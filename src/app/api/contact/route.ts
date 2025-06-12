import { emailService } from "@/lib/email/resend";
import { db } from "@/lib/supabase";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 },
        );
      }
    }

    // Insert contact inquiry into database
    const contactInquiry = await db.supabase
      .from("contact_inquiries")
      .insert({
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        phone: body.phone || null,
        company: body.company || null,
        title: body.title || null,
        investment_amount: body.investmentAmount || null,
        investment_interests: body.investmentInterests || [],
        accredited_status: body.accreditedStatus || null,
        timeframe: body.timeframe || null,
        message: body.message || null,
        preferred_contact: body.preferredContact || "email",
        preferred_time: body.preferredTime || null,
        status: "new",
      })
      .select()
      .single();

    if (contactInquiry.error) {
      throw new Error(contactInquiry.error.message);
    }

    // Send automatic response email to the inquirer
    const responseEmailResult = await emailService.sendEmail({
      template: "contact_inquiry_response",
      to: body.email,
      subject: "Thank you for your interest in LV Capital Partners",
      data: {
        firstName: body.firstName,
      },
    });

    // Send notification email to LV Capital Partners team
    const notificationEmailResult = await emailService.sendEmail({
      template: "contact_inquiry_notification",
      to: process.env.RESEND_FROM_EMAIL || "info@lvcapitalpartners.com",
      subject: `New Investor Inquiry - ${body.firstName} ${body.lastName}`,
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone || "Not provided",
        company: body.company || "Not provided",
        title: body.title || "Not provided",
        investmentAmount: body.investmentAmount || "Not specified",
        investmentInterests: body.investmentInterests || [],
        accreditedStatus: body.accreditedStatus || "Not specified",
        timeframe: body.timeframe || "Not specified",
        message: body.message || "No message provided",
        preferredContact: body.preferredContact || "email",
        preferredTime: body.preferredTime || "Not specified",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: contactInquiry.data.id,
        message: "Contact inquiry submitted successfully",
        emailSent: responseEmailResult.success,
      },
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit contact inquiry",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = db.supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: inquiries, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch contact inquiries",
      },
      { status: 500 },
    );
  }
}
