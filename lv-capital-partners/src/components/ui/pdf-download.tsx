"use client";

import { Button } from "@/components/ui/button";
import { generateInvestmentReport, generatePortfolioReport, generateQuarterlyReport } from "@/lib/pdf/generator";
import { pdf } from "@react-pdf/renderer";
import { Download, FileText, Loader2 } from "lucide-react";
import { useState } from "react";

// Type definitions for better type safety
interface Investment {
  id: string;
  name?: string;
  invested?: number;
  currentValue?: number;
  returnPercent?: number;
  status?: string;
  [key: string]: unknown;
}

interface UserType {
  id: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
}

interface InvestmentType {
  id: string;
  title?: string;
  property_type?: string;
  location?: string;
  asset_class?: string;
  [key: string]: unknown;
}

interface PortfolioType {
  investments: Investment[];
  portfolioSummary: {
    totalInvested?: number;
    currentValue?: number;
    totalReturn?: number;
    returnPercent?: number;
    [key: string]: unknown;
  };
}

interface QuarterlyType {
  quarter: string;
  year: number;
  portfolioData: {
    [key: string]: unknown;
  };
}

interface PDFDownloadProps {
  type: "investment" | "portfolio" | "quarterly";
  data: InvestmentType | PortfolioType | QuarterlyType | Record<string, unknown>;
  user?: UserType | Record<string, unknown>;
  fileName: string;
  title?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function PDFDownload({
  type,
  data,
  user,
  fileName,
  title,
  variant = "default",
  size = "default",
  className,
}: PDFDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAndDownload = async () => {
    try {
      setIsGenerating(true);

      let pdfComponent: React.ReactElement;
      switch (type) {
        case "investment":
          pdfComponent = generateInvestmentReport(data as InvestmentType, user as UserType);
          break;
        case "portfolio": {
          const portfolioData = data as PortfolioType;
          pdfComponent = generatePortfolioReport(
            user as UserType,
            portfolioData.investments || [],
            portfolioData.portfolioSummary || {},
          );
          break;
        }
        case "quarterly": {
          const quarterlyData = data as QuarterlyType;
          pdfComponent = generateQuarterlyReport(
            quarterlyData.quarter || "Q1",
            quarterlyData.year || new Date().getFullYear(),
            quarterlyData.portfolioData || {},
          );
          break;
        }
        default:
          throw new Error(`Unknown PDF type: ${type}`);
      }

      // Generate PDF blob
      const blob = await pdf(pdfComponent).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // You could add a toast notification here
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={generateAndDownload}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          {title || "Download PDF"}
        </>
      )}
    </Button>
  );
}

export function PDFPreviewLink({
  type,
  data,
  user,
  title = "View PDF",
  className,
}: Omit<PDFDownloadProps, "fileName" | "variant" | "size"> & {
  title?: string;
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const openPDFPreview = async () => {
    try {
      setIsGenerating(true);

      let pdfComponent: React.ReactElement;
      switch (type) {
        case "investment":
          pdfComponent = generateInvestmentReport(data as InvestmentType, user as UserType);
          break;
        case "portfolio": {
          const portfolioData = data as PortfolioType;
          pdfComponent = generatePortfolioReport(
            user as UserType,
            portfolioData.investments || [],
            portfolioData.portfolioSummary || {},
          );
          break;
        }
        case "quarterly": {
          const quarterlyData = data as QuarterlyType;
          pdfComponent = generateQuarterlyReport(
            quarterlyData.quarter || "Q1",
            quarterlyData.year || new Date().getFullYear(),
            quarterlyData.portfolioData || {},
          );
          break;
        }
        default:
          throw new Error(`Unknown PDF type: ${type}`);
      }

      // Generate PDF blob
      const blob = await pdf(pdfComponent).toBlob();

      // Open in new tab
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      className={`text-primary hover:text-primary/80 font-medium flex items-center gap-2 ${className}`}
      onClick={openPDFPreview}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          {title}
        </>
      )}
    </button>
  );
}
