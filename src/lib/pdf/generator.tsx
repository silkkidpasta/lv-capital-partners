import {
  Document,
  Font,
  Image,
  PDFDownloadLink,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// TypeScript interfaces
interface Investment {
  id: string;
  title: string;
  property_type: string;
  location: string;
  asset_class: string;
  amount_invested: number;
  current_value: number;
  performance_percentage: number;
  status: string;
  investment_date: string;
  target_irr: number;
  projected_hold_period: number;
  risk_profile: string;
  key_highlights?: string[];
  financial_summary?: {
    acquisition_cost: number;
    total_project_cost: number;
    loan_amount: number;
    equity_multiple: number;
    cash_on_cash: number;
  };
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  emailAddresses?: Array<{ emailAddress: string }>;
}

interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalReturns: number;
  overallPerformance: number;
  totalDistributions: number;
  activeInvestments: number;
  irr: number;
  averageHoldPeriod: number;
}

interface PortfolioData {
  portfolio: PortfolioSummary;
  investments: Investment[];
  performanceHistory: Array<{
    month: string;
    invested: number;
    current: number;
    returns: number;
  }>;
}

// Define styles for PDF documents
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: "#2c3e50",
    paddingBottom: 15,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    borderBottom: 1,
    borderBottomColor: "#bdc3c7",
    paddingBottom: 5,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#2c3e50",
    marginBottom: 5,
  },
  boldText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 15,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    fontSize: 10,
    padding: 8,
    color: "#2c3e50",
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    padding: 8,
    backgroundColor: "#ecf0f1",
    color: "#2c3e50",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#7f8c8d",
    fontSize: 8,
    borderTop: 1,
    borderTopColor: "#bdc3c7",
    paddingTop: 10,
  },
  highlight: {
    backgroundColor: "#f39c12",
    color: "#ffffff",
    padding: 3,
    fontSize: 11,
    fontWeight: "bold",
  },
  warning: {
    backgroundColor: "#e74c3c",
    color: "#ffffff",
    padding: 8,
    fontSize: 10,
    marginBottom: 10,
  },
});

