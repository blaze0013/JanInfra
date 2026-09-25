const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.auditLog.deleteMany({});
  await prisma.developmentRequest.deleteMany({});
  await prisma.citizenProfile.deleteMany({});
  await prisma.infrastructureIndicator.deleteMany({});
  await prisma.governmentProject.deleteMany({});
  await prisma.recommendation.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.datasetVersion.deleteMany({});

  // Categories
  const catNames = [
    "Roads & Connectivity",
    "Drinking Water",
    "Sanitation & Drainage",
    "Healthcare Infrastructure",
    "Education Infrastructure",
    "Public Transport",
    "Electricity",
    "Digital Connectivity",
    "Waste Management",
    "Irrigation & Agriculture Infrastructure",
    "Other"
  ];

  const categories = [];
  for (const name of catNames) {
    categories.push(await prisma.category.create({ data: { name } }));
  }

  // Users
  const citizen = await prisma.user.create({
    data: {
      email: "citizen1@demo.local",
      password: "Pass@123", // demo only
      role: "CITIZEN",
      citizenProfile: {
        create: {
          languagePreference: "en",
          state: "Maharashtra",
          district: "Pune"
        }
      }
    }
  });

  const analyst = await prisma.user.create({
    data: {
      email: "analyst1@demo.local",
      password: "Pass@123", // demo only
      role: "ANALYST"
    }
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin1@demo.local",
      password: "Pass@123", // demo only
      role: "ADMIN"
    }
  });

  // Requests
  await prisma.developmentRequest.create({
    data: {
      reference: "REQ-1001",
      citizenId: citizen.id,
      status: "UNDER_ANALYSIS",
      language: "en",
      originalText: "The main road connecting our village is completely destroyed.",
      state: "Maharashtra",
      district: "Pune",
      subdistrict: "Haveli",
      latitude: 18.5204,
      longitude: 73.8567,
      categoryId: categories.find(c => c.name === "Roads & Connectivity").id,
      severity: 4,
      aiSummary: "Main road connecting village is destroyed.",
      aiCategory: "Roads & Connectivity",
      aiSeverity: 4,
      aiRequiresHumanReview: false
    }
  });

  await prisma.developmentRequest.create({
    data: {
      reference: "REQ-1002",
      citizenId: citizen.id,
      status: "SUBMITTED",
      language: "hi",
      originalText: "Peene ke pani ki bahut dikkat hai, supply theek se nahi aa rahi.",
      state: "Maharashtra",
      district: "Pune",
      subdistrict: "Haveli",
      latitude: 18.5304,
      longitude: 73.8667,
      categoryId: categories.find(c => c.name === "Drinking Water").id,
      severity: 5,
      aiSummary: "Severe drinking water supply issues reported.",
      aiCategory: "Drinking Water",
      aiSeverity: 5,
      aiRequiresHumanReview: true
    }
  });

  // Hotspot metrics mock / Infrastructure indicators
  const dataset = await prisma.datasetVersion.create({
    data: {
      source: "Demo Dataset",
      sourceReference: "DEMO-2023",
      version: "v1",
      rowCount: 2,
      importedBy: admin.id,
      status: "SUCCESS"
    }
  });

  await prisma.infrastructureIndicator.create({
    data: {
      geographyType: "district",
      geographyCode: "Pune",
      indicatorName: "Piped Water Coverage",
      value: 65.5,
      unit: "%",
      year: 2023,
      higherIsBetter: true,
      weight: 1.0,
      sourceReference: "Jal Jeevan Mission 2023",
      datasetVersionId: dataset.id
    }
  });

  await prisma.governmentProject.create({
    data: {
      projectName: "Pune Rural Water Supply Augmentation",
      category: "Drinking Water",
      stateCode: "Maharashtra",
      districtCode: "Pune",
      status: "planned",
      budgetAmount: 150000000,
      sourceReference: "State Budget 2023-24",
      datasetVersionId: dataset.id
    }
  });

  await prisma.recommendation.create({
    data: {
      suggestedProjectType: "Water pipeline improvement",
      rationale: "High severity citizen reports coupled with 65.5% coverage indicating gaps.",
      evidence: "2 requests in Haveli, Pune for water. Piped Water Coverage is 65.5%.",
      limitations: "Population growth data missing.",
      priorityScore: 82.5,
      district: "Pune",
      category: "Drinking Water",
      status: "PENDING_REVIEW"
    }
  });

  console.log("Database seeded successfully.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
