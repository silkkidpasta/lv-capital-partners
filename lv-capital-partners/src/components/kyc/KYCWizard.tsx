"use client";

import { useState } from "react";
import DocumentUploadStep from "./steps/DocumentUploadStep";

interface KYCWizardProps {
  onComplete?: () => void;
}

export function KYCWizard({ onComplete }: KYCWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);

  const handleDocumentUploadSuccess = (documentId: string) => {
    setUploadedDocuments(prev => [...prev, documentId]);
  };

  const steps = [
    {
      title: "Personal Information",
      component: <div>Personal Info Step</div>
    },
    {
      title: "Document Upload",
      component: (
        <DocumentUploadStep
          onUploadSuccess={handleDocumentUploadSuccess}
          uploadedDocuments={uploadedDocuments}
        />
      )
    },
    {
      title: "Review & Submit",
      component: <div>Review Step</div>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">KYC Verification</h2>
        <span className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
      </div>

      <div className="space-y-4">
        {steps[currentStepIndex]?.component}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
          disabled={currentStepIndex === 0}
          className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => {
            if (currentStepIndex < steps.length - 1) {
              setCurrentStepIndex(currentStepIndex + 1);
            } else {
              onComplete?.();
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {currentStepIndex === steps.length - 1 ? "Complete" : "Next"}
        </button>
      </div>
    </div>
  );
}
