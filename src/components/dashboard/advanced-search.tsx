"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Building,
  Calendar as CalendarIcon,
  DollarSign,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

interface SearchFilters {
  query: string;
  investmentType: string[];
  assetClass: string[];
  status: string[];
  riskLevel: string[];
  location: string[];
  minAmount: number | null;
  maxAmount: number | null;
  dateRange: DateRange | undefined;
  performanceRange: string;
}

interface Investment {
  id: string;
  name: string;
  type: "Equity" | "Debt" | "Hybrid";
  assetClass: "Residential" | "Commercial" | "Industrial" | "Mixed-Use";
  status: "Active" | "Pending" | "Completed" | "Development";
  riskLevel: "Low" | "Medium" | "Medium-High" | "High";
  location: string;
  amount: number;
  performancePercent: number;
  date: Date;
}

// Mock investment data
const mockInvestments: Investment[] = [
  {
    id: "1",
    name: "Manhattan Luxury Tower",
    type: "Equity",
    assetClass: "Residential",
    status: "Active",
    riskLevel: "Medium",
    location: "New York, NY",
    amount: 250000,
    performancePercent: 34.0,
    date: new Date("2023-06-15"),
  },
  {
    id: "2",
    name: "Austin Tech Campus",
    type: "Equity",
    assetClass: "Commercial",
    status: "Active",
    riskLevel: "Low",
    location: "Austin, TX",
    amount: 150000,
    performancePercent: 30.0,
    date: new Date("2023-08-20"),
  },
  {
    id: "3",
    name: "Miami Mixed-Use Development",
    type: "Hybrid",
    assetClass: "Mixed-Use",
    status: "Development",
    riskLevel: "Medium-High",
    location: "Miami, FL",
    amount: 100000,
    performancePercent: 18.0,
    date: new Date("2024-01-10"),
  },
  {
    id: "4",
    name: "Denver Industrial Portfolio",
    type: "Debt",
    assetClass: "Industrial",
    status: "Active",
    riskLevel: "Low",
    location: "Denver, CO",
    amount: 200000,
    performancePercent: 42.5,
    date: new Date("2023-03-12"),
  },
  {
    id: "5",
    name: "Seattle Waterfront Development",
    type: "Equity",
    assetClass: "Residential",
    status: "Pending",
    riskLevel: "High",
    location: "Seattle, WA",
    amount: 300000,
    performancePercent: 15.0,
    date: new Date("2024-02-28"),
  },
];

const filterOptions = {
  investmentType: ["Equity", "Debt", "Hybrid"],
  assetClass: ["Residential", "Commercial", "Industrial", "Mixed-Use"],
  status: ["Active", "Pending", "Completed", "Development"],
  riskLevel: ["Low", "Medium", "Medium-High", "High"],
  location: [
    "New York, NY",
    "Austin, TX",
    "Miami, FL",
    "Denver, CO",
    "Seattle, WA",
  ],
  performanceRange: ["0-10%", "10-25%", "25-40%", "40%+"],
};

interface AdvancedSearchProps {
  onResults?: (results: Investment[]) => void;
  onFiltersChange?: (filters: SearchFilters) => void;
}

