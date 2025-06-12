import { emailService } from "@/lib/email/resend";
import { db } from "@/lib/supabase";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { template, to, subject, data, userId } = body;

    // Validate required fields
    if (!template || !to || !subject) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: template, to, subject",
        },
        { status: 400 },
      );
    }

    // Send email using the email service
    const result = await emailService.sendEmail({
      template,
      to,
      subject,
      data: data || {},
      userId,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: { id: result.id, message: "Email sent successfully" },
      });
    }
    return NextResponse.json(
      {
        success: false,
        error: result.error || "Failed to send email",
      },
      { status: 500 },
    );
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

// Send welcome email to new users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "test") {
      // Test email functionality
      const testResult = await emailService.sendEmail({
        template: "welcome",
        to: "test@example.com",
        subject: "Welcome to LV Capital Partners - Test",
        data: { firstName: "Test User" },
      });

      return NextResponse.json({
        success: true,
        data: {
          message: "Test email functionality",
          result: testResult,
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action parameter",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
