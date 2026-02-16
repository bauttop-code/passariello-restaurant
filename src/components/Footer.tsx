import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Button } from './ui/button';
import qrCodeImage from 'figma:asset/b5403460cd6f33e1ed63347a5b13254dda57da69.png';

// X (Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-[#fafafa] text-gray-600 mt-0 border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* QR CODE Column */}
          <div className="flex flex-col items-start">
            <div className="w-20 h-20 bg-white border-2 border-gray-300 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
              <img 
                src={qrCodeImage} 
                alt="Passariello's App QR Code"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs font-semibold text-gray-800 uppercase">
              SCAN TO DOWNLOAD<br />
              PASSARIELLO'S APP!
            </p>
          </div>

          {/* ABOUT US Column */}
          <div>
            <h4 className="text-[#A72020] mb-4 tracking-wide">ABOUT US</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <a href="https://www.passariellos.com/_files/ugd/1233fe_adee29c8961e4a38a45f70034bee980b.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-[#A72020] transition-colors">
                  Print Menu
                </a>
              </li>
              <li>
                <a href="https://www.passariellos.com/contactus" target="_blank" rel="noopener noreferrer" className="hover:text-[#A72020] transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="https://www.passariellos.com/faqs" target="_blank" rel="noopener noreferrer" className="hover:text-[#A72020] transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* JOIN THE FAMILY Column */}
          <div>
            <h4 className="text-[#A72020] mb-4 tracking-wide">JOIN THE FAMILY</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <a href="https://www.passariellos.com/giftcard" target="_blank" rel="noopener noreferrer" className="hover:text-[#A72020] transition-colors">
                  Gift Card
                </a>
              </li>
              <li>
                <a href="https://app.yiftee.com/gifts/egift_and_gift_cards/passariello-s-italian-kitchen-moorestown" target="_blank" rel="noopener noreferrer" className="hover:text-[#A72020] transition-colors">
                  eGift Card
                </a>
              </li>
              <li>
                <a href="https://www.passariellos.com/passarielloseclub" target="_blank" rel="noopener noreferrer" className="hover:text-[#A72020] transition-colors">
                  Passariello's eClub
                </a>
              </li>
            </ul>
          </div>

          {/* LEARN MORE Column */}
          <div>
            <h4 className="text-[#A72020] mb-4 tracking-wide">LEARN MORE</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <a href="https://www.passariellos.com/allergenguide" target="_blank" rel="noopener noreferrer" className="hover:text-[#A72020] transition-colors">
                  Allergen Guide
                </a>
              </li>
              <li>
                <a href="https://www.passariellos.com/careers" target="_blank" rel="noopener noreferrer" className="hover:text-[#A72020] transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="https://www.passariellos.com/fundraising" target="_blank" rel="noopener noreferrer" className="hover:text-[#A72020] transition-colors">
                  Dine & Donate
                </a>
              </li>
            </ul>
          </div>

          {/* LET'S CONNECT Column */}
          <div>
            <h4 className="text-[#A72020] mb-4 tracking-wide">LET'S CONNECT</h4>
            <div className="flex gap-3">
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-gray-800 hover:text-[#A72020] hover:bg-gray-200 w-9 h-9 rounded-full bg-white border border-gray-300"
                onClick={() => window.open('https://web.facebook.com/passariellosnj/', '_blank')}
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-gray-800 hover:text-[#A72020] hover:bg-gray-200 w-9 h-9 rounded-full bg-white border border-gray-300"
                onClick={() => window.open('https://www.instagram.com/passariellosnj/', '_blank')}
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-gray-800 hover:text-[#A72020] hover:bg-gray-200 w-9 h-9 rounded-full bg-white border border-gray-300"
                onClick={() => window.open('https://x.com/passariellosnj', '_blank')}
              >
                <XIcon className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-gray-800 hover:text-[#A72020] hover:bg-gray-200 w-9 h-9 rounded-full bg-white border border-gray-300"
                onClick={() => window.open('https://www.tiktok.com/@passariellosnj', '_blank')}
              >
                <TikTokIcon className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-gray-800 hover:text-[#A72020] hover:bg-gray-200 w-9 h-9 rounded-full bg-white border border-gray-300"
                onClick={() => window.open('https://www.youtube.com/channel/UC9sn_JCo8Y9b-rsfTKQEHlQ', '_blank')}
              >
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Orange/Gold Background */}
      <div className="bg-[#E69500] text-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-2 text-xs">
          <div className="flex gap-4">
            <a href="https://www.passariellos.com/terms" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Term of Use
            </a>
            <span className="text-gray-700">|</span>
            <a href="https://www.passariellos.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Privacy Policy
            </a>
          </div>
          <div>
            <a href="https://www.passariellos.com/privacy-choices" target="_blank" rel="noopener noreferrer" className="hover:underline">
              My privacy Choices
            </a>
          </div>
          <div>
            &copy; 2025 Passariello LLC. All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
}