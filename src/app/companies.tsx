import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { makutaQueries, makutaQueryClient, supabase } from '@makutainv/configs';
import { useQuery } from '@tanstack/react-query';
import { AddUpdateCompany } from '@/components/add-update-company';
import { UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { createRef, useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const CompaniesPage = () => {
  const { data } = useQuery({
    ...makutaQueries.companies.list(),
    staleTime: 1000 * 60 * 10,
  });
  const uploadCompanyImage = async (
    value: React.ChangeEvent<HTMLInputElement>,
    company_name: string,
    company_id: number
  ) => {
    toast({
      variant: 'default',
      title: 'Uploading your logo',
      description: 'Please wait while your logo is uploading',
    });
    if (value && value.target && value.target.files && value.target.files[0]) {
      const companyLogo = value.target.files[0];
      const imageExtension = companyLogo.type.split('/')[1];
      const { data, error } = await supabase.storage
        .from('company_logo')
        .upload(
          `public/${company_name}_logo_${(Math.random() + 1)
            .toString(36)
            .substring(7)}.${imageExtension}`,
          companyLogo,
          {
            cacheControl: '3600',
            upsert: false,
          }
        );
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error while trying to upload the logo',
          description: error?.message,
        });
      }
      if (data) {
        const {
          data: { publicUrl },
        } = supabase.storage.from('company_logo').getPublicUrl(`${data?.path}`);
        const { error } = await supabase
          .from('companies')
          .update({ logo: publicUrl })
          .eq('company_id', company_id);
        if (!error) {
          // invalidate all the list queries
          await makutaQueryClient.invalidateQueries({
            queryKey: makutaQueries.companies.list._def,
            refetchType: 'active',
          });
          toast({
            variant: 'default',
            title: 'Uploading logo',
            description: 'The logo has been uploaded successfully',
          });
        }
      }
    }
  };
  const { toast } = useToast();

  const refsById = useMemo(() => {
    const refs = {};
    data?.data?.forEach((item) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      refs[item.company_id] = createRef<HTMLInputElement | null>();
    });
    return refs;
  }, [data?.data]);
  return (
    <div>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <AddUpdateCompany />
        </div>
      </div>

      <Card x-chunk="dashboard-06-chunk-0" className="mt-4">
        <CardHeader>
          <CardTitle className="text-2xl">Companies</CardTitle>
          <CardDescription>
            Manage your companies and view their informations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[200px] sm:table-cell">
                  Company logo
                  <span className="sr-only">Company logo</span>
                </TableHead>
                <TableHead>Comany name</TableHead>
                <TableHead>Company email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead className="hidden md:table-cell">Adrres</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TooltipProvider>
              <TableBody>
                {data &&
                  data.data &&
                  data.data.map(
                    ({
                      company_name,
                      email,
                      phone,
                      address,
                      created_at,
                      logo,
                      company_id,
                    }) => (
                      <TableRow key={Math.random()}>
                        <TableCell className="hidden sm:table-cell">
                          {logo ? (
                            <img
                              className="rounded-2xl max-w-[80px] max-h-[80px]"
                              src={logo}
                              alt="companies logo"
                            />
                          ) : (
                            'No Image'
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {company_name}
                        </TableCell>
                        <TableCell>{email}</TableCell>
                        <TableCell>{phone}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {address}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {created_at}
                        </TableCell>
                        <TableCell className="flex gap-4">
                          <Input
                            id="picture"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            ref={refsById[company_id]}
                            key={company_id}
                            onChange={async (value) =>
                              uploadCompanyImage(
                                value,
                                company_name,
                                company_id
                              )
                            }
                          />
                          {/*<PenBox size={20} className="text-primary" />*/}
                          {/*<Trash2 size={20} className="text-red-600" />*/}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <UploadCloud
                                size={20}
                                className="text-red-600 cursor-pointer"
                                onClick={() => {
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-expect-error
                                  refsById[company_id].current?.click();
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              Upload company logo
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
                  )}
              </TableBody>
            </TooltipProvider>
          </Table>
        </CardContent>
        <CardFooter>
          {/* <div className="text-xs text-muted-foreground">
            <strong>32</strong> companies
          </div> */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CompaniesPage;
