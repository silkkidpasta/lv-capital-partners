import { db } from "@/lib/supabase";
import { Resend } from "resend";

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY || "";
const fromEmail = process.env.RESEND_FROM_EMAIL || "info@lvcapitalpartners.com";

if (!resendApiKey) {
  console.warn(
    "RESEND_API_KEY not found. Email functionality will be disabled.",
  );
}

export const resend = new Resend(resendApiKey);

// Email service interface
export interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
  userId?: string;
}

// Email service class
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(resendApiKey);
  }

  async sendEmail({ to, subject, template, data, userId }: EmailData) {
    try {
      // Log email attempt to database
      if (userId) {
        await db().from("email_notifications").insert({
          user_id: userId,
          template_type: template,
          subject,
          recipient_email: to,
          status: "pending",
          metadata: data,
        });
      }

      // Get email content based on template
      const emailContent = await this.getEmailContent(template, data);

      // Send email via Resend
      const result = await this.resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      // Update email status to sent
      if (userId && result.data?.id) {
        await db()
          .from("email_notifications")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            metadata: { ...data, resendId: result.data.id },
          })
          .eq("user_id", userId)
          .eq("template_type", template)
          .eq("status", "pending");
      }

      return { success: true, id: result.data?.id };
    } catch (error) {
      console.error("Email send error:", error);

      // Update email status to failed
      if (userId) {
        await db()
          .from("email_notifications")
          .update({
            status: "failed",
            error_message:
              error instanceof Error ? error.message : "Unknown error",
          })
          .eq("user_id", userId)
          .eq("template_type", template)
          .eq("status", "pending");
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private async getEmailContent(
    template: string,
    data: Record<string, unknown>,
  ) {
    switch (template) {
      case "welcome":
        return this.getWelcomeEmail(data);
      case "investment_confirmation":
        return this.getInvestmentConfirmationEmail(data);
      case "distribution_notification":
        return this.getDistributionNotificationEmail(data);
      case "contact_inquiry_response":
        return this.getContactInquiryResponseEmail(data);
      case "quarterly_report":
        return this.getQuarterlyReportEmail(data);
      case "new_opportunity":
        return this.getNewOpportunityEmail(data);
      case "contact_inquiry_notification":
        return this.getContactInquiryNotificationEmail(data);
      default:
        throw new Error(`Unknown email template: ${template}`);
    }
  }

  private getWelcomeEmail(data: Record<string, unknown>) {
    const { firstName } = data;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to LV Capital Partners</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2c3e50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #fff; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #2c3e50 0%, #27ae60 100%); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .highlight { background: #f39c12; color: white; padding: 2px 6px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LV Capital Partners</h1>
            <p>Welcome to Institutional-Quality Real Estate Investing</p>
          </div>

          <div class="content">
            <h2>Welcome, ${firstName}!</h2>

            <p>Thank you for your interest in LV Capital Partners. We're excited to introduce you to our exclusive real estate investment opportunities.</p>

            <p>As a sophisticated investor, you now have access to:</p>
            <ul>
              <li><strong>Institutional-Quality Deals:</strong> Carefully curated opportunities typically reserved for large institutions</li>
              <li><strong>Transparent Reporting:</strong> Detailed quarterly reports and real-time portfolio tracking</li>
              <li><strong>Expert Management:</strong> 15+ years of real estate investment expertise</li>
              <li><strong>Diversified Portfolio:</strong> Access to multiple asset classes and geographic markets</li>
            </ul>

            <p>Our current target returns range from <span class="highlight">14-22% IRR</span> across various investment structures.</p>

            <center>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/investments/opportunities" class="btn">View Current Opportunities</a>
            </center>

            <p>If you have any questions, please don't hesitate to reach out to our investor relations team.</p>

            <p>Best regards,<br>
            <strong>The LV Capital Partners Team</strong></p>
          </div>

          <div class="footer">
            <p>LV Capital Partners | Private Real Estate Investment</p>
            <p>432 Park Avenue, Suite 2800, New York, NY 10016</p>
            <p>This email was sent to a verified accredited investor. <a href="#unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to LV Capital Partners, ${firstName}!

      Thank you for your interest in our exclusive real estate investment opportunities.

      As a sophisticated investor, you now have access to institutional-quality deals, transparent reporting, expert management, and diversified portfolio options.

      Our current target returns range from 14-22% IRR across various investment structures.

      View current opportunities: ${process.env.NEXT_PUBLIC_APP_URL}/investments/opportunities

      Best regards,
      The LV Capital Partners Team
    `;

    return { html, text };
  }

  private getInvestmentConfirmationEmail(data: Record<string, unknown>) {
    const { firstName, investmentTitle, investmentAmount, expectedReturns } =
      data;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Investment Confirmation</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2c3e50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #27ae60 0%, #2c3e50 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #fff; }
          .investment-details { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          .amount { font-size: 24px; font-weight: bold; color: #27ae60; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Investment Confirmed</h1>
            <p>Your investment has been successfully processed</p>
          </div>

          <div class="content">
            <h2>Dear ${firstName},</h2>

            <p>We're pleased to confirm your investment in <strong>${investmentTitle}</strong>.</p>

            <div class="investment-details">
              <h3>Investment Summary</h3>
              <p><strong>Investment Amount:</strong> <span class="amount">$${Number(investmentAmount).toLocaleString()}</span></p>
              <p><strong>Investment:</strong> ${investmentTitle}</p>
              <p><strong>Expected Returns:</strong> ${expectedReturns}</p>
              <p><strong>Status:</strong> Confirmed and Processing</p>
            </div>

            <p>What happens next:</p>
            <ol>
              <li>You'll receive detailed investment documentation within 24 hours</li>
              <li>Your investor dashboard will be updated with this new investment</li>
              <li>Quarterly reports will be sent automatically</li>
              <li>Distributions will be processed according to the investment schedule</li>
            </ol>

            <p>Thank you for your trust in LV Capital Partners. We look forward to delivering exceptional returns on your investment.</p>

            <p>Best regards,<br>
            <strong>LV Capital Partners Investment Team</strong></p>
          </div>

          <div class="footer">
            <p>LV Capital Partners | Private Real Estate Investment</p>
            <p>For questions, contact: investments@lvcapitalpartners.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Investment Confirmation - LV Capital Partners

      Dear ${firstName},

      We're pleased to confirm your investment in ${investmentTitle}.

      Investment Amount: $${Number(investmentAmount).toLocaleString()}
      Expected Returns: ${expectedReturns}
      Status: Confirmed and Processing

      You'll receive detailed documentation within 24 hours and your dashboard will be updated accordingly.

      Thank you for your trust in LV Capital Partners.

      Best regards,
      LV Capital Partners Investment Team
    `;

    return { html, text };
  }

  private getDistributionNotificationEmail(data: Record<string, unknown>) {
    const { firstName, investmentTitle, distributionAmount, distributionDate } =
      data;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Distribution Notification</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2c3e50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #fff; }
          .distribution-box { background: #e8f5e8; border: 2px solid #27ae60; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0; }
          .amount { font-size: 28px; font-weight: bold; color: #27ae60; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Distribution Processed</h1>
            <p>Your quarterly distribution is ready</p>
          </div>

          <div class="content">
            <h2>Dear ${firstName},</h2>

            <p>We're pleased to notify you that a distribution from your investment in <strong>${investmentTitle}</strong> has been processed.</p>

            <div class="distribution-box">
              <h3>Distribution Amount</h3>
              <div class="amount">$${Number(distributionAmount).toLocaleString()}</div>
              <p>Distribution Date: ${distributionDate}</p>
            </div>

            <p>This distribution has been transferred to your designated account and should appear within 1-2 business days.</p>

            <p>You can view detailed information about this distribution and your overall portfolio performance in your investor dashboard.</p>

            <p>Thank you for being a valued LV Capital Partners investor.</p>

            <p>Best regards,<br>
            <strong>LV Capital Partners Investor Relations</strong></p>
          </div>

          <div class="footer">
            <p>LV Capital Partners | Private Real Estate Investment</p>
            <p>Questions? Contact: distributions@lvcapitalpartners.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Distribution Processed - LV Capital Partners

      Dear ${firstName},

      A distribution from your investment in ${investmentTitle} has been processed.

      Distribution Amount: $${Number(distributionAmount).toLocaleString()}
      Distribution Date: ${distributionDate}

      The funds have been transferred to your designated account and should appear within 1-2 business days.

      View details in your investor dashboard.

      Best regards,
      LV Capital Partners Investor Relations
    `;

    return { html, text };
  }

  private getContactInquiryResponseEmail(data: Record<string, unknown>) {
    const { firstName } = data;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Thank You for Your Interest</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2c3e50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #fff; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Interest</h1>
            <p>We'll be in touch soon</p>
          </div>

          <div class="content">
            <h2>Dear ${firstName},</h2>

            <p>Thank you for your interest in LV Capital Partners. We've received your inquiry and a member of our investment team will contact you within 24 hours.</p>

            <p>In the meantime, you might be interested in:</p>
            <ul>
              <li>Reviewing our current investment opportunities</li>
              <li>Learning more about our investment process</li>
              <li>Understanding our track record and performance history</li>
            </ul>

            <p>We look forward to discussing how LV Capital Partners can help you achieve your investment objectives.</p>

            <p>Best regards,<br>
            <strong>LV Capital Partners Investor Relations Team</strong></p>
          </div>

          <div class="footer">
            <p>LV Capital Partners | Private Real Estate Investment</p>
            <p>432 Park Avenue, Suite 2800, New York, NY 10016</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Thank You for Your Interest - LV Capital Partners

      Dear ${firstName},

      Thank you for your interest in LV Capital Partners. We've received your inquiry and will contact you within 24 hours.

      In the meantime, feel free to review our current investment opportunities and learn more about our investment process.

      We look forward to discussing your investment objectives.

      Best regards,
      LV Capital Partners Investor Relations Team
    `;

    return { html, text };
  }

  private getQuarterlyReportEmail(data: Record<string, unknown>) {
    const { firstName, quarter, portfolioValue, totalReturns } = data;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Quarterly Portfolio Report</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2c3e50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8e44ad 0%, #2c3e50 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #fff; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat { text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: #27ae60; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Quarterly Report</h1>
            <p>${quarter} Portfolio Performance</p>
          </div>

          <div class="content">
            <h2>Dear ${firstName},</h2>

            <p>Your ${quarter} portfolio report is now available. Here's a summary of your investment performance:</p>

            <div class="stats">
              <div class="stat">
                <div class="stat-value">$${Number(portfolioValue).toLocaleString()}</div>
                <div>Portfolio Value</div>
              </div>
              <div class="stat">
                <div class="stat-value">${totalReturns}%</div>
                <div>Total Returns</div>
              </div>
            </div>

            <p>Your detailed quarterly report includes:</p>
            <ul>
              <li>Individual investment performance</li>
              <li>Market analysis and outlook</li>
              <li>Distribution summary</li>
              <li>Portfolio allocation breakdown</li>
            </ul>

            <p>Please log into your investor dashboard to view the complete report and supporting documentation.</p>

            <p>Thank you for your continued trust in LV Capital Partners.</p>

            <p>Best regards,<br>
            <strong>LV Capital Partners Investment Team</strong></p>
          </div>

          <div class="footer">
            <p>LV Capital Partners | Private Real Estate Investment</p>
            <p>View full report: <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Investor Dashboard</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Quarterly Portfolio Report - LV Capital Partners

      Dear ${firstName},

      Your ${quarter} portfolio report is now available.

      Portfolio Value: $${Number(portfolioValue).toLocaleString()}
      Total Returns: ${totalReturns}%

      Your detailed report includes individual investment performance, market analysis, distribution summary, and portfolio allocation.

      View the complete report in your investor dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

      Thank you for your continued trust in LV Capital Partners.

      Best regards,
      LV Capital Partners Investment Team
    `;

    return { html, text };
  }

  private getNewOpportunityEmail(data: Record<string, unknown>) {
    const { firstName, investmentTitle, targetReturns, minimumInvestment } =
      data;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Investment Opportunity</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2c3e50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #fff; }
          .opportunity-box { background: #f8f9fa; border-left: 4px solid #e74c3c; padding: 20px; margin: 20px 0; }
          .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #e74c3c 0%, #27ae60 100%); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Investment Opportunity</h1>
            <p>Exclusive Access for LV Capital Partners Investors</p>
          </div>

          <div class="content">
            <h2>Dear ${firstName},</h2>

            <p>We're excited to present a new exclusive investment opportunity that matches your investment criteria.</p>

            <div class="opportunity-box">
              <h3>${investmentTitle}</h3>
              <p><strong>Target Returns:</strong> ${targetReturns}</p>
              <p><strong>Minimum Investment:</strong> $${Number(minimumInvestment).toLocaleString()}</p>
              <p><strong>Status:</strong> Now Available</p>
            </div>

            <p>This opportunity features:</p>
            <ul>
              <li>Prime location in a high-growth market</li>
              <li>Experienced development team</li>
              <li>Conservative underwriting assumptions</li>
              <li>Multiple exit strategies</li>
            </ul>

            <center>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/investments/opportunities" class="btn">View Opportunity Details</a>
            </center>

            <p><strong>Limited availability:</strong> This opportunity is available on a first-come, first-served basis to qualified investors.</p>

            <p>Contact our investment team if you have any questions or would like to schedule a call to discuss this opportunity.</p>

            <p>Best regards,<br>
            <strong>LV Capital Partners Investment Team</strong></p>
          </div>

          <div class="footer">
            <p>LV Capital Partners | Private Real Estate Investment</p>
            <p>Contact: opportunities@lvcapitalpartners.com | +1 (212) 555-0123</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      New Investment Opportunity - LV Capital Partners

      Dear ${firstName},

      We're excited to present a new exclusive investment opportunity: ${investmentTitle}

      Target Returns: ${targetReturns}
      Minimum Investment: $${Number(minimumInvestment).toLocaleString()}
      Status: Now Available

      This opportunity features prime location, experienced team, conservative underwriting, and multiple exit strategies.

      Limited availability - first-come, first-served basis.

      View details: ${process.env.NEXT_PUBLIC_APP_URL}/investments/opportunities

      Contact our team with any questions.

      Best regards,
      LV Capital Partners Investment Team
    `;

    return { html, text };
  }

  private getContactInquiryNotificationEmail(data: Record<string, unknown>) {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      title,
      investmentAmount,
      investmentInterests,
      accreditedStatus,
      timeframe,
      message,
      preferredContact,
      preferredTime,
    } = data;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Investor Inquiry</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2c3e50; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #fff; }
          .inquiry-details { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .field { margin-bottom: 15px; }
          .field-label { font-weight: bold; color: #2c3e50; }
          .field-value { margin-top: 5px; color: #34495e; }
          .priority { background: #e74c3c; color: white; padding: 8px 16px; border-radius: 4px; display: inline-block; margin: 10px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Investor Inquiry</h1>
            <p>LV Capital Partners Lead Management</p>
          </div>

          <div class="content">
            <h2>Contact Information</h2>

            <div class="inquiry-details">
              <div class="field">
                <div class="field-label">Name:</div>
                <div class="field-value">${firstName} ${lastName}</div>
              </div>

              <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
              </div>

              <div class="field">
                <div class="field-label">Phone:</div>
                <div class="field-value">${phone}</div>
              </div>

              <div class="field">
                <div class="field-label">Company:</div>
                <div class="field-value">${company}</div>
              </div>

              <div class="field">
                <div class="field-label">Title:</div>
                <div class="field-value">${title}</div>
              </div>
            </div>

            <h3>Investment Profile</h3>

            <div class="inquiry-details">
              <div class="field">
                <div class="field-label">Investment Amount:</div>
                <div class="field-value">${investmentAmount}</div>
              </div>

              <div class="field">
                <div class="field-label">Investment Interests:</div>
                <div class="field-value">${Array.isArray(investmentInterests) ? investmentInterests.join(", ") : investmentInterests}</div>
              </div>

              <div class="field">
                <div class="field-label">Accredited Status:</div>
                <div class="field-value">${accreditedStatus}</div>
              </div>

              <div class="field">
                <div class="field-label">Investment Timeframe:</div>
                <div class="field-value">${timeframe}</div>
              </div>
            </div>

            <h3>Contact Preferences</h3>

            <div class="inquiry-details">
              <div class="field">
                <div class="field-label">Preferred Contact Method:</div>
                <div class="field-value">${preferredContact}</div>
              </div>

              <div class="field">
                <div class="field-label">Preferred Contact Time:</div>
                <div class="field-value">${preferredTime}</div>
              </div>
            </div>

            <h3>Message</h3>
            <div class="inquiry-details">
              <div class="field-value">${message}</div>
            </div>

            ${Number(investmentAmount?.toString().replace(/[$,]/g, "")) >= 250000 ? '<div class="priority">🔥 HIGH PRIORITY - Qualified Investor ($250K+)</div>' : ""}

            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Review inquiry details and qualification status</li>
              <li>Schedule initial consultation call</li>
              <li>Prepare investment overview presentation</li>
              <li>Follow up within 24 hours</li>
            </ol>

            <p><strong>Action Required:</strong> Contact the prospect within 24 hours to maintain high service standards.</p>
          </div>

          <div class="footer">
            <p>LV Capital Partners | Investor Relations Team</p>
            <p>This is an automated notification from the website contact form</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      New Investor Inquiry - LV Capital Partners

      Contact Information:
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone}
      Company: ${company}
      Title: ${title}

      Investment Profile:
      Investment Amount: ${investmentAmount}
      Investment Interests: ${Array.isArray(investmentInterests) ? investmentInterests.join(", ") : investmentInterests}
      Accredited Status: ${accreditedStatus}
      Investment Timeframe: ${timeframe}

      Contact Preferences:
      Preferred Contact Method: ${preferredContact}
      Preferred Contact Time: ${preferredTime}

      Message:
      ${message}

      ${Number(investmentAmount?.toString().replace(/[$,]/g, "")) >= 250000 ? "HIGH PRIORITY - Qualified Investor ($250K+)" : ""}

      Action Required: Contact the prospect within 24 hours.
    `;

    return { html, text };
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export sendEmail function for backward compatibility
export const sendEmail = emailService.sendEmail.bind(emailService);
