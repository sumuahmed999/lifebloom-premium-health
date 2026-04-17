import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Enquiry } from '@/types/admin-content';
import { Mail, Phone, Calendar, MessageSquare, CheckCircle, Clock, XCircle } from 'lucide-react';

export function EnquiryList() {
  const { toast } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved' | 'closed'>('all');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      toast({
        title: 'Error',
        description: 'Failed to load enquiries',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Enquiry['status']) => {
    try {
      const updates: any = { status };
      
      if (status === 'resolved' || status === 'closed') {
        const { data: { user } } = await supabase.auth.getUser();
        updates.resolved_by = user?.id;
        updates.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('enquiries')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchEnquiries();
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;

    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ notes })
        .eq('id', selectedEnquiry.id);

      if (error) throw error;

      await fetchEnquiries();
      setShowDialog(false);
      toast({
        title: 'Success',
        description: 'Notes saved successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save notes',
        variant: 'destructive',
      });
    }
  };

  const openEnquiry = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setNotes(enquiry.notes || '');
    setShowDialog(true);
  };

  const getStatusBadge = (status: Enquiry['status']) => {
    const variants = {
      new: { variant: 'default' as const, icon: Mail, label: 'New' },
      in_progress: { variant: 'secondary' as const, icon: Clock, label: 'In Progress' },
      resolved: { variant: 'default' as const, icon: CheckCircle, label: 'Resolved' },
      closed: { variant: 'outline' as const, icon: XCircle, label: 'Closed' },
    };
    const config = variants[status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredEnquiries = filter === 'all' 
    ? enquiries 
    : enquiries.filter(e => e.status === filter);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enquiries</h1>
          <p className="text-muted-foreground">Manage customer enquiries and contact form submissions</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'new', 'in_progress', 'resolved', 'closed'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
            size="sm"
          >
            {status === 'all' ? 'All' : status.replace('_', ' ')}
            {status !== 'all' && (
              <Badge variant="secondary" className="ml-2">
                {enquiries.filter(e => e.status === status).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Enquiries List */}
      <div className="grid gap-4">
        {filteredEnquiries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No enquiries found</p>
            </CardContent>
          </Card>
        ) : (
          filteredEnquiries.map((enquiry) => (
            <Card key={enquiry.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openEnquiry(enquiry)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{enquiry.subject}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {enquiry.name}
                      </span>
                      <span>{enquiry.email}</span>
                      {enquiry.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {enquiry.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(enquiry.status)}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{enquiry.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Enquiry Detail Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{selectedEnquiry.email}</p>
                </div>
                {selectedEnquiry.phone && (
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-sm text-muted-foreground">{selectedEnquiry.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedEnquiry.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Subject</label>
                <p className="text-sm text-muted-foreground">{selectedEnquiry.subject}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedEnquiry.message}</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <div className="flex gap-2">
                  {(['new', 'in_progress', 'resolved', 'closed'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={selectedEnquiry.status === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(selectedEnquiry.id, status)}
                    >
                      {status.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Internal Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes about this enquiry..."
                  rows={4}
                />
                <Button onClick={handleSaveNotes} className="mt-2">
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EnquiryList;

