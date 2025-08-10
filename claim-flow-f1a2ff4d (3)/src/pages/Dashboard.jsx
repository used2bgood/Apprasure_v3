
import React, { useState, useEffect } from "react";
import { Client } from "@/api/entities";
import { SendEmail } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Users, FileCheck, Clock, CheckCircle,
  User, Mail, Phone, MapPin, FileText, Plus, Send
} from "lucide-react";
import { format, differenceInHours } from "date-fns";

export default function DashboardPage() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [remindingClientId, setRemindingClientId] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await Client.list("-created_date");
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReminder = async (client) => {
    setRemindingClientId(client.id);

    let missingDocs;
    let documentLabels;

    if (client.inquiry_reason === "join_team") {
      documentLabels = { resume_url: "Resume/CV" };
      missingDocs = Object.keys(documentLabels)
        .filter(key => !client[key])
        .map(key => `<li>${documentLabels[key]}</li>`)
        .join('');
    } else {
      documentLabels = {
        carrier_estimate_url: "Carrier Estimate",
        contractor_estimate_url: "Contractor Estimate",
        policy_copy_url: "Insurance Policy Copy"
      };
      missingDocs = Object.keys(documentLabels)
        .filter(key => !client[key])
        .map(key => `<li>${documentLabels[key]}</li>`)
        .join('');
    }

    if (!missingDocs) {
      alert("No documents are missing for this client.");
      setRemindingClientId(null);
      return;
    }

    const emailBody = client.inquiry_reason === "join_team" ? `
      <p>Dear ${client.first_name},</p>
      <p>Thank you for your interest in joining the AppraSure team! To move forward with your application, we still need the following document:</p>
      <ul>${missingDocs}</ul>
      <p>You can upload this by returning to our portal. If you have any questions about opportunities at AppraSure, please don't hesitate to contact us.</p>
      <p>We look forward to hearing from you,</p>
      <p>The AppraSure HR Team</p>
    ` : `
      <p>Dear ${client.first_name},</p>
      <p>This is a friendly reminder to complete your onboarding process with AppraSure. To proceed with your claim, we still need the following documents:</p>
      <ul>${missingDocs}</ul>
      <p>You can upload these by returning to our portal. If you have any questions, please don't hesitate to contact us.</p>
      <p>Thank you,</p>
      <p>The AppraSure Team</p>
    `;

    const emailSubject = client.inquiry_reason === "join_team"
      ? "Resume Required to Complete Your AppraSure Application"
      : "Reminder: Please Upload Your Documents for AppraSure";

    try {
      await SendEmail({
        to: client.email,
        subject: emailSubject,
        body: emailBody
      });

      await Client.update(client.id, {
        last_reminder_sent_at: new Date().toISOString()
      });

      // Refresh the data to reflect the change
      loadClients();
    } catch (error) {
      console.error("Failed to send reminder:", error);
      alert("Failed to send reminder email. Please try again.");
    } finally {
      setRemindingClientId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in_progress":
        return <Clock className="w-4 h-4" />;
      case "pending_review":
        return <FileCheck className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const completedClients = clients.filter(c => c.onboarding_status === "completed").length;
  const inProgressClients = clients.filter(c => ["in_progress", "pending_review"].includes(c.onboarding_status)).length;
  const inquiryOnlyClients = clients.filter(c => c.onboarding_status === "inquiry_only").length;

  return (
    <div className="py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2" style={{color: 'var(--primary)'}}>Client Dashboard</h1>
            <p className="text-neutral-600">Manage client onboarding and track progress</p>
          </div>
          <Link to={createPageUrl("Onboarding")}>
            <Button className="apprasure-btn shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              New Client
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-neutral-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">Total Clients</CardTitle>
              <Users className="w-5 h-5 text-primary" style={{color: 'var(--primary)'}} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-dark">{clients.length}</div>
              <p className="text-xs text-neutral-500 mt-1">All registered clients</p>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">Completed</CardTitle>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-dark">{completedClients}</div>
              <p className="text-xs text-neutral-500 mt-1">Finished onboarding</p>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">In Progress</CardTitle>
              <Clock className="w-5 h-5 text-primary" style={{color: 'var(--primary)'}} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-dark">{inProgressClients}</div>
              <p className="text-xs text-neutral-500 mt-1">Currently onboarding</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card className="border border-neutral-200 bg-white/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary" style={{color: 'var(--primary)'}}>Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-slate-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No clients yet</h3>
                <p className="text-slate-600 mb-4">Get started by adding your first client</p>
                <Link to={createPageUrl("Onboarding")}>
                  <Button className="apprasure-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Start Onboarding
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {clients.map((client) => {
                  const reminderSentRecently = client.last_reminder_sent_at &&
                                               differenceInHours(new Date(), new Date(client.last_reminder_sent_at)) < 24;

                  return (
                    <div key={client.id} className="border border-neutral-200 rounded-xl p-6 bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" style={{color: 'var(--primary)'}}/>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-text-dark">
                              {client.first_name} {client.last_name}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-neutral-600">
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {client.email}
                              </div>
                              {client.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {client.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <Badge className={`${getStatusColor(client.onboarding_status)} border`}>
                          {getStatusIcon(client.onboarding_status)}
                          <span className="ml-1 capitalize">
                            {client.onboarding_status?.replace("_", " ")}
                          </span>
                        </Badge>
                      </div>

                      {client.property_address && (
                        <div className="flex items-center gap-2 mb-3 text-sm text-neutral-600">
                          <MapPin className="w-4 h-4" />
                          {client.property_address}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-neutral-500">
                          Created {format(new Date(client.created_date), "MMM d, yyyy 'at' h:mm a")}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4 text-neutral-400" />
                            <span className="text-neutral-600">
                              {client.inquiry_reason === "join_team"
                                ? (client.resume_url ? "1/1 docs" : "0/1 docs")
                                : `${[client.carrier_estimate_url, client.contractor_estimate_url, client.policy_copy_url].filter(Boolean).length}/3 docs`
                              }
                            </span>
                          </div>

                          {client.onboarding_status === 'pending_review' && (
                            <Button
                              size="sm"
                              onClick={() => handleSendReminder(client)}
                              disabled={remindingClientId === client.id || reminderSentRecently}
                              className="apprasure-btn text-xs font-semibold"
                            >
                              {remindingClientId === client.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send className="w-3 h-3 mr-2" />
                                  {reminderSentRecently ? "Reminder Sent" : "Send Reminder"}
                                </>
                              )}
                            </Button>
                          )}

                          {client.claim_type && (
                            <Badge variant="outline" className="text-xs">
                              {client.claim_type.replace("_", " ")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
