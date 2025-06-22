"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  BarChart3,
  Calendar,
  DollarSign,
  PieChart as PieChartIcon,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data for portfolio performance over time
const portfolioPerformanceData = [
  { month: "Jan 2023", value: 500000, benchmark: 480000 },
  { month: "Feb 2023", value: 525000, benchmark: 495000 },
  { month: "Mar 2023", value: 580000, benchmark: 520000 },
  { month: "Apr 2023", value: 620000, benchmark: 540000 },
  { month: "May 2023", value: 650000, benchmark: 560000 },
  { month: "Jun 2023", value: 680000, benchmark: 580000 },
  { month: "Jul 2023", value: 720000, benchmark: 600000 },
  { month: "Aug 2023", value: 750000, benchmark: 620000 },
  { month: "Sep 2023", value: 800000, benchmark: 650000 },
  { month: "Oct 2023", value: 850000, benchmark: 670000 },
  { month: "Nov 2023", value: 920000, benchmark: 690000 },
  { month: "Dec 2023", value: 980000, benchmark: 710000 },
  { month: "Jan 2024", value: 1050000, benchmark: 730000 },
  { month: "Feb 2024", value: 1120000, benchmark: 750000 },
  { month: "Mar 2024", value: 1180000, benchmark: 770000 },
  { month: "Apr 2024", value: 1235000, benchmark: 790000 },
];

// Asset allocation data
const assetAllocationData = [
  {
    name: "Residential Development",
    value: 450000,
    count: 2,
    color: "#27225e",
  },
  { name: "Commercial Office", value: 345000, count: 1, color: "#f3c835" },
  { name: "Mixed-Use Projects", value: 235000, count: 2, color: "#3aa576" },
  { name: "Industrial/Logistics", value: 205000, count: 1, color: "#9797ae" },
];

// Monthly distribution data
const distributionData = [
  { month: "Jul 2024", amount: 8500, type: "Preferred Return" },
  { month: "Aug 2024", amount: 12300, type: "Profit Distribution" },
  { month: "Sep 2024", amount: 9800, type: "Preferred Return" },
  { month: "Oct 2024", amount: 15600, type: "Profit Distribution" },
  { month: "Nov 2024", amount: 11200, type: "Preferred Return" },
  { month: "Dec 2024", amount: 18900, type: "Year-end Bonus" },
];

