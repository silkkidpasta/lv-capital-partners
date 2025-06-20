"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  BarChart3,
  Building,
  Calendar as CalendarIcon,
  CheckCircle,
  DollarSign,
  Download,
  FileText,
  Loader2,
  Mail,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

interface ReportConfig {
  type:
    | "portfolio"
    | "performance"
    | "transactions"
    | "distributions"
    | "tax"
    | "custom";
  format: "pdf" | "excel" | "csv";
  period: "custom" | "monthly" | "quarterly" | "yearly" | "ytd" | "all";
  dateRange?: DateRange;
  includeCharts: boolean;
  includeDetails: boolean;
  email?: boolean;
  recipients?: string[];
}

const reportTypes = [
  {
    type: "portfolio",
    title: "Portfolio Summary",
    description: "Complete portfolio overview with performance metrics",
    icon: <Building className="w-5 h-5" />,
    includes: ["Holdings", "Performance", "Asset Allocation", "Risk Analysis"],
  },
  {
    type: "performance",
    title: "Performance Report",
    description: "Detailed performance analysis and benchmarks",
    icon: <TrendingUp className="w-5 h-5" />,
    includes: [
      "IRR Analysis",
      "Equity Multiples",
      "Benchmark Comparison",
      "Growth Charts",
    ],
  },
  {
    type: "transactions",
    title: "Transaction History",
    description: "All investment transactions and activities",
    icon: <FileText className="w-5 h-5" />,
    includes: ["Investments", "Capital Calls", "Distributions", "Fees"],
  },
  {
    type: "distributions",
    title: "Distribution Report",
    description: "Cash distributions and dividend payments",
    icon: <DollarSign className="w-5 h-5" />,
    includes: [
      "Cash Flow",
      "Distribution Schedule",
      "Yield Analysis",
      "Tax Implications",
    ],
  },
  {
    type: "tax",
    title: "Tax Documentation",
    description: "Tax-related documents and summaries",
    icon: <FileText className="w-5 h-5" />,
    includes: ["K-1 Forms", "Tax Summaries", "Cost Basis", "Deductions"],
  },
  {
    type: "custom",
    title: "Custom Report",
    description: "Build a custom report with selected data",
    icon: <BarChart3 className="w-5 h-5" />,
    includes: [
      "Custom Fields",
      "Flexible Periods",
      "Multiple Formats",
      "Scheduled Delivery",
    ],
  },
];

const formatOptions = [
  {
    value: "pdf",
    label: "PDF Document",
    description: "Professional formatted report",
  },
  {
    value: "excel",
    label: "Excel Spreadsheet",
    description: "Data analysis and manipulation",
  },
  {
    value: "csv",
    label: "CSV Data",
    description: "Raw data for external systems",
  },
];

const periodOptions = [
  { value: "monthly", label: "Monthly", description: "Last 30 days" },
  { value: "quarterly", label: "Quarterly", description: "Last 3 months" },
  { value: "yearly", label: "Yearly", description: "Last 12 months" },
  { value: "ytd", label: "Year to Date", description: "January 1st to today" },
  { value: "all", label: "All Time", description: "Complete history" },
  {
    value: "custom",
    label: "Custom Range",
    description: "Select specific dates",
  },
];

