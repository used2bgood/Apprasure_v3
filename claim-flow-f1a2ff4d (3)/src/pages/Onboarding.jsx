
import React, { useState } from "react";
import { Client } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CheckCircle, FileWarning } from "lucide-react";
import { motion } from "framer-motion";

import ProgressIndicator from "../components/onboarding/ProgressIndicator";
import ProfileStep from "../components/onboarding/ProfileStep";
import PropertyStep from "../components/onboarding/PropertyStep";
import PurposeStep from "../components/onboarding/PurposeStep";
import DocumentsStep from "../components/onboarding/DocumentsStep";
import ReviewStep from "../components/onboarding/ReviewStep";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [clientData, setClientData] = useState({});
  const [uploading, setUploading] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [completionStatus, setCompletionStatus] = useState(null);

  const handleDataChange = (field, value) => {
    setClientData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileUpload = async (docKey, file) => {
    setUploading(docKey);
    try {
      const { file_url } = await UploadFile({ file });
      handleDataChange(docKey, file_url);
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setUploading(null);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!clientData.first_name?.trim()) newErrors.first_name = "First name is required";
      if (!clientData.last_name?.trim()) newErrors.last_name = "Last name is required";
      if (!clientData.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(clientData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!clientData.user_type) newErrors.user_type = "Please select your role";
      if (clientData.user_type === 'contractor' && !clientData.business_name?.trim()) {
        newErrors.business_name = "Business name is required for contractors";
      }
      if (clientData.user_type === 'carrier' && !clientData.insurance_company?.trim()) {
        newErrors.insurance_company = "Insurance company name is required";
      }
    } else if (step === 2) {
      if (!clientData.property_address?.trim()) newErrors.property_address = "Property address is required";
      if (!clientData.property_type) newErrors.property_type = "Property type is required";
      if (!clientData.claim_type) newErrors.claim_type = "Claim type is required";
    } else if (step === 3) {
      if (!clientData.inquiry_reason) newErrors.inquiry_reason = "Please select your reason for contacting us";
    } else if (step === 4) {
      // If they chose not to upload documents, validate inquiry details
      if (clientData.has_documents_ready === false && !clientData.inquiry_details?.trim()) {
        newErrors.inquiry_details = "Please provide details about your inquiry";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (currentStep !== 5) return; // Only submit on review step
    
    // Determine final status based on inquiry type and documents
    let finalStatus = "in_progress";
    if (clientData.has_documents_ready === false || clientData.inquiry_reason === "inquiring_process") {
      finalStatus = "inquiry_only";
    } else if (clientData.inquiry_reason === "join_team") {
      // For team joiners, check if resume is uploaded
      finalStatus = clientData.resume_url ? "completed" : "pending_review";
    } else {
      // This 'else' block will handle the "ready_to_start" case
      // For ready_to_start, check if all insurance docs are uploaded
      const requiredDocs = ['carrier_estimate_url', 'contractor_estimate_url', 'policy_copy_url'];
      const docsAreComplete = requiredDocs.every(doc => !!clientData[doc]);
      finalStatus = docsAreComplete ? "completed" : "pending_review";
    }
    
    setIsSubmitting(true);
    try {
      await Client.create({
        ...clientData,
        onboarding_status: finalStatus
      });
      setCompletionStatus(finalStatus);
      setIsComplete(true);
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg"
        >
          {completionStatus === 'completed' ? (
            <>
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-200">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-text-dark mb-4">Application Submitted!</h1>
              <p className="text-neutral-600 mb-6">
                Thank you for completing your onboarding. Our team will review your information and documents, 
                and we'll contact you within 1-2 business days.
              </p>
            </>
          ) : completionStatus === 'inquiry_only' ? (
            <>
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-200">
                <FileWarning className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-text-dark mb-4">Thank You for Your Inquiry!</h1>
              <p className="text-neutral-600 mb-6">
                We've received your inquiry and our team will get back to you within 24 hours with the information you requested.
              </p>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-yellow-200">
                <FileWarning className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-text-dark mb-4">Profile Created!</h1>
              <p className="text-neutral-600 mb-6">
                Your profile has been successfully created. Please remember to return and upload the required documents 
                when you're ready to proceed with your claim.
              </p>
            </>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              {completionStatus === 'inquiry_only' ? (
                <>
                  <li>• Our team will review your inquiry</li>
                  <li>• We'll provide you with relevant information</li>
                  <li>• If you decide to proceed, we'll guide you through next steps</li>
                </>
              ) : (
                <>
                  {completionStatus !== 'completed' && <li>• Upload your missing documents when ready</li>}
                  <li>• Our team will perform an initial review</li>
                  <li>• We'll schedule an initial consultation call</li>
                  <li>• Claim processing begins once all documents are received</li>
                </>
              )}
            </ul>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProfileStep 
            data={clientData} 
            onChange={handleDataChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <PropertyStep 
            data={clientData} 
            onChange={handleDataChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <PurposeStep 
            data={clientData} 
            onChange={handleDataChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <DocumentsStep 
            data={clientData} 
            onChange={handleDataChange}
            onFileUpload={handleFileUpload}
            uploading={uploading}
            errors={errors}
          />
        );
      case 5:
        return <ReviewStep data={clientData} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <ProgressIndicator currentStep={currentStep} />
      
      <div className="px-6 pb-8">
        {renderStep()}

        {currentStep === 5 && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes" className="text-sm font-semibold text-neutral-700">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={clientData.notes || ''}
                  onChange={(e) => handleDataChange('notes', e.target.value)}
                  placeholder="Any additional information you'd like to share..."
                  className="mt-2 min-h-[100px] bg-white/80 border-neutral-300 focus:border-primary-green"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center max-w-3xl mx-auto mt-12">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 h-12 font-semibold border-2 border-neutral-400 hover:bg-neutral-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              className="apprasure-btn flex items-center gap-2 px-8 h-12 font-semibold shadow-lg"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="apprasure-btn flex items-center gap-2 px-8 h-12 font-semibold shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Complete Submission
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
