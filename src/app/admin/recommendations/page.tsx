import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';
import RecommendationList from '@/components/RecommendationList';

export default async function AdminRecommendationsView() {
  const user = await getUser();
  const lang = user?.citizenProfile?.languagePreference || 'en';
  const dictAnalyst = getDictionary(lang).analyst;
  const dictAdmin = getDictionary(lang).admin;

  const recommendations = await prisma.recommendation.findMany({
    orderBy: { priorityScore: 'desc' }
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{dictAdmin.recommendations || "Analyst Recommendations"}</h2>
      <RecommendationList recommendations={recommendations} dictAnalyst={dictAnalyst} dictAdmin={dictAdmin} isAdmin={true} />
    </div>
  );
}
