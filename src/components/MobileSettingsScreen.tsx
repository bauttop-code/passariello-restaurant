import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface MobileSettingsScreenProps {
  onBack: () => void;
}

export function MobileSettingsScreen({ onBack }: MobileSettingsScreenProps) {
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center px-4 py-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Back button clicked');
              onBack();
            }}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors z-50"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="flex-1 text-center text-xl text-gray-900 -ml-10">Settings</h1>
        </div>
      </div>

      {/* Settings Options */}
      <div className="px-4 pt-4">
        {/* Push Notifications Toggle */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <span className="text-gray-900 text-lg">Push Notifications</span>
          <button
            onClick={() => setPushNotifications(!pushNotifications)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              pushNotifications ? 'bg-[#A72020]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                pushNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* FAQs */}
        <button onClick={() => window.open('https://www.passariellos.com/faqs', '_blank')} className="w-full flex items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
          <span className="text-gray-900 text-lg">FAQs</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Privacy Notice */}
        <button onClick={() => window.open('https://www.passariellos.com/privacypolicy', '_blank')} className="w-full flex items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
          <span className="text-gray-900 text-lg">Privacy Notice</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Legal Notice */}
        <button onClick={() => window.open('https://www.passariellos.com/termofuse', '_blank')} className="w-full flex items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
          <span className="text-gray-900 text-lg">Term of Use</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Do Not Sell or Share My Personal Information */}
        <button className="w-full flex items-center justify-between py-4 hover:bg-gray-50 transition-colors">
          <span className="text-gray-900 text-lg text-left">Do Not Sell or Share My Personal Information</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}