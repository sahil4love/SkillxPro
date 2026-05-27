import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, CheckCircle, ArrowRight } from 'lucide-react';

export const Success: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/verify-email');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative py-12">
      {/* Background glow effects */}
      <div className="absolute w-[500px] h-[500px] bg-accent/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-primary/10 rounded-full filter blur-[70px] pointer-events-none transform -translate-y-20" />

      <div className="w-full max-w-md google-card rounded-3xl p-8 text-center shadow-elevation2 animate-fade-in relative z-10 space-y-6">
        
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="p-4 bg-accent/15 border border-accent/20 rounded-full animate-bounce">
            <CheckCircle className="w-12 h-12 text-accent" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-textPrimary">Success!</h2>
          <p className="text-textSecondary text-sm">Your collaborative learning profile is active.</p>
        </div>

        {/* Reward Card */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 shadow-glow max-w-xs mx-auto space-y-3">
          <div className="flex justify-center text-yellow-400">
            <Coins className="w-10 h-10 fill-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-white">+200 Tokens</span>
            <p className="text-[10px] text-primary-light uppercase tracking-wider font-bold">Welcome Gift Escrowed</p>
          </div>
        </div>

        {/* Info */}
        <p className="text-textSecondary text-xs leading-relaxed max-w-sm mx-auto">
          We have safely allocated your initial balance. You will now be redirected to the secure verification checkpoint.
        </p>

        {/* Redirect timer */}
        <div className="pt-4 border-t border-primary/10 flex flex-col items-center justify-center space-y-3">
          <span className="text-xs text-textSecondary font-semibold">
            Redirecting in <span className="text-primary-light font-bold text-sm">{countdown}</span> seconds...
          </span>
          <button
            onClick={() => navigate('/verify-email')}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary-light hover:text-primary transition-colors focus:outline-none"
          >
            <span>Skip and verify now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
