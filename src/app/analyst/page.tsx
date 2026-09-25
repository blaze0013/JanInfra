import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';
import AnalystDashboardInteractive from '@/components/AnalystDashboardInteractive';

export default async function AnalystDashboard() {
  const user = await getUser();
  const lang = user?.citizenProfile?.languagePreference || 'en';
  const dict = getDictionary(lang).analyst;

  const requests = await prisma.developmentRequest.findMany();
  const projects = await prisma.governmentProject.findMany();
  const alerts = await prisma.analyticalAlert.findMany({ orderBy: { createdAt: 'desc' }, take: 3 });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{dict.dashboard} (Intelligence Summary)</h2>
      <AnalystDashboardInteractive 
        requests={requests} 
        projects={projects} 
        alerts={alerts} 
        dict={dict} 
      />
    </div>
  );
}
