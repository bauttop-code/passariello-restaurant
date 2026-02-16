import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, Loader2, ArrowLeft, Mail, User as UserIcon } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import logo from 'figma:asset/b4555029177debc2d76f87272ada6b2492302600.png';

interface RegisterPageProps {
  onAuthSuccess: () => void;
  onBack: () => void;
  onLoginClick: () => void;
}

export function RegisterPage({ onAuthSuccess, onBack, onLoginClick }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const supabase = getSupabaseClient();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!registerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!validateEmail(registerEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(registerPassword)) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Call the server to create a new user
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4c0cb245/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: registerEmail,
            password: registerPassword,
            name: registerName,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Now sign in with the new credentials
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: registerEmail,
        password: registerPassword,
      });

      if (signInError) {
        setError('Account created but login failed. Please try logging in.');
        setLoading(false);
        return;
      }

      if (data.session) {
        setSuccessMessage('Account created successfully!');
        setTimeout(() => {
          onAuthSuccess();
          setRegisterName('');
          setRegisterEmail('');
          setRegisterPassword('');
          setRegisterConfirmPassword('');
          setError('');
          setSuccessMessage('');
        }, 1000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Google sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f0]">
      {/* Header with logo */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-center relative">
          <button
            onClick={onBack}
            className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <img src={logo} alt="Passariello's" className="h-10 w-auto" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-xl w-full">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl text-gray-900 mb-2">Create Account</h1>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onLoginClick}
                className="text-[#a6bba1] hover:underline font-medium"
              >
                Log In
              </button>
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              {/* First Name and Last Name in one row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name*"
                    value={registerName.split(' ')[0] || ''}
                    onChange={(e) => {
                      const lastName = registerName.split(' ').slice(1).join(' ');
                      setRegisterName(e.target.value + (lastName ? ' ' + lastName : ''));
                    }}
                    className="h-12 border-gray-300"
                    required
                  />
                </div>
                <div>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name*"
                    value={registerName.split(' ').slice(1).join(' ') || ''}
                    onChange={(e) => {
                      const firstName = registerName.split(' ')[0] || '';
                      setRegisterName(firstName + (e.target.value ? ' ' + e.target.value : ''));
                    }}
                    className="h-12 border-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email*"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="h-12 border-gray-300"
                  required
                />
              </div>

              {/* Password with strength indicators */}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password*"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="h-12 pr-10 border-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                
                {/* Password strength indicators */}
                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                  <span className={registerPassword.match(/[A-Z]/) ? 'text-green-600' : ''}>⚬ ABC</span>
                  <span className={registerPassword.match(/[a-z]/) ? 'text-green-600' : ''}>⚬ abc</span>
                  <span className={registerPassword.match(/[0-9]/) ? 'text-green-600' : ''}>⚬ 123</span>
                  <span className={registerPassword.match(/[!@#$%^&*]/) ? 'text-green-600' : ''}>⚬ !@#</span>
                  <span className={registerPassword.length >= 10 ? 'text-green-600' : ''}>⚬ Min 10</span>
                </div>
              </div>

              {/* Mobile Number (optional in this version) */}
              <div>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Mobile Number*"
                  className="h-12 border-gray-300"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#A72020] hover:bg-[#8d1a1a] h-12 uppercase tracking-wide text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'NEXT'
                )}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                By clicking on "Next" you agree to the Legal Notices. Check our Privacy Policy for more info.
              </p>
            </form>

            {/* Divider for Google Sign In */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm text-gray-500 bg-white">OR</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full text-gray-700 hover:bg-gray-50 h-12 gap-3"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#A72020] text-white py-4 text-center text-sm">
        <button className="hover:underline">
          Accessibility Statement
        </button>
      </footer>
    </div>
  );
}