
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, Building2, Shield } from "lucide-react";
import { motion } from "framer-motion";

const userTypes = [
  { value: "homeowner", label: "Homeowner", icon: User },
  { value: "contractor", label: "Contractor", icon: Building2 },
  { value: "carrier", label: "Insurance Carrier", icon: Shield }
];

export default function ProfileStep({ data, onChange, errors }) {
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
            <User className="w-10 h-10 text-primary" style={{color: 'var(--primary)'}} />
          </div>
          <CardTitle className="text-3xl font-bold text-primary mb-3" style={{color: 'var(--primary)'}}>Welcome to AppraSure</CardTitle>
          <p className="text-neutral-600 text-lg">Let's start with your basic information</p>
        </CardHeader>
        
        <CardContent className="space-y-8 px-2 pb-8">
          {/* User Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-text-dark uppercase tracking-wide">
              I am a... *
            </Label>
            <Select
              value={data.user_type || ''}
              onValueChange={(value) => onChange('user_type', value)}
            >
              <SelectTrigger className={`h-12 border-2 bg-white/80 border-neutral-300 focus:border-primary rounded-lg ${
                errors.user_type ? 'border-red-500' : ''
              }`} style={{borderColor: errors.user_type ? 'red' : 'var(--primary)'}}>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {userTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.user_type && (
              <p className="text-red-600 text-sm mt-2 font-medium">{errors.user_type}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="first_name" className="text-sm font-bold text-text-dark uppercase tracking-wide">
                First Name *
              </Label>
              <div className="relative">
                <Input
                  id="first_name"
                  value={data.first_name || ''}
                  onChange={(e) => onChange('first_name', e.target.value)}
                  placeholder="Enter your first name"
                  className={`h-12 border-2 bg-white/80 border-neutral-300 focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-300 ${
                    errors.first_name ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  style={{borderColor: errors.first_name ? 'red' : 'var(--primary)'}}
                />
                {errors.first_name && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.first_name}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="last_name" className="text-sm font-bold text-text-dark uppercase tracking-wide">
                Last Name *
              </Label>
              <div className="relative">
                <Input
                  id="last_name"
                  value={data.last_name || ''}
                  onChange={(e) => onChange('last_name', e.target.value)}
                  placeholder="Enter your last name"
                  className={`h-12 border-2 bg-white/80 border-neutral-300 focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-300 ${
                    errors.last_name ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  style={{borderColor: errors.last_name ? 'red' : 'var(--primary)'}}
                />
                {errors.last_name && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.last_name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Conditional Business Name for Contractors */}
          {data.user_type === 'contractor' && (
            <div className="space-y-3">
              <Label htmlFor="business_name" className="text-sm font-bold text-text-dark uppercase tracking-wide">
                Business Name *
              </Label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="business_name"
                  value={data.business_name || ''}
                  onChange={(e) => onChange('business_name', e.target.value)}
                  placeholder="Enter your business name"
                  className={`pl-12 h-12 border-2 bg-white/80 border-neutral-300 focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-300 ${
                    errors.business_name ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  style={{borderColor: errors.business_name ? 'red' : 'var(--primary)'}}
                />
                {errors.business_name && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.business_name}</p>
                )}
              </div>
            </div>
          )}

          {/* Conditional Insurance Company for Carriers */}
          {data.user_type === 'carrier' && (
            <div className="space-y-3">
              <Label htmlFor="insurance_company" className="text-sm font-bold text-text-dark uppercase tracking-wide">
                Insurance Company Name *
              </Label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="insurance_company"
                  value={data.insurance_company || ''}
                  onChange={(e) => onChange('insurance_company', e.target.value)}
                  placeholder="Enter your insurance company name"
                  className={`pl-12 h-12 border-2 bg-white/80 border-neutral-300 focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-300 ${
                    errors.insurance_company ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                   style={{borderColor: errors.insurance_company ? 'red' : 'var(--primary)'}}
                />
                {errors.insurance_company && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.insurance_company}</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-bold text-text-dark uppercase tracking-wide">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                id="email"
                type="email"
                value={data.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className={`pl-12 h-12 border-2 bg-white/80 border-neutral-300 focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-300 ${
                  errors.email ? 'border-red-500 focus:border-red-500' : ''
                }`}
                style={{borderColor: errors.email ? 'red' : 'var(--primary)'}}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-2 font-medium">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone" className="text-sm font-bold text-text-dark uppercase tracking-wide">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                id="phone"
                value={data.phone || ''}
                onChange={(e) => onChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="pl-12 h-12 border-2 bg-white/80 border-neutral-300 focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-300"
                style={{borderColor: 'var(--primary)'}}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
