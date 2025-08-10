
import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Check, AlertCircle, X, CheckCircle, FileWarning } from "lucide-react";
import { motion } from "framer-motion";

const requiredDocuments = [
  {
    key: "carrier_estimate_url",
    title: "Carrier Estimate",
    description: "Most recent estimate from your insurance carrier",
    required: true,
    forInquiryTypes: ["ready_to_start"]
  },
  {
    key: "contractor_estimate_url", 
    title: "Contractor Estimate",
    description: "Current estimate from your contractor",
    required: true,
    forInquiryTypes: ["ready_to_start"]
  },
  {
    key: "policy_copy_url",
    title: "Insurance Policy Copy",
    description: "Copy of your current insurance policy",
    required: true,
    forInquiryTypes: ["ready_to_start"]
  },
  {
    key: "resume_url",
    title: "Resume/CV",
    description: "Your current resume or curriculum vitae",
    required: true,
    forInquiryTypes: ["join_team"]
  }
];

export default function DocumentsStep({ data, onChange, onFileUpload, uploading, errors }) {
  const fileInputRefs = useRef({});

  const handleFileSelect = async (docKey, event) => {
    const file = event.target.files[0];
    if (file) {
      await onFileUpload(docKey, file);
    }
  };

  const removeDocument = (docKey) => {
    onChange(docKey, null);
  };

  // Filter documents based on inquiry reason
  const getRequiredDocuments = () => {
    if (data.inquiry_reason === "join_team") {
      return requiredDocuments.filter(doc => doc.forInquiryTypes.includes("join_team"));
    }
    return requiredDocuments.filter(doc => doc.forInquiryTypes.includes("ready_to_start"));
  };

  const currentRequiredDocs = getRequiredDocuments();

  // Show inquiry form if user doesn't have documents ready
  if (data.has_documents_ready === false) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader className="text-center pb-8 pt-2">
            <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <FileWarning className="w-10 h-10 text-primary" style={{color: 'var(--primary)'}}/>
            </div>
            <CardTitle className="text-3xl font-bold text-primary mb-3" style={{color: 'var(--primary)'}}>Tell us about your inquiry</CardTitle>
            <p className="text-neutral-600 text-lg">Since you don't have documents ready, please provide more details</p>
          </CardHeader>
          
          <CardContent className="space-y-8 px-2 pb-8">
            <div className="space-y-3">
              <Label htmlFor="inquiry_details" className="text-sm font-bold text-text-dark uppercase tracking-wide">
                {data.inquiry_reason === "join_team" ? "Tell us about your interest in joining our team *" : "What would you like to know? *"}
              </Label>
              <Textarea
                id="inquiry_details"
                value={data.inquiry_details || ''}
                onChange={(e) => onChange('inquiry_details', e.target.value)}
                placeholder={data.inquiry_reason === "join_team" 
                  ? "Please tell us about your background, what position you're interested in, your relevant experience, and why you'd like to join AppraSure..."
                  : "Please describe what you're inquiring about, any questions you have, or details about your situation..."
                }
                className={`min-h-[150px] border-2 bg-white/80 border-neutral-300 focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-300 ${
                  errors.inquiry_details ? 'border-red-500 focus:border-red-500' : ''
                }`}
                style={{borderColor: errors.inquiry_details ? 'red' : 'var(--primary)'}}
              />
              {errors.inquiry_details && (
                <p className="text-red-600 text-sm mt-2 font-medium">{errors.inquiry_details}</p>
              )}
            </div>

            <div className="bg-white/50 border-2 border-neutral-200 rounded-xl p-6">
              <div className="flex gap-4">
                <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-neutral-400 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-800 mb-3 text-lg" style={{color: '#424242'}}>What happens next?</h4>
                  {data.inquiry_reason === "join_team" ? (
                    <ul className="text-neutral-700 font-medium space-y-2">
                      <li>• Our HR team will review your information within 2 business days</li>
                      <li>• We'll contact you about potential opportunities that match your background</li>
                      <li>• If there's a good fit, we'll schedule an initial interview</li>
                      <li>• You can always return to upload your resume when ready</li>
                    </ul>
                  ) : (
                    <ul className="text-neutral-700 font-medium space-y-2">
                      <li>• Our team will review your inquiry within 24 hours</li>
                      <li>• We'll contact you with relevant information or next steps</li>
                      <li>• If you decide to proceed, we'll guide you through document collection</li>
                      <li>• You can always return to upload documents when ready</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto"
    >
      {/* Document Readiness Question */}
      {data.has_documents_ready === undefined && (
        <Card className="bg-transparent border-none shadow-none mb-8">
          <CardHeader className="text-center pb-6 pt-2">
            <CardTitle className="text-2xl font-bold text-primary mb-3" style={{color: 'var(--primary)'}}>
              {data.inquiry_reason === "join_team" ? "Do you have your resume ready?" : "Do you have your documents ready?"}
            </CardTitle>
            <p className="text-neutral-600">
              {data.inquiry_reason === "join_team" 
                ? "We'd love to review your resume and background"
                : "We need a few documents to process your request"
              }
            </p>
          </CardHeader>
          
          <CardContent className="px-2 pb-8">
            <div className="grid gap-4">
              <Button
                onClick={() => onChange('has_documents_ready', true)}
                variant="outline"
                className="h-16 text-left justify-start border-2 border-neutral-300 hover:border-primary hover:bg-accent transition-all duration-300 bg-white/50"
              >
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-primary" style={{color: 'var(--primary)'}}/>
                  <div>
                    <p className="font-bold text-text-dark">
                      {data.inquiry_reason === "join_team" ? "Yes, I have my resume ready" : "Yes, I have them ready"}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {data.inquiry_reason === "join_team" ? "I can upload my resume now" : "I can upload my documents now"}
                    </p>
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => onChange('has_documents_ready', false)}
                variant="outline"
                className="h-16 text-left justify-start border-2 border-neutral-300 hover:border-amber-400 hover:bg-amber-50 transition-all duration-300 bg-white/50"
              >
                <div className="flex items-center gap-4">
                  <FileWarning className="w-6 h-6 text-amber-600" />
                  <div>
                    <p className="font-bold text-text-dark">Not yet</p>
                    <p className="text-sm text-neutral-600">
                      {data.inquiry_reason === "join_team" 
                        ? "I'd like to share my interest and background first"
                        : "I'd like to provide more details about my inquiry"
                      }
                    </p>
                  </div>
                </div>
              </Button>
            </div>

            <div className="mt-6 p-4 bg-white/50 rounded-lg border-2 border-neutral-200">
              <h4 className="font-bold text-neutral-800 mb-2" style={{color: '#424242'}}>
                {data.inquiry_reason === "join_team" ? "Required document:" : "Required documents:"}
              </h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                {data.inquiry_reason === "join_team" ? (
                  <li>• Current resume or CV</li>
                ) : (
                  <>
                    <li>• Most recent carrier estimate</li>
                    <li>• Current contractor estimate</li>
                    <li>• Copy of your insurance policy</li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Upload Section */}
      {data.has_documents_ready === true && (
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader className="text-center pb-8 pt-2">
            <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <FileText className="w-10 h-10 text-primary" style={{color: 'var(--primary)'}} />
            </div>
            <CardTitle className="text-3xl font-bold text-primary mb-3" style={{color: 'var(--primary)'}}>
              {data.inquiry_reason === "join_team" ? "Upload Your Resume" : "Upload Your Documents"}
            </CardTitle>
            <p className="text-neutral-600 text-lg">
              {data.inquiry_reason === "join_team" 
                ? "Please upload your resume so we can review your background"
                : "Please upload the required documents to continue"
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8 px-2 pb-8">
            {currentRequiredDocs.map((doc) => (
              <div key={doc.key} className="border-2 border-neutral-200 rounded-xl p-6 bg-white/50 hover:border-primary transition-colors duration-300">
                 <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-bold text-primary" style={{color: 'var(--primary)'}}>{doc.title}</h3>
                      {doc.required && (
                        <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-300 font-semibold">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-neutral-600 font-medium">{doc.description}</p>
                  </div>

                  {data[doc.key] ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full border border-green-200">
                        <Check className="w-5 h-5 text-green-700" />
                        <span className="text-sm font-bold text-green-800">Uploaded</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.key)}
                        className="text-neutral-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {errors[doc.key] && (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  )}
                </div>

                {!data[doc.key] ? (
                  <div className="relative">
                    <input
                      ref={ref => fileInputRefs.current[doc.key] = ref}
                      type="file"
                      accept={doc.key === "resume_url" ? ".pdf,.doc,.docx" : ".pdf,.jpg,.jpeg,.png,.doc,.docx"}
                      onChange={(e) => handleFileSelect(doc.key, e)}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-neutral-400 rounded-xl p-8 text-center hover:border-primary hover:bg-accent/50 transition-all duration-300 cursor-pointer"
                         onClick={() => fileInputRefs.current[doc.key]?.click()}>
                      <Upload className="w-10 h-10 text-neutral-400 mx-auto mb-4" />
                      <p className="text-lg font-bold text-neutral-700 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-neutral-500 font-medium">
                        {doc.key === "resume_url" 
                          ? "PDF, DOC, DOCX (max 10MB)"
                          : "PDF, DOC, DOCX, JPG, PNG (max 10MB)"
                        }
                      </p>
                    </div>
                    
                    {uploading === doc.key && (
                      <div className="mt-4 flex items-center justify-center gap-3 text-primary" style={{color: 'var(--primary)'}}>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" style={{borderColor: 'var(--primary)'}}></div>
                        <span className="font-medium">Uploading...</span>
                      </div>
                    )}

                    {errors[doc.key] && (
                      <p className="text-red-600 text-sm mt-3 font-medium">{errors[doc.key]}</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 text-lg">Document uploaded successfully</p>
                          <p className="text-neutral-500 font-medium">Ready for review</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRefs.current[doc.key]?.click()}
                        className="border-2 border-primary text-primary hover:bg-accent font-semibold"
                        style={{color: 'var(--primary)', borderColor: 'var(--primary)'}}
                      >
                        Replace
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="bg-white/50 border-2 border-neutral-200 rounded-xl p-6">
              <div className="flex gap-4">
                <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-neutral-400 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-800 mb-3 text-lg" style={{color: '#424242'}}>Upload Requirements</h4>
                  <ul className="text-neutral-700 font-medium space-y-2">
                    <li>• Files must be clear and legible for processing</li>
                    <li>• {data.inquiry_reason === "join_team" ? "Accepted formats: PDF, DOC, DOCX" : "Accepted formats: PDF, DOC, DOCX, JPG, PNG"}</li>
                    <li>• Maximum file size: 10MB per document</li>
                    <li>• Ensure all important information is visible</li>
                    <li className="text-orange-700 font-bold">• You can upload documents later if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
