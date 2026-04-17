/**
 * GetInTouchContentPage Component
 * 
 * Admin page for managing "Get in Touch" section content.
 * Displays current content with edit functionality.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useContent } from '@/hooks/useContent';
import { useToast } from '@/hooks/use-toast';
import type { GetInTouchContent } from '@/types/admin-content';
import { Edit, Save, X, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function GetInTouchContentPage() {
  const { toast } = useToast();
  const {
    items: contentList,
    loading,
    create,
    update,
  } = useContent<GetInTouchContent>('get_in_touch');

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    badge_text: '',
    heading: '',
    description: '',
    intro_heading: '',
    intro_description: '',
    call_card_title: '',
    call_card_description: '',
    call_card_button_text: '',
    email_card_title: '',
    email_card_description: '',
    email_card_button_text: '',
    visit_card_title: '',
    visit_card_description: '',
    visit_card_button_text: '',
    hours_card_title: '',
    hours_card_description: '',
  });

  // Get the first (and should be only) content record
  const content = contentList[0];

  // Handle edit button click
  const handleEdit = () => {
    if (content) {
      setFormData({
        badge_text: content.badge_text,
        heading: content.heading,
        description: content.description,
        intro_heading: content.intro_heading,
        intro_description: content.intro_description,
        call_card_title: content.call_card_title,
        call_card_description: content.call_card_description,
        call_card_button_text: content.call_card_button_text,
        email_card_title: content.email_card_title,
        email_card_description: content.email_card_description,
        email_card_button_text: content.email_card_button_text,
        visit_card_title: content.visit_card_title,
        visit_card_description: content.visit_card_description,
        visit_card_button_text: content.visit_card_button_text,
        hours_card_title: content.hours_card_title,
        hours_card_description: content.hours_card_description,
      });
    }
    setShowForm(true);
  };

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (content) {
        await update(content.id, formData);
        toast({
          title: 'Success',
          description: 'Get in Touch content updated successfully',
        });
      } else {
        await create(formData as any);
        toast({
          title: 'Success',
          description: 'Get in Touch content created successfully',
        });
      }
      setShowForm(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update Get in Touch content',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Get in Touch Content</h1>
          <p className="text-muted-foreground">
            Manage the heading and description text for the contact section
          </p>
        </div>
        <Button onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Content
        </Button>
      </div>

      {content ? (
        <div className="grid gap-6">
          {/* Section Header Content */}
          <Card>
            <CardHeader>
              <CardTitle>Section Header</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Badge Text</p>
                <p className="text-lg">{content.badge_text}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Main Heading</p>
                <p className="text-2xl font-bold">{content.heading}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                <p className="text-base">{content.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Intro Content */}
          <Card>
            <CardHeader>
              <CardTitle>Intro Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Intro Heading</p>
                <p className="text-xl font-semibold">{content.intro_heading}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Intro Description</p>
                <p className="text-base">{content.intro_description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Cards Content */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Cards Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Call Card */}
              <div className="border-b pb-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Call Card Title</p>
                <p className="text-lg font-semibold mb-2">{content.call_card_title}</p>
                <p className="text-sm font-medium text-muted-foreground mb-1">Call Card Description</p>
                <p className="text-base">{content.call_card_description}</p>
              </div>

              {/* Email Card */}
              <div className="border-b pb-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Email Card Title</p>
                <p className="text-lg font-semibold mb-2">{content.email_card_title}</p>
                <p className="text-sm font-medium text-muted-foreground mb-1">Email Card Description</p>
                <p className="text-base">{content.email_card_description}</p>
              </div>

              {/* Visit Card */}
              <div className="border-b pb-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Visit Card Title</p>
                <p className="text-lg font-semibold mb-2">{content.visit_card_title}</p>
                <p className="text-sm font-medium text-muted-foreground mb-1">Visit Card Description</p>
                <p className="text-base">{content.visit_card_description}</p>
              </div>

              {/* Hours Card */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Hours Card Title</p>
                <p className="text-lg font-semibold mb-2">{content.hours_card_title}</p>
                <p className="text-sm font-medium text-muted-foreground mb-1">Hours Card Description</p>
                <p className="text-base">{content.hours_card_description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>
                  Last updated: {new Date(content.updated_at).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No content found. Click the button above to add content.
            </p>
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {content ? 'Edit Get in Touch Content' : 'Add Get in Touch Content'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Section Header Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Section Header</h3>
              
              <div className="space-y-2">
                <Label htmlFor="badge_text">Badge Text</Label>
                <Input
                  id="badge_text"
                  name="badge_text"
                  value={formData.badge_text}
                  onChange={handleInputChange}
                  placeholder="Get In Touch"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heading">Main Heading</Label>
                <Input
                  id="heading"
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  placeholder="Contact LifeBloom"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Ready to experience premium healthcare?..."
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Intro Section Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Intro Section</h3>
              
              <div className="space-y-2">
                <Label htmlFor="intro_heading">Intro Heading</Label>
                <Input
                  id="intro_heading"
                  name="intro_heading"
                  value={formData.intro_heading}
                  onChange={handleInputChange}
                  placeholder="Get in Touch"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intro_description">Intro Description</Label>
                <Textarea
                  id="intro_description"
                  name="intro_description"
                  value={formData.intro_description}
                  onChange={handleInputChange}
                  placeholder="We're here to help you with all your healthcare needs..."
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Contact Cards Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Cards Content</h3>
              
              {/* Call Card */}
              <div className="space-y-2 p-4 border rounded-lg">
                <h4 className="font-medium">Call Card</h4>
                <div className="space-y-2">
                  <Label htmlFor="call_card_title">Title</Label>
                  <Input
                    id="call_card_title"
                    name="call_card_title"
                    value={formData.call_card_title}
                    onChange={handleInputChange}
                    placeholder="Call Us"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="call_card_description">Description</Label>
                  <Textarea
                    id="call_card_description"
                    name="call_card_description"
                    value={formData.call_card_description}
                    onChange={handleInputChange}
                    placeholder="Available during business hours..."
                    rows={2}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="call_card_button_text">Button Text</Label>
                  <Input
                    id="call_card_button_text"
                    name="call_card_button_text"
                    value={formData.call_card_button_text}
                    onChange={handleInputChange}
                    placeholder="Call Now"
                    required
                  />
                </div>
              </div>

              {/* Email Card */}
              <div className="space-y-2 p-4 border rounded-lg">
                <h4 className="font-medium">Email Card</h4>
                <div className="space-y-2">
                  <Label htmlFor="email_card_title">Title</Label>
                  <Input
                    id="email_card_title"
                    name="email_card_title"
                    value={formData.email_card_title}
                    onChange={handleInputChange}
                    placeholder="Email Us"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email_card_description">Description</Label>
                  <Textarea
                    id="email_card_description"
                    name="email_card_description"
                    value={formData.email_card_description}
                    onChange={handleInputChange}
                    placeholder="Send us an email..."
                    rows={2}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email_card_button_text">Button Text</Label>
                  <Input
                    id="email_card_button_text"
                    name="email_card_button_text"
                    value={formData.email_card_button_text}
                    onChange={handleInputChange}
                    placeholder="Send Email"
                    required
                  />
                </div>
              </div>

              {/* Visit Card */}
              <div className="space-y-2 p-4 border rounded-lg">
                <h4 className="font-medium">Visit Card</h4>
                <div className="space-y-2">
                  <Label htmlFor="visit_card_title">Title</Label>
                  <Input
                    id="visit_card_title"
                    name="visit_card_title"
                    value={formData.visit_card_title}
                    onChange={handleInputChange}
                    placeholder="Visit Us"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visit_card_description">Description</Label>
                  <Textarea
                    id="visit_card_description"
                    name="visit_card_description"
                    value={formData.visit_card_description}
                    onChange={handleInputChange}
                    placeholder="Visit our pharmacy..."
                    rows={2}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visit_card_button_text">Button Text</Label>
                  <Input
                    id="visit_card_button_text"
                    name="visit_card_button_text"
                    value={formData.visit_card_button_text}
                    onChange={handleInputChange}
                    placeholder="Get Directions"
                    required
                  />
                </div>
              </div>

              {/* Hours Card */}
              <div className="space-y-2 p-4 border rounded-lg">
                <h4 className="font-medium">Opening Hours Card</h4>
                <div className="space-y-2">
                  <Label htmlFor="hours_card_title">Title</Label>
                  <Input
                    id="hours_card_title"
                    name="hours_card_title"
                    value={formData.hours_card_title}
                    onChange={handleInputChange}
                    placeholder="Opening Hours"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours_card_description">Description</Label>
                  <Textarea
                    id="hours_card_description"
                    name="hours_card_description"
                    value={formData.hours_card_description}
                    onChange={handleInputChange}
                    placeholder="Emergency services available..."
                    rows={2}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                disabled={submitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                <Save className="h-4 w-4 mr-2" />
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GetInTouchContentPage;

