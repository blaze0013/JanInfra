import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';
import RecommendationList from '@/components/RecommendationList';

export default async function AnalystRecommendations() {
  const user = await getUser();
  const lang = user?.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).analyst;

  const recommendations = await prisma.recommendation.findMany({
    orderBy: { priorityScore: 'desc' }
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{dict.recommendations}</h2>
      <RecommendationList recommendations={recommendations} dictAnalyst={dict} isAdmin={false} />
    </div>
  );
}
