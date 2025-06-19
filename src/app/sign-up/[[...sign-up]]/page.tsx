import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-light-gold flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-navy mb-2">
            Join LV Capital Partners
          </h1>
          <p className="text-charcoal-secondary">
            Apply for exclusive access to premium investment opportunities
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gold/20 p-8">
          <SignUp
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
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="text-navy hover:text-navy/80 font-medium"
            >
              Sign In
            </a>
          </p>
        </div>

        <div className="bg-cream/50 rounded-lg p-4 mt-6 border border-gold/20">
          <h3 className="font-semibold text-navy mb-2">
            Investment Access Requirements
          </h3>
          <ul className="text-sm text-charcoal-secondary space-y-1">
            <li>• Accredited investor status verification required</li>
            <li>• Minimum investment commitment: $250,000</li>
            <li>• Applications reviewed within 24-48 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
