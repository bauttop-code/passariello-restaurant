import { MapPin, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface LocationRequiredModalProps {
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
  source: 'geolocation' | 'ip' | null;
  onRetry: () => void;
}

export function LocationRequiredModal({
  isOpen,
  loading,
  error,
  permissionDenied,
  source,
  onRetry,
}: LocationRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 lg:p-8 animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {loading ? (
            <div className="w-16 h-16 bg-[#A72020]/10 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#A72020] animate-spin" />
            </div>
          ) : error ? (
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-[#A72020]/10 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-[#A72020]" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl text-center mb-3 text-gray-900">
          {loading ? 'Determining Your Location...' : error ? 'Location Required' : 'Location Access Needed'}
        </h2>

        {/* Description */}
        <div className="text-center text-gray-600 mb-6 space-y-2">
          {loading ? (
            <p className="text-sm">
              Please wait while we determine your location to show you available options.
            </p>
          ) : error ? (
            <>
              <p className="text-sm mb-3">{error}</p>
              {permissionDenied && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
                  <p className="text-sm text-amber-900 mb-2">
                    <strong>How to enable location services:</strong>
                  </p>
                  <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
                    <li>Click the lock icon 🔒 in your browser's address bar</li>
                    <li>Find "Location" and select "Allow"</li>
                    <li>Refresh the page or click "Try Again" below</li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm">
                We need your location to:
              </p>
              <ul className="text-sm text-left max-w-xs mx-auto space-y-1.5 mt-3">
                <li className="flex items-start gap-2">
                  <span className="text-[#A72020] mt-0.5">•</span>
                  <span>Find the nearest pickup location</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A72020] mt-0.5">•</span>
                  <span>Verify delivery availability in your area</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A72020] mt-0.5">•</span>
                  <span>Provide accurate menu and pricing</span>
                </li>
              </ul>
            </>
          )}
        </div>

        {/* Source Info (if using IP) */}
        {source === 'ip' && !loading && !error && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-900 text-center">
              Using approximate location based on your internet connection
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {error || permissionDenied ? (
            <Button
              onClick={onRetry}
              className="w-full bg-[#A72020] hover:bg-[#8b1919] text-white py-6 gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </Button>
          ) : !loading && (
            <div className="text-center">
              <p className="text-xs text-gray-500 italic">
                Location detection in progress...
              </p>
            </div>
          )}
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          🔒 Your location is only used to provide service and is never stored or shared.
        </p>
      </div>
    </div>
  );
}