export function AdvancedSearch({
  onResults,
  onFiltersChange,
}: AdvancedSearchProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    investmentType: [],
    assetClass: [],
    status: [],
    riskLevel: [],
    location: [],
    minAmount: null,
    maxAmount: null,
    dateRange: undefined,
    performanceRange: "",
  });

  // Filter investments based on current filters
  const filteredInvestments = useMemo(() => {
    let results = mockInvestments;

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(
        (investment) =>
          investment.name.toLowerCase().includes(query) ||
          investment.location.toLowerCase().includes(query) ||
          investment.type.toLowerCase().includes(query) ||
          investment.assetClass.toLowerCase().includes(query),
      );
    }

    // Filter by investment type
    if (filters.investmentType.length > 0) {
      results = results.filter((investment) =>
        filters.investmentType.includes(investment.type),
      );
    }

    // Filter by asset class
    if (filters.assetClass.length > 0) {
      results = results.filter((investment) =>
        filters.assetClass.includes(investment.assetClass),
      );
    }

    // Filter by status
    if (filters.status.length > 0) {
      results = results.filter((investment) =>
        filters.status.includes(investment.status),
      );
    }

    // Filter by risk level
    if (filters.riskLevel.length > 0) {
      results = results.filter((investment) =>
        filters.riskLevel.includes(investment.riskLevel),
      );
    }

    // Filter by location
    if (filters.location.length > 0) {
      results = results.filter((investment) =>
        filters.location.includes(investment.location),
      );
    }

    // Filter by amount range
    if (filters.minAmount !== null) {
      results = results.filter(
        (investment) => investment.amount >= (filters.minAmount ?? 0),
      );
    }
    if (filters.maxAmount !== null) {
      results = results.filter(
        (investment) => investment.amount <= (filters.maxAmount ?? Number.MAX_VALUE),
      );
    }

    // Filter by performance range
    if (filters.performanceRange) {
      const ranges = {
        "0-10%": [0, 10],
        "10-25%": [10, 25],
        "25-40%": [25, 40],
        "40%+": [40, 100],
      };
      const [min, max] = ranges[
        filters.performanceRange as keyof typeof ranges
      ] || [0, 100];
      results = results.filter(
        (investment) =>
          investment.performancePercent >= min &&
          investment.performancePercent <= max,
      );
    }

    // Filter by date range
    if (filters.dateRange?.from) {
      results = results.filter((investment) => {
        const investmentDate = investment.date;
        const from = filters.dateRange?.from;
        const to = filters.dateRange?.to || new Date();
        return from && investmentDate >= from && investmentDate <= to;
      });
    }

    return results;
  }, [filters]);

  // Notify parent components of results and filter changes
  useState(() => {
    if (onResults) onResults(filteredInvestments);
    if (onFiltersChange) onFiltersChange(filters);
  });

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      query: "",
      investmentType: [],
      assetClass: [],
      status: [],
      riskLevel: [],
      location: [],
      minAmount: null,
      maxAmount: null,
      dateRange: undefined,
      performanceRange: "",
    });
  };

  const activeFiltersCount =
    Object.values(filters).reduce((count, value) => {
      if (Array.isArray(value)) return count + value.length;
      if (value && value !== "") return count + 1;
      return count;
    }, 0) - (filters.query ? 1 : 0); // Don't count query as a filter

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-vault-muted" />
          <Input
            placeholder="Search investments, locations, or asset classes..."
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            className="pl-10 border-vault-light focus:border-vault-primary"
          />
        </div>

        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "gap-2 border-vault-light",
                activeFiltersCount > 0 &&
                  "border-vault-primary bg-vault-primary/5",
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-96 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-vault-primary">
                  Advanced Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-vault-muted hover:text-vault-primary"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Investment Type Filter */}
              <div>
                <label className="text-sm font-medium text-vault-primary mb-2 block">
                  Investment Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.investmentType.map((type) => (
                    <Badge
                      key={type}
                      variant={
                        filters.investmentType.includes(type)
                          ? "default"
                          : "outline"
                      }
                      className={cn(
                        "cursor-pointer",
                        filters.investmentType.includes(type)
                          ? "bg-vault-primary text-white"
                          : "border-vault-light hover:border-vault-primary",
                      )}
                      onClick={() => toggleArrayFilter("investmentType", type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Asset Class Filter */}
              <div>
                <label className="text-sm font-medium text-vault-primary mb-2 block">
                  Asset Class
                </label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.assetClass.map((assetClass) => (
                    <Badge
                      key={assetClass}
                      variant={
                        filters.assetClass.includes(assetClass)
                          ? "default"
                          : "outline"
                      }
                      className={cn(
                        "cursor-pointer",
                        filters.assetClass.includes(assetClass)
                          ? "bg-vault-primary text-white"
                          : "border-vault-light hover:border-vault-primary",
                      )}
                      onClick={() =>
                        toggleArrayFilter("assetClass", assetClass)
                      }
                    >
                      {assetClass}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-vault-primary mb-2 block">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.status.map((status) => (
                    <Badge
                      key={status}
                      variant={
                        filters.status.includes(status) ? "default" : "outline"
                      }
                      className={cn(
                        "cursor-pointer",
                        filters.status.includes(status)
                          ? "bg-vault-primary text-white"
                          : "border-vault-light hover:border-vault-primary",
                      )}
                      onClick={() => toggleArrayFilter("status", status)}
                    >
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Risk Level Filter */}
              <div>
                <label className="text-sm font-medium text-vault-primary mb-2 block">
                  Risk Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.riskLevel.map((risk) => (
                    <Badge
                      key={risk}
                      variant={
                        filters.riskLevel.includes(risk) ? "default" : "outline"
                      }
                      className={cn(
                        "cursor-pointer",
                        filters.riskLevel.includes(risk)
                          ? "bg-vault-primary text-white"
                          : "border-vault-light hover:border-vault-primary",
                      )}
                      onClick={() => toggleArrayFilter("riskLevel", risk)}
                    >
                      {risk}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Amount Range */}
              <div>
                <label className="text-sm font-medium text-vault-primary mb-2 block">
                  Investment Amount Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min amount"
                    value={filters.minAmount || ""}
                    onChange={(e) =>
                      updateFilter(
                        "minAmount",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="border-vault-light"
                  />
                  <Input
                    type="number"
                    placeholder="Max amount"
                    value={filters.maxAmount || ""}
                    onChange={(e) =>
                      updateFilter(
                        "maxAmount",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="border-vault-light"
                  />
                </div>
              </div>

              {/* Performance Range */}
              <div>
                <label className="text-sm font-medium text-vault-primary mb-2 block">
                  Performance Range
                </label>
                <Select
                  value={filters.performanceRange}
                  onValueChange={(value) =>
                    updateFilter("performanceRange", value)
                  }
                >
                  <SelectTrigger className="border-vault-light">
                    <SelectValue placeholder="Select performance range" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.performanceRange.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-vault-muted">Active filters:</span>

          {filters.investmentType.map((type) => (
            <Badge key={type} variant="outline" className="gap-1">
              {type}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => toggleArrayFilter("investmentType", type)}
              />
            </Badge>
          ))}

          {filters.assetClass.map((assetClass) => (
            <Badge key={assetClass} variant="outline" className="gap-1">
              {assetClass}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => toggleArrayFilter("assetClass", assetClass)}
              />
            </Badge>
          ))}

          {filters.status.map((status) => (
            <Badge key={status} variant="outline" className="gap-1">
              {status}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => toggleArrayFilter("status", status)}
              />
            </Badge>
          ))}

          {filters.riskLevel.map((risk) => (
            <Badge key={risk} variant="outline" className="gap-1">
              {risk}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => toggleArrayFilter("riskLevel", risk)}
              />
            </Badge>
          ))}

          {filters.performanceRange && (
            <Badge variant="outline" className="gap-1">
              Performance: {filters.performanceRange}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter("performanceRange", "")}
              />
            </Badge>
          )}

          {(filters.minAmount || filters.maxAmount) && (
            <Badge variant="outline" className="gap-1">
              Amount:{" "}
              {filters.minAmount ? formatCurrency(filters.minAmount) : "$0"} -{" "}
              {filters.maxAmount ? formatCurrency(filters.maxAmount) : "∞"}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  updateFilter("minAmount", null);
                  updateFilter("maxAmount", null);
                }}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-vault-muted">
          {filteredInvestments.length} investment
          {filteredInvestments.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4">
        {filteredInvestments.map((investment) => (
          <Card
            key={investment.id}
            className="border-vault-light hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-vault-primary">
                      {investment.name}
                    </h3>
                    <Badge variant="outline" className="border-vault-light">
                      {investment.type}
                    </Badge>
                    <Badge variant="outline" className="border-vault-light">
                      {investment.assetClass}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-vault-muted">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {investment.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {formatCurrency(investment.amount)}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {investment.performancePercent.toFixed(1)}% return
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Badge
                    variant={
                      investment.status === "Active" ? "default" : "outline"
                    }
                    className={
                      investment.status === "Active" ? "bg-vault-accent" : ""
                    }
                  >
                    {investment.status}
                  </Badge>
                  <p className="text-xs text-vault-muted mt-1">
                    {format(investment.date, "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
