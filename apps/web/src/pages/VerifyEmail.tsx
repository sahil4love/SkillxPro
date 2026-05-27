import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, AlertCircle, RefreshCw } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    // Keep only the last character
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const code = otp.join('');
    if (code.length < 6) {
      setError('Please fill in all 6 OTP digits.');
      return;
    }

    setIsVerifying(true);
    try {
      await new Promise((res) => setTimeout(res, 1200));

      // Accept 123456 as standard mockup key
      if (code === '123456' || code.startsWith('12')) {
        updateUser({ isPendingOTP: false });
        setSuccess('✓ Email Address Verified Successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError('Incorrect verification key. Try entering default: 123456');
      }
    } catch (_) {
      setError('An error occurred during verification.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    setResendTimer(30);
    alert('✓ Simulated OTP Code resent to: ' + (user?.identifier || 'your device'));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative py-12">
      <div className="absolute w-[400px] h-[400px] bg-primary/10 rounded-full filter blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md google-card rounded-3xl p-8 shadow-elevation2 animate-fade-in space-y-6 relative z-10 text-center">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex p-3 bg-primary/10 border border-primary/20 rounded-full text-primary">
            <Mail className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-textPrimary">Verify Your Account</h2>
          <p className="text-textSecondary text-xs leading-relaxed max-w-sm mx-auto">
            We have dispatched a simulated 6-digit confirmation key to:<br />
            <span className="font-bold text-textPrimary">{user?.identifier}</span>
          </p>
        </div>

        {/* Messaging Box */}
        {error && (
          <div className="flex items-center justify-center space-x-2 bg-red-50 border border-red/30 text-danger p-3.5 rounded-2xl text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center justify-center space-x-2 bg-emerald-50 border border-accent/30 text-accent-dark p-3.5 rounded-2xl text-xs font-bold">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          {/* Box grids */}
          <div className="flex justify-between max-w-xs mx-auto gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  if (el) inputRefs.current[idx] = el;
                }}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-12 text-center bg-bg border border-slate-200 text-textPrimary text-lg font-bold rounded-xl focus:border-primary focus:google-focus focus:outline-none transition-all shadow-inner"
              />
            ))}
          </div>

          <div className="text-[10px] text-textSecondary font-semibold">
            Hint: Enter standard mockup code <span className="text-accent-dark font-bold">123456</span> to complete instantly.
          </div>

          {/* Verify button */}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full flex items-center justify-center google-btn-primary font-bold py-3 px-4 rounded-full active:scale-95 disabled:opacity-50"
          >
            {isVerifying ? (
              <span className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </span>
            ) : (
              <span>Confirm Verification Code</span>
            )}
          </button>
        </form>

        {/* Resend Action */}
        <div className="pt-4 border-t border-primary/10 text-xs text-textSecondary font-semibold flex items-center justify-center">
          {resendTimer > 0 ? (
            <span>Resend code in <span className="text-primary-light font-bold">{resendTimer}s</span></span>
          ) : (
            <button
              onClick={handleResend}
              className="text-primary-light hover:underline hover:text-primary transition-colors font-bold focus:outline-none"
            >
              Resend OTP Code
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
