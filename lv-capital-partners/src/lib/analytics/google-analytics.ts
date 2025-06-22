// Google Analytics 4 Integration for LV Capital Partners
// Comprehensive tracking for investment platform user behavior and performance

// Investment interface for analytics
interface Investment {
  id: string;
  title: string;
  property_type?: string;
  location?: string;
  amount_invested?: number;
  current_value?: number;
  [key: string]: unknown;
}

declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || "";

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID) {
    console.warn("Google Analytics tracking ID not found");
    return;
  }

  // Load gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer.push(args);
  };

  // Configure GA4
  window.gtag("js", new Date());
  window.gtag("config", GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
    // Enhanced ecommerce for investment tracking
    enhanced_ecommerce: true,
    // Custom parameters for investment platform
    custom_map: {
      custom_parameter_1: "user_type",
      custom_parameter_2: "accreditation_status",
      custom_parameter_3: "investment_experience",
    },
  });

  console.log("Google Analytics initialized");
};

// Page view tracking
export const trackPageView = (url: string, title?: string) => {
  if (!window.gtag) return;

  window.gtag("config", GA_TRACKING_ID, {
    page_title: title || document.title,
    page_location: url,
  });
};

// Custom event tracking for investment platform
export interface InvestmentEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  user_id?: string;
  custom_parameters?: Record<string, unknown>;
}

export const trackEvent = (event: InvestmentEvent) => {
  if (!window.gtag) return;

  window.gtag("event", event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    user_id: event.user_id,
    ...event.custom_parameters,
  });
};

