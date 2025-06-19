import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-light-gold flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-navy mb-2">Welcome Back</h1>
          <p className="text-charcoal-secondary">
            Access your exclusive investment portfolio
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gold/20 p-8">
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "#1e3a8a", // navy
                colorText: "#374151", // charcoal
                borderRadius: "0.5rem",
              },
              elements: {
                formButtonPrimary: "bg-navy hover:bg-navy/90 text-white",
                card: "shadow-none border-none",
                headerTitle: "text-navy font-serif",
                headerSubtitle: "text-charcoal-secondary",
                socialButtonsBlockButton:
                  "border-gold/20 text-charcoal hover:bg-cream",
                formFieldInput: "border-gold/20 focus:border-navy",
                footerActionLink: "text-navy hover:text-navy/80",
              },
            }}
          />
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-charcoal-secondary">
            New to LV Capital Partners?{" "}
            <a
              href="/sign-up"
              className="text-navy hover:text-navy/80 font-medium"
            >
              Apply for Access
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
