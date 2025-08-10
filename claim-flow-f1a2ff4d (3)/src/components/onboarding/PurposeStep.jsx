
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { HelpCircle, Rocket, Users } from "lucide-react";
import { motion } from "framer-motion";

const inquiryReasons = [
  { 
    value: "inquiring_process", 
    label: "Inquiring about the process", 
    description: "I want to learn more about how AppraSure works",
    icon: HelpCircle,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
  },
  { 
    value: "ready_to_start", 
    label: "Ready to get started", 
    description: "I have a claim and want to begin the process",
    icon: Rocket,
    color: "bg-green-50 border-green-200 hover:bg-green-100"
  },
  { 
    value: "join_team", 
    label: "Interested in joining the team", 
    description: "I want to explore career or partnership opportunities",
    icon: Users,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
  }
];

export default function PurposeStep({ data, onChange, errors }) {
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
            <HelpCircle className="w-10 h-10 text-primary" style={{color: 'var(--primary)'}} />
          </div>
          <CardTitle className="text-3xl font-bold text-primary mb-3" style={{color: 'var(--primary)'}}>How can we help you?</CardTitle>
          <p className="text-neutral-600 text-lg">Please let us know the purpose of your inquiry</p>
        </CardHeader>
        
        <CardContent className="space-y-6 px-2 pb-8">
          <div className="space-y-3">
            <Label className="text-sm font-bold text-text-dark uppercase tracking-wide">
              Select your primary reason for contacting us *
            </Label>
            
            <div className="grid gap-4">
              {inquiryReasons.map((reason) => {
                const IconComponent = reason.icon;
                const isSelected = data.inquiry_reason === reason.value;
                
                return (
                  <div
                    key={reason.value}
                    onClick={() => onChange('inquiry_reason', reason.value)}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'border-primary bg-accent shadow-md' 
                        : `bg-white/50 border-neutral-300 hover:border-primary`
                    }`}
                    style={{borderColor: isSelected ? 'var(--primary)' : '#e0e0e0'}}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white`}>
                        <IconComponent className={`w-6 h-6 ${
                          isSelected ? 'text-primary' : 'text-neutral-600'
                        }`} style={isSelected ? {color: 'var(--primary)'} : {}} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold mb-2 text-primary ${
                          isSelected ? 'text-primary' : 'text-neutral-800'
                        }`} style={{color: 'var(--primary)'}}>
                          {reason.label}
                        </h3>
                        <p className={`text-sm ${
                          isSelected ? 'text-neutral-700' : 'text-neutral-600'
                        }`}>
                          {reason.description}
                        </p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected 
                          ? 'border-primary bg-primary' 
                          : 'border-neutral-300 bg-white'
                      }`} style={{borderColor: isSelected ? 'var(--primary)' : '#bdbdbd', backgroundColor: isSelected ? 'var(--primary)' : 'white'}}>
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {errors.inquiry_reason && (
              <p className="text-red-600 text-sm mt-2 font-medium">{errors.inquiry_reason}</p>
            )}
          </div>

          <div className="bg-white/50 border-2 border-neutral-200 rounded-xl p-6">
            <div className="flex gap-4">
              <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-3 h-3 bg-neutral-400 rounded-full"></div>
              </div>
              <div>
                <h4 className="font-bold text-neutral-800 mb-3 text-lg" style={{color: '#424242'}}>What happens next?</h4>
                <ul className="text-neutral-700 font-medium space-y-2">
                  <li>• <strong>Inquiring about process:</strong> We'll provide detailed information about our services</li>
                  <li>• <strong>Ready to start:</strong> We'll guide you through our comprehensive claim process</li>
                  <li>• <strong>Join the team:</strong> We'll connect you with our HR department for opportunities</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
