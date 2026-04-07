/**
 * ContactInfoPage Component
 * 
 * Admin page for managing contact information.
 * Displays current contact info with edit functionality.
 * 
 * Requirements: 6.1, 6.4
 */

import { useState, useEffect } from 'react';
import { ContactInfoForm } from '@/components/admin/ContactInfoForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContent } from '@/hooks/useContent';
import { useToast } from '@/hooks/use-toast';
import type { ContactInfo } from '@/types/admin-content';
import { Edit, MapPin, Phone, Mail, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ============================================================================
// Component
// ============================================================================

export function ContactInfoPage() {
  const { toast } = useToast();
  const {
    items: contactInfoList,
    loading,
    create,
    update,
  } = useContent<ContactInfo>('contact');

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Get the first (and should be only) contact info record
  const contactInfo = contactInfoList[0];

  // Format operating hours for display
  const formatHours = (hours: ContactInfo['operating_hours']) => {
    return Object.entries(hours).map(([day, schedule]) => ({
      day,
      ...schedule,
    }));
  };

  // Handle form submit
  const handleFormSubmit = async (
    data: Omit<ContactInfo, 'id' | 'updated_at' | 'updated_by'>
  ) => {
    setSubmitting(true);
    try {
      if (contactInfo) {
        await update(contactInfo.id, data);
        toast({
          title: 'Success',
          description: 'Contact information updated successfully',
        });
      } else {
        await create(data as any);
        toast({
          title: 'Success',
          description: 'Contact information created successfully',
        });
      }
      setShowForm(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update contact information',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading contact information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Information</h1>
          <p className="text-muted-foreground">
            Manage business contact details and operating hours
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Contact Info
        </Button>
      </div>

      {contactInfo ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {contactInfo.address}
                  </p>
                </div>
              </div>

              {/* Primary Phone */}
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Primary Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {contactInfo.primary_phone}
                  </p>
                </div>
              </div>

              {/* Secondary Phone */}
              {contactInfo.secondary_phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Secondary Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {contactInfo.secondary_phone}
                    </p>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {contactInfo.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formatHours(contactInfo.operating_hours).map(({ day, open, close, closed }) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="font-medium">{day}</span>
                    {closed ? (
                      <span className="text-sm text-muted-foreground">Closed</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {open} - {close}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Last updated: {new Date(contactInfo.updated_at).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No contact information found. Click the button above to add contact details.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Add Contact Info
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {contactInfo ? 'Edit Contact Information' : 'Add Contact Information'}
            </DialogTitle>
          </DialogHeader>
          <ContactInfoForm
            initialData={contactInfo}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ContactInfoPage;
