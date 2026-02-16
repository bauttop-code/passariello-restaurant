import { Clock, MessageSquare, MapPin, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

interface FloatingMenuProps {
  onOrderAhead?: () => void;
  onFindLocation?: () => void;
  onSwitchToCatering?: () => void;
  cartItemsCount?: number;
}

export function FloatingMenu({ onOrderAhead, onFindLocation, onSwitchToCatering, cartItemsCount = 0 }: FloatingMenuProps) {
  const [isCateringDialogOpen, setIsCateringDialogOpen] = useState(false);
  const [cateringForm, setCateringForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    guestCount: '',
    message: ''
  });

  const handleCateringSubmit = () => {
    // Here you would typically send the form data to a backend
    console.log('Catering inquiry submitted:', cateringForm);
    
    // Show success toast
    toast.success('Catering Inquiry Submitted!', {
      description: `We'll contact you at ${cateringForm.email} within 24 hours to discuss your event on ${new Date(cateringForm.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`,
      duration: 5000,
    });
    
    // Reset form
    setCateringForm({
      name: '',
      email: '',
      phone: '',
      eventDate: '',
      guestCount: '',
      message: ''
    });
    
    setIsCateringDialogOpen(false);
    
    // Switch to catering mode after a short delay
    setTimeout(() => {
      if (onSwitchToCatering) {
        onSwitchToCatering();
      }
    }, 500);
  };

  return (
    <>
      <TooltipProvider>
        <div className="fixed right-6 bottom-24 flex flex-col gap-3 z-40 hidden">
          {/* Order Ahead Button - Primary CTA */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                {/* Pulsing ring animation */}
                <div className="absolute inset-0 rounded-full bg-[#753221] opacity-75 animate-ping" />
                <Button
                  size="icon"
                  onClick={onOrderAhead}
                  className="relative h-14 w-14 rounded-full shadow-lg bg-[#753221] hover:bg-[#5a2619] text-white transition-transform hover:scale-110"
                >
                  <Clock className="w-6 h-6" />
                  {cartItemsCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-white text-[#753221] border-2 border-[#753221]"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{cartItemsCount > 0 ? 'Review & Schedule Order' : 'Schedule Your Order'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Catering Inquiry Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={() => setIsCateringDialogOpen(true)}
                className="h-14 w-14 rounded-full shadow-lg bg-white hover:bg-gray-100 text-[#753221] border-2 border-[#753221] transition-transform hover:scale-110"
              >
                <MessageSquare className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Catering Inquiry</p>
            </TooltipContent>
          </Tooltip>

          {/* Find Location Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={onFindLocation}
                className="h-14 w-14 rounded-full shadow-lg bg-white hover:bg-gray-100 text-[#753221] border-2 border-[#753221] transition-transform hover:scale-110"
              >
                <MapPin className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Find Location</p>
            </TooltipContent>
          </Tooltip>

          {/* Quick Call Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={() => window.open('tel:+18565551234', '_self')}
                className="h-14 w-14 rounded-full shadow-lg bg-white hover:bg-gray-100 text-[#753221] border-2 border-[#753221] transition-transform hover:scale-110"
              >
                <Phone className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Call Us: (856) 555-1234</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Catering Inquiry Dialog */}
      <Dialog open={isCateringDialogOpen} onOpenChange={setIsCateringDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Catering Inquiry</DialogTitle>
            <DialogDescription>
              Tell us about your event and we'll help you create the perfect menu.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={cateringForm.name}
                onChange={(e) => setCateringForm({ ...cateringForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={cateringForm.email}
                  onChange={(e) => setCateringForm({ ...cateringForm, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={cateringForm.phone}
                  onChange={(e) => setCateringForm({ ...cateringForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={cateringForm.eventDate}
                  onChange={(e) => setCateringForm({ ...cateringForm, eventDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestCount">Guest Count *</Label>
                <Input
                  id="guestCount"
                  type="number"
                  placeholder="50"
                  value={cateringForm.guestCount}
                  onChange={(e) => setCateringForm({ ...cateringForm, guestCount: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your event, menu preferences, dietary restrictions, etc."
                rows={4}
                value={cateringForm.message}
                onChange={(e) => setCateringForm({ ...cateringForm, message: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsCateringDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#753221] hover:bg-[#5a2619]"
              onClick={handleCateringSubmit}
              disabled={!cateringForm.name || !cateringForm.email || !cateringForm.phone || !cateringForm.eventDate || !cateringForm.guestCount}
            >
              Submit Inquiry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}