export function ExportReports() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<string[]>([]);
  const [config, setConfig] = useState<ReportConfig>({
    type: "portfolio",
    format: "pdf",
    period: "quarterly",
    includeCharts: true,
    includeDetails: true,
    email: false,
    recipients: [],
  });

  const updateConfig = (updates: Partial<ReportConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const generateReport = async () => {
    setIsGenerating(true);

    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const reportName = `${config.type}-report-${Date.now()}.${config.format}`;
      setGeneratedReports((prev) => [...prev, reportName]);

      // If email is enabled, simulate sending
      if (config.email && config.recipients?.length) {
        console.log("Sending report via email to:", config.recipients);
      }
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedReportType = reportTypes.find((rt) => rt.type === config.type);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-vault-primary hover:bg-vault-primary/90 text-white">
          <Download className="w-4 h-4" />
          Export Reports
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-vault-primary">
            Generate & Export Reports
          </DialogTitle>
          <DialogDescription className="text-vault-muted">
            Create detailed reports for your investment portfolio and download
            in multiple formats
          </DialogDescription>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Report Type Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-vault-primary">Report Type</h3>
            <div className="grid gap-3">
              {reportTypes.map((type) => (
                <Card
                  key={type.type}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    config.type === type.type
                      ? "border-vault-primary bg-vault-primary/5"
                      : "border-vault-light hover:border-vault-primary/50",
                  )}
                  onClick={() => updateConfig({ type: type.type as ReportConfig['type'] })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          config.type === type.type
                            ? "bg-vault-primary text-white"
                            : "bg-vault-background text-vault-primary",
                        )}
                      >
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-vault-primary">
                          {type.title}
                        </h4>
                        <p className="text-sm text-vault-muted mb-2">
                          {type.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {type.includes.map((include) => (
                            <Badge
                              key={include}
                              variant="outline"
                              className="text-xs"
                            >
                              {include}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Configuration Options */}
          <div className="space-y-6">
            <h3 className="font-semibold text-vault-primary">Configuration</h3>

            {/* Format Selection */}
            <div>
              <Label className="text-vault-primary font-medium">
                Export Format
              </Label>
              <Select
                value={config.format}
                onValueChange={(value) =>
                  updateConfig({ format: value as ReportConfig['format'] })
                }
              >
                <SelectTrigger className="mt-2 border-vault-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div>
                        <div className="font-medium">{format.label}</div>
                        <div className="text-xs text-vault-muted">
                          {format.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Period Selection */}
            <div>
              <Label className="text-vault-primary font-medium">
                Time Period
              </Label>
              <Select
                value={config.period}
                onValueChange={(value) =>
                  updateConfig({ period: value as ReportConfig['period'] })
                }
              >
                <SelectTrigger className="mt-2 border-vault-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      <div>
                        <div className="font-medium">{period.label}</div>
                        <div className="text-xs text-vault-muted">
                          {period.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range */}
            {config.period === "custom" && (
              <div>
                <Label className="text-vault-primary font-medium">
                  Custom Date Range
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full mt-2 justify-start text-left font-normal border-vault-light",
                        !config.dateRange && "text-vault-muted",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {config.dateRange?.from ? (
                        config.dateRange.to ? (
                          <>
                            {format(config.dateRange.from, "LLL dd, y")} -{" "}
                            {format(config.dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(config.dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={config.dateRange?.from}
                      selected={config.dateRange}
                      onSelect={(range) => updateConfig({ dateRange: range })}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              <Label className="text-vault-primary font-medium">Options</Label>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="charts"
                  checked={config.includeCharts}
                  onChange={(e) =>
                    updateConfig({ includeCharts: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="charts" className="text-sm">
                  Include charts and visualizations
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="details"
                  checked={config.includeDetails}
                  onChange={(e) =>
                    updateConfig({ includeDetails: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="details" className="text-sm">
                  Include detailed breakdowns
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="email"
                  checked={config.email}
                  onChange={(e) => updateConfig({ email: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="email" className="text-sm">
                  Email report when ready
                </Label>
              </div>
            </div>

            {/* Email Recipients */}
            {config.email && (
              <div>
                <Label className="text-vault-primary font-medium">
                  Email Recipients
                </Label>
                <Input
                  placeholder="Enter email addresses (comma separated)"
                  className="mt-2 border-vault-light"
                  value={config.recipients?.join(", ") || ""}
                  onChange={(e) =>
                    updateConfig({
                      recipients: e.target.value
                        .split(",")
                        .map((email) => email.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
            )}

            {/* Report Preview */}
            {selectedReportType && (
              <Card className="border-vault-light bg-vault-background/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-vault-primary">
                    Report Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-vault-muted">Type:</span>
                      <span className="font-medium">
                        {selectedReportType.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-vault-muted">Format:</span>
                      <span className="font-medium">
                        {config.format.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-vault-muted">Period:</span>
                      <span className="font-medium">
                        {config.period === "custom" && config.dateRange?.from
                          ? `${format(config.dateRange.from, "MMM dd")} - ${format(config.dateRange.to || config.dateRange.from, "MMM dd, yyyy")}`
                          : periodOptions.find((p) => p.value === config.period)
                              ?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-vault-muted">Charts:</span>
                      <span className="font-medium">
                        {config.includeCharts ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-vault-muted">Details:</span>
                      <span className="font-medium">
                        {config.includeDetails ? "Yes" : "No"}
                      </span>
                    </div>
                    {config.email && (
                      <div className="flex justify-between">
                        <span className="text-vault-muted">Email:</span>
                        <span className="font-medium">
                          {config.recipients?.length || 0} recipient(s)
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generate Button */}
            <Button
              onClick={generateReport}
              disabled={isGenerating}
              className="w-full bg-vault-primary hover:bg-vault-primary/90 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>

            {/* Generated Reports */}
            {generatedReports.length > 0 && (
              <div className="space-y-3">
                <Label className="text-vault-primary font-medium">
                  Recent Reports
                </Label>
                {generatedReports.slice(-3).map((report, index) => (
                  <div
                    key={`${report.type}-${report.timestamp || index}`}
                    className="flex items-center justify-between p-3 bg-vault-background/30 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-vault-accent" />
                      <span className="text-sm font-medium text-vault-primary">
                        {report}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
