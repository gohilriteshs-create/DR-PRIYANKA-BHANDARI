import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Stethoscope,
  Heart,
  KeyRound,
  FileCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { checkPasswordStrength, validateEmail, validateMobile } from '../../utils/security';

interface PortalAuthProps {
  onSuccess?: () => void;
  onClose?: () => void;
  initialTab?: 'signin' | 'signup';
}

export const PortalAuth: React.FC<PortalAuthProps> = ({ 
  onSuccess, 
  onClose,
  initialTab = 'signin' 
}) => {
  const { 
    login, 
    loginWithGoogle, 
    registerPatient, 
    requestPasswordReset, 
    resetPasswordWithToken,
    switchDemoAccount 
  } = usePortal();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot' | 'reset'>(initialTab);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpDob, setSignUpDob] = useState('');
  const [signUpGender, setSignUpGender] = useState<'Female' | 'Male' | 'Other' | 'Prefer not to say'>('Female');
  const [signUpMobile, setSignUpMobile] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpBloodGroup, setSignUpBloodGroup] = useState('');
  const [signUpAddress, setSignUpAddress] = useState('');
  const [signUpEmergencyName, setSignUpEmergencyName] = useState('');
  const [signUpEmergencyRelation, setSignUpEmergencyRelation] = useState('');
  const [signUpEmergencyPhone, setSignUpEmergencyPhone] = useState('');
  const [agreedConsent, setAgreedConsent] = useState(false);
  const [showPrivacyNoticeModal, setShowPrivacyNoticeModal] = useState(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [simulatedTokenNotice, setSimulatedTokenNotice] = useState<string | null>(null);

  // Password Strength scoring
  const passwordStrength = checkPasswordStrength(activeTab === 'signup' ? signUpPassword : newPassword);

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Handle Sign In Submit
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!signInIdentifier.trim()) {
      setErrorMessage('Please enter your registered email address or mobile number.');
      return;
    }
    if (!signInPassword) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(signInIdentifier, signInPassword, rememberMe);
      if (res.success) {
        onSuccess?.();
      } else {
        setErrorMessage(res.error || 'Failed to authenticate. Please check your credentials.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during sign-in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Sign Up Submit
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!signUpFullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!signUpDob) {
      setErrorMessage('Please select your date of birth.');
      return;
    }
    if (!validateMobile(signUpMobile)) {
      setErrorMessage('Please enter a valid 10-digit mobile number (e.g. 9820144520 or +91 9820144520).');
      return;
    }
    if (!validateEmail(signUpEmail)) {
      setErrorMessage('Please provide a valid email format (e.g. name@example.com).');
      return;
    }
    if (signUpPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters in length.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Password confirmation does not match.');
      return;
    }
    if (!agreedConsent) {
      setErrorMessage('You must review and agree to the Patient Privacy Policy and Terms to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerPatient({
        fullName: signUpFullName,
        dateOfBirth: signUpDob,
        gender: signUpGender,
        mobile: signUpMobile,
        email: signUpEmail,
        password: signUpPassword,
        bloodGroup: signUpBloodGroup || undefined,
        address: signUpAddress || undefined,
        emergencyContact: signUpEmergencyName ? {
          name: signUpEmergencyName,
          relation: signUpEmergencyRelation || 'Contact',
          phone: signUpEmergencyPhone
        } : undefined
      });

      if (res.success) {
        setSuccessMessage('Patient account created successfully! Redirecting to your dashboard...');
        setTimeout(() => {
          onSuccess?.();
        }, 1200);
      } else {
        setErrorMessage(res.error || 'Registration failed. Please check your input.');
      }
    } catch {
      setErrorMessage('Registration service encountered an error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleAuth = async () => {
    clearMessages();
    setIsSubmitting(true);
    try {
      // Simulate verified Google token payload
      const mockGoogleEmail = 'rajesh.kumar@example.com';
      const mockGoogleName = 'Rajesh Kumar';
      const res = await loginWithGoogle(
        mockGoogleEmail, 
        mockGoogleName,
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
      );
      if (res.success) {
        onSuccess?.();
      } else {
        setErrorMessage(res.error || 'Google authentication could not be completed.');
      }
    } catch {
      setErrorMessage('Google authentication service error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!validateEmail(forgotEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestPasswordReset(forgotEmail);
      setSuccessMessage(res.message);
      if (res.simulatedToken) {
        setSimulatedTokenNotice(res.simulatedToken);
        setResetToken(res.simulatedToken);
      }
    } catch {
      setErrorMessage('Unable to process password reset request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Reset Password with Token
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!resetToken.trim()) {
      setErrorMessage('Please enter the security reset token.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPasswordWithToken(resetToken.trim(), newPassword);
      if (res.success) {
        setSuccessMessage('Password reset successful! You may now sign in with your new password.');
        setTimeout(() => {
          setActiveTab('signin');
          setSignInPassword('');
          setSimulatedTokenNotice(null);
        }, 1500);
      } else {
        setErrorMessage(res.error || 'Password reset failed.');
      }
    } catch {
      setErrorMessage('Error resetting password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-2xl w-full mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-teal-800 p-6 sm:p-8 text-white relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Stethoscope className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-sky-200">
                Official Patient Portal · Hinduja Hospital
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS
              </h2>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        <p className="mt-3 text-sm text-sky-100/90 leading-relaxed max-w-lg">
          Secure, confidential access to your medical history, verified prescriptions, laboratory records, and clinical consultation summaries.
        </p>

        {/* Security Assurance Badge */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-sky-200 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            End-to-End Encrypted
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-sky-300" />
            DISHA & HIPAA Standards
          </span>
          <span className="flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-sky-300" />
            Doctor Verified Records
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={() => { setActiveTab('signin'); clearMessages(); }}
          className={`flex-1 py-3.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'signin'
              ? 'border-sky-700 text-sky-900 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Patient Sign In
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('signup'); clearMessages(); }}
          className={`flex-1 py-3.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'signup'
              ? 'border-sky-700 text-sky-900 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Patient Sign Up
        </button>
      </div>

      <div className="p-6 sm:p-8">
        {/* Alerts */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Security / Validation Notice</div>
              <div>{errorMessage}</div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Operation Completed</div>
              <div>{successMessage}</div>
            </div>
          </div>
        )}

        {/* ----------------- 1. SIGN IN TAB ----------------- */}
        {activeTab === 'signin' && (
          <div>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    placeholder="e.g. rajesh.kumar@example.com or 9820144520"
                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('forgot'); clearMessages(); }}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your confidential password"
                    className="w-full pl-11 pr-11 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showSignInPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>Remember me securely on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-sky-800 hover:bg-sky-900 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Google Continue */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Or Continue With
              </span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Quick Demo Accounts Banner for Tester Convenience */}
            <div className="mt-8 pt-6 border-t border-slate-100 bg-sky-50/60 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-900 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Demo Evaluation Fast-Login (1-Click)</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                  DEMO DATA
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Click any profile below to instantly experience the verified patient records or doctor consultation workflows:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => { switchDemoAccount('rajesh'); onSuccess?.(); }}
                  className="p-2.5 bg-white border border-sky-200 rounded-lg text-left hover:border-sky-500 hover:shadow-xs transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-sky-900">Rajesh Kumar (Patient)</div>
                    <div className="text-[11px] text-slate-500">PB-2026-0842 · Pharyngitis & BP</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600" />
                </button>

                <button
                  type="button"
                  onClick={() => { switchDemoAccount('priya'); onSuccess?.(); }}
                  className="p-2.5 bg-white border border-sky-200 rounded-lg text-left hover:border-sky-500 hover:shadow-xs transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-sky-900">Priya Sharma (Patient)</div>
                    <div className="text-[11px] text-slate-500">PB-2026-1094 · Prenatal Review</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600" />
                </button>

                <button
                  type="button"
                  onClick={() => { switchDemoAccount('doctor'); onSuccess?.(); }}
                  className="p-2.5 bg-sky-900 border border-sky-900 rounded-lg text-left text-white hover:bg-sky-950 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-semibold">Dr. Priyanka Bhandari (Doctor)</div>
                    <div className="text-[11px] text-sky-200">Clinical Dashboard & Prescribe</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-sky-300" />
                </button>

                <button
                  type="button"
                  onClick={() => { switchDemoAccount('admin'); onSuccess?.(); }}
                  className="p-2.5 bg-white border border-slate-300 rounded-lg text-left hover:border-slate-500 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-semibold text-slate-800">Clinic Admin / Staff</div>
                    <div className="text-[11px] text-slate-500">Audit Trails & Operations</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 2. SIGN UP TAB ----------------- */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl text-xs text-sky-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <strong>Confidential Patient Registration:</strong> We strictly collect only information necessary to identify you and safeguard your clinical history.
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Legal Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={signUpFullName}
                  onChange={(e) => setSignUpFullName(e.target.value)}
                  placeholder="e.g. Meera Nair"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
                />
              </div>
            </div>

            {/* DOB & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={signUpDob}
                    onChange={(e) => setSignUpDob(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={signUpGender}
                  onChange={(e) => setSignUpGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Mobile & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={signUpMobile}
                    onChange={(e) => setSignUpMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="meera@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {signUpPassword && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Password Strength:</span>
                  <span className={`font-bold ${
                    passwordStrength.score >= 3 ? 'text-emerald-700' :
                    passwordStrength.score === 2 ? 'text-amber-700' : 'text-red-700'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.score >= 3 ? 'bg-emerald-500' :
                      passwordStrength.score === 2 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-1">
                  <span className={passwordStrength.hasMinLength ? 'text-emerald-700 font-semibold' : ''}>
                    ✓ 8+ chars
                  </span>
                  <span className={passwordStrength.hasUpperCase ? 'text-emerald-700 font-semibold' : ''}>
                    ✓ Uppercase
                  </span>
                  <span className={passwordStrength.hasLowerCase ? 'text-emerald-700 font-semibold' : ''}>
                    ✓ Lowercase
                  </span>
                  <span className={passwordStrength.hasNumber ? 'text-emerald-700 font-semibold' : ''}>
                    ✓ Number
                  </span>
                  <span className={passwordStrength.hasSpecialChar ? 'text-emerald-700 font-semibold' : ''}>
                    ✓ Special symbol
                  </span>
                </div>
              </div>
            )}

            {/* Optional Personal Details Collapsible */}
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
              <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>Optional Contact & Medical Details</span>
                <span className="text-[10px] text-slate-400 font-normal">Can be completed later</span>
              </div>
              
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Blood Group</label>
                  <select
                    value={signUpBloodGroup}
                    onChange={(e) => setSignUpBloodGroup(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="">Select (Optional)</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={signUpAddress}
                    onChange={(e) => setSignUpAddress(e.target.value)}
                    placeholder="Street, locality, city and postal pin code"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      value={signUpEmergencyName}
                      onChange={(e) => setSignUpEmergencyName(e.target.value)}
                      placeholder="e.g. Sunita"
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Relation</label>
                    <input
                      type="text"
                      value={signUpEmergencyRelation}
                      onChange={(e) => setSignUpEmergencyRelation(e.target.value)}
                      placeholder="e.g. Spouse / Parent"
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Emergency Phone</label>
                    <input
                      type="tel"
                      value={signUpEmergencyPhone}
                      onChange={(e) => setSignUpEmergencyPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Consent & Privacy Checkbox */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedConsent}
                  onChange={(e) => setAgreedConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <div className="text-xs text-slate-600 leading-relaxed">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyNoticeModal(true)}
                    className="font-semibold text-sky-800 underline hover:text-sky-950"
                  >
                    Patient Privacy Policy and Terms & Conditions
                  </button>
                  . I understand my records will be maintained securely and accessed only by authorized clinical practitioners.
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-sky-800 hover:bg-sky-900 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Patient Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Google Continue Option */}
            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Or
              </span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setActiveTab('signin'); clearMessages(); }}
                className="text-xs font-medium text-slate-600 hover:text-sky-800"
              >
                Already have an account? <span className="font-bold text-sky-800 underline">Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* ----------------- 3. FORGOT PASSWORD TAB ----------------- */}
        {activeTab === 'forgot' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
              <KeyRound className="w-5 h-5 text-sky-700" />
              <span>Recover Portal Access</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your registered email address. We will send a secure, time-limited verification reset token.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. rajesh.kumar@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-sky-800 hover:bg-sky-900 text-white font-semibold rounded-xl text-sm transition-all"
              >
                {isSubmitting ? 'Dispatching Token...' : 'Send Password Reset Token'}
              </button>
            </form>

            {simulatedTokenNotice && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  <span>Simulated Email Delivery Token (Demo Notice)</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-amber-300 font-mono text-[11px] select-all break-all">
                  {simulatedTokenNotice}
                </div>
                <div className="text-[11px] text-amber-800">
                  This token expires in 15 minutes. In production, this token arrives via verified email link.
                </div>
                <button
                  type="button"
                  onClick={() => { setActiveTab('reset'); }}
                  className="px-3 py-1.5 bg-amber-800 text-white rounded font-semibold text-xs hover:bg-amber-900"
                >
                  Proceed to Reset Password →
                </button>
              </div>
            )}

            <div className="text-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setActiveTab('signin'); clearMessages(); }}
                className="text-xs font-semibold text-slate-600 hover:text-sky-800"
              >
                ← Return to Sign In
              </button>
            </div>
          </div>
        )}

        {/* ----------------- 4. RESET PASSWORD WITH TOKEN TAB ----------------- */}
        {activeTab === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
              <KeyRound className="w-5 h-5 text-sky-700" />
              <span>Create New Password</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Security Reset Token
              </label>
              <input
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Paste the reset token"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-sm shadow transition-all"
            >
              {isSubmitting ? 'Updating Password...' : 'Save New Password & Sign In'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setActiveTab('signin'); clearMessages(); }}
                className="text-xs text-slate-600 hover:text-sky-800 font-semibold"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Privacy Notice Modal */}
      {showPrivacyNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  Patient Health Information & Privacy Notice
                </h3>
              </div>
              <button
                onClick={() => setShowPrivacyNoticeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>1. What information is collected?</strong><br />
                We collect your basic demographics (Full Name, Date of Birth, Gender, Mobile, Email) and clinical notes created directly by Dr. Priyanka Bhandari during in-person and tele-consultations.
              </p>
              <p>
                <strong>2. Why is it collected?</strong><br />
                To provide safe, accurate, and ongoing primary medical care, prevent medication contraindications, and enable convenient access to your verified prescriptions.
              </p>
              <p>
                <strong>3. Who may access your data?</strong><br />
                Only Dr. Priyanka Bhandari and authorized clinic medical staff under strict doctor-patient confidentiality. We never sell or share patient records with advertisers or third-party marketing services.
              </p>
              <p>
                <strong>4. Retention & Export Rights:</strong><br />
                Medical records are preserved in accordance with statutory medical council guidelines. Patients have the right to inspect and export their comprehensive health dossiers at any time.
              </p>
              <p>
                <strong>5. Medical Record Integrity:</strong><br />
                Prescriptions and diagnoses recorded by Dr. Priyanka Bhandari cannot be modified by patients to prevent clinical errors and ensure patient safety.
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setAgreedConsent(true);
                  setShowPrivacyNoticeModal(false);
                }}
                className="px-4 py-2 bg-sky-800 text-white rounded-xl text-xs font-semibold hover:bg-sky-900"
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
