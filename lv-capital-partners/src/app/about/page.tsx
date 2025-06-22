"use client";

import { Header } from "@/components/navigation/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  Building,
  Calendar,
  GraduationCap,
  Handshake,
  MapPin,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

const teamMembers = [
  {
    name: "Marcus Wellington",
    title: "Founding Partner & CEO",
    education: "Harvard Business School, MBA | Wharton, BS Finance",
    experience:
      "Former Goldman Sachs Vice President, 15+ years real estate investing",
    specialization: "Acquisition Strategy, Capital Markets",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Victoria Sterling",
    title: "Managing Partner & CIO",
    education:
      "Stanford Graduate School of Business, MBA | MIT, BS Engineering",
    experience:
      "Former Blackstone Real Estate, 12+ years institutional investing",
    specialization: "Asset Management, Development Oversight",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Alexander Thornton",
    title: "Partner & Head of Acquisitions",
    education: "Columbia Business School, MBA | Yale, BA Economics",
    experience: "Former CBRE Capital Markets, 10+ years transaction leadership",
    specialization: "Market Analysis, Due Diligence",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Catherine Blackwood",
    title: "Partner & General Counsel",
    education: "Harvard Law School, JD | Princeton, BA Political Science",
    experience: "Former Skadden Arps, 8+ years securities & real estate law",
    specialization: "Regulatory Compliance, Structure Optimization",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  },
];

const companyStats = [
  { label: "Founded", value: "2009", icon: Calendar },
  { label: "Total Assets Under Management", value: "$2.8B", icon: TrendingUp },
  { label: "Completed Transactions", value: "127", icon: Building },
  { label: "Average Annual Returns", value: "16.3%", icon: Target },
];

const awards = [
  {
    title: "Best Real Estate Investment Firm",
    organization: "Private Equity International",
    year: "2023",
  },
  {
    title: "Top Performing Real Estate Fund",
    organization: "Institutional Investor",
    year: "2022",
  },
  {
    title: "Excellence in Investor Relations",
    organization: "PERE Awards",
    year: "2022",
  },
  {
    title: "Outstanding Transaction of the Year",
    organization: "Commercial Real Estate Finance Council",
    year: "2021",
  },
];

const coreValues = [
  {
    icon: Shield,
    title: "Fiduciary Excellence",
    description:
      "We operate with the highest standards of integrity and transparency, always putting our investors' interests first.",
  },
  {
    icon: Target,
    title: "Risk-Adjusted Returns",
    description:
      "Our disciplined approach focuses on generating superior risk-adjusted returns through careful market analysis and due diligence.",
  },
  {
    icon: Handshake,
    title: "Partnership Philosophy",
    description:
      "We view our investor relationships as true partnerships, built on trust, communication, and shared success.",
  },
  {
    icon: Users,
    title: "Institutional Quality",
    description:
      "We bring institutional-level expertise and resources to every investment opportunity we present to our partners.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-emerald-navy opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              A Legacy of
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Investment Excellence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Since 2009, LV Capital Partners has been providing sophisticated
              investors with access to institutional-quality real estate
              opportunities, delivering consistent returns while preserving
              capital.
            </p>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => (
              <div key={stat.label} className="text-center animate-slide-up">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-6">
                Our Story
              </h2>

              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2009 by Marcus Wellington and Victoria Sterling, LV
                  Capital Partners emerged from a vision to democratize access
                  to institutional-quality real estate investments for
                  sophisticated individual investors.
                </p>

                <p>
                  With combined experience of over 40 years in investment
                  banking, private equity, and real estate development, our
                  founding partners recognized a significant gap in the market:
                  high-net-worth individuals lacked access to the same caliber
                  of real estate opportunities available to large institutions.
                </p>

                <p>
                  Today, we manage over $2.8 billion in assets across diverse
                  real estate sectors, maintaining our commitment to
                  transparency, excellence, and generating superior
                  risk-adjusted returns for our investor partners.
                </p>
              </div>

              <div className="mt-8">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    Partner With Us
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <Building className="w-24 h-24 text-primary mx-auto mb-6" />
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    15+ Years of Excellence
                  </h3>
                  <p className="text-muted-foreground">
                    Consistently delivering institutional-quality investment
                    opportunities to our partners
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our experienced leadership team brings decades of institutional
              investment experience and deep market expertise to every
              opportunity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={member.name}
                className="overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-border"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                        {member.name}
                      </h3>
                      <p className="text-accent font-semibold mb-4">
                        {member.title}
                      </p>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <GraduationCap className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {member.education}
                          </span>
                        </div>

                        <div className="flex items-start gap-2">
                          <Users className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {member.experience}
                          </span>
                        </div>

                        <div className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {member.specialization}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These principles guide every decision we make and every
              relationship we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <Card
                key={value.title}
                className="text-center hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mb-6">
                    <value.icon className="w-8 h-8 text-primary-foreground" />
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                    {value.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Awards & Recognition
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our commitment to excellence has been recognized by leading
              industry organizations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <Card
                key={`${award.title}-${award.year}`}
                className="text-center hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <Award className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {award.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {award.organization}
                  </p>
                  <Badge variant="secondary">{award.year}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-emerald-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-primary-foreground mb-6">
            Ready to Learn More?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Discover how our experience and expertise can help you achieve your
            real estate investment objectives.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg font-semibold"
              >
                Schedule a Meeting
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
