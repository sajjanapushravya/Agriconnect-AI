import React, { useState } from 'react';
import {
  Sprout,
  KeyRound,
  Sparkles,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Phone,
  Lock,
  User as UserIcon,
  MapPin,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (user: User, token: string, redirectRole?: UserRole) => void;
  language?: string;
  onLanguageChange?: (lang: any) => void;
}

type AuthStep =
  | 'welcome'
  | 'login'
  | 'signup-role'
  | 'signup-farmer'
  | 'signup-customer'
  | 'forgot-step1'
  | 'forgot-step2'
  | 'forgot-step3';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [step, setStep] = useState<AuthStep>('welcome');

  // Role selection for Login ('farmer' or 'customer')
  const [loginRole, setLoginRole] = useState<'farmer' | 'customer' | 'admin'>('farmer');

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Farmer Signup Form
  const [farmerName, setFarmerName] = useState('');
  const [farmerMobile, setFarmerMobile] = useState('');
  const [farmerPassword, setFarmerPassword] = useState('');
  const [farmerConfirmPassword, setFarmerConfirmPassword] = useState('');
  const [farmerLocation, setFarmerLocation] = useState('');
  const [isPartOfFpo, setIsPartOfFpo] = useState<boolean>(false);
  const [fpoName, setFpoName] = useState('');
  const [showFarmerPassword, setShowFarmerPassword] = useState(false);
  const [showFarmerConfirmPassword, setShowFarmerConfirmPassword] = useState(false);

  // Customer Signup Form
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerConfirmPassword, setCustomerConfirmPassword] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);
  const [showCustomerConfirmPassword, setShowCustomerConfirmPassword] = useState(false);

  // Forgot Password Flow
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password validation helper
  const isPasswordValid = (pw: string) => {
    return pw.length >= 8 && /\d/.test(pw);
  };

  const goToStep = (newStep: AuthStep) => {
    setErrorMessage('');
    setSuccessMessage('');
    setStep(newStep);
  };

  // 1. Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim()) {
      setErrorMessage('Please enter your Mobile Number or Email.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword,
          role: loginRole === 'customer' ? 'buyer' : loginRole
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      setSuccessMessage(data.message || 'Login successful!');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token, data.user.role);
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error logging in.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle Farmer Signup
  const handleFarmerSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!farmerName.trim()) {
      setErrorMessage('Please enter Full Name.');
      return;
    }
    if (!farmerMobile.trim()) {
      setErrorMessage('Please enter Mobile Number.');
      return;
    }
    if (!farmerPassword) {
      setErrorMessage('Please create a password.');
      return;
    }
    if (!isPasswordValid(farmerPassword)) {
      setErrorMessage('Password must be at least 8 characters with at least one number.');
      return;
    }
    if (farmerPassword !== farmerConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }
    if (isPartOfFpo && !fpoName.trim()) {
      setErrorMessage('Please enter your FPO Name.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: farmerName,
          mobileNumber: farmerMobile,
          password: farmerPassword,
          confirmPassword: farmerConfirmPassword,
          location: farmerLocation || 'Kisan Nagar, Rural AP',
          isPartOfFpo,
          fpoName: isPartOfFpo ? fpoName : undefined,
          role: 'farmer'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      setSuccessMessage(data.message || 'Farmer account created successfully!');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token, 'farmer');
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration error.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Customer Signup
  const handleCustomerSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter Full Name.');
      return;
    }
    if (!customerMobile.trim()) {
      setErrorMessage('Please enter Mobile Number.');
      return;
    }
    if (!customerPassword) {
      setErrorMessage('Please create a password.');
      return;
    }
    if (!isPasswordValid(customerPassword)) {
      setErrorMessage('Password must be at least 8 characters with at least one number.');
      return;
    }
    if (customerPassword !== customerConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: customerName,
          mobileNumber: customerMobile,
          password: customerPassword,
          confirmPassword: customerConfirmPassword,
          location: customerLocation || 'Indiranagar, Bengaluru',
          role: 'buyer'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      setSuccessMessage(data.message || 'Customer account created successfully!');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token, 'buyer');
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration error.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Forgot Password Flow
  const handleForgotStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!forgotIdentifier.trim()) {
      setErrorMessage('Please enter your registered mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'User not found.');

      setSimulatedOtp(data.simulatedOtp || '123456');
      setSuccessMessage('OTP sent! Please check below.');
      goToStep('forgot-step2');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!forgotOtp || forgotOtp.length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier, otp: forgotOtp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP.');

      setResetToken(data.resetToken);
      goToStep('forgot-step3');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!isPasswordValid(newPassword)) {
      setErrorMessage('Password must be at least 8 characters with at least one number.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword, confirmPassword: confirmNewPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed.');

      setSuccessMessage('Password changed successfully! Please log in.');
      setTimeout(() => {
        goToStep('login');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo auto-fill helpers
  const handleAutofillDemoFarmer = () => {
    setLoginRole('farmer');
    setLoginIdentifier('+91 98765 43210');
    setLoginPassword('password123');
  };

  const handleAutofillDemoBuyer = () => {
    setLoginRole('customer');
    setLoginIdentifier('+91 98765 43211');
    setLoginPassword('password123');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center p-4 font-sans text-stone-900 antialiased">
      <div className="w-full max-w-md bg-[#FBFDF9] rounded-3xl shadow-xl border border-stone-200 p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-xs">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h1 className="font-black text-emerald-950 text-base leading-none">
                AgriConnect <span className="text-emerald-600 font-extrabold text-sm">AI</span>
              </h1>
              <p className="text-[11px] font-semibold text-stone-500 mt-0.5">
                Direct Agricultural Marketplace
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            English
          </span>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-rose-800 text-xs font-bold animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 flex items-start gap-2.5 text-emerald-950 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. WELCOME SCREEN strictly per prompt specification:
            🌾 AgriConnect AI
            Welcome to AgriConnect AI
            Do you already have an account?
            Large buttons:
            🔑 LOG IN
            ✨ SIGN UP
            Keep the screen minimal. */}
        {step === 'welcome' && (
          <div className="space-y-6 text-center py-2 animate-in fade-in duration-200">
            <div className="space-y-2">
              <div className="text-4xl">🌾</div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                Welcome to AgriConnect AI
              </h2>
              <p className="text-stone-600 font-bold text-sm sm:text-base">
                Do you already have an account?
              </p>
            </div>

            {/* Large Buttons: LOG IN & SIGN UP */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => goToStep('login')}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                <KeyRound className="w-5 h-5 text-emerald-200" />
                <span>🔑 LOG IN</span>
              </button>
              <p className="text-xs text-stone-500 font-semibold">
                For users who already have an account
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => goToStep('signup-role')}
                  className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-stone-50 text-emerald-950 font-black text-lg flex items-center justify-center gap-3 border-2 border-stone-300 shadow-xs transition-all active:scale-98"
                >
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>✨ SIGN UP</span>
                </button>
                <p className="text-xs text-stone-500 font-semibold mt-1">
                  For users who do not have an account
                </p>
              </div>
            </div>

            {/* Instant Demo Logins */}
            <div className="pt-4 border-t border-stone-200">
              <p className="text-[11px] font-bold text-stone-400 mb-2 uppercase tracking-wider">
                Instant Demo Logins
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    handleAutofillDemoFarmer();
                    goToStep('login');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 text-xs font-bold border border-stone-200 active:scale-95"
                >
                  🌾 Demo Farmer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAutofillDemoBuyer();
                    goToStep('login');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 text-xs font-bold border border-stone-200 active:scale-95"
                >
                  🛒 Demo Customer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SIGN UP ROLE SELECTION */}
        {step === 'signup-role' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToStep('welcome')}
                className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-black text-stone-900">Create Your Account</h2>
              <div className="w-9" />
            </div>

            <div className="text-center">
              <p className="text-lg font-black text-stone-900">I am a...</p>
              <p className="text-xs text-stone-500 mt-0.5">
                Choose how you want to use AgriConnect AI
              </p>
            </div>

            {/* Two Large Options: 🌾 FARMER / 🛒 CUSTOMER */}
            <div className="space-y-3.5 pt-2">
              <div
                onClick={() => goToStep('signup-farmer')}
                className="bg-emerald-50 hover:bg-emerald-100/70 border-2 border-emerald-600 rounded-3xl p-5 cursor-pointer transition-all active:scale-98 flex items-center gap-4 group shadow-xs"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-3xl font-black shrink-0">
                  🌾
                </div>
                <div>
                  <h3 className="text-lg font-black text-emerald-950">
                    FARMER
                  </h3>
                  <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                    I want to sell my farm harvest directly
                  </p>
                </div>
              </div>

              <div
                onClick={() => goToStep('signup-customer')}
                className="bg-white hover:bg-stone-50 border-2 border-stone-300 hover:border-emerald-600 rounded-3xl p-5 cursor-pointer transition-all active:scale-98 flex items-center gap-4 group shadow-xs"
              >
                <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center text-3xl font-black shrink-0">
                  🛒
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900">
                    CUSTOMER
                  </h3>
                  <p className="text-xs text-stone-600 font-semibold mt-0.5">
                    I want to buy fresh produce from farmers
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => goToStep('login')}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                Already have an account? Log In
              </button>
            </div>
          </div>
        )}

        {/* 3. FARMER SIGN UP */}
        {step === 'signup-farmer' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToStep('signup-role')}
                className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-black text-stone-900">Farmer Registration</h2>
              <div className="w-9" />
            </div>

            <form onSubmit={handleFarmerSignupSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={farmerMobile}
                  onChange={(e) => setFarmerMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showFarmerPassword ? 'text' : 'password'}
                    value={farmerPassword}
                    onChange={(e) => setFarmerPassword(e.target.value)}
                    placeholder="Min 8 chars with number"
                    className="w-full px-4 py-3 pr-11 rounded-2xl bg-white border-2 border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowFarmerPassword(!showFarmerPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showFarmerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showFarmerConfirmPassword ? 'text' : 'password'}
                    value={farmerConfirmPassword}
                    onChange={(e) => setFarmerConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-4 py-3 pr-11 rounded-2xl bg-white border-2 border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowFarmerConfirmPassword(!showFarmerConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showFarmerConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Village / Location (Optional)
                </label>
                <input
                  type="text"
                  value={farmerLocation}
                  onChange={(e) => setFarmerLocation(e.target.value)}
                  placeholder="e.g. Nashik, Maharashtra"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base shadow-md transition-all active:scale-98"
                >
                  {isLoading ? 'Creating Account...' : 'REGISTER AS FARMER'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. CUSTOMER SIGN UP */}
        {step === 'signup-customer' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToStep('signup-role')}
                className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-black text-stone-900">Customer Registration</h2>
              <div className="w-9" />
            </div>

            <form onSubmit={handleCustomerSignupSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  placeholder="e.g. 9876543211"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCustomerPassword ? 'text' : 'password'}
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    placeholder="Min 8 chars with number"
                    className="w-full px-4 py-3 pr-11 rounded-2xl bg-white border-2 border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showCustomerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCustomerConfirmPassword ? 'text' : 'password'}
                    value={customerConfirmPassword}
                    onChange={(e) => setCustomerConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-4 py-3 pr-11 rounded-2xl bg-white border-2 border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomerConfirmPassword(!showCustomerConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showCustomerConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Delivery Address / City
                </label>
                <input
                  type="text"
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                  placeholder="e.g. Indiranagar, Bengaluru"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base shadow-md transition-all active:scale-98"
                >
                  {isLoading ? 'Creating Account...' : 'REGISTER AS CUSTOMER'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 5. LOG IN FORM */}
        {step === 'login' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToStep('welcome')}
                className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-black text-stone-900">Log In</h2>
              <div className="w-9" />
            </div>

            {/* Role Tab in Login */}
            <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200">
              <button
                type="button"
                onClick={() => setLoginRole('farmer')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                  loginRole === 'farmer'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                🌾 Farmer
              </button>
              <button
                type="button"
                onClick={() => setLoginRole('customer')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                  loginRole === 'customer'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                🛒 Customer
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-stone-700">Password</label>
                  <button
                    type="button"
                    onClick={() => goToStep('forgot-step1')}
                    className="text-xs font-bold text-emerald-800 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white border-2 border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base shadow-md transition-all active:scale-98"
                >
                  {isLoading ? 'Logging In...' : 'LOG IN'}
                </button>
              </div>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => goToStep('signup-role')}
                className="text-xs font-bold text-stone-600 hover:text-stone-900"
              >
                Don't have an account? <span className="text-emerald-800 font-black">Sign Up</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. FORGOT PASSWORD (3 STEPS) */}
        {step === 'forgot-step1' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToStep('login')}
                className="w-9 h-9 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-black text-stone-900">Reset Password</h2>
              <div className="w-9" />
            </div>

            <p className="text-xs text-stone-600">
              Enter your registered mobile number to receive a verification OTP.
            </p>

            <form onSubmit={handleForgotStep1} className="space-y-3.5">
              <input
                type="text"
                value={forgotIdentifier}
                onChange={(e) => setForgotIdentifier(e.target.value)}
                placeholder="Mobile number"
                className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 text-sm font-bold"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-emerald-700 text-white font-black text-sm"
              >
                Send OTP
              </button>
            </form>
          </div>
        )}

        {step === 'forgot-step2' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-lg font-black text-stone-900">Enter OTP</h2>
            {simulatedOtp && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-bold">
                🔑 Simulated OTP: <span className="text-base font-black tracking-widest">{simulatedOtp}</span>
              </div>
            )}
            <form onSubmit={handleForgotStep2} className="space-y-3.5">
              <input
                type="text"
                maxLength={6}
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value)}
                placeholder="6-digit OTP"
                className="w-full px-4 py-3 text-center tracking-widest text-lg font-black rounded-2xl border-2 border-stone-200"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-emerald-700 text-white font-black text-sm"
              >
                Verify OTP
              </button>
            </form>
          </div>
        )}

        {step === 'forgot-step3' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-lg font-black text-stone-900">Create New Password</h2>
            <form onSubmit={handleForgotStep3} className="space-y-3.5">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password (min 8 chars)"
                className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 text-sm font-bold"
                required
              />
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 text-sm font-bold"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-emerald-700 text-white font-black text-sm"
              >
                Reset Password
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