// Investment Report PDF Component
export const InvestmentReportPDF = ({
  investment,
  user,
}: {
  investment: Investment;
  user?: User;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>LV Capital Partners</Text>
        <Text style={styles.subtitle}>
          Private Real Estate Investment Report
        </Text>
        <Text style={styles.text}>
          Generated on: {new Date().toLocaleDateString()}
        </Text>
      </View>

      {/* Investment Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Investment Overview</Text>
        <Text style={styles.boldText}>{investment.title}</Text>
        <Text style={styles.text}>Location: {investment.location}</Text>
        <Text style={styles.text}>Asset Class: {investment.asset_class}</Text>
        <Text style={styles.text}>Strategy: {investment.strategy}</Text>
        <Text style={styles.text}>Status: {investment.status}</Text>
      </View>

      {/* Financial Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Metric</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Value</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Target Return</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {investment.target_return_min}% - {investment.target_return_max}
                %
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Minimum Investment</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                ${investment.minimum_investment?.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Total Raise</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                ${investment.total_raise?.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Risk Level</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{investment.risk_level}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Investment Highlights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Investment Highlights</Text>
        {investment.key_highlights?.map((highlight: string) => (
          <Text key={highlight} style={styles.text}>
            • {highlight}
          </Text>
        ))}
      </View>

      {/* Risk Factors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Important Disclosures</Text>
        <View style={styles.warning}>
          <Text style={styles.text}>
            This investment involves substantial risk and is suitable only for
            accredited investors who can afford to lose their entire investment.
          </Text>
        </View>
        <Text style={styles.text}>
          • Past performance does not guarantee future results
        </Text>
        <Text style={styles.text}>
          • Real estate investments are illiquid and may not be readily
          convertible to cash
        </Text>
        <Text style={styles.text}>
          • Market conditions can significantly impact returns
        </Text>
        <Text style={styles.text}>
          • This is not an offer to sell securities and is intended for
          informational purposes only
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>
          LV Capital Partners | Private Real Estate Investment | 432 Park
          Avenue, Suite 2800, New York, NY 10016
        </Text>
        <Text>
          This document is confidential and proprietary. Distribution is
          restricted to accredited investors only.
        </Text>
      </View>
    </Page>
  </Document>
);

// Portfolio Report PDF Component
export const PortfolioReportPDF = ({
  user,
  investments,
  portfolioSummary,
}: {
  user: User;
  investments: Investment[];
  portfolioSummary: PortfolioSummary;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>LV Capital Partners</Text>
        <Text style={styles.subtitle}>Quarterly Portfolio Report</Text>
        <Text style={styles.text}>
          Investor: {user.first_name} {user.last_name}
        </Text>
        <Text style={styles.text}>
          Report Date: {new Date().toLocaleDateString()}
        </Text>
      </View>

      {/* Portfolio Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Portfolio Summary</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Metric</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Value</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Total Invested</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                ${portfolioSummary.totalInvested?.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Current Value</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                ${portfolioSummary.currentValue?.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Total Return</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                ${portfolioSummary.totalReturn?.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Return Percentage</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {portfolioSummary.returnPercent?.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Individual Investments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Investment Details</Text>
        {investments.map((investment, index) => (
          <View key={investment.id} style={{ marginBottom: 15 }}>
            <Text style={styles.boldText}>{investment.name}</Text>
            <Text style={styles.text}>Type: {investment.type}</Text>
            <Text style={styles.text}>
              Invested: ${investment.invested?.toLocaleString()}
            </Text>
            <Text style={styles.text}>
              Current Value: ${investment.currentValue?.toLocaleString()}
            </Text>
            <Text style={styles.text}>
              Return: {investment.returnPercent?.toFixed(1)}%
            </Text>
            <Text style={styles.text}>Status: {investment.status}</Text>
          </View>
        ))}
      </View>

      {/* Market Commentary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Market Commentary</Text>
        <Text style={styles.text}>
          The real estate market continues to show resilience despite economic
          uncertainties. Our portfolio has benefited from strategic positioning
          in high-growth markets and careful selection of value-add
          opportunities.
        </Text>
        <Text style={styles.text}>
          Looking ahead, we remain cautiously optimistic about market conditions
          and continue to focus on preserving capital while generating
          attractive risk-adjusted returns.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>
          LV Capital Partners | Private Real Estate Investment | 432 Park
          Avenue, Suite 2800, New York, NY 10016
        </Text>
        <Text>
          This document is confidential and proprietary. Distribution is
          restricted to the named investor only.
        </Text>
      </View>
    </Page>
  </Document>
);

// Quarterly Report PDF Component
export const QuarterlyReportPDF = ({
  quarter,
  year,
  portfolioData,
}: {
  quarter: string;
  year: number;
  portfolioData: PortfolioData;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>LV Capital Partners</Text>
        <Text style={styles.subtitle}>
          {quarter} {year} Quarterly Report
        </Text>
        <Text style={styles.text}>
          Report Date: {new Date().toLocaleDateString()}
        </Text>
      </View>

      {/* Executive Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <Text style={styles.text}>
          During {quarter} {year}, LV Capital Partners continued to deliver
          strong performance across our diversified real estate portfolio. Our
          focus on institutional-quality assets in prime markets has positioned
          us well despite market volatility.
        </Text>
      </View>

      {/* Portfolio Performance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Portfolio Performance</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Metric</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Value</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Total AUM</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>$2.8B</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Active Investments</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>47</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Average Returns</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>16.3%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Market Outlook */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Market Outlook</Text>
        <Text style={styles.text}>
          We remain constructive on the real estate market fundamentals,
          particularly in our target markets. Supply constraints and demographic
          trends continue to support our investment thesis.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>
          LV Capital Partners | Private Real Estate Investment | 432 Park
          Avenue, Suite 2800, New York, NY 10016
        </Text>
        <Text>
          This document contains confidential and proprietary information.
        </Text>
      </View>
    </Page>
  </Document>
);

// PDF Generation Functions
export function generateInvestmentReport(investment: Investment, user?: User) {
  return <InvestmentReportPDF investment={investment} user={user} />;
}

export function generatePortfolioReport(
  user: User,
  investments: Investment[],
  portfolioSummary: PortfolioSummary,
) {
  return (
    <PortfolioReportPDF
      user={user}
      investments={investments}
      portfolioSummary={portfolioSummary}
    />
  );
}

export function generateQuarterlyReport(
  quarter: string,
  year: number,
  portfolioData: PortfolioData,
) {
  return (
    <QuarterlyReportPDF
      quarter={quarter}
      year={year}
      portfolioData={portfolioData}
    />
  );
}

// Export PDF Download Link Component
export const PDFDownloadButton = ({
  document,
  fileName,
  children,
}: {
  document: JSX.Element;
  fileName: string;
  children: React.ReactNode;
}) => (
  <PDFDownloadLink document={document} fileName={fileName}>
    {({ blob, url, loading, error }) =>
      loading ? "Generating PDF..." : children
    }
  </PDFDownloadLink>
);
