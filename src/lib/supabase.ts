import { auth } from "@clerk/nextjs/server";
import {
  type SupabaseClient,
  createClient as createSupabaseClient,
} from "@supabase/supabase-js";

// Environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}

// Client-side Supabase client (for use in components)
export function createClient(): SupabaseClient {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Server-side Supabase client with service role (for API routes)
export function createServiceClient(): SupabaseClient {
  if (!supabaseServiceKey) {
    throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY");
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Convenience object for modules that expect a "db" export.
// Provides a ready-to-use service role client under `db.supabase`.
export const db = {
  supabase: createServiceClient(),
};

// Server-side Supabase client with Clerk user authentication
export async function createAuthenticatedClient(): Promise<SupabaseClient | null> {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return null;
    }

    // Get Clerk JWT token and create authenticated Supabase client
    const token = await getToken({ template: "supabase" });

    if (!token) {
      return null;
    }

    return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  } catch (error) {
    console.error("Error creating authenticated Supabase client:", error);
    return null;
  }
}

// Helper function to check if user has valid authentication
export async function validateUserAuth(): Promise<{
  isValid: boolean;
  userId?: string;
  supabase?: SupabaseClient;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { isValid: false };
    }

    const supabase = await createAuthenticatedClient();

    if (!supabase) {
      return { isValid: false };
    }

    return {
      isValid: true,
      userId,
      supabase,
    };
  } catch (error) {
    console.error("Error validating user auth:", error);
    return { isValid: false };
  }
}

// Helper function to get user profile from Supabase
export async function getUserProfile(
  userId: string,
  supabase?: SupabaseClient,
) {
  const client = supabase || createServiceClient();

  const { data: profile, error } = await client
    .from("user_profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return profile;
}

// Helper function to create user profile if it doesn't exist
export async function createUserProfile(userData: {
  clerkUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}) {
  const supabase = createServiceClient();

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .insert({
      clerk_user_id: userData.clerkUserId,
      email: userData.email,
      first_name: userData.firstName || "",
      last_name: userData.lastName || "",
      user_type: "investor",
      verification_status: "unverified",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating user profile:", error);
    return null;
  }

  return profile;
}

// Helper function to get user's portfolio data
export async function getUserPortfolio(userId: string) {
  const supabase = createServiceClient();

  const { data: portfolio, error } = await supabase.rpc(
    "get_user_portfolio_summary",
    { p_user_id: userId },
  );

  if (error) {
    console.error("Error fetching user portfolio:", error);
    return null;
  }

  return portfolio;
}

// Helper function to get user's investments
export async function getUserInvestments(userId: string) {
  const supabase = createServiceClient();

  // Get user profile first
  const profile = await getUserProfile(userId);
  if (!profile) return null;

  const { data: investments, error } = await supabase
    .from("user_investments")
    .select(`
      *,
      investment_deals (
        *
      )
    `)
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user investments:", error);
    return null;
  }

  return investments;
}

// Helper function to get user's distributions
export async function getUserDistributions(userId: string) {
  const supabase = createServiceClient();

  // Get user profile first
  const profile = await getUserProfile(userId);
  if (!profile) return null;

  const { data: distributions, error } = await supabase
    .from("distributions")
    .select(`
      *,
      user_investments (
        *,
        investment_deals (
          title
        )
      )
    `)
    .eq("user_investments.user_id", profile.id)
    .order("distribution_date", { ascending: false });

  if (error) {
    console.error("Error fetching user distributions:", error);
    return null;
  }

  return distributions;
}

// Helper function to get user's verification status
export async function getUserVerificationStatus(userId: string) {
  const supabase = createServiceClient();

  // Get user profile first
  const profile = await getUserProfile(userId);
  if (!profile) return null;

  const { data: verification, error } = await supabase
    .from("accredited_investor_verification")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("Error fetching verification status:", error);
    return null;
  }

  return verification || null;
}

// Helper function to get available investment deals
export async function getInvestmentDeals(status = "active") {
  const supabase = createServiceClient();

  const { data: deals, error } = await supabase
    .from("investment_deals")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching investment deals:", error);
    return null;
  }

  return deals;
}

// Export types for TypeScript
export type { SupabaseClient } from "@supabase/supabase-js";
