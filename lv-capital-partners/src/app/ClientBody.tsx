"use client";

import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { useEffect, useState } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Remove any extension-added classes during hydration
    document.body.className = "antialiased";
  }, []);

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted) {
    return <div className="antialiased">{children}</div>;
  }

  return (
    <AnalyticsProvider>
      <div className="antialiased">{children}</div>
    </AnalyticsProvider>
  );
}
