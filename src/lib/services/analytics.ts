import { prisma } from '@/lib/db';

export async function getDemandVsSupply(filters: { state?: string, district?: string, category?: string }) {
  const whereReqs = {
    ...(filters.state && { state: filters.state }),
    ...(filters.district && { district: filters.district }),
    ...(filters.category && { category: { name: filters.category } })
  };

  const requests = await prisma.developmentRequest.findMany({ where: whereReqs, select: { citizenId: true, severity: true, aiCategory: true, category: { select: { name: true } }, createdAt: true } });
  
  const totalRequests = requests.length;
  const uniqueCitizens = new Set(requests.map(r => r.citizenId)).size;
  const avgSeverity = totalRequests > 0 ? requests.reduce((acc, r) => acc + r.severity, 0) / totalRequests : 0;

  // Fetch Projects
  const whereProjects = {
    ...(filters.state && { stateCode: filters.state }),
    ...(filters.district && { districtCode: filters.district }),
    ...(filters.category && { category: filters.category })
  };
  const projects = await prisma.governmentProject.findMany({ where: whereProjects });
  const activeProjects = projects.filter(p => p.status.toLowerCase() === 'active').length;
  const plannedProjects = projects.filter(p => p.status.toLowerCase() === 'planned').length;
  const completedProjects = projects.filter(p => p.status.toLowerCase() === 'completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budgetAmount || 0), 0);

  // Fetch Indicators
  const whereInds = {
    ...(filters.district && { geographyType: 'district', geographyCode: filters.district }),
  };
  const indicators = await prisma.infrastructureIndicator.findMany({ where: whereInds });

  // Calculate generic gap (demo calculation)
  const gapScore = indicators.reduce((sum, ind) => {
    // If higher is better and value is low -> high gap
    const gap = ind.higherIsBetter ? (100 - ind.value) : ind.value;
    return sum + (gap * ind.weight);
  }, 0) / (indicators.length || 1);

  return {
    demand: {
      totalRequests,
      uniqueCitizens,
      avgSeverity,
      requests
    },
    supply: {
      totalProjects: projects.length,
      activeProjects,
      plannedProjects,
      completedProjects,
      totalBudget,
      indicators,
      gapScore
    },
    gapAnalysis: totalRequests > 0 && projects.length === 0 ? "Potential planning gap based on available datasets." : "Project matches found or insufficient data."
  };
}

export async function getPopulationImpact(filters: { state?: string, district?: string }) {
  const pops = await prisma.populationDataset.findMany({
    where: {
      ...(filters.district && { geographyType: 'district', geographyCode: filters.district }),
      ...(filters.state && !filters.district && { geographyType: 'state', geographyCode: filters.state }),
    }
  });

  const totalPop = pops.reduce((sum, p) => sum + p.population, 0);

  // Re-fetch demand to get per-1000 calculations
  const { demand } = await getDemandVsSupply(filters);

  return {
    totalPopulation: totalPop,
    requestsPer1000: totalPop > 0 ? (demand.totalRequests / totalPop) * 1000 : null,
    citizensPer1000: totalPop > 0 ? (demand.uniqueCitizens / totalPop) * 1000 : null,
    populationDensity: pops.length > 0 ? pops[0].populationDensity : null
  };
}

export async function getDemandTrends() {
  const reqs = await prisma.developmentRequest.findMany({ select: { createdAt: true, category: { select: { name: true } }, severity: true } });
  
  const now = new Date();
  const days30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const recent = reqs.filter(r => r.createdAt >= days30).length;
  const older = reqs.length - recent;
  
  const isRising = recent > older && older > 0;

  return {
    recent30Days: recent,
    older: older,
    trend: isRising ? "Rising" : "Stable/Declining"
  };
}

export async function generateAlerts() {
  // Deterministic checks
  const trends = await getDemandTrends();
  if (trends.trend === 'Rising') {
    await prisma.analyticalAlert.create({
      data: {
        type: 'RISING_DEMAND',
        title: 'Rising Citizen Demand',
        description: `Requests have increased significantly over the last 30 days (${trends.recent30Days} vs ${trends.older}).`,
        district: 'Aggregate'
      }
    });
  }
}