// Investment-specific event tracking functions
export const trackInvestmentEvents = {
  // User registration and onboarding
  signUp: (method: string, userId?: string) => {
    trackEvent({
      action: "sign_up",
      category: "user_engagement",
      label: method,
      user_id: userId,
      custom_parameters: {
        method: method,
        timestamp: new Date().toISOString(),
      },
    });
  },

  signIn: (method: string, userId?: string) => {
    trackEvent({
      action: "login",
      category: "user_engagement",
      label: method,
      user_id: userId,
      custom_parameters: {
        method: method,
        timestamp: new Date().toISOString(),
      },
    });
  },

  // Verification process tracking
  verificationStarted: (verificationType: string, userId?: string) => {
    trackEvent({
      action: "verification_started",
      category: "verification",
      label: verificationType,
      user_id: userId,
      custom_parameters: {
        verification_type: verificationType,
        step: "started",
      },
    });
  },

  verificationStepCompleted: (
    step: string,
    stepNumber: number,
    userId?: string,
  ) => {
    trackEvent({
      action: "verification_step_completed",
      category: "verification",
      label: step,
      value: stepNumber,
      user_id: userId,
      custom_parameters: {
        step_name: step,
        step_number: stepNumber,
      },
    });
  },

  verificationSubmitted: (
    verificationType: string,
    documentsCount: number,
    userId?: string,
  ) => {
    trackEvent({
      action: "verification_submitted",
      category: "verification",
      label: verificationType,
      value: documentsCount,
      user_id: userId,
      custom_parameters: {
        verification_type: verificationType,
        documents_uploaded: documentsCount,
        completion_status: "submitted",
      },
    });
  },

  documentUploaded: (
    documentType: string,
    fileSize: number,
    userId?: string,
  ) => {
    trackEvent({
      action: "document_uploaded",
      category: "verification",
      label: documentType,
      value: Math.round(fileSize / 1024), // File size in KB
      user_id: userId,
      custom_parameters: {
        document_type: documentType,
        file_size_kb: Math.round(fileSize / 1024),
      },
    });
  },

  // Investment opportunity tracking
  dealViewed: (
    dealId: string,
    dealTitle: string,
    assetClass: string,
    userId?: string,
  ) => {
    trackEvent({
      action: "view_item",
      category: "investment_engagement",
      label: dealTitle,
      user_id: userId,
      custom_parameters: {
        item_id: dealId,
        item_name: dealTitle,
        item_category: assetClass,
        content_type: "investment_opportunity",
      },
    });
  },

  dealInterest: (
    dealId: string,
    dealTitle: string,
    minInvestment: number,
    userId?: string,
  ) => {
    trackEvent({
      action: "express_interest",
      category: "investment_engagement",
      label: dealTitle,
      value: minInvestment,
      user_id: userId,
      custom_parameters: {
        item_id: dealId,
        item_name: dealTitle,
        minimum_investment: minInvestment,
        engagement_type: "interest_expressed",
      },
    });
  },

  investmentCommitted: (
    dealId: string,
    dealTitle: string,
    amount: number,
    userId?: string,
  ) => {
    trackEvent({
      action: "purchase",
      category: "investment_conversion",
      label: dealTitle,
      value: amount,
      user_id: userId,
      custom_parameters: {
        transaction_id: `inv_${dealId}_${Date.now()}`,
        item_id: dealId,
        item_name: dealTitle,
        investment_amount: amount,
        currency: "USD",
      },
    });

    // Also track as a conversion for Google Ads
    window.gtag("event", "conversion", {
      send_to: "AW-CONVERSION_ID/CONVERSION_LABEL", // Replace with actual conversion tracking
      value: amount,
      currency: "USD",
      transaction_id: `inv_${dealId}_${Date.now()}`,
    });
  },

  // Portfolio and performance tracking
  portfolioViewed: (
    totalValue: number,
    investmentCount: number,
    userId?: string,
  ) => {
    trackEvent({
      action: "view_portfolio",
      category: "portfolio_engagement",
      value: totalValue,
      user_id: userId,
      custom_parameters: {
        portfolio_value: totalValue,
        investment_count: investmentCount,
        page_type: "dashboard",
      },
    });
  },

  reportDownloaded: (
    reportType: string,
    reportPeriod: string,
    userId?: string,
  ) => {
    trackEvent({
      action: "download_report",
      category: "document_engagement",
      label: `${reportType}_${reportPeriod}`,
      user_id: userId,
      custom_parameters: {
        report_type: reportType,
        report_period: reportPeriod,
        format: "pdf",
      },
    });
  },

  distributionReceived: (
    amount: number,
    investmentId: string,
    userId?: string,
  ) => {
    trackEvent({
      action: "distribution_received",
      category: "investment_performance",
      value: amount,
      user_id: userId,
      custom_parameters: {
        investment_id: investmentId,
        distribution_amount: amount,
        event_type: "passive_income",
      },
    });
  },

  // Content engagement tracking
  contentEngagement: (
    contentType: string,
    contentId: string,
    engagementType: string,
    userId?: string,
  ) => {
    trackEvent({
      action: engagementType,
      category: "content_engagement",
      label: contentType,
      user_id: userId,
      custom_parameters: {
        content_type: contentType,
        content_id: contentId,
        engagement_type: engagementType,
      },
    });
  },

  // Form interactions
  formStarted: (formName: string, userId?: string) => {
    trackEvent({
      action: "form_start",
      category: "form_engagement",
      label: formName,
      user_id: userId,
      custom_parameters: {
        form_name: formName,
        form_step: "started",
      },
    });
  },

  formCompleted: (
    formName: string,
    completionTime: number,
    userId?: string,
  ) => {
    trackEvent({
      action: "form_submit",
      category: "form_engagement",
      label: formName,
      value: completionTime,
      user_id: userId,
      custom_parameters: {
        form_name: formName,
        completion_time_seconds: completionTime,
        form_step: "completed",
      },
    });
  },

  // Error tracking
  errorOccurred: (
    errorType: string,
    errorMessage: string,
    page: string,
    userId?: string,
  ) => {
    trackEvent({
      action: "exception",
      category: "technical_issues",
      label: errorType,
      user_id: userId,
      custom_parameters: {
        error_type: errorType,
        error_message: errorMessage.substring(0, 100), // Limit message length
        page_url: page,
        is_fatal: false,
      },
    });
  },

  // Search and filtering
  searchPerformed: (
    searchTerm: string,
    resultsCount: number,
    userId?: string,
  ) => {
    trackEvent({
      action: "search",
      category: "site_search",
      label: searchTerm,
      value: resultsCount,
      user_id: userId,
      custom_parameters: {
        search_term: searchTerm,
        results_count: resultsCount,
      },
    });
  },

  filtersApplied: (
    filterCategory: string,
    filterValues: string[],
    userId?: string,
  ) => {
    trackEvent({
      action: "filter_applied",
      category: "content_discovery",
      label: filterCategory,
      user_id: userId,
      custom_parameters: {
        filter_category: filterCategory,
        filter_values: filterValues.join(","),
        filter_count: filterValues.length,
      },
    });
  },
};

