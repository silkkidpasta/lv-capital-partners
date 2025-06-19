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
  CheckCircle,
  DollarSign,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

const featuredDeals = [
  {
    id: 1,
    title: "Luxury Residential Development",
    location: "Manhattan, NY",
    type: "Equity Investment",
    targetReturn: "18-22%",
    minimumInvestment: "$250,000",
    status: "Active",
    fundedPercent: 85,
    timeRemaining: "14 days",
  },
  {
    id: 2,
    title: "Commercial Office Portfolio",
    location: "Austin, TX",
    type: "Debt + Equity",
    targetReturn: "15-18%",
    minimumInvestment: "$100,000",
    status: "Active",
    fundedPercent: 92,
    timeRemaining: "7 days",
  },
  {
    id: 3,
    title: "Mixed-Use Development",
    location: "Miami, FL",
    type: "Preferred Equity",
    targetReturn: "14-17%",
    minimumInvestment: "$500,000",
    status: "Coming Soon",
    fundedPercent: 0,
    timeRemaining: "TBA",
  },
];

const stats = [
  { label: "Total Capital Deployed", value: "$2.8B", icon: DollarSign },
  { label: "Average Returns", value: "16.3%", icon: TrendingUp },
  { label: "Active Investments", value: "47", icon: Building },
  { label: "Satisfied Investors", value: "1,200+", icon: Users },
];

const testimonials = [
  {
    name: "Michael Richardson",
    title: "Family Office Principal",
    content:
      "LV Capital Partners has consistently delivered exceptional returns while maintaining the highest standards of transparency and professionalism.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    title: "High Net Worth Investor",
    content:
      "Their rigorous due diligence process and market expertise have made them our preferred partner for real estate investments.",
    rating: 5,
  },
  {
    name: "James Morrison",
    title: "Investment Committee Chair",
    content:
      "The quality of opportunities and investor relations at LV Capital is unmatched in the industry.",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 gradient-navy-gold opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Exclusive Real Estate
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Investment Opportunities
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Join sophisticated investors in carefully curated real estate
              ventures. Minimum investments starting at $100,000 with target
              returns of 14-22% IRR.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/investments/opportunities">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  View Current Opportunities
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Learn More About Us
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                SEC Compliant
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                Accredited Investors Only
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                15+ Years Experience
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
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

      {/* Featured Investments */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Current Investment Opportunities
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Carefully selected real estate investments offering superior
              risk-adjusted returns for accredited investors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDeals.map((deal, index) => (
              <Card
                key={deal.id}
                className="group hover:shadow-xl transition-all duration-300 border-border animate-slide-up"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant={
                        deal.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {deal.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {deal.timeRemaining}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-serif">
                    {deal.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {deal.location}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-semibold">{deal.type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Target Return:
                      </span>
                      <p className="font-semibold text-accent">
                        {deal.targetReturn}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground text-sm">
                      Minimum Investment:
                    </span>
                    <p className="font-semibold text-lg">
                      {deal.minimumInvestment}
                    </p>
                  </div>

                  {deal.status === "Active" && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Funded</span>
                        <span className="font-semibold">
                          {deal.fundedPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-accent to-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${deal.fundedPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Button className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground">
                    View Details
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/investments/opportunities">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
              >
                View All Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Trusted by Leading Investors
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from our community of sophisticated investors who have
              achieved exceptional returns through our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={`${testimonial.name}-star-${i}`}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <blockquote className="text-foreground mb-6 italic">
                    "{testimonial.content}"
                  </blockquote>

                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.title}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-navy-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-primary-foreground mb-6">
            Ready to Diversify Your Portfolio?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join our exclusive community of accredited investors and access
            institutional-quality real estate opportunities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg font-semibold"
              >
                Schedule a Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Learn Our Process
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="font-serif text-2xl font-semibold mb-4">
                LV Capital Partners
              </h3>
              <p className="text-primary-foreground/80 mb-4 max-w-md">
                Providing sophisticated investors with access to
                institutional-quality real estate investment opportunities since
                2009.
              </p>
              <p className="text-sm text-primary-foreground/70">
                © 2024 LV Capital Partners. All rights reserved.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-secondary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/investments"
                    className="hover:text-secondary transition-colors"
                  >
                    Investments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/performance"
                    className="hover:text-secondary transition-colors"
                  >
                    Performance
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-secondary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-secondary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-secondary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/disclosures"
                    className="hover:text-secondary transition-colors"
                  >
                    Disclosures
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
