
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { PlusCircle, MoreHorizontal, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslation } from 'react-i18next'; // Импортируем хук

const DeveloperDashboard = () => {
  const { user } = useAppAuth();
  const { t } = useTranslation(); // Используем хук

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Sidebar can be added here */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        {/* Header can be added here */}
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="sm:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle>{t('developerDashboard.welcome.title', { name: user?.user_metadata?.full_name || 'Developer' })}</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    {t('developerDashboard.welcome.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link to="/developer/create-agent">{t('developerDashboard.welcome.createAgentButton')}</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{t('developerDashboard.stats.agents')}</CardDescription>
                  <CardTitle className="text-4xl">12</CardTitle> {/* Replace with dynamic data */}
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +2 {t('developerDashboard.stats.fromLastMonth')}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{t('developerDashboard.stats.revenue')}</CardDescription>
                  <CardTitle className="text-4xl">$1,234</CardTitle> {/* Replace with dynamic data */}
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +15% {t('developerDashboard.stats.fromLastMonth')}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader className="px-7">
                <CardTitle>{t('developerDashboard.agents.title')}</CardTitle>
                <CardDescription>{t('developerDashboard.agents.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('developerDashboard.agents.table.name')}</TableHead>
                      <TableHead className="hidden sm:table-cell">{t('developerDashboard.agents.table.status')}</TableHead>
                      <TableHead className="hidden sm:table-cell">{t('developerDashboard.agents.table.revenue')}</TableHead>
                      <TableHead className="hidden md:table-cell">{t('developerDashboard.agents.table.created')}</TableHead>
                      <TableHead className="text-right">{t('developerDashboard.agents.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Replace with dynamic agent data */} 
                    <TableRow className="bg-accent">
                      <TableCell>
                        <div className="font-medium">Agent Alpha</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          Data Analysis
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className="text-xs" variant="secondary">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">$150.00</TableCell>
                      <TableCell className="hidden md:table-cell">2023-06-23</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t('developerDashboard.agents.table.toggleMenu')}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('developerDashboard.agents.table.actions')}</DropdownMenuLabel>
                            <DropdownMenuItem>{t('developerDashboard.agents.table.edit')}</DropdownMenuItem>
                            <DropdownMenuItem>{t('developerDashboard.agents.table.viewAnalytics')}</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">{t('developerDashboard.agents.table.delete')}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {/* Add more rows for other agents */}
                  </TableBody>
                </Table>
                <div className="flex justify-end mt-4">
                  <Button asChild size="sm" variant="outline">
                    <Link to="/developer/manage-agents">{t('developerDashboard.agents.manageAllButton')}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{t('developerDashboard.analytics.title')}</CardTitle>
                <CardDescription>{t('developerDashboard.analytics.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add analytics chart or summary here */}
                <p className="text-sm text-muted-foreground">{t('developerDashboard.analytics.placeholder')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('developerDashboard.earnings.title')}</CardTitle>
                <CardDescription>{t('developerDashboard.earnings.description')}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('developerDashboard.earnings.total')}</span>
                  <span>$1,234.56</span> {/* Replace with dynamic data */}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('developerDashboard.earnings.thisMonth')}</span>
                  <span>$250.00</span> {/* Replace with dynamic data */}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('developerDashboard.earnings.pending')}</span>
                  <span>$50.00</span> {/* Replace with dynamic data */}
                </div>
                <Button size="sm" variant="outline" className="mt-2">
                  {t('developerDashboard.earnings.viewDetailsButton')}
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('developerDashboard.activity.title')}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* Replace with dynamic activity feed */}
                <div className="flex items-center gap-4">
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">Agent Beta approved</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">New review on Agent Alpha</p>
                    <p className="text-sm text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                {/* Add placeholder if no activity */}
                {/* <p className="text-sm text-muted-foreground">{t('developerDashboard.activity.noActivity')}</p> */}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
