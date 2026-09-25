const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo analytics data...');

  // 1. Scenarios
  await prisma.scenario.createMany({
    data: [
      { name: 'Default Balanced', demandWeight: 40, infrastructureWeight: 35, severityWeight: 25 },
      { name: 'Demand Focused', demandWeight: 70, infrastructureWeight: 10, severityWeight: 20 },
    ]
  });

  // 2. Analytical Alerts
  await prisma.analyticalAlert.create({
    data: {
      type: 'RISING_DEMAND',
      title: 'Rising Citizen Demand in Water',
      description: 'Drinking Water requests have increased by 42% over the last 30 days compared to historical averages.',
      district: 'Pune'
    }
  });
  await prisma.analyticalAlert.create({
    data: {
      type: 'HIGH_GAP_NO_PROJECT',
      title: 'Planning Gap: Solapur Roads',
      description: 'High citizen demand and low infrastructure score for Roads in Solapur, with no matching active projects.',
      district: 'Solapur'
    }
  });

  // 3. Population Data
  await prisma.populationDataset.createMany({
    data: [
      { geographyType: 'district', geographyCode: 'Pune', population: 3124000, populationDensity: 603, year: 2024 },
      { geographyType: 'district', geographyCode: 'Solapur', population: 950000, populationDensity: 290, year: 2024 },
    ]
  });

  // 4. Update Projects with mock budgets
  await prisma.$executeRawUnsafe(`UPDATE GovernmentProject SET budgetAmount = 45000000 WHERE status = 'Active'`);
  await prisma.$executeRawUnsafe(`UPDATE GovernmentProject SET budgetAmount = 120000000 WHERE status = 'Planned'`);

  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
