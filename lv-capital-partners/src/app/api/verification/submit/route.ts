import { sendEmail } from "@/lib/email/resend";
import { createClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const verificationData = JSON.parse(
      formData.get("verification_data") as string,
    );

    // Initialize Supabase client with service role
    const supabase = createClient();

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("clerk_user_id", userId)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    // Create verification record
    const { data: verification, error: verificationError } = await supabase
      .from("accredited_investor_verification")
      .insert({
        user_id: userProfile.id,
        accreditation_method: verificationData.accreditationMethod,
        verification_status: "pending",
        submission_date: new Date().toISOString(),
        personal_info: {
          firstName: verificationData.firstName,
          lastName: verificationData.lastName,
          dateOfBirth: verificationData.dateOfBirth,
          phone: verificationData.phone,
          address: verificationData.address,
        },
        financial_info: {
          annualIncome: verificationData.annualIncome,
          jointAnnualIncome: verificationData.jointAnnualIncome,
          netWorth: verificationData.netWorth,
          liquidNetWorth: verificationData.liquidNetWorth,
          employmentStatus: verificationData.employmentStatus,
          employer: verificationData.employer,
          jobTitle: verificationData.jobTitle,
        },
        investment_profile: {
          investmentExperience: verificationData.investmentExperience,
          riskTolerance: verificationData.riskTolerance,
          previousInvestments: verificationData.previousInvestments,
          investmentObjectives: verificationData.investmentObjectives,
        },
        compliance_info: {
          usCitizen: verificationData.usCitizen,
          politicallyExposed: verificationData.politicallyExposed,
          sanctionsCheck: verificationData.sanctionsCheck,
        },
      })
      .select()
      .single();

    if (verificationError) {
      console.error("Verification creation error:", verificationError);
      return NextResponse.json(
        { error: "Failed to create verification record" },
        { status: 500 },
      );
    }

    // Handle document uploads to Supabase Storage
    const uploadedDocuments = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("document_") && value instanceof File) {
        const fileName = `${userId}/${verification.id}/${value.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("investor-documents")
          .upload(fileName, value, {
            cacheControl: "3600",
            upsert: false,
          });

        if (!uploadError) {
          uploadedDocuments.push({
            file_name: value.name,
            file_path: uploadData.path,
            file_size: value.size,
            content_type: value.type,
          });
        }
      }
    }

    // Save document records
    if (uploadedDocuments.length > 0) {
      const { error: documentsError } = await supabase.from("documents").insert(
        uploadedDocuments.map((doc) => ({
          user_id: userProfile.id,
          verification_id: verification.id,
          document_type: "verification",
          file_name: doc.file_name,
          file_path: doc.file_path,
          file_size: doc.file_size,
          content_type: doc.content_type,
          upload_date: new Date().toISOString(),
        })),
      );

      if (documentsError) {
        console.error("Documents creation error:", documentsError);
      }
    }

    // Update user profile verification status
    await supabase
      .from("user_profiles")
      .update({
        verification_status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userProfile.id);

    // Send confirmation email to user
    try {
      await sendEmail({
        to: userProfile.email,
        subject: "Accredited Investor Verification Submitted",
        template: "welcome",
        data: {
          firstName: verificationData.firstName,
          subject: "Accredited Investor Verification Submitted"
        },
        userId: userProfile.clerk_user_id
      });

      // Send internal notification
      await sendEmail({
        to: process.env.RESEND_FROM_EMAIL || "info@lvcapitalpartners.com",
        subject: "New Accredited Investor Verification",
        template: "contact_inquiry_notification",
        data: {
          firstName: verificationData.firstName,
          lastName: verificationData.lastName,
          email: userProfile.email,
          investmentAmount: verificationData.netWorth || "Not specified",
          accreditedStatus: "Pending Verification"
        }
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    // Send notification to admin team
    try {
      await sendEmail({
        to: "compliance@lvcapitalpartners.com",
        subject: "New Accredited Investor Verification Submission",
        template: "contact_inquiry_notification",
        data: {
          firstName: verificationData.firstName,
          lastName: verificationData.lastName,
          email: userProfile.email,
          accreditedStatus: verificationData.accreditationMethod,
          investmentAmount: verificationData.netWorth || "Not specified",
          message: `New verification submission for review. Documents uploaded: ${uploadedDocuments.length}`
        }
      });
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
    }

    return NextResponse.json({
      success: true,
      verificationId: verification.id,
      message: "Verification submitted successfully",
    });
  } catch (error) {
    console.error("Verification submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
