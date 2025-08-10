
import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { id: 1, title: "Profile", description: "Personal details" },
  { id: 2, title: "Property", description: "Property information" },
  { id: 3, title: "Purpose", description: "Reason for inquiry" },
  { id: 4, title: "Documents", description: "Upload required files" },
  { id: 5, title: "Review", description: "Confirm details" }
];

export default function ProgressIndicator({ currentStep }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 pt-12 pb-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-neutral-200 rounded-full -z-10">
          <motion.div 
            className="h-full rounded-full"
            style={{backgroundColor: 'var(--primary)'}}
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center relative">
            <motion.div
              className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                currentStep > step.id
                  ? "bg-primary text-white border-transparent shadow-lg"
                  : currentStep === step.id
                  ? "bg-primary text-white border-transparent shadow-lg shadow-green-200/50"
                  : "bg-white border-neutral-300 text-neutral-400"
              }`}
              style={{
                backgroundColor: currentStep >= step.id ? 'var(--primary)' : 'white',
                borderColor: currentStep >= step.id ? 'var(--primary)' : '#bdbdbd'
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: currentStep === step.id ? 1.1 : 1.0 }}
              transition={{ duration: 0.4 }}
            >
              {currentStep > step.id ? (
                <Check className="w-6 h-6 text-white" />
              ) : (
                <span className={`font-bold text-lg ${currentStep === step.id ? 'text-white' : 'text-neutral-400'}`}>{step.id}</span>
              )}
            </motion.div>
            
            <div className="mt-4 text-center min-w-0">
              <p className={`text-sm font-bold transition-colors duration-300 ${
                currentStep >= step.id ? "text-neutral-900" : "text-neutral-500"
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-neutral-400 mt-1 hidden sm:block font-medium">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
