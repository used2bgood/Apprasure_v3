
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const propertyTypes = [
  { value: "single_family", label: "Single Family Home" },
  { value: "townhouse", label: "Townhouse" },
  { value: "condo", label: "Condominium" },
  { value: "apartment", label: "Apartment" },
  { value: "commercial", label: "Commercial Property" }
];

const claimTypes = [
  { value: "roof_damage", label: "Roof Damage" },
  { value: "water_damage", label: "Water Damage" },
  { value: "fire_damage", label: "Fire Damage" },
  { value: "storm_damage", label: "Storm Damage" },
  { value: "other", label: "Other" }
];

export default function PropertyStep({ data, onChange, errors }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader className="text-center pb-8 pt-2">
          <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
            <Home className="w-10 h-10 text-primary" style={{color: 'var(--primary)'}} />
          </div>
          <CardTitle className="text-3xl font-bold text-primary mb-3" style={{color: 'var(--primary)'}}>Property Details</CardTitle>
          <p className="text-neutral-600 text-lg">Tell us about your property and claim</p>
        </CardHeader>
        
        <CardContent className="space-y-8 px-2 pb-8">
          <div className="space-y-3">
            <Label htmlFor="property_address" className="text-sm font-bold text-text-dark uppercase tracking-wide">
              Property Address *
            </Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                id="property_address"
                value={data.property_address || ''}
                onChange={(e) => onChange('property_address', e.target.value)}
                placeholder="123 Main Street, City, State 12345"
                className={`pl-12 h-12 border-2 bg-white/80 border-neutral-300 focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-300 ${
                  errors.property_address ? 'border-red-500 focus:border-red-500' : ''
                }`}
                style={{borderColor: errors.property_address ? 'red' : 'var(--primary)'}}
              />
              {errors.property_address && (
                <p className="text-red-600 text-sm mt-2 font-medium">{errors.property_address}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-bold text-text-dark uppercase tracking-wide">
                Property Type *
              </Label>
              <Select
                value={data.property_type || ''}
                onValueChange={(value) => onChange('property_type', value)}
              >
                <SelectTrigger className={`h-12 border-2 bg-white/80 border-neutral-300 focus:border-primary rounded-lg ${
                  errors.property_type ? 'border-red-500' : ''
                }`} style={{borderColor: errors.property_type ? 'red' : 'var(--primary)'}}>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.property_type && (
                <p className="text-red-600 text-sm mt-2 font-medium">{errors.property_type}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold text-text-dark uppercase tracking-wide">
                Claim Type *
              </Label>
              <Select
                value={data.claim_type || ''}
                onValueChange={(value) => onChange('claim_type', value)}
              >
                <SelectTrigger className={`h-12 border-2 bg-white/80 border-neutral-300 focus:border-primary rounded-lg ${
                  errors.claim_type ? 'border-red-500' : ''
                }`} style={{borderColor: errors.claim_type ? 'red' : 'var(--primary)'}}>
                  <SelectValue placeholder="Select claim type" />
                </SelectTrigger>
                <SelectContent>
                  {claimTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.claim_type && (
                <p className="text-red-600 text-sm mt-2 font-medium">{errors.claim_type}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
