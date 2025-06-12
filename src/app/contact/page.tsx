"use client";

import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

const officeLocations = [
  {
    city: "New York",
    address: "432 Park Avenue, Suite 2800, New York, NY 10016",
    phone: "+1 (212) 555-0123",
    email: "ny@lvcapitalpartners.com",
  },
  {
    city: "Los Angeles",
    address: "1999 Avenue of the Stars, Suite 1200, Los Angeles, CA 90067",
    phone: "+1 (310) 555-0456",
    email: "la@lvcapitalpartners.com",
  },
  {
    city: "Chicago",
    address: "875 North Michigan Avenue, Suite 3100, Chicago, IL 60611",
    phone: "+1 (312) 555-0789",
    email: "chicago@lvcapitalpartners.com",
  },
];

const investmentInterests = [
  "Residential Development",
  "Commercial Office",
  "Mixed-Use Projects",
  "Industrial/Logistics",
  "Hospitality",
  "Retail Properties",
  "Senior Housing",
  "Student Housing",
];

const investmentAmounts = [
  "$100,000 - $250,000",
  "$250,000 - $500,000",
  "$500,000 - $1,000,000",
  "$1,000,000 - $2,500,000",
  "$2,500,000 - $5,000,000",
  "$5,000,000+",
];

export default function ContactPage() {
  const [selectedTab, setSelectedTab] = useState("contact");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    investmentAmount: "",
    investmentInterests: [],
    accreditedStatus: "",
    timeframe: "",
    message: "",
    preferredContact: "email",
    preferredTime: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // Show success message or redirect
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-navy-gold opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              Connect With
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Our Investment Team
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Schedule a private consultation to discuss exclusive real estate
              investment opportunities tailored to your portfolio objectives.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                Confidential Consultation
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Dedicated Relationship Manager
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Institutional-Quality Opportunities
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-muted mb-12">
              <TabsTrigger value="contact">Contact Form</TabsTrigger>
              <TabsTrigger value="schedule">Schedule Meeting</TabsTrigger>
              <TabsTrigger value="locations">Our Offices</TabsTrigger>
            </TabsList>

            {/* Contact Form Tab */}
            <TabsContent value="contact">
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif text-2xl">
                        Investor Inquiry Form
                      </CardTitle>
                      <CardDescription>
                        Tell us about your investment objectives and we'll
                        connect you with the right opportunities.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">
                            Personal Information
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">First Name *</Label>
                              <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) =>
                                  handleInputChange("firstName", e.target.value)
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name *</Label>
                              <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) =>
                                  handleInputChange("lastName", e.target.value)
                                }
                                required
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="email">Email Address *</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                  handleInputChange("email", e.target.value)
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                  handleInputChange("phone", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="company">
                                Company/Organization
                              </Label>
                              <Input
                                id="company"
                                value={formData.company}
                                onChange={(e) =>
                                  handleInputChange("company", e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="title">Title/Position</Label>
                              <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                  handleInputChange("title", e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>

                        {/* Investment Preferences */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">
                            Investment Preferences
                          </h3>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="investmentAmount">
                                Investment Amount Range *
                              </Label>
                              <Select
                                value={formData.investmentAmount}
                                onValueChange={(value) =>
                                  handleInputChange("investmentAmount", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select investment range" />
                                </SelectTrigger>
                                <SelectContent>
                                  {investmentAmounts.map((amount) => (
                                    <SelectItem key={amount} value={amount}>
                                      {amount}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="timeframe">
                                Investment Timeframe
                              </Label>
                              <Select
                                value={formData.timeframe}
                                onValueChange={(value) =>
                                  handleInputChange("timeframe", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select timeframe" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="immediate">
                                    Immediate (within 30 days)
                                  </SelectItem>
                                  <SelectItem value="short">
                                    Short-term (1-3 months)
                                  </SelectItem>
                                  <SelectItem value="medium">
                                    Medium-term (3-6 months)
                                  </SelectItem>
                                  <SelectItem value="long">
                                    Long-term (6+ months)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label>Accredited Investor Status *</Label>
                            <div className="mt-2 space-y-2">
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="accredited"
                                  value="yes"
                                  checked={formData.accreditedStatus === "yes"}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "accreditedStatus",
                                      e.target.value,
                                    )
                                  }
                                  className="text-primary"
                                />
                                <span>Yes, I am an accredited investor</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="accredited"
                                  value="no"
                                  checked={formData.accreditedStatus === "no"}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "accreditedStatus",
                                      e.target.value,
                                    )
                                  }
                                  className="text-primary"
                                />
                                <span>No, I am not an accredited investor</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="accredited"
                                  value="unsure"
                                  checked={
                                    formData.accreditedStatus === "unsure"
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      "accreditedStatus",
                                      e.target.value,
                                    )
                                  }
                                  className="text-primary"
                                />
                                <span>Unsure - please provide information</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Contact Preferences */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">
                            Contact Preferences
                          </h3>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Preferred Contact Method</Label>
                              <div className="mt-2 space-y-2">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="contact"
                                    value="email"
                                    checked={
                                      formData.preferredContact === "email"
                                    }
                                    onChange={(e) =>
                                      handleInputChange(
                                        "preferredContact",
                                        e.target.value,
                                      )
                                    }
                                    className="text-primary"
                                  />
                                  <span>Email</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="contact"
                                    value="phone"
                                    checked={
                                      formData.preferredContact === "phone"
                                    }
                                    onChange={(e) =>
                                      handleInputChange(
                                        "preferredContact",
                                        e.target.value,
                                      )
                                    }
                                    className="text-primary"
                                  />
                                  <span>Phone Call</span>
                                </label>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="preferredTime">
                                Preferred Contact Time
                              </Label>
                              <Select
                                value={formData.preferredTime}
                                onValueChange={(value) =>
                                  handleInputChange("preferredTime", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select preferred time" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="morning">
                                    Morning (9AM - 12PM EST)
                                  </SelectItem>
                                  <SelectItem value="afternoon">
                                    Afternoon (12PM - 5PM EST)
                                  </SelectItem>
                                  <SelectItem value="evening">
                                    Evening (5PM - 8PM EST)
                                  </SelectItem>
                                  <SelectItem value="anytime">
                                    Anytime
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Message */}
                        <div>
                          <Label htmlFor="message">
                            Additional Information
                          </Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) =>
                              handleInputChange("message", e.target.value)
                            }
                            placeholder="Tell us about your investment goals, experience, or any specific questions you have..."
                            rows={4}
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                        >
                          Submit Inquiry
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-full mt-1">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Initial Review</p>
                          <p className="text-sm text-muted-foreground">
                            We review your inquiry within 24 hours
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-full mt-1">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Personal Consultation</p>
                          <p className="text-sm text-muted-foreground">
                            Schedule a private meeting with our team
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-full mt-1">
                          <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            Investment Opportunities
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Access to exclusive deal pipeline
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">+1 (212) 555-0123</p>
                          <p className="text-sm text-muted-foreground">
                            Monday - Friday, 9AM - 6PM EST
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">
                            info@lvcapitalpartners.com
                          </p>
                          <p className="text-sm text-muted-foreground">
                            General inquiries and information
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Schedule Meeting Tab */}
            <TabsContent value="schedule">
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="font-serif text-2xl">
                      Schedule a Private Consultation
                    </CardTitle>
                    <CardDescription>
                      Book a one-on-one meeting with our investment team to
                      discuss your portfolio objectives and available
                      opportunities.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <Calendar className="w-16 h-16 text-primary mx-auto mb-6" />
                    <h3 className="text-xl font-semibold mb-4">
                      Calendar Integration Coming Soon
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                      We're implementing a sophisticated scheduling system to
                      make booking consultations seamless. In the meantime,
                      please use our contact form or call us directly to
                      schedule your meeting.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={() => setSelectedTab("contact")}>
                        Use Contact Form
                      </Button>
                      <Button variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Call +1 (212) 555-0123
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Locations Tab */}
            <TabsContent value="locations">
              <div className="grid md:grid-cols-3 gap-8">
                {officeLocations.map((office, index) => (
                  <Card
                    key={office.city}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="font-serif text-xl">
                        {office.city} Office
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <p className="text-sm">{office.address}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <p className="text-sm font-semibold">{office.phone}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <p className="text-sm">{office.email}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <p className="text-sm">Mon-Fri: 9AM - 6PM Local Time</p>
                      </div>

                      <Button variant="outline" className="w-full mt-4">
                        Get Directions
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="pt-6">
                    <h3 className="font-serif text-xl font-semibold mb-4">
                      Global Reach
                    </h3>
                    <p className="text-muted-foreground">
                      While our primary offices are located in major financial
                      centers, we serve accredited investors worldwide. Our team
                      is available for virtual consultations and can arrange
                      meetings in your location for substantial investment
                      commitments.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
