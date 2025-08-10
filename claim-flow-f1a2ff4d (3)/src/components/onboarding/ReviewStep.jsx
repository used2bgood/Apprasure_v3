
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, User, Home, FileText, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const propertyTypeLabels = {
  single_family: "Single Family Home",
  townhouse: "Townhouse",
  condo: "Condominium",
  apartment: "Apartment",
  commercial: "Commercial Property"
};

const claimTypeLabels = {
  roof_damage: "Roof Damage",
  water_damage: "Water Damage",
  fire_damage: "Fire Damage",
  storm_damage: "Storm Damage",
  other: "Other"
};

const documentLabels = {
  carrier_estimate_url: "Carrier Estimate",
  contractor_estimate_url: "Contractor Estimate",
  policy_copy_url: "Insurance Policy Copy",
  resume_url: "Resume/CV"
};

export default function ReviewStep({ data }) {
  // Get relevant documents based on inquiry reason
  const getRelevantDocuments = () => {
    if (data.inquiry_reason === "join_team") {
      return { resume_url: "Resume/CV" };
    }
    return {
      carrier_estimate_url: "Carrier Estimate",
      contractor_estimate_url: "Contractor Estimate",
      policy_copy_url: "Insurance Policy Copy"
    };
  };

  const relevantDocuments = getRelevantDocuments();
  const completedDocuments = Object.keys(relevantDocuments).filter(key => data[key]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="border-none bg-transparent shadow-none">
        <CardHeader className="text-center pb-6 pt-2">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary" style={{color: 'var(--primary)'}}/>
          </div>
          <CardTitle className="text-2xl font-bold text-primary" style={{color: 'var(--primary)'}}>Review Your Information</CardTitle>
          <p className="text-slate-600 mt-2">Please review all details before submitting your application</p>
        </CardHeader>

        <CardContent className="space-y-8 bg-white/50 p-6 rounded-lg border-2 border-neutral-200">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-primary" style={{color: 'var(--primary)'}} />
              </div>
              <h3 className="text-lg font-semibold text-primary" style={{color: 'var(--primary)'}}>Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Name:</span>
                <span className="font-medium text-slate-900">
                  {data.first_name} {data.last_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-900">{data.email}</span>
              </div>
              {data.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-900">{data.phone}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Property Information - Only show for non-team joiners */}
          {data.inquiry_reason !== "join_team" && (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <Home className="w-4 h-4 text-primary" style={{color: 'var(--primary)'}}/>
                  </div>
                  <h3 className="text-lg font-semibold text-primary" style={{color: 'var(--primary)'}}>Property Information</h3>
                </div>

                <div className="space-y-3 ml-11">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <span className="text-sm text-slate-900">{data.property_address}</span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Type:</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {propertyTypeLabels[data.property_type]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Claim:</span>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {claimTypeLabels[data.claim_type]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Documents */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" style={{color: 'var(--primary)'}}/>
              </div>
              <h3 className="text-lg font-semibold text-primary" style={{color: 'var(--primary)'}}>
                {data.inquiry_reason === "join_team" ? "Resume" : "Uploaded Documents"}
              </h3>
            </div>

            <div className="space-y-3 ml-11">
              {Object.keys(relevantDocuments).map(key => (
                <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-900">
                    {relevantDocuments[key]}
                  </span>
                  {data[key] ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Uploaded
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      Missing
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {data.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">Additional Notes</h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-700">{data.notes}</p>
                </div>
              </div>
            </>
          )}

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Ready to Submit</h4>
                <p className="text-sm text-green-800">
                  Your application is ready. Click "Complete Submission" to send your information for review.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
