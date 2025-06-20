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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Building,
  Calendar,
  DollarSign,
  Filter,
  MapPin,
  Search,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

// Mock investment opportunities data
const investmentOpportunities = [
  {
    id: "1",
    title: "Seattle Waterfront Development",
    description:
      "Premium mixed-use development with luxury condominiums and retail spaces in Seattle's vibrant waterfront district.",
    location: "Seattle, WA",
    assetClass: "Mixed-Use",
    investmentType: "Equity",
    minimumInvestment: 100000,
    targetReturn: 19.2,
    investmentTerm: 48,
    totalRaise: 85000000,
    currentFunding: 42000000,
    status: "Funding",
    riskLevel: "Medium-High",
    images: ["/placeholder-property-1.jpg"],
    keyHighlights: [
      "Prime waterfront location",
      "Pre-leased retail spaces",
      "Luxury amenities package",
      "Strong rental demand",
    ],
  },
  {
    id: "2",
    title: "Phoenix Retail Center",
    description:
      "Newly renovated retail center anchored by premium grocery and featuring diverse tenant mix in high-traffic Phoenix suburban location.",
    location: "Phoenix, AZ",
    assetClass: "Retail",
    investmentType: "Debt",
    minimumInvestment: 75000,
    targetReturn: 14.5,
    investmentTerm: 36,
    totalRaise: 28000000,
    currentFunding: 22000000,
    status: "Funding",
    riskLevel: "Medium",
    images: ["/placeholder-property-2.jpg"],
    keyHighlights: [
      "Anchor tenant secured",
      "Recent renovations completed",
      "High-traffic location",
      "Stable cash flow",
    ],
  },
  {
    id: "3",
    title: "Atlanta Office Complex",
    description:
      "Modern office complex in Atlanta's growing business district with flexible workspace design and premium amenities.",
    location: "Atlanta, GA",
    assetClass: "Commercial",
    investmentType: "Equity",
    minimumInvestment: 200000,
    targetReturn: 22.8,
    investmentTerm: 60,
    totalRaise: 120000000,
    currentFunding: 95000000,
    status: "Active",
    riskLevel: "Medium-High",
    images: ["/placeholder-property-3.jpg"],
    keyHighlights: [
      "Class A office space",
      "Tech company tenants",
      "Modern amenities",
      "Growth market location",
    ],
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

const formatPercent = (percent: number) => {
  return `${percent.toFixed(1)}%`;
};

export default function InvestmentsPage() {
  const [selectedTab, setSelectedTab] = useState("opportunities");
  const [searchTerm, setSearchTerm] = useState("");
  const [assetClassFilter, setAssetClassFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const filteredOpportunities = investmentOpportunities.filter(
    (opportunity) => {
      const matchesSearch =
        opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAssetClass =
        assetClassFilter === "all" ||
        opportunity.assetClass === assetClassFilter;
      const matchesLocation =
        locationFilter === "all" ||
        opportunity.location.includes(locationFilter);

      return matchesSearch && matchesAssetClass && matchesLocation;
    },
  );

  return (
    <div className="min-h-screen bg-vault-background/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-vault-primary mb-4">
            Investment Opportunities
          </h1>
          <p className="text-lg text-vault-muted max-w-3xl mx-auto">
            Discover exclusive real estate investment opportunities carefully
            curated for accredited investors. Each opportunity undergoes
            rigorous due diligence and offers attractive risk-adjusted returns.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-vault-primary flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search & Filter Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vault-muted w-4 h-4" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={assetClassFilter}
                onValueChange={setAssetClassFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Asset Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Asset Classes</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Seattle">Seattle, WA</SelectItem>
                  <SelectItem value="Phoenix">Phoenix, AZ</SelectItem>
                  <SelectItem value="Atlanta">Atlanta, GA</SelectItem>
                  <SelectItem value="Austin">Austin, TX</SelectItem>
                  <SelectItem value="Miami">Miami, FL</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-vault-primary hover:bg-vault-primary/90 text-white">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Investment Opportunities */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/60 backdrop-blur-sm border border-vault-light/50 shadow-lg mb-8 rounded-xl p-1">
            <TabsTrigger
              value="opportunities"
              className="data-[state=active]:bg-vault-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg font-medium"
            >
              <Target className="w-4 h-4 mr-2" />
              Available
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="data-[state=active]:bg-vault-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg font-medium"
            >
              <Building className="w-4 h-4 mr-2" />
              My Investments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="mt-0">
            <div className="grid gap-8">
              {filteredOpportunities.map((opportunity) => (
                <Card
                  key={opportunity.id}
                  className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-0">
                    <div className="grid lg:grid-cols-3 gap-6 p-6">
                      {/* Property Image */}
                      <div className="lg:col-span-1">
                        <div className="aspect-video bg-vault-background/20 rounded-lg flex items-center justify-center">
                          <Building className="w-16 h-16 text-vault-muted" />
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-semibold text-vault-primary">
                                {opportunity.title}
                              </h3>
                              <Badge
                                variant={
                                  opportunity.status === "Active"
                                    ? "default"
                                    : "outline"
                                }
                                className={
                                  opportunity.status === "Active"
                                    ? "bg-vault-accent text-white"
                                    : "border-vault-primary text-vault-primary"
                                }
                              >
                                {opportunity.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-vault-muted mb-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {opportunity.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {opportunity.assetClass}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {opportunity.investmentTerm} months
                              </div>
                            </div>
                            <p className="text-vault-muted text-sm leading-relaxed">
                              {opportunity.description}
                            </p>
                          </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-vault-light/30">
                          <div>
                            <div className="text-xs text-vault-muted uppercase tracking-wide">
                              Target Return
                            </div>
                            <div className="text-lg font-semibold text-vault-accent">
                              {formatPercent(opportunity.targetReturn)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-vault-muted uppercase tracking-wide">
                              Min Investment
                            </div>
                            <div className="text-lg font-semibold text-vault-primary">
                              {formatCurrency(opportunity.minimumInvestment)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-vault-muted uppercase tracking-wide">
                              Total Raise
                            </div>
                            <div className="text-lg font-semibold text-vault-primary">
                              {formatCurrency(opportunity.totalRaise)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-vault-muted uppercase tracking-wide">
                              Funding Progress
                            </div>
                            <div className="text-lg font-semibold text-vault-accent">
                              {Math.round(
                                (opportunity.currentFunding /
                                  opportunity.totalRaise) *
                                  100,
                              )}
                              %
                            </div>
                          </div>
                        </div>

                        {/* Key Highlights */}
                        <div>
                          <h4 className="font-semibold text-vault-primary mb-2">
                            Key Highlights:
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {opportunity.keyHighlights.map(
                              (highlight) => (
                                <div
                                  key={highlight}
                                  className="flex items-center gap-2 text-sm text-vault-muted"
                                >
                                  <div className="w-1.5 h-1.5 bg-vault-accent rounded-full" />
                                  {highlight}
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Funding Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-vault-muted">
                              Funding Progress
                            </span>
                            <span className="font-semibold text-vault-primary">
                              {formatCurrency(opportunity.currentFunding)} /{" "}
                              {formatCurrency(opportunity.totalRaise)}
                            </span>
                          </div>
                          <div className="w-full bg-vault-background/20 rounded-full h-2">
                            <div
                              className="bg-vault-accent h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(opportunity.currentFunding / opportunity.totalRaise) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <Button className="bg-vault-primary hover:bg-vault-primary/90 text-white flex-1">
                            <Users className="w-4 h-4 mr-2" />
                            Express Interest
                          </Button>
                          <Button
                            variant="outline"
                            className="border-vault-light hover:border-vault-primary"
                          >
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredOpportunities.length === 0 && (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Target className="w-16 h-16 text-vault-muted mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-vault-primary mb-2">
                      No Opportunities Found
                    </h3>
                    <p className="text-vault-muted">
                      Try adjusting your search criteria or check back later for
                      new opportunities.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-0">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Building className="w-16 h-16 text-vault-primary mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-vault-primary mb-4">
                  Your Investment Portfolio
                </h2>
                <p className="text-vault-muted mb-6 max-w-md mx-auto">
                  View and manage your current investments from your main
                  dashboard.
                </p>
                <Button
                  className="bg-vault-primary hover:bg-vault-primary/90 text-white"
                  onClick={() => { window.location.href = "/dashboard"; }}
                >
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
