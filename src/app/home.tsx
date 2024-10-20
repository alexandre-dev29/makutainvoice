import {
  makutaQueries,
  supabase,
  useCompanyState,
  useCurrentUser,
} from '@makutainv/configs';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import MakutaDashboard from '@/components/dashboard/makuta-dashboard';

export function HomePage() {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const { currentCompany, setCurrentCompany, setCurrentInformation } =
    useCompanyState();

  const { data, isPending } = useQuery({
    ...makutaQueries.companies.list(),
    staleTime: 1000 * 60 * 10,
    enabled: currentCompany === '',
  });
  if (!isPending && currentCompany === '' && data?.data) {
    setCurrentCompany(`${data?.data[0]?.company_id}`);
    setCurrentInformation({
      logo: `${data?.data[0]?.logo}`,
      address: `${data?.data[0]?.address}`,
      name: `${data?.data[0]?.company_name}`,
      telephone: `${data?.data[0]?.phone}`,
    });
  }
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setCurrentUser({
          email: data.session.user.email ?? '',
          phone: data.session.user.user_metadata.phoneNumber,
          name: data.session.user.user_metadata.name,
          id: data.session.user.id,
        });
      }
    });
  }, []);
  return (
    <div>
      <div className="flex items-center justify-between p-6">
        <h2 className=" text-4xl font-bold">
          Welcome <span className=" text-primary"> {currentUser.name}</span>
        </h2>
        {currentCompany === '' || currentCompany === 'undefined' ? (
          <Link to="/companies">
            <Button variant="default">Start by creating a new company</Button>
          </Link>
        ) : (
          ''
        )}
      </div>
      <MakutaDashboard />
    </div>
  );
}

export default HomePage;
