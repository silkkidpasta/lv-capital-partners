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
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #27225e;">Verification Submitted Successfully</h2>
            <p>Dear ${verificationData.firstName},</p>
            <p>Thank you for submitting your accredited investor verification. We have received your application and supporting documents.</p>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #27225e; margin-top: 0;">What's Next?</h3>
              <ul>
                <li>Our compliance team will review your application within 5-7 business days</li>
                <li>You'll receive an email notification once the review is complete</li>
                <li>If additional information is needed, we'll contact you directly</li>
                <li>Once approved, you'll gain access to exclusive investment opportunities</li>
              </ul>
            </div>

            <p>You can track the status of your verification in your dashboard at any time.</p>

            <p>If you have any questions, please don't hesitate to contact us.</p>

            <p>Best regards,<br>
            The LV Capital Partners Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    // Send notification to admin team
    try {
      await sendEmail({
        to: "compliance@lvcapitalpartners.com",
        subject: "New Accredited Investor Verification Submission",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #27225e;">New Verification Submission</h2>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Applicant Information</h3>
              <p><strong>Name:</strong> ${verificationData.firstName} ${verificationData.lastName}</p>
              <p><strong>Email:</strong> ${userProfile.email}</p>
              <p><strong>Accreditation Method:</strong> ${verificationData.accreditationMethod}</p>
              <p><strong>Documents Uploaded:</strong> ${uploadedDocuments.length}</p>
              <p><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <p>Please review this application in the admin dashboard.</p>

            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/verifications/${verification.id}"
               style="background-color: #27225e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Review Application
            </a>
          </div>
        `,
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
