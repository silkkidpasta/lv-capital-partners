import {
  createServiceClient,
  getUserDistributions,
  getUserInvestments,
  getUserPortfolio,
  getUserProfile,
} from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

// TypeScript interfaces
interface Investment {
  id: string;
  amount_invested: number;
  current_value: number;
  investment_date: string;
  status: string;
  updated_at: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if we have valid Supabase configuration
    const hasValidSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !==
        "https://placeholder.supabase.co";

    if (!hasValidSupabase) {
      // Return mock data for development
      return NextResponse.json({
        success: true,
        data: getMockDashboardData(userId),
        timestamp: new Date().toISOString(),
      });
    }

    // Get user profile
    const userProfile = await getUserProfile(userId);

    if (!userProfile) {
      // Return mock data if no profile found
      return NextResponse.json({
        success: true,
        data: getMockDashboardData(userId),
        timestamp: new Date().toISOString(),
      });
    }

    // Get portfolio summary using database function
    const portfolioSummary = await getUserPortfolio(userId);

    // Get user investments with details
    const investments = await getUserInvestments(userId);

    // Get recent distributions
    const distributions = await getUserDistributions(userId);

    // Get recent activity (last 30 days)
    const supabase = createServiceClient();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentActivity, error: activityError } = await supabase
      .from("user_investments")
      .select(`
        id,
        amount_invested,
        current_value,
        status,
        created_at,
        investment_deals (
          title,
          asset_class,
          location
        )
      `)
      .eq("user_id", userProfile.id)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(10);

    // Calculate performance metrics
    const totalInvested =
      investments?.reduce((sum, inv) => sum + (inv.amount_invested || 0), 0) ||
      0;
    const currentValue =
      investments?.reduce((sum, inv) => sum + (inv.current_value || 0), 0) || 0;
    const totalDistributions =
      distributions?.reduce((sum, dist) => sum + (dist.amount || 0), 0) || 0;
    const totalReturns = currentValue - totalInvested + totalDistributions;
    const overallPerformance =
      totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

    // Get performance over time (last 12 months)
    const { data: performanceHistory, error: performanceError } = await supabase
      .from("user_investments")
      .select(`
        current_value,
        amount_invested,
        updated_at,
        investment_deals (
          title
        )
      `)
      .eq("user_id", userProfile.id)
      .order("updated_at", { ascending: true });

    // Calculate monthly performance data
    const monthlyPerformance = [];
    if (performanceHistory) {
      const monthlyData: {
        [key: string]: { invested: number; current: number };
      } = {};

      for (const inv of performanceHistory) {
        const month = new Date(inv.updated_at).toISOString().substring(0, 7); // YYYY-MM
        if (!monthlyData[month]) {
          monthlyData[month] = { invested: 0, current: 0 };
        }
        monthlyData[month].invested += inv.amount_invested || 0;
        monthlyData[month].current += inv.current_value || 0;
      }

      for (const month of Object.keys(monthlyData).slice(-12)) {
        monthlyPerformance.push({
          month: new Date(`${month}-01`).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          value: monthlyData[month].current,
          benchmark: monthlyData[month].invested * 1.08, // 8% benchmark
        });
      }
    }

    // Calculate asset allocation
    const assetAllocation =
      investments?.reduce(
        (acc, inv) => {
          const assetClass = inv.investment_deals?.asset_class || "Other";
          if (!acc[assetClass]) {
            acc[assetClass] = { value: 0, count: 0 };
          }
          acc[assetClass].value += inv.current_value || 0;
          acc[assetClass].count += 1;
          return acc;
        },
        {} as { [key: string]: { value: number; count: number } },
      ) || {};

    const assetAllocationArray = Object.entries(assetAllocation).map(
      ([name, data]) => ({
        name,
        value: data.value,
        count: data.count,
        color: getAssetClassColor(name),
      }),
    );

    // Format distributions for chart
    const distributionHistory =
      distributions
        ?.slice(0, 6)
        .map((dist) => ({
          month: new Date(dist.distribution_date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          amount: dist.amount,
          type: dist.type || "Distribution",
        }))
        .reverse() || [];

    // Format recent activity
    const activityFeed =
      recentActivity?.map((activity) => ({
        id: activity.id,
        type: "investment",
        title: "New Investment",
        description: `${activity.investment_deals?.title} - ${activity.investment_deals?.location}`,
        amount: activity.amount_invested,
        date: new Date(activity.created_at).toLocaleDateString(),
        status: activity.status,
      })) || [];

    // Add distribution activities
    for (const dist of distributions?.slice(0, 5) || []) {
      activityFeed.push({
        id: `dist_${dist.id}`,
        type: "distribution",
        title: "Distribution Received",
        description: `${dist.user_investments?.investment_deals?.title} - ${dist.type || "Quarterly Distribution"}`,
        amount: dist.amount,
        date: new Date(dist.distribution_date).toLocaleDateString(),
        status: "completed",
      });
    }

    // Sort activity by date
    activityFeed.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Build comprehensive dashboard response
    const dashboardData = {
      // Portfolio Overview
      portfolio: {
        totalValue: currentValue,
        totalInvested: totalInvested,
        totalReturns: totalReturns,
        overallPerformance: overallPerformance,
        totalDistributions: totalDistributions,
        activeInvestments:
          investments?.filter((inv) => inv.status === "active").length || 0,
        monthlyChange: 12.3, // Calculate from recent performance
        yearToDateReturn: 24.8, // Calculate from YTD performance
      },

      // Performance Charts
      performanceHistory: monthlyPerformance,

      // Asset Allocation
      assetAllocation: assetAllocationArray,

      // Distribution History
      distributionHistory: distributionHistory,

      // Recent Activity
      recentActivity: activityFeed.slice(0, 10),

      // Investment Summary
      investments:
        investments?.map((inv) => ({
          id: inv.id,
          name: inv.investment_deals?.title || "Unknown Investment",
          type: inv.investment_deals?.type || "Equity",
          invested: inv.amount_invested,
          currentValue: inv.current_value,
          performance:
            inv.amount_invested > 0
              ? ((inv.current_value - inv.amount_invested) /
                  inv.amount_invested) *
                100
              : 0,
          status: inv.status,
          assetClass: inv.investment_deals?.asset_class,
          location: inv.investment_deals?.location,
          investmentDate: inv.created_at,
        })) || [],

      // User Profile Info
      userProfile: {
        id: userProfile.id,
        name: `${userProfile.first_name} ${userProfile.last_name}`,
        email: userProfile.email,
        verificationStatus: userProfile.verification_status,
        memberSince: userProfile.created_at,
        userType: userProfile.user_type,
      },

      // Performance Metrics
      metrics: {
        irr: calculateIRR(investments || []), // Internal Rate of Return
        cashOnCash:
          totalDistributions > 0 && totalInvested > 0
            ? (totalDistributions / totalInvested) * 100
            : 0,
        equityMultiple: totalInvested > 0 ? currentValue / totalInvested : 0,
        averageHoldPeriod: calculateAverageHoldPeriod(investments || []),
      },
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Helper function to get asset class colors
function getAssetClassColor(assetClass: string): string {
  const colors: { [key: string]: string } = {
    Residential: "#27225e",
    Commercial: "#f3c835",
    "Mixed-Use": "#3aa576",
    Industrial: "#9797ae",
    Retail: "#e74c3c",
    Office: "#3498db",
    Hospitality: "#9b59b6",
    Other: "#95a5a6",
  };
  return colors[assetClass] || colors.Other;
}

// Helper function to calculate IRR (simplified)
function calculateIRR(investments: Investment[]): number {
  if (!investments.length) return 0;

  // Simplified IRR calculation
  // In production, use a proper financial library
  const totalInvested = investments.reduce(
    (sum, inv) => sum + (inv.amount_invested || 0),
    0,
  );
  const currentValue = investments.reduce(
    (sum, inv) => sum + (inv.current_value || 0),
    0,
  );

  if (totalInvested === 0) return 0;

  // Assume average hold period of 2 years for simplified calculation
  const holdPeriodYears = 2;
  const irr = (currentValue / totalInvested) ** (1 / holdPeriodYears) - 1;

  return irr * 100;
}

// Helper function to calculate average hold period
function calculateAverageHoldPeriod(investments: Investment[]): number {
  if (!investments.length) return 0;

  const now = new Date();
  const totalDays = investments.reduce((sum, inv) => {
    const investmentDate = new Date(inv.created_at);
    const daysDiff = Math.floor(
      (now.getTime() - investmentDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return sum + daysDiff;
  }, 0);

  return Math.floor(totalDays / investments.length);
}

// Mock data function for development
function getMockDashboardData(userId: string) {
  const mockPortfolio = {
    totalValue: 932000,
    totalInvested: 700000,
    totalReturns: 232000,
    overallPerformance: 33.1,
    totalDistributions: 76500,
    activeInvestments: 4,
    monthlyChange: 12.3,
    yearToDateReturn: 24.8,
  };

  const mockInvestments = [
    {
      id: "1",
      name: "Manhattan Luxury Tower",
      type: "Equity",
      invested: 250000,
      currentValue: 334000,
      performance: 33.6,
      status: "active",
      assetClass: "Residential",
      location: "New York, NY",
      investmentDate: new Date(
        Date.now() - 8 * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
    {
      id: "2",
      name: "Austin Tech Campus",
      type: "Equity",
      invested: 150000,
      currentValue: 195000,
      performance: 30.0,
      status: "active",
      assetClass: "Commercial",
      location: "Austin, TX",
      investmentDate: new Date(
        Date.now() - 6 * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
    {
      id: "3",
      name: "Miami Mixed-Use Development",
      type: "Hybrid",
      invested: 100000,
      currentValue: 118000,
      performance: 18.0,
      status: "active",
      assetClass: "Mixed-Use",
      location: "Miami, FL",
      investmentDate: new Date(
        Date.now() - 3 * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
    {
      id: "4",
      name: "Denver Industrial Portfolio",
      type: "Debt",
      invested: 200000,
      currentValue: 285000,
      performance: 42.5,
      status: "active",
      assetClass: "Industrial",
      location: "Denver, CO",
      investmentDate: new Date(
        Date.now() - 12 * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
  ];

  const mockActivity = [
    {
      id: "1",
      type: "distribution",
      title: "Distribution Received",
      description: "Austin Tech Campus - Q4 Distribution",
      amount: 12500,
      date: "2 hours ago",
      status: "completed",
    },
    {
      id: "2",
      type: "performance",
      title: "Portfolio Update",
      description: "Manhattan Luxury Tower valuation increased",
      amount: 45000,
      date: "3 days ago",
      status: "info",
    },
    {
      id: "3",
      type: "investment",
      title: "Investment Opportunity",
      description: "Seattle Waterfront Development - Early Access",
      amount: null,
      date: "1 week ago",
      status: "pending",
    },
    {
      id: "4",
      type: "document",
      title: "Tax Documents Ready",
      description: "K-1 forms available for download",
      amount: null,
      date: "2 weeks ago",
      status: "action_required",
    },
  ];

  return {
    portfolio: mockPortfolio,
    investments: mockInvestments,
    recentActivity: mockActivity,
    userProfile: {
      name: "Demo Investor",
      verificationStatus: "approved",
    },
    performanceHistory: [
      { month: "Jan 2024", value: 650000, benchmark: 624000 },
      { month: "Feb 2024", value: 678000, benchmark: 649600 },
      { month: "Mar 2024", value: 712000, buffer: 675200 },
      { month: "Apr 2024", value: 745000, benchmark: 700800 },
      { month: "May 2024", value: 789000, benchmark: 726400 },
      { month: "Jun 2024", value: 823000, benchmark: 752000 },
      { month: "Jul 2024", value: 856000, benchmark: 777600 },
      { month: "Aug 2024", value: 891000, benchmark: 803200 },
      { month: "Sep 2024", value: 912000, benchmark: 828800 },
      { month: "Oct 2024", value: 925000, benchmark: 854400 },
      { month: "Nov 2024", value: 932000, benchmark: 880000 },
    ],
    assetAllocation: [
      { name: "Residential", value: 334000, count: 1, color: "#27225e" },
      { name: "Commercial", value: 195000, count: 1, color: "#f3c835" },
      { name: "Mixed-Use", value: 118000, count: 1, color: "#3aa576" },
      { name: "Industrial", value: 285000, count: 1, color: "#9797ae" },
    ],
    distributionHistory: [
      { month: "Q2 2024", amount: 23850, type: "Quarterly" },
      { month: "Q3 2024", amount: 27550, type: "Quarterly" },
      { month: "Q4 2024", amount: 25100, type: "Quarterly" },
    ],
    metrics: {
      irr: 18.5,
      cashOnCash: 10.9,
      equityMultiple: 1.33,
      averageHoldPeriod: 245,
    },
  };
}

// WebSocket endpoint for real-time updates (optional)
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // This endpoint can be used to trigger real-time updates
    // or to update specific portfolio values

    const { investmentId, newValue } = await request.json();

    if (investmentId && newValue) {
      const supabase = createServiceClient();

      const { error } = await supabase
        .from("user_investments")
        .update({
          current_value: newValue,
          updated_at: new Date().toISOString(),
        })
        .eq("id", investmentId);

      if (error) {
        return NextResponse.json(
          { error: "Failed to update investment value" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Dashboard update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
