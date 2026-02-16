import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Bell, CreditCard, Loader2, Check, Smartphone, Mail } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase/client';
import { useDialogFix } from '../hooks/useDialogFix';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  useDialogFix(open);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(true);

  // Preferences
  const [defaultDeliveryMode, setDefaultDeliveryMode] = useState<'Pickup' | 'Delivery'>('Pickup');
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState('card');

  const supabase = getSupabaseClient();

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.settings) {
        const settings = user.user_metadata.settings;
        setEmailNotifications(settings.emailNotifications ?? true);
        setSmsNotifications(settings.smsNotifications ?? false);
        setOrderUpdates(settings.orderUpdates ?? true);
        setPromotionalEmails(settings.promotionalEmails ?? true);
        setDefaultDeliveryMode(settings.defaultDeliveryMode ?? 'Pickup');
        setDefaultPaymentMethod(settings.defaultPaymentMethod ?? 'card');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setSuccess('');

    try {
      const settings = {
        emailNotifications,
        smsNotifications,
        orderUpdates,
        promotionalEmails,
        defaultDeliveryMode,
        defaultPaymentMethod,
      };

      const { error } = await supabase.auth.updateUser({
        data: {
          settings,
        }
      });

      if (error) {
        console.error('Error saving settings:', error);
      } else {
        setSuccess('Settings saved successfully!');
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
          <DialogDescription>
            Manage your preferences and notification settings
          </DialogDescription>
        </DialogHeader>

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
            <Check className="w-4 h-4" />
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Notifications Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#A72020]" />
              <h3 className="font-medium">Notifications</h3>
            </div>

            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="text-base cursor-pointer">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications" className="text-base cursor-pointer">
                    SMS Notifications
                  </Label>
                  <p className="text-sm text-gray-500">Receive text messages for updates</p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="order-updates" className="text-base cursor-pointer">
                    Order Updates
                  </Label>
                  <p className="text-sm text-gray-500">Get notified about order status</p>
                </div>
                <Switch
                  id="order-updates"
                  checked={orderUpdates}
                  onCheckedChange={setOrderUpdates}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="promotional-emails" className="text-base cursor-pointer">
                    Promotional Emails
                  </Label>
                  <p className="text-sm text-gray-500">Receive special offers and deals</p>
                </div>
                <Switch
                  id="promotional-emails"
                  checked={promotionalEmails}
                  onCheckedChange={setPromotionalEmails}
                />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium">Order Preferences</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-delivery">Default Order Type</Label>
                <Select value={defaultDeliveryMode} onValueChange={(v) => setDefaultDeliveryMode(v as 'Pickup' | 'Delivery')}>
                  <SelectTrigger id="default-delivery">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pickup">Pickup</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-payment">Preferred Payment Method</Label>
                <Select value={defaultPaymentMethod} onValueChange={setDefaultPaymentMethod}>
                  <SelectTrigger id="default-payment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="apple-pay">Apple Pay</SelectItem>
                    <SelectItem value="google-pay">Google Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Account Actions Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-red-600">Account Actions</h3>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                Clear Order History
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                Delete Account
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Warning: These actions cannot be undone
            </p>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveSettings}
            className="w-full bg-[#A72020] hover:bg-[#8B1818]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}