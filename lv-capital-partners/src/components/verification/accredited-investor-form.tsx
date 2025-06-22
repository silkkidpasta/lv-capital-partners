"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import {
  AlertCircle,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  FileText,
  Info,
  Shield,
  Upload,
  User,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";

export function AccreditedInvestorForm() {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSSN, setShowSSN] = useState(false);
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    ssn: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    accreditationMethod: string;
    annualIncome: string;
    jointAnnualIncome: string;
    employmentStatus: string;
    employer: string;
    jobTitle: string;
    yearsEmployed: string;
    netWorth: string;
    liquidNetWorth: string;
    primaryResidenceValue: string;
    investmentPortfolioValue: string;
    professionalStatus: string;
    licenseNumber: string;
    issuingAuthority: string;
    entityType: string;
    entityName: string;
    entityAssets: string;
    investmentExperience: string;
    previousInvestments: string;
    riskTolerance: string;
    investmentObjectives: string;
    usCitizen: boolean;
    politicallyExposed: boolean;
    sanctionsCheck: boolean;
    uploadedDocuments: File[];
  }>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dateOfBirth: "",
    ssn: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    accreditationMethod: "income",
    annualIncome: "",
    jointAnnualIncome: "",
    employmentStatus: "",
    employer: "",
    jobTitle: "",
    yearsEmployed: "",
    netWorth: "",
    liquidNetWorth: "",
    primaryResidenceValue: "",
    investmentPortfolioValue: "",
    professionalStatus: "",
    licenseNumber: "",
    issuingAuthority: "",
    entityType: "",
    entityName: "",
    entityAssets: "",
    investmentExperience: "",
    previousInvestments: "",
    riskTolerance: "",
    investmentObjectives: "",
    usCitizen: false,
    politicallyExposed: false,
    sanctionsCheck: false,
    uploadedDocuments: [],
  });

  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const updateFormData = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateAddressField = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.dateOfBirth &&
          formData.ssn &&
          formData.phone
        );
      case 2:
        return !!(
          formData.address.street &&
          formData.address.city &&
          formData.address.state &&
          formData.address.zipCode
        );
      case 3:
        return !!formData.accreditationMethod;
      case 4:
        if (formData.accreditationMethod === "income") {
          return !!(formData.annualIncome && formData.employmentStatus);
        }
        if (formData.accreditationMethod === "net_worth") {
          return !!(formData.netWorth && formData.liquidNetWorth);
        }
        if (formData.accreditationMethod === "professional") {
          return !!(
            formData.professionalStatus &&
            formData.licenseNumber &&
            formData.issuingAuthority
          );
        }
        return true;
      case 5:
        return !!(
          formData.investmentExperience &&
          formData.riskTolerance &&
          formData.investmentObjectives
        );
      case 6:
        return (
          formData.usCitizen &&
          !formData.politicallyExposed &&
          formData.sanctionsCheck
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const submissionData = new FormData();
      submissionData.append("verification_data", JSON.stringify(formData));

      formData.uploadedDocuments.forEach((file, index) => {
        submissionData.append(`document_${index}`, file);
      });

      const response = await fetch("/api/verification/submit", {
        method: "POST",
        body: submissionData,
      });

      if (response.ok) {
        window.location.href = "/dashboard?tab=verification";
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: string) => {
    const num = value.replace(/[^\d]/g, "");
    return num ? `$${Number.parseInt(num).toLocaleString()}` : "";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-serif font-bold text-vault-primary mb-2">
          Accredited Investor Verification
        </h1>
        <p className="text-vault-muted mb-6">
          Complete this form to verify your accredited investor status and
          unlock exclusive investment opportunities.
        </p>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-vault-muted mb-2">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            {currentStep === 1 && (
              <User className="w-6 h-6 text-vault-primary" />
            )}
            {currentStep === 2 && (
              <Building className="w-6 h-6 text-vault-primary" />
            )}
            {currentStep === 3 && (
              <Shield className="w-6 h-6 text-vault-primary" />
            )}
            {currentStep === 4 && (
              <DollarSign className="w-6 h-6 text-vault-primary" />
            )}
            {currentStep === 5 && (
              <FileText className="w-6 h-6 text-vault-primary" />
            )}
            {currentStep === 6 && (
              <CheckCircle className="w-6 h-6 text-vault-primary" />
            )}

            <div>
              <CardTitle className="text-vault-primary">
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Address Information"}
                {currentStep === 3 && "Accreditation Method"}
                {currentStep === 4 && "Financial Information"}
                {currentStep === 5 && "Investment Profile"}
                {currentStep === 6 && "Compliance & Documents"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 &&
                  "Provide your basic personal details for identity verification"}
                {currentStep === 2 && "Enter your current residential address"}
                {currentStep === 3 &&
                  "Select how you qualify as an accredited investor"}
                {currentStep === 4 &&
                  "Provide financial details to support your accreditation"}
                {currentStep === 5 &&
                  "Tell us about your investment experience and objectives"}
                {currentStep === 6 &&
                  "Complete compliance checks and upload required documents"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    updateFormData("dateOfBirth", e.target.value)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="ssn">Social Security Number *</Label>
                <div className="relative mt-1">
                  <Input
                    id="ssn"
                    type={showSSN ? "text" : "password"}
                    value={formData.ssn}
                    onChange={(e) => updateFormData("ssn", e.target.value)}
                    placeholder="XXX-XX-XXXX"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowSSN(!showSSN)}
                  >
                    {showSSN ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Step 2: Address Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => updateAddressField("street", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => updateAddressField("city", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.address.state}
                    onValueChange={(value) =>
                      updateAddressField("state", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="AK">Alaska</SelectItem>
                      <SelectItem value="AZ">Arizona</SelectItem>
                      <SelectItem value="AR">Arkansas</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="CO">Colorado</SelectItem>
                      <SelectItem value="CT">Connecticut</SelectItem>
                      <SelectItem value="DE">Delaware</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="GA">Georgia</SelectItem>
                      <SelectItem value="HI">Hawaii</SelectItem>
                      <SelectItem value="ID">Idaho</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                      <SelectItem value="IN">Indiana</SelectItem>
                      <SelectItem value="IA">Iowa</SelectItem>
                      <SelectItem value="KS">Kansas</SelectItem>
                      <SelectItem value="KY">Kentucky</SelectItem>
                      <SelectItem value="LA">Louisiana</SelectItem>
                      <SelectItem value="ME">Maine</SelectItem>
                      <SelectItem value="MD">Maryland</SelectItem>
                      <SelectItem value="MA">Massachusetts</SelectItem>
                      <SelectItem value="MI">Michigan</SelectItem>
                      <SelectItem value="MN">Minnesota</SelectItem>
                      <SelectItem value="MS">Mississippi</SelectItem>
                      <SelectItem value="MO">Missouri</SelectItem>
                      <SelectItem value="MT">Montana</SelectItem>
                      <SelectItem value="NE">Nebraska</SelectItem>
                      <SelectItem value="NV">Nevada</SelectItem>
                      <SelectItem value="NH">New Hampshire</SelectItem>
                      <SelectItem value="NJ">New Jersey</SelectItem>
                      <SelectItem value="NM">New Mexico</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="NC">North Carolina</SelectItem>
                      <SelectItem value="ND">North Dakota</SelectItem>
                      <SelectItem value="OH">Ohio</SelectItem>
                      <SelectItem value="OK">Oklahoma</SelectItem>
                      <SelectItem value="OR">Oregon</SelectItem>
                      <SelectItem value="PA">Pennsylvania</SelectItem>
                      <SelectItem value="RI">Rhode Island</SelectItem>
                      <SelectItem value="SC">South Carolina</SelectItem>
                      <SelectItem value="SD">South Dakota</SelectItem>
                      <SelectItem value="TN">Tennessee</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="UT">Utah</SelectItem>
                      <SelectItem value="VT">Vermont</SelectItem>
                      <SelectItem value="VA">Virginia</SelectItem>
                      <SelectItem value="WA">Washington</SelectItem>
                      <SelectItem value="WV">West Virginia</SelectItem>
                      <SelectItem value="WI">Wisconsin</SelectItem>
                      <SelectItem value="WY">Wyoming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.address.zipCode}
                    onChange={(e) =>
                      updateAddressField("zipCode", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Accreditation Method */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      Accredited Investor Requirements
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      You must meet at least one of the following criteria to
                      qualify as an accredited investor under SEC regulations.
                    </p>
                  </div>
                </div>
              </div>

              <RadioGroup
                value={formData.accreditationMethod}
                onValueChange={(value) =>
                  updateFormData("accreditationMethod", value)
                }
              >
                <div className="space-y-4">
                  <Card className="border-2 hover:border-vault-primary transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem
                          value="income"
                          id="income"
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="income"
                            className="font-semibold cursor-pointer"
                          >
                            Income Qualification
                          </Label>
                          <p className="text-sm text-vault-muted mt-1">
                            Individual income exceeding $200,000 (or $300,000
                            joint income with spouse) in each of the prior two
                            years.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:border-vault-primary transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem
                          value="net_worth"
                          id="net_worth"
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="net_worth"
                            className="font-semibold cursor-pointer"
                          >
                            Net Worth Qualification
                          </Label>
                          <p className="text-sm text-vault-muted mt-1">
                            Net worth exceeding $1,000,000 (excluding primary
                            residence).
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:border-vault-primary transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem
                          value="professional"
                          id="professional"
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="professional"
                            className="font-semibold cursor-pointer"
                          >
                            Professional Certification
                          </Label>
                          <p className="text-sm text-vault-muted mt-1">
                            Hold professional certifications, designations, or
                            credentials (Series 7, 65, 82).
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 4: Financial Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {formData.accreditationMethod === "income" && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">
                      Income Qualification Requirements
                    </h3>
                    <p className="text-sm text-green-700">
                      Individual income exceeding $200,000 (or $300,000 joint
                      income) in each of the prior two years.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="annualIncome">
                        Individual Annual Income *
                      </Label>
                      <Input
                        id="annualIncome"
                        value={formData.annualIncome}
                        onChange={(e) =>
                          updateFormData(
                            "annualIncome",
                            formatCurrency(e.target.value),
                          )
                        }
                        placeholder="$200,000"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="jointAnnualIncome">
                        Joint Annual Income (if married)
                      </Label>
                      <Input
                        id="jointAnnualIncome"
                        value={formData.jointAnnualIncome}
                        onChange={(e) =>
                          updateFormData(
                            "jointAnnualIncome",
                            formatCurrency(e.target.value),
                          )
                        }
                        placeholder="$300,000"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="employmentStatus">
                        Employment Status *
                      </Label>
                      <Select
                        value={formData.employmentStatus}
                        onValueChange={(value) =>
                          updateFormData("employmentStatus", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select employment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="self_employed">
                            Self-Employed
                          </SelectItem>
                          <SelectItem value="business_owner">
                            Business Owner
                          </SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="yearsEmployed">
                        Years in Current Position
                      </Label>
                      <Input
                        id="yearsEmployed"
                        value={formData.yearsEmployed}
                        onChange={(e) =>
                          updateFormData("yearsEmployed", e.target.value)
                        }
                        placeholder="5"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="employer">Employer/Company Name</Label>
                      <Input
                        id="employer"
                        value={formData.employer}
                        onChange={(e) =>
                          updateFormData("employer", e.target.value)
                        }
                        placeholder="Company Name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="jobTitle">Job Title/Position</Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) =>
                          updateFormData("jobTitle", e.target.value)
                        }
                        placeholder="Senior Executive"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.accreditationMethod === "net_worth" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Net Worth Qualification Requirements
                    </h3>
                    <p className="text-sm text-blue-700">
                      Net worth exceeding $1,000,000 (excluding primary
                      residence value).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="netWorth">Total Net Worth *</Label>
                      <Input
                        id="netWorth"
                        value={formData.netWorth}
                        onChange={(e) =>
                          updateFormData(
                            "netWorth",
                            formatCurrency(e.target.value),
                          )
                        }
                        placeholder="$1,500,000"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="liquidNetWorth">Liquid Net Worth *</Label>
                      <Input
                        id="liquidNetWorth"
                        value={formData.liquidNetWorth}
                        onChange={(e) =>
                          updateFormData(
                            "liquidNetWorth",
                            formatCurrency(e.target.value),
                          )
                        }
                        placeholder="$500,000"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="primaryResidenceValue">
                        Primary Residence Value
                      </Label>
                      <Input
                        id="primaryResidenceValue"
                        value={formData.primaryResidenceValue}
                        onChange={(e) =>
                          updateFormData(
                            "primaryResidenceValue",
                            formatCurrency(e.target.value),
                          )
                        }
                        placeholder="$800,000"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="investmentPortfolioValue">
                        Investment Portfolio Value
                      </Label>
                      <Input
                        id="investmentPortfolioValue"
                        value={formData.investmentPortfolioValue}
                        onChange={(e) =>
                          updateFormData(
                            "investmentPortfolioValue",
                            formatCurrency(e.target.value),
                          )
                        }
                        placeholder="$750,000"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.accreditationMethod === "professional" && (
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">
                      Professional Certification Requirements
                    </h3>
                    <p className="text-sm text-purple-700">
                      Hold valid professional certifications, designations, or
                      credentials recognized by the SEC.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="professionalStatus">
                        Professional Status *
                      </Label>
                      <Select
                        value={formData.professionalStatus}
                        onValueChange={(value) =>
                          updateFormData("professionalStatus", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select certification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="series_7">Series 7</SelectItem>
                          <SelectItem value="series_65">Series 65</SelectItem>
                          <SelectItem value="series_82">Series 82</SelectItem>
                          <SelectItem value="cfa">CFA Charter</SelectItem>
                          <SelectItem value="cpa">CPA</SelectItem>
                          <SelectItem value="other">
                            Other Professional Designation
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="licenseNumber">
                        License/Certification Number *
                      </Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) =>
                          updateFormData("licenseNumber", e.target.value)
                        }
                        placeholder="License Number"
                        className="mt-1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="issuingAuthority">
                        Issuing Authority *
                      </Label>
                      <Input
                        id="issuingAuthority"
                        value={formData.issuingAuthority}
                        onChange={(e) =>
                          updateFormData("issuingAuthority", e.target.value)
                        }
                        placeholder="FINRA, SEC, State Board, etc."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Investment Profile */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900">
                      Investment Experience Assessment
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Help us understand your investment background and
                      preferences to provide suitable opportunities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="investmentExperience">
                    Investment Experience *
                  </Label>
                  <Select
                    value={formData.investmentExperience}
                    onValueChange={(value) =>
                      updateFormData("investmentExperience", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">
                        Beginner (Less than 2 years)
                      </SelectItem>
                      <SelectItem value="intermediate">
                        Intermediate (2-5 years)
                      </SelectItem>
                      <SelectItem value="experienced">
                        Experienced (5-10 years)
                      </SelectItem>
                      <SelectItem value="expert">Expert (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="previousInvestments">
                    Previous Real Estate Investments
                  </Label>
                  <Textarea
                    id="previousInvestments"
                    value={formData.previousInvestments}
                    onChange={(e) =>
                      updateFormData("previousInvestments", e.target.value)
                    }
                    placeholder="Describe your previous real estate investment experience..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="riskTolerance">Risk Tolerance *</Label>
                  <RadioGroup
                    value={formData.riskTolerance}
                    onValueChange={(value) =>
                      updateFormData("riskTolerance", value)
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="conservative" id="conservative" />
                      <Label htmlFor="conservative">
                        Conservative - Prefer stable, lower-risk investments
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate">
                        Moderate - Balanced approach to risk and return
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="aggressive" id="aggressive" />
                      <Label htmlFor="aggressive">
                        Aggressive - Comfortable with higher risk for higher
                        returns
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="investmentObjectives">
                    Investment Objectives *
                  </Label>
                  <Textarea
                    id="investmentObjectives"
                    value={formData.investmentObjectives}
                    onChange={(e) =>
                      updateFormData("investmentObjectives", e.target.value)
                    }
                    placeholder="Describe your investment goals and objectives..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Compliance & Documents */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900">
                      Compliance Requirements
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      Complete these compliance checks and upload required
                      documents to finalize your verification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Compliance Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="usCitizen"
                      checked={formData.usCitizen}
                      onCheckedChange={(checked) =>
                        updateFormData("usCitizen", checked)
                      }
                    />
                    <Label htmlFor="usCitizen" className="text-sm">
                      I am a U.S. citizen or permanent resident *
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="politicallyExposed"
                      checked={formData.politicallyExposed}
                      onCheckedChange={(checked) =>
                        updateFormData("politicallyExposed", checked)
                      }
                    />
                    <Label htmlFor="politicallyExposed" className="text-sm">
                      I am NOT a politically exposed person (PEP) *
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="sanctionsCheck"
                      checked={formData.sanctionsCheck}
                      onCheckedChange={(checked) =>
                        updateFormData("sanctionsCheck", checked)
                      }
                    />
                    <Label htmlFor="sanctionsCheck" className="text-sm">
                      I confirm that I am not on any government sanctions lists
                      *
                    </Label>
                  </div>
                </div>

                {/* Document Upload Section */}
                <div className="border-2 border-dashed border-vault-light rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-vault-muted" />
                    <h3 className="mt-2 text-sm font-semibold text-vault-primary">
                      Upload Required Documents
                    </h3>
                    <p className="mt-1 text-sm text-vault-muted">
                      Upload supporting documents to verify your accredited
                      investor status
                    </p>
                  </div>

                  <div className="mt-4">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        updateFormData("uploadedDocuments", [
                          ...formData.uploadedDocuments,
                          ...files,
                        ]);
                      }}
                      className="hidden"
                      id="document-upload"
                    />
                    <Label
                      htmlFor="document-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-vault-primary text-vault-primary rounded-lg hover:bg-vault-primary hover:text-white transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Label>
                  </div>

                  {formData.uploadedDocuments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-semibold">
                        Uploaded Documents:
                      </h4>
                      {formData.uploadedDocuments.map((file, index) => (
                        <div
                          key={file.name}
                          className="flex items-center justify-between bg-vault-background/30 rounded p-2"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-vault-secondary" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newFiles =
                                formData.uploadedDocuments.filter(
                                  (_, i) => i !== index,
                                );
                              updateFormData("uploadedDocuments", newFiles);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Required Documents Checklist */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-vault-primary mb-3">
                    Required Documents Checklist:
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>
                        Government-issued photo ID (Driver's License or
                        Passport)
                      </span>
                    </div>
                    {formData.accreditationMethod === "income" && (
                      <>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>
                            Tax returns for the last 2 years (Form 1040)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>
                            W-2 forms or 1099 forms for income verification
                          </span>
                        </div>
                      </>
                    )}
                    {formData.accreditationMethod === "net_worth" && (
                      <>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Bank statements (last 3 months)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Investment account statements</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>
                            Property appraisals or mortgage statements
                          </span>
                        </div>
                      </>
                    )}
                    {formData.accreditationMethod === "professional" && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>
                          Professional license or certification documents
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="border-vault-light"
        >
          Previous
        </Button>

        <div className="flex gap-3">
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className="bg-vault-primary hover:bg-vault-primary/90 text-white"
            >
              Next Step
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!validateStep(currentStep) || isSubmitting}
              className="bg-vault-primary hover:bg-vault-primary/90 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Verification"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
