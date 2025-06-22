"use client";

import { AdvancedSearch } from "@/components/dashboard/advanced-search";
import { ExportReports } from "@/components/dashboard/export-reports";
import { PortfolioAnalytics } from "@/components/dashboard/portfolio-analytics";
import { useAnalytics } from "@/components/providers/analytics-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building,
  Calendar,
  DollarSign,
  Download,
  Eye,
  FileText,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

// Types
interface PortfolioData {
  totalValue: number;
  totalInvested: number;
  totalReturns: number;
  overallPerformance: number;
  totalDistributions: number;
  activeInvestments: number;
  monthlyChange: number;
  yearToDateReturn: number;
}

interface Investment {
  id: string;
  name: string;
  type: string;
  invested: number;
  currentValue: number;
  performance: number;
  status: string;
  assetClass: string;
  location: string;
  investmentDate: string;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  amount?: number;
  date: string;
  status: string;
}

interface DashboardData {
  portfolio: PortfolioData;
  investments: Investment[];
  recentActivity: ActivityItem[];
  userProfile: {
    name: string;
    verificationStatus: string;
  };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercent = (percent: number) => {
  return `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`;
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "distribution":
      return <DollarSign className="w-5 h-5 text-vault-accent" />;
    case "investment":
      return <Building className="w-5 h-5 text-vault-primary" />;
    case "performance":
      return <TrendingUp className="w-5 h-5 text-vault-accent" />;
    case "document":
      return <FileText className="w-5 h-5 text-vault-secondary" />;
    default:
      return <Activity className="w-5 h-5 text-vault-muted" />;
  }
};

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  // Safely get analytics if available
  let analytics: ReturnType<typeof useAnalytics> | null = null;
  try {
    analytics = useAnalytics();
  } catch (error) {
    // Analytics not available, continue without tracking
    console.log("Analytics not available:", error);
  }

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/dashboard/portfolio");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();
        setDashboardData(result.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Track page view
  useEffect(() => {
    if (user && analytics && dashboardData) {
      analytics.trackEvent.portfolioViewed(
        dashboardData.portfolio.totalValue,
        dashboardData.portfolio.activeInvestments,
        user.id,
      );
    }
  }, [user, analytics, dashboardData]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    if (user && analytics) {
      analytics.trackEvent.contentEngagement("dashboard_tab", tab, "tab_view", user.id);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-vault-background/30 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <Skeleton className="h-10 w-80 mb-2" />
              <Skeleton className="h-6 w-96" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className="border-0 shadow-lg bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-6 mb-4" />
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-4 w-20 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-vault-background/30 p-6 flex items-center justify-center">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-vault-primary mb-2">
              Unable to Load Dashboard
            </h2>
            <p className="text-vault-muted mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-vault-primary hover:bg-vault-primary/90 text-white"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No data state
  if (!dashboardData || dashboardData.portfolio.activeInvestments === 0) {
    return (
      <div className="min-h-screen bg-vault-background/30 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-vault-primary mb-2">
              Investment Dashboard
            </h1>
            <p className="text-lg text-vault-muted">
              Welcome, {user?.firstName || "Investor"}! Start your investment
              journey.
            </p>
          </div>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Building className="w-16 h-16 text-vault-primary mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-vault-primary mb-4">
                No Investments Yet
              </h2>
              <p className="text-vault-muted mb-6 max-w-md mx-auto">
                You haven't made any investments yet. Explore our available
                investment opportunities to get started.
              </p>
              <div className="space-y-3">
                <Button
                  className="bg-vault-primary hover:bg-vault-primary/90 text-white"
                  onClick={() => { window.location.href = "/investments"; }}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Explore Investment Opportunities
                </Button>
                <div>
                  <Button
                    variant="outline"
                    className="border-vault-light hover:border-vault-primary"
                    onClick={() => { window.location.href = "/verification"; }}
                  >
                    Complete Verification First
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const portfolio = dashboardData.portfolio;

  return (
    <div className="min-h-screen bg-vault-background/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-vault-primary mb-2">
              Investment Dashboard
            </h1>
            <p className="text-lg text-vault-muted">
              Welcome back, {dashboardData.userProfile.name}. Here's your
              portfolio overview.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ExportReports />
            <Button
              variant="outline"
              className="gap-2 border-vault-light hover:border-vault-primary"
              onClick={() => {
                if (user && analytics) {
                  analytics.trackEvent.contentEngagement(
                    "dashboard",
                    "portfolio_details",
                    "button_click",
                    user.id,
                  );
                }
              }}
            >
              <Eye className="w-4 h-4" />
              View Details
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-vault-primary/10 rounded-lg">
                  <Wallet className="w-6 h-6 text-vault-primary" />
                </div>
                <Badge
                  variant="outline"
                  className="text-vault-accent border-vault-accent"
                >
                  {formatPercent(portfolio.monthlyChange || 0)}
                </Badge>
              </div>
              <h3 className="text-sm font-medium text-vault-muted mb-1">
                Total Portfolio Value
              </h3>
              <p className="text-3xl font-bold text-vault-primary">
                {formatCurrency(portfolio.totalValue)}
              </p>
              <p className="text-sm text-vault-muted mt-2">
                {formatPercent(portfolio.yearToDateReturn || 0)} YTD
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-vault-accent/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-vault-accent" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-vault-accent" />
              </div>
              <h3 className="text-sm font-medium text-vault-muted mb-1">
                Total Returns
              </h3>
              <p className="text-3xl font-bold text-vault-primary">
                {formatCurrency(portfolio.totalReturns)}
              </p>
              <p className="text-sm text-vault-muted mt-2">
                {formatPercent(portfolio.overallPerformance)} Total Return
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-vault-secondary/10 rounded-lg">
                  <Building className="w-6 h-6 text-vault-secondary" />
                </div>
                <Badge
                  variant="outline"
                  className="text-vault-primary border-vault-primary"
                >
                  Active
                </Badge>
              </div>
              <h3 className="text-sm font-medium text-vault-muted mb-1">
                Active Investments
              </h3>
              <p className="text-3xl font-bold text-vault-primary">
                {portfolio.activeInvestments}
              </p>
              <p className="text-sm text-vault-muted mt-2">
                {formatCurrency(portfolio.totalInvested)} invested
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <ArrowDownRight className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-vault-muted mb-1">
                Distributions Received
              </h3>
              <p className="text-3xl font-bold text-vault-primary">
                {formatCurrency(portfolio.totalDistributions)}
              </p>
              <p className="text-sm text-vault-muted mt-2">This year</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-white/60 backdrop-blur-sm border border-vault-light/50 shadow-lg mb-8 rounded-xl p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-vault-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg font-medium"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="investments"
              className="data-[state=active]:bg-vault-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg font-medium"
            >
              <Building className="w-4 h-4 mr-2" />
              Investments
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-vault-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg font-medium"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-vault-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg font-medium"
            >
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-vault-primary">
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-vault-muted">
                      Latest updates from your investment portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dashboardData.recentActivity.length > 0 ? (
                      dashboardData.recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center gap-4 p-4 bg-vault-background/30 rounded-lg hover:bg-vault-background/50 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-vault-primary">
                              {activity.title}
                            </h4>
                            <p className="text-sm text-vault-muted">
                              {activity.description}
                            </p>
                          </div>
                          <div className="text-right">
                            {activity.amount && (
                              <p className="font-semibold text-vault-primary">
                                {formatCurrency(activity.amount)}
                              </p>
                            )}
                            <p className="text-xs text-vault-muted">
                              {activity.date}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="w-12 h-12 text-vault-muted mx-auto mb-4" />
                        <p className="text-vault-muted">No recent activity</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-vault-primary">
                      Performance Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-vault-muted">Best Performer</span>
                      <Badge
                        variant="outline"
                        className="border-vault-accent text-vault-accent"
                      >
                        {dashboardData.investments.length > 0
                          ? formatPercent(
                              Math.max(
                                ...dashboardData.investments.map(
                                  (i) => i.performance,
                                ),
                              ),
                            )
                          : "+0%"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-vault-muted">Average Return</span>
                      <span className="font-semibold text-vault-primary">
                        {dashboardData.investments.length > 0
                          ? formatPercent(
                              dashboardData.investments.reduce(
                                (sum, i) => sum + i.performance,
                                0,
                              ) / dashboardData.investments.length,
                            )
                          : "0%"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-vault-muted">
                        Portfolio Diversity
                      </span>
                      <span className="font-semibold text-vault-primary">
                        {
                          new Set(
                            dashboardData.investments.map((i) => i.assetClass),
                          ).size
                        }{" "}
                        Asset Classes
                      </span>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-vault-muted">
                          Verification Status
                        </span>
                        <span className="font-medium text-vault-primary capitalize">
                          {dashboardData.userProfile.verificationStatus}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-vault-primary">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full justify-start bg-vault-primary hover:bg-vault-primary/90 text-white"
                      onClick={() => {
                        window.location.href = "/investments";
                        if (user && analytics) {
                          analytics.trackEvent.contentEngagement(
                            "dashboard",
                            "new_investment",
                            "button_click",
                            user.id,
                          );
                        }
                      }}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Explore New Deals
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-vault-light hover:border-vault-primary"
                      onClick={() => {
                        if (user && analytics) {
                          analytics.trackEvent.reportDownloaded(
                            "portfolio_summary",
                            "current",
                            user.id,
                          );
                        }
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Reports
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-vault-light hover:border-vault-primary"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Call
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="mt-0">
            <div className="space-y-6">
              <AdvancedSearch />

              <div className="grid gap-6">
                {dashboardData.investments.map((investment) => (
                  <Card
                    key={investment.id}
                    className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold text-vault-primary">
                              {investment.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="border-vault-light"
                            >
                              {investment.type}
                            </Badge>
                            <Badge
                              variant={
                                investment.status === "active"
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                investment.status === "active"
                                  ? "bg-vault-accent text-white"
                                  : ""
                              }
                            >
                              {investment.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-vault-muted block">
                                Invested
                              </span>
                              <span className="font-semibold text-vault-primary">
                                {formatCurrency(investment.invested)}
                              </span>
                            </div>
                            <div>
                              <span className="text-vault-muted block">
                                Current Value
                              </span>
                              <span className="font-semibold text-vault-primary">
                                {formatCurrency(investment.currentValue)}
                              </span>
                            </div>
                            <div>
                              <span className="text-vault-muted block">
                                Performance
                              </span>
                              <span className="font-semibold text-vault-accent">
                                {formatPercent(investment.performance)}
                              </span>
                            </div>
                            <div>
                              <span className="text-vault-muted block">
                                Location
                              </span>
                              <span className="font-semibold text-vault-primary">
                                {investment.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          className="ml-4 text-vault-primary hover:bg-vault-primary/10"
                          onClick={() => {
                            if (user && analytics) {
                              analytics.trackEvent.dealViewed(
                                investment.id,
                                investment.name,
                                investment.assetClass,
                                user.id,
                              );
                            }
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-0">
            <PortfolioAnalytics />
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="mt-0">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-vault-primary">
                    Recent Documents
                  </CardTitle>
                  <CardDescription className="text-vault-muted">
                    Latest reports and investment documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      name: "Q4 2024 Portfolio Report",
                      type: "PDF",
                      date: "2 days ago",
                      size: "2.4 MB",
                    },
                    {
                      name: "Tax Documents K-1",
                      type: "PDF",
                      date: "1 week ago",
                      size: "890 KB",
                    },
                    {
                      name: "Manhattan Tower Update",
                      type: "PDF",
                      date: "2 weeks ago",
                      size: "1.2 MB",
                    },
                    {
                      name: "Distribution Summary",
                      type: "Excel",
                      date: "3 weeks ago",
                      size: "156 KB",
                    },
                  ].map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between p-4 bg-vault-background/30 rounded-lg hover:bg-vault-background/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-vault-secondary" />
                        <div>
                          <h4 className="font-medium text-vault-primary">
                            {doc.name}
                          </h4>
                          <p className="text-sm text-vault-muted">
                            {doc.type} • {doc.size} • {doc.date}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-vault-primary hover:bg-vault-primary/10"
                        onClick={() => {
                          if (user && analytics) {
                            analytics.trackEvent.reportDownloaded(
                              doc.name.toLowerCase().replace(/\s+/g, "_"),
                              "manual",
                              user.id,
                            );
                          }
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-vault-primary">
                    Document Categories
                  </CardTitle>
                  <CardDescription className="text-vault-muted">
                    Organize your investment documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      category: "Performance Reports",
                      count: 12,
                      icon: BarChart3,
                    },
                    { category: "Tax Documents", count: 8, icon: FileText },
                    {
                      category: "Investment Agreements",
                      count: 6,
                      icon: Building,
                    },
                    {
                      category: "Distribution Notices",
                      count: 24,
                      icon: DollarSign,
                    },
                  ].map((cat) => (
                    <div
                      key={cat.category}
                      className="flex items-center justify-between p-4 bg-vault-background/30 rounded-lg hover:bg-vault-background/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <cat.icon className="w-5 h-5 text-vault-primary" />
                        <span className="font-medium text-vault-primary">
                          {cat.category}
                        </span>
                      </div>
                      <Badge variant="outline" className="border-vault-light">
                        {cat.count}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
