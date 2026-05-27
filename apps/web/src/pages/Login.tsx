import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, Lock, User as UserIcon, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register, config } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Tab State
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile' | 'username'>('email');
  const [registerMethod, setRegisterMethod] = useState<'email' | 'mobile'>('email');

  // Form Fields
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Strength / Validation States
  const [pwdStrength, setPwdStrength] = useState({score: 0, text: '', color: '', width: ''});
  const [pwdRequirements, setPwdRequirements] = useState({
    len: false, upper: false, lower: false, num: false, spec: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotMethod, setForgotMethod] = useState<'email' | 'mobile'>('email');
  const [forgotInput, setForgotInput] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  const gmailRe = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const mobileRe = /^\d{10}$/;

  // Check if admin login was requested from query params
  useEffect(() => {
    const isAdmin = searchParams.get('admin') === 'true';
    const isRegister = searchParams.get('tab') === 'register';
    if (isAdmin) {
      setLoginMethod('username');
      setUsername('admin');
      setPassword('admin');
      setActiveTab('login');
    } else if (isRegister) {
      setActiveTab('register');
    }
  }, [searchParams]);

  // Live Password Strength & Requirements Check
  const checkPasswordStrength = (val: string) => {
    let sc = 0;
    const reqs = {
      len: val.length >= 8,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      num: /[0-9]/.test(val),
      spec: /[!@#$%^&*\-_+=[\]{}|;:'",.<>?/\\~`]/.test(val)
    };

    setPwdRequirements(reqs);

    if (reqs.len) sc++;
    if (reqs.upper) sc++;
    if (reqs.lower) sc++;
    if (reqs.num) sc++;
    if (reqs.spec) sc++;

    const levels = [
      { text: '', color: 'bg-red-500', width: '0%' },
      { text: 'Too weak', color: 'bg-red-500', width: '20%' },
      { text: 'Weak', color: 'bg-orange-500', width: '40%' },
      { text: 'Fair', color: 'bg-yellow-500', width: '60%' },
      { text: 'Strong', color: 'bg-green-500', width: '80%' },
      { text: 'Very strong', color: 'bg-emerald-500', width: '100%' },
    ];

    setPwdStrength({
      score: sc,
      text: levels[sc].text,
      color: levels[sc].color,
      width: levels[sc].width
    });
  };

  // Live validator for password confirmation
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.confirmPassword;
        return copy;
      });
    }
  }, [password, confirmPassword]);

  // Clear errors when form switches
  const clearForm = () => {
    setEmail('');
    setMobile('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setAgreeTerms(false);
    setErrors({});
    setSuccessMsg('');
    setPwdStrength({score: 0, text: '', color: '', width: ''});
    setPwdRequirements({len: false, upper: false, lower: false, num: false, spec: false});
  };

  const handleTabSwitch = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    clearForm();
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg('');
    
    let ok = true;
    const formErrors: Record<string, string> = {};

    if (activeTab === 'login') {
      let identifier = '';
      if (loginMethod === 'email') {
        if (!email) { formErrors.email = 'Gmail address is required.'; ok = false; }
        else if (!gmailRe.test(email)) { formErrors.email = 'Must be a valid @gmail.com address.'; ok = false; }
        identifier = email;
      } else if (loginMethod === 'mobile') {
        if (!mobile) { formErrors.mobile = 'Mobile number is required.'; ok = false; }
        else if (!mobileRe.test(mobile)) { formErrors.mobile = 'Enter a valid 10-digit mobile number.'; ok = false; }
        identifier = mobile;
      } else {
        if (!username) { formErrors.username = 'Username is required.'; ok = false; }
        else if (username.length < 3) { formErrors.username = 'Username must be at least 3 characters.'; ok = false; }
        identifier = username;
      }

      if (!password) { formErrors.password = 'Password is required.'; ok = false; }
      else if (loginMethod !== 'username' && password.length < 8) {
        formErrors.password = 'Password must be at least 8 characters.';
        ok = false;
      }

      if (!ok) { setErrors(formErrors); return; }

      setIsSubmitting(true);
      try {
        await new Promise(res => setTimeout(res, 1200)); // simulates loading delay
        const loggedIn = await login(identifier, loginMethod);
        if (loggedIn) {
          setSuccessMsg(identifier === 'admin' ? '👮 Admin access granted! Loading console...' : '👋 Welcome back! Redirecting...');
          setTimeout(() => {
            if (identifier === 'admin') {
              navigate('/admin');
            } else {
              const pending = localStorage.getItem('swj_pending');
              const dest = pending ? JSON.parse(pending).url : '/dashboard';
              localStorage.removeItem('swj_pending');
              navigate(dest);
            }
          }, 1000);
        }
      } catch (err: any) {
        setErrors({ general: err.message || 'Incorrect credentials.' });
      } finally {
        setIsSubmitting(false);
      }

    } else {
      // REGISTER
      if (config.registrationLocked) {
        setErrors({ general: 'Platform registration is currently locked by the administrator.' });
        return;
      }

      if (!name.trim()) { formErrors.name = 'Full name is required.'; ok = false; }

      let identifier = '';
      if (registerMethod === 'email') {
        if (!email) { formErrors.email = 'Gmail address is required.'; ok = false; }
        else if (!gmailRe.test(email)) { formErrors.email = 'Must be a valid @gmail.com address.'; ok = false; }
        identifier = email;
      } else {
        if (!mobile) { formErrors.mobile = 'Mobile number is required.'; ok = false; }
        else if (!mobileRe.test(mobile)) { formErrors.mobile = 'Enter a valid 10-digit mobile number.'; ok = false; }
        identifier = mobile;
      }

      if (!password) { formErrors.password = 'Password is required.'; ok = false; }
      else if (pwdStrength.score < 4) {
        formErrors.password = 'Please provide a stronger password (must meet at least 4 criteria).';
        ok = false;
      }

      if (!confirmPassword) { formErrors.confirmPassword = 'Please confirm your password.'; ok = false; }
      else if (password !== confirmPassword) { formErrors.confirmPassword = 'Passwords do not match.'; ok = false; }

      if (!agreeTerms) {
        formErrors.terms = 'You must agree to the Terms of Service';
        ok = false;
      }

      if (!ok) { setErrors(formErrors); return; }

      setIsSubmitting(true);
      try {
        await new Promise(res => setTimeout(res, 1200));
        await register(name, identifier, registerMethod);
        setSuccessMsg('🚀 Account created! 200 welcome tokens awarded.');
        setTimeout(() => {
          navigate('/success');
        }, 1000);
      } catch (err: any) {
        setErrors({ general: err.message || 'Registration failed.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Forgot Password Submit Handler
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    
    let ok = true;
    if (forgotMethod === 'email') {
      if (!forgotInput) { setForgotError('Email address is required.'); ok = false; }
      else if (!gmailRe.test(forgotInput)) { setForgotError('Invalid email. Must be @gmail.com'); ok = false; }
    } else {
      if (!forgotInput) { setForgotError('Mobile number is required.'); ok = false; }
      else if (!mobileRe.test(forgotInput)) { setForgotError('Invalid mobile. Must be 10 digits'); ok = false; }
    }

    if (!ok) return;

    setForgotSubmitting(true);
    try {
      await new Promise(res => setTimeout(res, 1500));
      alert(`✓ Password reset link has been successfully transmitted to ${forgotInput}`);
      setShowForgotModal(false);
      setForgotInput('');
    } catch (_) {
      setForgotError('Failed to send reset link.');
    } finally {
      setForgotSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative py-12">
      {/* Dynamic Purple/Indigo glow behind card */}
      <div className="absolute w-[600px] h-[400px] bg-primary/10 rounded-full filter blur-[70px] pointer-events-none transform translate-y-[-50px]" />
      
      <div className="w-full max-w-lg google-card rounded-3xl p-8 shadow-elevation2 transform hover:-translate-y-1 transition-all duration-300 relative z-10">
        
        {/* Toggle tabs */}
        <div className="flex bg-slate-50 rounded-2xl p-1.5 border border-slate-200 mb-8">
          <button 
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 text-center py-2.5 font-bold rounded-xl text-sm transition-all ${
              activeTab === 'login' ? 'bg-primary text-white shadow-sm' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => handleTabSwitch('register')}
            className={`flex-1 text-center py-2.5 font-bold rounded-xl text-sm transition-all ${
              activeTab === 'register' ? 'bg-primary text-white shadow-sm' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Brand visual header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-textPrimary flex items-center justify-center space-x-2">
            <span>🎓</span>
            <span>{activeTab === 'login' ? 'Welcome Back' : 'Get 200 Free Tokens'}</span>
          </h2>
          <p className="text-textSecondary text-xs mt-1">
            {activeTab === 'login' 
              ? 'Access your dashboard, chat inbox, and token ledger' 
              : 'Join the premier open learning skill exchange community'
            }
          </p>
        </div>

        {/* Global error / success message */}
        {errors.general && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-xs mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs mb-6">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* REGISTER: Name input */}
          {activeTab === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-textTertiary" />
                <input 
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-bg border ${errors.name ? 'border-red-500' : 'border-primary/10 focus:border-primary/50'} text-sm text-textPrimary rounded-2xl pl-12 pr-4 py-3 focus:outline-none transition-colors`}
                />
              </div>
              {errors.name && <span className="text-[10px] text-red-400 font-semibold">{errors.name}</span>}
            </div>
          )}

          {/* Form Method selectors */}
          {activeTab === 'login' ? (
            <div className="flex space-x-2 text-[10px] sm:text-xs font-bold">
              <button 
                type="button" 
                onClick={() => { setLoginMethod('email'); setErrors({}); }}
                className={`px-3 py-1 rounded-full border transition-all ${
                  loginMethod === 'email' ? 'bg-primary/20 border-primary text-primary-light' : 'bg-transparent border-primary/10 text-textSecondary'
                }`}
              >
                Gmail Link
              </button>
              <button 
                type="button" 
                onClick={() => { setLoginMethod('mobile'); setErrors({}); }}
                className={`px-3 py-1 rounded-full border transition-all ${
                  loginMethod === 'mobile' ? 'bg-primary/20 border-primary text-primary-light' : 'bg-transparent border-primary/10 text-textSecondary'
                }`}
              >
                Mobile Verification
              </button>
              <button 
                type="button" 
                onClick={() => { setLoginMethod('username'); setErrors({}); }}
                className={`px-3 py-1 rounded-full border transition-all ${
                  loginMethod === 'username' ? 'bg-primary/20 border-primary text-primary-light' : 'bg-transparent border-primary/10 text-textSecondary'
                }`}
              >
                Admin Username
              </button>
            </div>
          ) : (
            <div className="flex space-x-2 text-xs font-bold">
              <button 
                type="button" 
                onClick={() => { setRegisterMethod('email'); setErrors({}); }}
                className={`px-3 py-1 rounded-full border transition-all ${
                  registerMethod === 'email' ? 'bg-primary/20 border-primary text-primary-light' : 'bg-transparent border-primary/10 text-textSecondary'
                }`}
              >
                Gmail Setup
              </button>
              <button 
                type="button" 
                onClick={() => { setRegisterMethod('mobile'); setErrors({}); }}
                className={`px-3 py-1 rounded-full border transition-all ${
                  registerMethod === 'mobile' ? 'bg-primary/20 border-primary text-primary-light' : 'bg-transparent border-primary/10 text-textSecondary'
                }`}
              >
                Mobile Setup
              </button>
            </div>
          )}

          {/* Dynamic input (Email / Mobile / Username) */}
          {((activeTab === 'login' && loginMethod === 'email') || (activeTab === 'register' && registerMethod === 'email')) && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Gmail Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-textTertiary" />
                <input 
                  type="text"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-bg border ${errors.email ? 'border-red-500 font-medium' : 'border-primary/10 focus:border-primary/50'} text-sm text-textPrimary rounded-2xl pl-12 pr-4 py-3 focus:outline-none transition-colors`}
                />
              </div>
              {errors.email && <span className="text-[10px] text-red-400 font-semibold">{errors.email}</span>}
            </div>
          )}

          {((activeTab === 'login' && loginMethod === 'mobile') || (activeTab === 'register' && registerMethod === 'mobile')) && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">10-Digit Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-4 h-4 text-textTertiary" />
                <input 
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className={`w-full bg-bg border ${errors.mobile ? 'border-red-500' : 'border-primary/10 focus:border-primary/50'} text-sm text-textPrimary rounded-2xl pl-12 pr-4 py-3 focus:outline-none transition-colors`}
                />
              </div>
              {errors.mobile && <span className="text-[10px] text-red-400 font-semibold">{errors.mobile}</span>}
            </div>
          )}

          {activeTab === 'login' && loginMethod === 'username' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-textTertiary" />
                <input 
                  type="text"
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full bg-bg border ${errors.username ? 'border-red-500' : 'border-primary/10 focus:border-primary/50'} text-sm text-textPrimary rounded-2xl pl-12 pr-4 py-3 focus:outline-none transition-colors`}
                />
              </div>
              {errors.username && <span className="text-[10px] text-red-400 font-semibold">{errors.username}</span>}
            </div>
          )}

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Password</label>
              {activeTab === 'login' && (
                <button 
                  type="button" 
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] font-bold text-primary-light hover:underline focus:outline-none"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-textTertiary" />
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (activeTab === 'register') checkPasswordStrength(e.target.value);
                }}
                className={`w-full bg-bg border ${errors.password ? 'border-red-500 font-medium' : 'border-primary/10 focus:border-primary/50'} text-sm text-textPrimary rounded-2xl pl-12 pr-12 py-3 focus:outline-none transition-colors`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-textSecondary hover:text-textPrimary focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <span className="text-[10px] text-red-400 font-semibold">{errors.password}</span>}

            {/* REGISTER: Password Strength Meter & Requirement Tracker */}
            {activeTab === 'register' && password && (
              <div className="space-y-3 pt-1">
                {/* Bar */}
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-textSecondary">Strength:</span>
                  <span style={{color: pwdStrength.score >= 4 ? '#34d399' : pwdStrength.score >= 2 ? '#fb923c' : '#f87171'}}>
                    {pwdStrength.text}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden border border-primary/5">
                  <div className={`h-full ${pwdStrength.color} transition-all duration-300`} style={{width: pwdStrength.width}} />
                </div>

                {/* Requirement list */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-primary/5 pt-3">
                  <div className="flex items-center text-[10px] font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${pwdRequirements.len ? 'bg-accent' : 'bg-textTertiary'}`} />
                    <span className={pwdRequirements.len ? 'text-accent' : 'text-textSecondary'}>8+ Characters</span>
                  </div>
                  <div className="flex items-center text-[10px] font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${pwdRequirements.upper ? 'bg-accent' : 'bg-textTertiary'}`} />
                    <span className={pwdRequirements.upper ? 'text-accent' : 'text-textSecondary'}>1 Uppercase Letter</span>
                  </div>
                  <div className="flex items-center text-[10px] font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${pwdRequirements.lower ? 'bg-accent' : 'bg-textTertiary'}`} />
                    <span className={pwdRequirements.lower ? 'text-accent' : 'text-textSecondary'}>1 Lowercase Letter</span>
                  </div>
                  <div className="flex items-center text-[10px] font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${pwdRequirements.num ? 'bg-accent' : 'bg-textTertiary'}`} />
                    <span className={pwdRequirements.num ? 'text-accent' : 'text-textSecondary'}>1 Number</span>
                  </div>
                  <div className="flex items-center text-[10px] font-medium col-span-2">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${pwdRequirements.spec ? 'bg-accent' : 'bg-textTertiary'}`} />
                    <span className={pwdRequirements.spec ? 'text-accent' : 'text-textSecondary'}>1 Special Character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* REGISTER: Confirm password field */}
          {activeTab === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-textTertiary" />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-bg border ${errors.confirmPassword ? 'border-red-500' : 'border-primary/10 focus:border-primary/50'} text-sm text-textPrimary rounded-2xl pl-12 pr-12 py-3 focus:outline-none transition-colors`}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-textSecondary hover:text-textPrimary focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-[10px] text-red-400 font-semibold">{errors.confirmPassword}</span>}
            </div>
          )}

          {/* LOGIN: Remember me */}
          {activeTab === 'login' && (
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="l-remember"
                className="w-4 h-4 accent-primary bg-bg border-primary/10 rounded cursor-pointer"
              />
              <label htmlFor="l-remember" className="ml-2 text-xs font-medium text-textSecondary cursor-pointer select-none">
                Remember this browser credentials
              </label>
            </div>
          )}

          {/* REGISTER: Terms & newsletter checkbox */}
          {activeTab === 'register' && (
            <div className="space-y-2">
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="r-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 accent-primary bg-bg border-primary/10 rounded mt-0.5 cursor-pointer"
                />
                <label htmlFor="r-terms" className="ml-2 text-xs font-medium text-textSecondary cursor-pointer select-none">
                  I agree to the <span className="text-primary-light hover:underline">Terms of Service</span> and <span className="text-primary-light hover:underline">Privacy Policy</span>
                </label>
              </div>
              {errors.terms && <div className="text-[10px] text-red-400 font-semibold">{errors.terms}</div>}

              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="r-news"
                  defaultChecked
                  className="w-4 h-4 accent-primary bg-bg border-primary/10 rounded mt-0.5 cursor-pointer"
                />
                <label htmlFor="r-news" className="ml-2 text-xs font-medium text-textSecondary cursor-pointer select-none">
                  Subscribe to the weekly SkillxPro learning newsletter
                </label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center google-btn-primary font-bold py-3.5 px-4 rounded-full active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <span className="animate-spin text-sm">⟳</span>
                <span>Processing...</span>
              </span>
            ) : (
              <span>{activeTab === 'login' ? 'Sign In' : 'Claim Your 200 Tokens'}</span>
            )}
          </button>
        </form>

        {/* Simulated Social Logins */}
        <div className="mt-8 pt-6 border-t border-primary/10 text-center">
          <span className="text-[10px] uppercase font-black text-textTertiary tracking-widest block mb-4">Or Connect Via</span>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => alert('Connecting Google credentials OAuth simulation...')}
              className="flex items-center justify-center space-x-2 bg-bg border border-primary/10 hover:border-primary/20 text-xs font-semibold py-2.5 px-4 rounded-xl text-textSecondary hover:text-textPrimary transition-all"
            >
              <span>🌐</span>
              <span>Google</span>
            </button>
            <button 
              onClick={() => alert('Connecting GitHub credentials OAuth simulation...')}
              className="flex items-center justify-center space-x-2 bg-bg border border-primary/10 hover:border-primary/20 text-xs font-semibold py-2.5 px-4 rounded-xl text-textSecondary hover:text-textPrimary transition-all"
            >
              <span>🐙</span>
              <span>GitHub</span>
            </button>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal Overlay */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-bg2 border border-primary/20 rounded-3xl p-6 shadow-glass animate-fade-in relative">
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 text-textSecondary hover:text-textPrimary text-sm font-bold focus:outline-none"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-textPrimary mb-2">Request Password Reset</h3>
            <p className="text-xs text-textSecondary mb-4">
              Enter your credential below to receive a magic recovery access link.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="flex space-x-2 text-[10px] font-bold">
                <button 
                  type="button" 
                  onClick={() => { setForgotMethod('email'); setForgotError(''); }}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    forgotMethod === 'email' ? 'bg-primary/20 border-primary text-primary-light' : 'bg-transparent border-primary/10 text-textSecondary'
                  }`}
                >
                  Email
                </button>
                <button 
                  type="button" 
                  onClick={() => { setForgotMethod('mobile'); setForgotError(''); }}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    forgotMethod === 'mobile' ? 'bg-primary/20 border-primary text-primary-light' : 'bg-transparent border-primary/10 text-textSecondary'
                  }`}
                >
                  Mobile Number
                </button>
              </div>

              <div className="relative">
                {forgotMethod === 'email' ? (
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-textTertiary" />
                ) : (
                  <Phone className="absolute left-4 top-3.5 w-4 h-4 text-textTertiary" />
                )}
                <input 
                  type="text"
                  placeholder={forgotMethod === 'email' ? 'name@gmail.com' : '9876543210'}
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  className="w-full bg-bg border border-primary/10 focus:border-primary/50 text-sm text-textPrimary rounded-2xl pl-12 pr-4 py-3 focus:outline-none"
                />
              </div>
              {forgotError && <span className="text-[10px] text-red-400 font-semibold">{forgotError}</span>}

              <button 
                type="submit"
                disabled={forgotSubmitting}
                className="w-full flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-2xl"
              >
                {forgotSubmitting ? 'Sending link...' : 'Send Recovery Link'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
