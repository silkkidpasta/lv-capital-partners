"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Extend Window interface for gtag
// Google Analytics types - using unknown[] for better type safety
type GtagArgs = unknown[];

declare global {
  interface Window {
    gtag: (...args: GtagArgs) => void;
    dataLayer: GtagArgs;
  }
}

interface AnalyticsContextType {
  isInitialized: boolean;
  hasConsent: boolean;
  trackEvent: {
    investmentViewed: (
      investmentId: string,
      investmentName: string,
      assetClass: string,
      userId?: string,
    ) => void;
    portfolioViewed: (
      totalValue: number,
      investmentCount: number,
      userId?: string,
    ) => void;
    verificationStarted: (userId?: string) => void;
    verificationCompleted: (userId?: string) => void;
    reportDownloaded: (
      reportType: string,
      format: string,
      userId?: string,
    ) => void;
    dealViewed: (
      dealId: string,
      dealName: string,
      assetClass: string,
      userId?: string,
    ) => void;
    contentEngagement: (
      contentType: string,
      contentId: string,
      action: string,
      userId?: string,
    ) => void;
    signIn: (method: string, userId?: string) => void;
  };
  trackUserLifecycle: {
    setAccreditationStatus: (status: string, userId?: string) => void;
    setInvestmentExperience: (experience: string, userId?: string) => void;
  };
  setConsentMode: (consent: ConsentSettings) => void;
}

interface ConsentSettings {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface AnalyticsProviderProps {
  children: ReactNode;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined,
);

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();

  // Initialize Google Analytics
  const initGA = useCallback(() => {
    if (
      typeof window === "undefined" ||
      !process.env.NEXT_PUBLIC_GA_TRACKING_ID
    )
      return;

    // Create gtag function
    window.gtag = (...args: GtagArgs) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(args);
    };

    // Load GA script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize consent mode first
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      wait_for_update: 500,
    });

    window.gtag("js", new Date());
    window.gtag("config", process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    setIsInitialized(true);
  }, []);

  // Check for existing consent on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedConsent = localStorage.getItem("lv-analytics-consent");
    if (savedConsent) {
      try {
        const consent = JSON.parse(savedConsent);
        setHasConsent(consent.analytics);
        if (consent.analytics) {
          initGA();
        }
      } catch (error) {
        console.error("Error parsing saved consent:", error);
        setShowConsentBanner(true);
      }
    } else {
      setShowConsentBanner(true);
    }
  }, [initGA]);

  // Track page views
  useEffect(() => {
    if (!isInitialized || !pathname || !hasConsent) return;

    const url = window.location.href;
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: url,
        page_path: pathname,
      });
    }
  }, [pathname, isInitialized, hasConsent]);

  // Track user authentication events
  useEffect(() => {
    if (!isInitialized || !user || !hasConsent) return;

    if (window.gtag) {
      window.gtag("event", "login", {
        method: "clerk",
        user_id: user.id,
      });
    }
  }, [user, isInitialized, hasConsent]);

  const handleAcceptConsent = () => {
    const consent = { analytics: true, marketing: false, functional: true };
    setHasConsent(true);
    setShowConsentBanner(false);
    localStorage.setItem("lv-analytics-consent", JSON.stringify(consent));

    if (!isInitialized) {
      initGA();
    }

    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        functionality_storage: "granted",
        personalization_storage: "granted",
      });
    }
  };

  const handleDeclineConsent = () => {
    const consent = { analytics: false, marketing: false, functional: false };
    setHasConsent(false);
    setShowConsentBanner(false);
    localStorage.setItem("lv-analytics-consent", JSON.stringify(consent));
  };

  const setConsentMode = (consent: ConsentSettings) => {
    setHasConsent(consent.analytics);
    localStorage.setItem("lv-analytics-consent", JSON.stringify(consent));

    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: consent.analytics ? "granted" : "denied",
        ad_storage: consent.marketing ? "granted" : "denied",
        functionality_storage: consent.functional ? "granted" : "denied",
        personalization_storage: consent.analytics ? "granted" : "denied",
      });
    }
  };

  // Tracking functions
  const trackEvent = {
    investmentViewed: (
      investmentId: string,
      investmentName: string,
      assetClass: string,
      userId?: string,
    ) => {
      if (!hasConsent || !window.gtag) return;
      window.gtag("event", "investment_viewed", {
        investment_id: investmentId,
        investment_name: investmentName,
        asset_class: assetClass,
        user_id: userId,
      });
    },
    portfolioViewed: (
      totalValue: number,
      investmentCount: number,
      userId?: string,
    ) => {
      if (!hasConsent || !window.gtag) return;
      window.gtag("event", "portfolio_viewed", {
        total_value: totalValue,
        investment_count: investmentCount,
        user_id: userId,
      });
    },
    verificationStarted: (userId?: string) => {
      if (!hasConsent || !window.gtag) return;
      window.gtag("event", "verification_started", {
        user_id: userId,
      });
    },
    verificationCompleted: (userId?: string) => {
      if (!hasConsent || !window.gtag) return;
      window.gtag("event", "verification_completed", {
        user_id: userId,
      });
    },
    reportDownloaded: (reportType: string, format: string, userId?: string) => {
      if (!hasConsent || !window.gtag) return;
      window.gtag("event", "report_downloaded", {
        report_type: reportType,
        format: format,
        user_id: userId,
      });
    },
    dealViewed: (
      dealId: string,
      dealName: string,
      assetClass: string,
      userId?: string,
    ) => {
      if (!hasConsent || !window.gtag) return;
      window.gtag("event", "deal_viewed", {
        deal_id: dealId,
        deal_name: dealName,
        asset_class: assetClass,
        user_id: userId,
      });
    },
    contentEngagement: (
      contentType: string,
      contentId: string,
      action: string,
      userId?: string,
    ) => {
      if (!hasConsent || !window.gtag) return;
      window.gtag("event", "content_engagement", {
        content_type: contentType,
        content_id: contentId,
        action: action,
        user_id: userId,
      });
    },
    signIn: (method: string, userId?: string) => {
      if (!hasConsent || !window.gtag) return;
      window.gtag("event", "login", {
        method: method,
        user_id: userId,
      });
    },
  };

  const trackUserLifecycle = {
    setAccreditationStatus: (status: string, userId?: string) => {
      if (!hasConsent || !window.gtag) return;
      window.gtag("event", "accreditation_status_set", {
        status: status,
        user_id: userId,
      });
    },
    setInvestmentExperience: (experience: string, userId?: string) => {
      if (!hasConsent || !window.gtag) return;
      window.gtag("event", "investment_experience_set", {
        experience: experience,
        user_id: userId,
      });
    },
  };

  const value: AnalyticsContextType = {
    isInitialized,
    hasConsent,
    trackEvent,
    trackUserLifecycle,
    setConsentMode,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
      {showConsentBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              <p>
                We use analytics to improve your experience. Your data is never
                shared with third parties.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDeclineConsent}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAcceptConsent}
                className="px-4 py-2 bg-vault-primary text-white text-sm rounded-lg hover:bg-vault-primary/90 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}