// Enhanced ecommerce tracking for investments
export const trackInvestmentEcommerce = {
  viewInvestmentList: (
    investments: Investment[],
    listName: string,
    userId?: string,
  ) => {
    window.gtag("event", "view_item_list", {
      item_list_id: listName,
      item_list_name: listName,
      items: investments.map((investment, index) => ({
        item_id: investment.id,
        item_name: investment.title,
        item_category: investment.asset_class,
        item_variant: investment.risk_level,
        price: investment.minimum_investment,
        quantity: 1,
        index: index,
      })),
      user_id: userId,
    });
  },

  selectInvestment: (investment: Investment, listName: string, userId?: string) => {
    window.gtag("event", "select_item", {
      item_list_id: listName,
      item_list_name: listName,
      items: [
        {
          item_id: investment.id,
          item_name: investment.title,
          item_category: investment.asset_class,
          item_variant: investment.risk_level,
          price: investment.minimum_investment,
          quantity: 1,
        },
      ],
      user_id: userId,
    });
  },

  beginInvestmentProcess: (investment: Investment, userId?: string) => {
    window.gtag("event", "begin_checkout", {
      currency: "USD",
      value: investment.minimum_investment,
      items: [
        {
          item_id: investment.id,
          item_name: investment.title,
          item_category: investment.asset_class,
          item_variant: investment.risk_level,
          price: investment.minimum_investment,
          quantity: 1,
        },
      ],
      user_id: userId,
    });
  },
};

// User property tracking for segmentation
export const setUserProperties = (properties: Record<string, unknown>) => {
  if (!window.gtag) return;

  window.gtag("config", GA_TRACKING_ID, {
    user_properties: properties,
  });
};

// Track user lifecycle events
export const trackUserLifecycle = {
  setAccreditationStatus: (status: string, userId?: string) => {
    setUserProperties({
      accreditation_status: status,
      user_id: userId,
    });
  },

  setInvestmentExperience: (experience: string, userId?: string) => {
    setUserProperties({
      investment_experience: experience,
      user_id: userId,
    });
  },

  setUserTier: (tier: string, totalInvested: number, userId?: string) => {
    setUserProperties({
      user_tier: tier,
      total_invested: totalInvested,
      user_id: userId,
    });
  },
};

// Privacy and consent management
export const updateConsentMode = (consent: {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  functionality_storage: "granted" | "denied";
  personalization_storage: "granted" | "denied";
}) => {
  if (!window.gtag) return;

  window.gtag("consent", "update", consent);
};

// Initialize consent mode (call before GA initialization)
export const initConsentMode = () => {
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer.push(args);
  };

  // Default consent state (denied until user gives consent)
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    functionality_storage: "granted",
    personalization_storage: "denied",
    wait_for_update: 500,
  });
};

// Performance monitoring
export const trackPerformance = (
  metric: string,
  value: number,
  unit = "ms",
) => {
  trackEvent({
    action: "performance_metric",
    category: "technical_performance",
    label: metric,
    value: Math.round(value),
    custom_parameters: {
      metric_name: metric,
      metric_value: value,
      metric_unit: unit,
    },
  });
};

// A/B testing support
export const trackExperiment = (
  experimentId: string,
  variant: string,
  userId?: string,
) => {
  trackEvent({
    action: "experiment_impression",
    category: "experiments",
    label: `${experimentId}_${variant}`,
    user_id: userId,
    custom_parameters: {
      experiment_id: experimentId,
      experiment_variant: variant,
    },
  });
};

export default {
  initGA,
  trackPageView,
  trackEvent,
  trackInvestmentEvents,
  trackInvestmentEcommerce,
  setUserProperties,
  trackUserLifecycle,
  updateConsentMode,
  initConsentMode,
  trackPerformance,
  trackExperiment,
};
