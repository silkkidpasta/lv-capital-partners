import { createServiceClient } from "@/lib/supabase";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

// Clerk webhook event types
interface ClerkEmailAddress {
  email_address: string;
  id: string;
}

interface ClerkUserData {
  id: string;
  email_addresses: ClerkEmailAddress[];
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
}

interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserData;
}

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local",
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret);

  let evt: Record<string, unknown>;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as Record<string, unknown>;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Handle the webhook
  const event = evt as unknown as ClerkWebhookEvent;
  const { id } = event.data;
  const eventType = event.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    try {
      const supabase = createServiceClient();

      // Create user profile in Supabase
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .insert({
          clerk_user_id: id,
          email: email_addresses[0]?.email_address || "",
          first_name: first_name || "",
          last_name: last_name || "",
          avatar_url: image_url || "",
          user_type: "investor",
          verification_status: "unverified",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating user profile:", error);
        return NextResponse.json(
          { error: "Failed to create user profile" },
          { status: 500 },
        );
      }

      console.log("Created user profile:", profile);
    } catch (error) {
      console.error("Error in webhook:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    try {
      const supabase = createServiceClient();

      // Update user profile in Supabase
      const { error } = await supabase
        .from("user_profiles")
        .update({
          email: email_addresses[0]?.email_address || "",
          first_name: first_name || "",
          last_name: last_name || "",
          avatar_url: image_url || "",
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", id);

      if (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json(
          { error: "Failed to update user profile" },
          { status: 500 },
        );
      }

      console.log("Updated user profile for:", id);
    } catch (error) {
      console.error("Error in webhook:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  }

  if (eventType === "user.deleted") {
    const { id } = event.data;

    try {
      const supabase = createServiceClient();

      // Delete user profile from Supabase
      const { error } = await supabase
        .from("user_profiles")
        .delete()
        .eq("clerk_user_id", id);

      if (error) {
        console.error("Error deleting user profile:", error);
        return NextResponse.json(
          { error: "Failed to delete user profile" },
          { status: 500 },
        );
      }

      console.log("Deleted user profile for:", id);
    } catch (error) {
      console.error("Error in webhook:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ message: "Webhook processed successfully" });
}
