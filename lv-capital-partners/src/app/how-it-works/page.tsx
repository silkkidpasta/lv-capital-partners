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
import {
  ArrowRight,
  BarChart3,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  FileText,
  Search,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

const investmentSteps = [
  {
    step: 1,
    title: "Discovery & Qualification",
    description:
      "Initial consultation to understand your investment objectives and verify accredited investor status.",
    icon: Users,
    details: [
      "Confidential portfolio assessment",
      "Investment preference analysis",
      "Accredited investor verification",
      "Risk tolerance evaluation",
    ],
    timeframe: "1-2 days",
  },
  {
    step: 2,
    title: "Deal Sourcing & Analysis",
    description:
      "Our team identifies and evaluates investment opportunities that match your criteria.",
    icon: Search,
    details: [
      "Market analysis and due diligence",
      "Financial modeling and projections",
      "Risk assessment and mitigation",
      "Opportunity presentation preparation",
    ],
    timeframe: "Ongoing",
  },
  {
    step: 3,
    title: "Investment Presentation",
    description:
      "Detailed presentation of curated opportunities with comprehensive financial analysis.",
    icon: FileText,
    details: [
      "Investment memorandum review",
      "Financial projections and returns",
      "Market conditions assessment",
      "Q&A session with deal team",
    ],
    timeframe: "1-2 weeks",
  },
  {
    step: 4,
    title: "Due Diligence Period",
    description:
      "Comprehensive review period with access to all relevant documentation and data.",
    icon: BarChart3,
    details: [
      "Legal document review",
      "Property inspection (if applicable)",
      "Third-party reports access",
      "Financial audit materials",
    ],
    timeframe: "7-14 days",
  },
  {
    step: 5,
    title: "Investment Commitment",
    description:
      "Formal commitment process with subscription documents and capital contribution.",
    icon: Shield,
    details: [
      "Subscription agreement execution",
      "Legal documentation signing",
      "Capital call notification",
      "Wire transfer instructions",
    ],
    timeframe: "3-5 days",
  },
  {
    step: 6,
    title: "Ongoing Management",
    description:
      "Active asset management with regular reporting and distribution processing.",
    icon: Building,
    details: [
      "Quarterly performance reports",
      "Monthly market updates",
      "Distribution processing",
      "Exit strategy execution",
    ],
    timeframe: "Investment duration",
  },
];

const investmentTypes = [
  {
    type: "Equity Investments",
    description:
      "Direct ownership stakes in real estate projects with potential for capital appreciation and distributions.",
    targetReturns: "18-25% IRR",
    minimumInvestment: "$250,000",
    holdPeriod: "3-7 years",
    features: [
      "Direct property ownership",
      "Quarterly distributions",
      "Capital appreciation upside",
      "Tax-advantaged structure",
    ],
  },
  {
    type: "Debt Investments",
    description:
      "Secured lending positions providing steady income with lower risk profile.",
    targetReturns: "12-16% IRR",
    minimumInvestment: "$100,000",
    holdPeriod: "1-3 years",
    features: [
      "First lien position",
      "Monthly interest payments",
      "Principal protection focus",
      "Shorter investment horizon",
    ],
  },
  {
    type: "Preferred Equity",
    description:
      "Hybrid structure combining debt-like returns with equity upside potential.",
    targetReturns: "14-20% IRR",
    minimumInvestment: "$500,000",
    holdPeriod: "2-5 years",
    features: [
      "Preferred return guarantee",
      "Equity appreciation participation",
      "Priority over common equity",
      "Structured exit provisions",
    ],
  },
];

const riskManagement = [
  {
    title: "Market Analysis",
    description:
      "Comprehensive market research and economic analysis for each opportunity.",
    icon: TrendingUp,
  },
  {
    title: "Due Diligence",
    description:
      "Rigorous evaluation of all investment opportunities by our experienced team.",
    icon: FileText,
  },
  {
    title: "Diversification",
    description:
      "Portfolio construction across markets, asset classes, and investment strategies.",
    icon: BarChart3,
  },
  {
    title: "Active Management",
    description:
      "Ongoing asset management and performance monitoring throughout the investment lifecycle.",
    icon: Target,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-emerald-navy opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              How It
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                Works
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Our sophisticated investment process combines
              institutional-quality due diligence with personalized service to
              deliver exceptional real estate opportunities.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                SEC Compliant Process
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                Accredited Investors Only
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Streamlined Timeline
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Process Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Investment Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From initial consultation to ongoing management, our six-step
              process ensures a seamless investment experience.
            </p>
          </div>

          <div className="grid gap-8">
            {investmentSteps.map((step, index) => (
              <Card
                key={step.step}
                className="overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Step Number and Icon */}
                    <div className="flex-shrink-0 text-center lg:text-left">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mb-4">
                        <step.icon className="w-10 h-10 text-primary-foreground" />
                      </div>
                      <div className="text-3xl font-bold text-primary mb-2">
                        Step {step.step}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {step.timeframe}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                        {step.title}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        {step.description}
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detail} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                            <span className="text-foreground">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    {index < investmentSteps.length - 1 && (
                      <div className="hidden lg:flex items-center justify-center">
                        <ArrowRight className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Types */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Investment Structures
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We offer three primary investment structures, each designed to
              meet different risk and return objectives.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {investmentTypes.map((investment, index) => (
              <Card
                key={investment.type}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    {investment.type}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {investment.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Target Returns
                      </p>
                      <p className="font-bold text-accent">
                        {investment.targetReturns}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Min. Investment
                      </p>
                      <p className="font-semibold">
                        {investment.minimumInvestment}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">
                        Hold Period
                      </p>
                      <p className="font-semibold">{investment.holdPeriod}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {investment.features.map((feature, featureIndex) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Management */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Risk Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive approach to risk management protects your
              capital while maximizing return potential.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {riskManagement.map((item, index) => (
              <Card
                key={item.title}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mb-6">
                    <item.icon className="w-8 h-8 text-primary-foreground" />
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                    {item.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline & FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">
                  Typical Timeline
                </CardTitle>
                <CardDescription>
                  From initial inquiry to first distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">Day 1</span>
                  </div>
                  <div>
                    <p className="font-semibold">Initial Consultation</p>
                    <p className="text-sm text-muted-foreground">
                      Portfolio review and qualification
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">Week 1</span>
                  </div>
                  <div>
                    <p className="font-semibold">Opportunity Presentation</p>
                    <p className="text-sm text-muted-foreground">
                      Investment options review
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">Week 2</span>
                  </div>
                  <div>
                    <p className="font-semibold">Due Diligence</p>
                    <p className="text-sm text-muted-foreground">
                      Document review and analysis
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">Week 3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Investment Commitment</p>
                    <p className="text-sm text-muted-foreground">
                      Documentation and funding
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Ongoing Management</p>
                    <p className="text-sm text-muted-foreground">
                      Regular reporting and distributions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Advantages */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">
                  Why Choose LV Capital?
                </CardTitle>
                <CardDescription>
                  Advantages of our investment platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Institutional Quality</p>
                    <p className="text-sm text-muted-foreground">
                      Access to deals typically reserved for large institutions
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Experienced Team</p>
                    <p className="text-sm text-muted-foreground">
                      15+ years of real estate investment expertise
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Transparent Reporting</p>
                    <p className="text-sm text-muted-foreground">
                      Detailed quarterly reports and regular updates
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Aligned Interests</p>
                    <p className="text-sm text-muted-foreground">
                      Management co-invests in every opportunity
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Proven Track Record</p>
                    <p className="text-sm text-muted-foreground">
                      Consistent returns across market cycles
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Comprehensive Support</p>
                    <p className="text-sm text-muted-foreground">
                      Dedicated relationship management throughout investment
                      lifecycle
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-navy-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-primary-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Begin your journey with institutional-quality real estate
            investments. Schedule a consultation to discuss your investment
            objectives.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg font-semibold"
              >
                Schedule Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/investments/opportunities">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                View Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
