"use client";

import { Header } from "@/components/navigation/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Building,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  MapPin,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

const investmentOpportunities = [
  {
    id: 1,
    title: "Manhattan Luxury Residential Tower",
    location: "Upper East Side, New York, NY",
    type: "Equity Investment",
    status: "Active",
    targetReturn: "18-22%",
    minimumInvestment: 250000,
    totalRaise: 45000000,
    currentFunding: 38250000,
    fundedPercent: 85,
    timeRemaining: "14 days",
    unitCount: 87,
    projectedCompletion: "Q3 2026",
    riskLevel: "Medium",
    assetClass: "Residential",
    strategy: "Development",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    ],
    keyHighlights: [
      "Prime Upper East Side location",
      "Pre-sold 40% of units",
      "Experienced development team",
      "Strong market fundamentals",
    ],
    investmentStructure: {
      preferredReturn: "8% annually",
      irr: "18-22%",
      equity: "2.0-2.5x",
      holdPeriod: "36 months",
    },
  },
  {
    id: 2,
    title: "Austin Tech Campus Portfolio",
    location: "Austin, Texas",
    type: "Debt + Equity",
    status: "Active",
    targetReturn: "15-18%",
    minimumInvestment: 100000,
    totalRaise: 28000000,
    currentFunding: 25760000,
    fundedPercent: 92,
    timeRemaining: "7 days",
    unitCount: 3,
    projectedCompletion: "Q1 2025",
    riskLevel: "Low",
    assetClass: "Commercial",
    strategy: "Acquisition",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
    ],
    keyHighlights: [
      "Stable tech tenant base",
      "Below-market acquisition price",
      "Value-add renovation opportunity",
      "Growing Austin market",
    ],
    investmentStructure: {
      preferredReturn: "10% annually",
      irr: "15-18%",
      equity: "1.8-2.2x",
      holdPeriod: "24 months",
    },
  },
  {
    id: 3,
    title: "Miami Mixed-Use Development",
    location: "Brickell Avenue, Miami, FL",
    type: "Preferred Equity",
    status: "Coming Soon",
    targetReturn: "14-17%",
    minimumInvestment: 500000,
    totalRaise: 65000000,
    currentFunding: 0,
    fundedPercent: 0,
    timeRemaining: "TBA",
    unitCount: 156,
    projectedCompletion: "Q2 2027",
    riskLevel: "Medium-High",
    assetClass: "Mixed-Use",
    strategy: "Development",
    images: [
      "https://images.unsplash.com/photo-1587380541739-2ca6c9c5d87a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493962853295-0fd8b5f4c9f2?w=800&h=600&fit=crop",
    ],
    keyHighlights: [
      "Prime Brickell location",
      "Mixed residential/retail",
      "Strong pre-leasing interest",
      "Experienced sponsor",
    ],
    investmentStructure: {
      preferredReturn: "12% annually",
      irr: "14-17%",
      equity: "1.6-2.0x",
      holdPeriod: "42 months",
    },
  },
  {
    id: 4,
    title: "San Francisco Office Renovation",
    location: "SOMA District, San Francisco, CA",
    type: "Value-Add Equity",
    status: "Active",
    targetReturn: "16-20%",
    minimumInvestment: 150000,
    totalRaise: 32000000,
    currentFunding: 22400000,
    fundedPercent: 70,
    timeRemaining: "21 days",
    unitCount: 1,
    projectedCompletion: "Q4 2025",
    riskLevel: "Medium",
    assetClass: "Commercial",
    strategy: "Value-Add",
    images: [
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    ],
    keyHighlights: [
      "Class A office building",
      "50% below replacement cost",
      "Tech tenant demand",
      "Transit-oriented location",
    ],
    investmentStructure: {
      preferredReturn: "9% annually",
      irr: "16-20%",
      equity: "1.9-2.3x",
      holdPeriod: "30 months",
    },
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "Low":
      return "text-green-600 bg-green-50 border-green-200";
    case "Medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "Medium-High":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "High":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

export default function InvestmentOpportunitiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-navy-gold opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              Investment
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                Opportunities
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Carefully curated real estate investments offering superior
              risk-adjusted returns for accredited investors. Each opportunity
              undergoes rigorous due diligence.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                SEC Regulation D Offerings
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                Accredited Investors Only
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-accent" />
                Institutional Due Diligence
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-5 bg-background">
              <TabsTrigger value="all">All Opportunities</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="development">Development</TabsTrigger>
              <TabsTrigger value="commercial">Commercial</TabsTrigger>
              <TabsTrigger value="residential">Residential</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-12">
              <div className="grid lg:grid-cols-2 gap-8">
                {investmentOpportunities.map((opportunity) => (
                  <Card
                    key={opportunity.id}
                    className="group hover:shadow-2xl transition-all duration-300 border-border overflow-hidden"
                  >
                    {/* Property Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={opportunity.images[0]}
                        alt={opportunity.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge
                          variant={
                            opportunity.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {opportunity.status}
                        </Badge>
                        <Badge
                          className={`border ${getRiskColor(opportunity.riskLevel)}`}
                          variant="outline"
                        >
                          {opportunity.riskLevel} Risk
                        </Badge>
                      </div>
                      {opportunity.status === "Active" && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-foreground">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {opportunity.timeRemaining}
                        </div>
                      )}
                    </div>

                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <CardTitle className="text-2xl font-serif group-hover:text-primary transition-colors">
                            {opportunity.title}
                          </CardTitle>
                          <CardDescription className="text-base flex items-center gap-1 mt-2">
                            <MapPin className="w-4 h-4" />
                            {opportunity.location}
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">{opportunity.type}</Badge>
                        <Badge variant="outline">
                          {opportunity.assetClass}
                        </Badge>
                        <Badge variant="outline">{opportunity.strategy}</Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Target Return
                          </span>
                          <p className="text-2xl font-bold text-accent">
                            {opportunity.targetReturn}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Min. Investment
                          </span>
                          <p className="text-xl font-semibold">
                            {formatCurrency(opportunity.minimumInvestment)}
                          </p>
                        </div>
                      </div>

                      {/* Funding Progress */}
                      {opportunity.status === "Active" && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">
                              Funding Progress
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(opportunity.currentFunding)} /{" "}
                              {formatCurrency(opportunity.totalRaise)}
                            </span>
                          </div>
                          <Progress
                            value={opportunity.fundedPercent}
                            className="h-3"
                          />
                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-muted-foreground">
                              {opportunity.fundedPercent}% funded
                            </span>
                            <span className="font-semibold text-accent">
                              {formatCurrency(
                                opportunity.totalRaise -
                                  opportunity.currentFunding,
                              )}{" "}
                              remaining
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Key Highlights */}
                      <div>
                        <h4 className="font-semibold mb-3">Key Highlights</h4>
                        <ul className="space-y-2">
                          {opportunity.keyHighlights
                            .slice(0, 3)
                            .map((highlight, index) => (
                              <li
                                key={highlight}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                              >
                                <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                                {highlight}
                              </li>
                            ))}
                        </ul>
                      </div>

                      {/* Investment Details */}
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">
                          Investment Structure
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Preferred Return:
                            </span>
                            <p className="font-semibold">
                              {opportunity.investmentStructure.preferredReturn}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Target IRR:
                            </span>
                            <p className="font-semibold">
                              {opportunity.investmentStructure.irr}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Equity Multiple:
                            </span>
                            <p className="font-semibold">
                              {opportunity.investmentStructure.equity}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Hold Period:
                            </span>
                            <p className="font-semibold">
                              {opportunity.investmentStructure.holdPeriod}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Link
                          href={`/investments/deal/${opportunity.id}`}
                          className="flex-1"
                        >
                          <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                            View Details
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="px-4">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="active" className="mt-12">
              <div className="grid lg:grid-cols-2 gap-8">
                {investmentOpportunities
                  .filter((opp) => opp.status === "Active")
                  .map((opportunity) => (
                    <Card
                      key={opportunity.id}
                      className="group hover:shadow-2xl transition-all duration-300 border-border overflow-hidden"
                    >
                      {/* Same card content structure as above */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={opportunity.images[0]}
                          alt={opportunity.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge variant="default">Active</Badge>
                          <Badge
                            className={`border ${getRiskColor(opportunity.riskLevel)}`}
                            variant="outline"
                          >
                            {opportunity.riskLevel} Risk
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-foreground">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {opportunity.timeRemaining}
                        </div>
                      </div>
                      {/* Rest of card content... */}
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Similar TabsContent for other filter options */}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-emerald-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-primary-foreground mb-6">
            Ready to Invest?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Our investment team is standing by to answer your questions and
            guide you through our streamlined investment process.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg font-semibold"
              >
                Schedule a Call
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Learn the Process
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
