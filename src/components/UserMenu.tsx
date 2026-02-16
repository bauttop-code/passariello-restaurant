import { User, LogOut, Package, Settings, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { getSupabaseClient } from '../utils/supabase/client';
import { useState } from 'react';
import { ProfileDialog } from './ProfileDialog';
import { OrdersDialog } from './OrdersDialog';
import { SettingsDialog } from './SettingsDialog';

interface UserMenuProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

export function UserMenu({ userName, userEmail, onLogout }: UserMenuProps) {
  const supabase = getSupabaseClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentUserName, setCurrentUserName] = useState(userName);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfileUpdate = (newName: string) => {
    setCurrentUserName(newName);
  };

  const openDialog = (dialogSetter: (open: boolean) => void) => {
    setIsDropdownOpen(false); // Close dropdown first
    // Small delay to ensure dropdown is closed before opening dialog
    setTimeout(() => {
      dialogSetter(true);
    }, 50);
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 h-auto py-2 px-3">
            <div className="w-8 h-8 rounded-full bg-[#A72020] text-white flex items-center justify-center">
              <span className="text-sm">{getInitials(currentUserName)}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="font-medium leading-none">{currentUserName}</p>
              <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openDialog(setIsProfileOpen)}>
            <User className="w-4 h-4 mr-2" />
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDialog(setIsOrdersOpen)}>
            <Package className="w-4 h-4 mr-2" />
            My Orders
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDialog(setIsSettingsOpen)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        currentUser={{ name: currentUserName, email: userEmail }}
        onProfileUpdate={handleProfileUpdate}
      />

      <OrdersDialog
        open={isOrdersOpen}
        onOpenChange={setIsOrdersOpen}
      />

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </>
  );
}