// Performance metrics data
const performanceMetrics = [
  { metric: "Total IRR", value: 18.5, target: 15.0, status: "above" },
  { metric: "Equity Multiple", value: 1.65, target: 1.5, status: "above" },
  { metric: "Cash-on-Cash", value: 12.3, target: 10.0, status: "above" },
  { metric: "Occupancy Rate", value: 94.2, target: 90.0, status: "above" },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercent = (percent: number) => {
  return `${percent.toFixed(1)}%`;
};

interface TooltipPayload {
  color: string;
  dataKey: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-vault-light rounded-lg shadow-lg">
        <p className="font-semibold text-vault-primary">{label}</p>
        {payload.map((pld, index) => (
          <p key={`${pld.dataKey}-${index}`} className="text-sm" style={{ color: pld.color }}>
            {pld.dataKey === "value" ? "Portfolio Value: " : "Benchmark: "}
            {formatCurrency(pld.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function PortfolioAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("12M");
  const [selectedChart, setSelectedChart] = useState("performance");

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-vault-primary">
            Portfolio Analytics
          </h2>
          <p className="text-vault-muted">
            Comprehensive performance insights and data visualization
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-lg border border-vault-light p-1">
            {["3M", "6M", "12M", "YTD", "All"].map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className={
                  selectedTimeframe === timeframe
                    ? "bg-vault-primary text-white"
                    : "text-vault-muted hover:text-vault-primary"
                }
              >
                {timeframe}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric) => (
          <Card
            key={metric.metric}
            className="border-0 shadow-md bg-white/80 backdrop-blur-sm"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-vault-muted">
                  {metric.metric}
                </span>
                {metric.status === "above" ? (
                  <TrendingUp className="w-4 h-4 text-vault-accent" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-vault-primary">
                  {metric.metric.includes("Rate") ||
                  metric.metric.includes("IRR") ||
                  metric.metric.includes("Cash")
                    ? formatPercent(metric.value)
                    : `${metric.value.toFixed(2)}x`}
                </p>
                <p className="text-xs text-vault-muted">
                  Target:{" "}
                  {metric.metric.includes("Rate") ||
                  metric.metric.includes("IRR") ||
                  metric.metric.includes("Cash")
                    ? formatPercent(metric.target)
                    : `${metric.target.toFixed(2)}x`}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics Charts */}
      <Tabs
        value={selectedChart}
        onValueChange={setSelectedChart}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/60 backdrop-blur-sm border border-vault-light/50 shadow-lg mb-6 rounded-xl p-1">
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-vault-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg font-medium"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger
            value="allocation"
            className="data-[state=active]:bg-vault-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg font-medium"
          >
            <PieChartIcon className="w-4 h-4 mr-2" />
            Allocation
          </TabsTrigger>
          <TabsTrigger
            value="distributions"
            className="data-[state=active]:bg-vault-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg font-medium"
          >
            <Activity className="w-4 h-4 mr-2" />
            Cash Flow
          </TabsTrigger>
        </TabsList>

        {/* Portfolio Performance Chart */}
        <TabsContent value="performance" className="mt-0">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-vault-primary">
                    Portfolio Performance vs Benchmark
                  </CardTitle>
                  <CardDescription className="text-vault-muted">
                    Track your portfolio growth compared to market benchmarks
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="border-vault-accent text-vault-accent"
                >
                  +56.2% Outperformance
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={portfolioPerformanceData}>
                    <defs>
                      <linearGradient
                        id="portfolioGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#27225e"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#27225e"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                      <linearGradient
                        id="benchmarkGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#9797ae"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#9797ae"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#9797ae" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#9797ae" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#27225e"
                      strokeWidth={3}
                      fill="url(#portfolioGradient)"
                      name="Portfolio Value"
                    />
                    <Area
                      type="monotone"
                      dataKey="benchmark"
                      stroke="#9797ae"
                      strokeWidth={2}
                      fill="url(#benchmarkGradient)"
                      name="Market Benchmark"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Asset Allocation Chart */}
        <TabsContent value="allocation" className="mt-0">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-vault-primary">
                Asset Allocation
              </CardTitle>
              <CardDescription className="text-vault-muted">
                Portfolio diversification across asset classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetAllocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {assetAllocationData.map((entry, index) => (
                          <Cell key={`${entry.name}-${entry.value}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "Investment Value",
                        ]}
                        labelFormatter={(label) => `Asset Class: ${label}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-vault-primary">
                    Investment Breakdown
                  </h4>
                  {assetAllocationData.map((asset, index) => {
                    const percentage =
                      (asset.value /
                        assetAllocationData.reduce(
                          (sum, a) => sum + a.value,
                          0,
                        )) *
                      100;
                    return (
                      <div
                        key={`${asset.name}-breakdown-${index}`}
                        className="flex items-center justify-between p-3 bg-vault-background/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: asset.color }}
                          />
                          <div>
                            <p className="font-medium text-vault-primary">
                              {asset.name}
                            </p>
                            <p className="text-sm text-vault-muted">
                              {asset.count}{" "}
                              {asset.count === 1 ? "property" : "properties"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-vault-primary">
                            {formatCurrency(asset.value)}
                          </p>
                          <p className="text-sm text-vault-muted">
                            {percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distributions Chart */}
        <TabsContent value="distributions" className="mt-0">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-vault-primary">
                Distribution History
              </CardTitle>
              <CardDescription className="text-vault-muted">
                Monthly cash distributions and dividend payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#9797ae" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#9797ae" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        "Distribution Amount",
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #cbccdb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="amount"
                      fill="#3aa576"
                      radius={[4, 4, 0, 0]}
                      name="Distribution"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-vault-background/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-vault-accent" />
                    <span className="font-medium text-vault-primary">
                      Total Received
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-vault-primary">
                    {formatCurrency(
                      distributionData.reduce((sum, d) => sum + d.amount, 0),
                    )}
                  </p>
                </div>

                <div className="bg-vault-background/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-vault-secondary" />
                    <span className="font-medium text-vault-primary">
                      Average Monthly
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-vault-primary">
                    {formatCurrency(
                      distributionData.reduce((sum, d) => sum + d.amount, 0) /
                        distributionData.length,
                    )}
                  </p>
                </div>

                <div className="bg-vault-background/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-vault-primary" />
                    <span className="font-medium text-vault-primary">
                      Yield Rate
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-vault-primary">
                    {formatPercent(8.7)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
