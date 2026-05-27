import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, BookOpen, Users, Compass, ShieldCheck, HelpCircle, Star, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  const { user, allUsers, skills, schedules } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 4000); // smooth flip every 4 seconds
    return () => clearInterval(timer);
  }, []);

  // Derive stats dynamically from context to clean up dummy data
  const stats = [
    { value: `${skills.length || 6}`, label: 'Skills Available', icon: BookOpen, colorClass: 'text-primary' },
    { value: `${allUsers.length || 3}`, label: 'Active Swappers', icon: Users, colorClass: 'text-accent' },
    { value: `${schedules.filter(s => s.status === 'completed').length || 0}`, label: 'Completed Sessions', icon: Compass, colorClass: 'text-warning-dark' },
    { value: '99%', label: 'Success Rate', icon: ShieldCheck, colorClass: 'text-danger' },
  ];

  // Dynamically feed first two listing skills to the hero showcase card
  const featuredSkill1 = skills[1] || { name: 'React & TypeScript Mastery', teacher: 'David Chen' };
  const featuredSkill2 = skills[0] || { name: 'UI/UX Design with Figma', teacher: 'Sarah Jenkins' };

  const steps = [
    { step: '01', title: 'Create a Profile', desc: 'Register your skills to teach and things you want to learn. Get 200 welcome tokens instantly.' },
    { step: '02', title: 'Earn Tokens by Teaching', desc: 'Publish skills, host a session for others, and receive tokens directly to your ledger.' },
    { step: '03', title: 'Unlock Free Classes', desc: 'Spend your earned tokens to join expert classes in design, coding, writing, and business.' },
  ];

  const skillsList = [
    'React & Web Development', 'Figma UI/UX Design', 'Python & Data Science', 
    'Creative Writing', 'Public Speaking', 'Digital Marketing', 
    'Music Theory & Piano', 'French & Spanish', 'Financial Modeling', 
    'Agile Scrum Methodology', 'Video Editing & VFX', 'Photography Masterclass'
  ];

  const reviews = [
    { name: 'Marcus Aurelius', role: 'Business Strategist', review: 'SkillxPro allowed me to learn React in exchange for offering lessons in Agile development. The token system makes the exchange completely fair and rewarding.', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { name: 'Sarah Jenkins', role: 'UI Designer', review: 'I loved the clean layout right away. Direct Messaging made scheduling so easy! I taught 3 students Figma and used my tokens to learn French.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { name: 'David Chen', role: 'Full Stack Dev', review: 'The dynamic token ledger and admin dashboard are highly secure and engaging. An incredible tool to foster real collaborative learning without monetary stress.', rating: 5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  ];

  const faqs = [
    { q: 'How does the token system work?', a: 'Every new user gets a welcome bonus (200 tokens). Teaching a class awards you tokens paid by the student. You can use these tokens to enroll in classes taught by other experts. It is a completely self-sustaining economy!' },
    { q: 'Are there any hidden fees?', a: 'No! SkillxPro is 100% free and open-source. There are no registration costs, subscription plans, or hidden microtransactions.' },
    { q: 'What topics can I teach or learn?', a: 'You can teach anything you are skilled at! From programming languages and design tools to creative writing, languages, music, and business management.' },
    { q: 'How do I schedule a class?', a: 'Once you find a skill you like in the marketplace, you can click to Message the teacher. Direct messaging allows you to align on a time. Once agreed, the teacher schedules the class, and tokens are safely escrowed.' },
    { q: 'Is this project open-source?', a: 'Yes! SkillxPro is an open-source project. Anyone can inspect the code, add new features, and submit pull requests following our community contributor guidelines.' },
  ];

  return (
    <div className="space-y-28 pb-20 overflow-hidden bg-bg">
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 z-10">
          
          {/* Google styled micro badge */}
          <div className="inline-flex items-center space-x-3 bg-white/80 hover:bg-white border border-slate-200/80 backdrop-blur-md rounded-full pl-2.5 pr-4 py-1.5 text-xs sm:text-sm font-bold shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 select-none">
            <span className="bg-gradient-to-r from-primary to-accent text-white text-[9px] uppercase tracking-wider font-black px-2.5 py-1 rounded-full shadow-sm animate-pulse shrink-0">
              NEW
            </span>
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-warning-dark shrink-0 animate-spin-slow" />
              <span className="bg-gradient-to-r from-textPrimary via-primary to-accent bg-clip-text text-transparent tracking-wide font-black">
                Next-Gen Peer-to-Peer Exchange
              </span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-textPrimary">
            Master New Skills <br />
            <span className="text-primary">via Direct Exchange.</span>
          </h1>

          <p className="text-textSecondary text-base sm:text-lg max-w-2xl leading-relaxed">
            Join the world's first zero-cost skill economy. Trade your expertise for the knowledge you need, directly with professionals worldwide. No fees, just growth.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full">
            {user ? (
              <Link 
                to="/dashboard" 
                className="google-btn-primary w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 space-x-2 active:scale-95 transition-transform"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/login?tab=register" 
                  className="google-btn-primary w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 space-x-2 active:scale-95 transition-transform"
                >
                  <span>Start Swapping</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/login" 
                  className="google-btn-outline w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 active:scale-95 transition-transform"
                >
                  <span>Explore Ledger</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* High-Fidelity Google Developers Inspired Mock Product Showcase */}
        <div className="flex-1 w-full max-w-xl h-[420px] relative hidden lg:block">
          <div className="absolute inset-0 flex items-center justify-center">
            
            {/* Unified relative container to pin floating panels to the main card boundaries */}
            <div className="relative w-[430px] h-[320px]">
              {/* Elevated White Material 3 Card */}
              <div className="google-card w-full h-full p-6 relative overflow-hidden shadow-elevation2 z-20 flex flex-col justify-between hover:shadow-elevation3 hover:scale-101 transition-all duration-300">
                
                {/* Header inside Card */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-textPrimary font-bold">{featuredSkill1.name}</div>
                      <div className="text-[10px] text-textSecondary font-medium">Instructor: @{featuredSkill1.teacher.toLowerCase().replace(/\s+/g, '_')}</div>
                    </div>
                  </div>
                  <div className="google-badge-green text-xs px-3 py-1 rounded-full font-bold">Active Match</div>
                </div>

                {/* Progress Tracker bar */}
                <div className="space-y-2">
                  <div className="h-2.5 bg-slate-100 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-bar-fill" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-textSecondary font-bold">
                    <span>Exchange Progress</span>
                    <span className="text-primary">65% Completed</span>
                  </div>
                </div>

                {/* Surface Overlay Category Block */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs text-textPrimary font-bold">{featuredSkill2.name}</div>
                    <div className="text-[10px] text-textSecondary font-medium">Requested in return from @{featuredSkill2.teacher.toLowerCase().replace(/\s+/g, '_')}</div>
                  </div>
                </div>
              </div>

              {/* Premium 3D Animated Flip Card (Alternates content on interval with zero overlapping) */}
              <div className="absolute -bottom-8 -right-12 w-52 h-28 z-30 flip-card-container animate-google-float-1 select-none">
                <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
                  
                  {/* Front Side: Network Value */}
                  <div className="flip-card-front google-card p-5 flex flex-col justify-center border-l-4 border-l-primary bg-white shadow-elevation2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-textSecondary uppercase tracking-wider font-bold">Total Network Value</span>
                      <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                    </div>
                    <div className="text-2xl text-textPrimary font-black tracking-tight">$12,450</div>
                    <div className="text-[9px] text-success font-semibold mt-0.5">▲ +18.4% this week</div>
                  </div>

                  {/* Back Side: Network Speed */}
                  <div className="flip-card-back google-card p-5 flex flex-col justify-between border-l-4 border-l-accent bg-white shadow-elevation2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-textSecondary uppercase tracking-wider font-bold">Exchange Speed</span>
                      <span className="material-symbols-outlined text-accent text-sm">bolt</span>
                    </div>
                    <div className="flex items-end gap-1.5 h-10 mt-1">
                      <div className="w-1/5 bg-slate-100 h-[40%] rounded-t"></div>
                      <div className="w-1/5 bg-slate-100 h-[70%] rounded-t"></div>
                      <div className="w-1/5 bg-accent h-[100%] rounded-t"></div>
                      <div className="w-1/5 bg-accent/60 h-[85%] rounded-t"></div>
                      <div className="w-1/5 bg-accent/40 h-[60%] rounded-t"></div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-bg2 border-y border-slate-200 py-16 relative z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="google-card p-6 rounded-3xl flex flex-col items-center text-center space-y-2 hover:shadow-elevation2 transition-all">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-1">
                  <stat.icon className={`w-6 h-6 ${stat.colorClass}`} />
                </div>
                <span className="text-3xl md:text-4xl font-extrabold text-textPrimary tracking-tight">{stat.value}</span>
                <span className="text-textSecondary text-xs uppercase tracking-wider font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Feature Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Designed for High-Performance Learning</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Everything you need to manage your skill portfolio in one seamless environment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px]">
          
          {/* Zero Cost Exchanges (Large) */}
          <div className="bento-card md:col-span-8 p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 p-3 bg-surface-container-lowest rounded-xl shadow-sm inline-block">handshake</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Zero Cost Exchanges</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">Access premium knowledge without the premium price tag. Our pure barter system ensures equitable value exchange based on time and expertise.</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary rounded-full opacity-5 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          </div>

          {/* Dynamic Ledgers */}
          <div className="bento-card md:col-span-4 p-6 flex flex-col justify-between border-t-4 border-accent">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-title-lg text-title-lg text-on-surface">Dynamic Ledgers</h3>
                <span className="material-symbols-outlined text-accent">receipt_long</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4">Track every hour given and received with immutable precision.</p>
            </div>
            {/* Mock transactions mini */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-xl">
                <span className="font-label-md text-label-md text-on-surface">+2 Hrs (Python)</span>
                <span className="material-symbols-outlined text-accent text-sm">arrow_upward</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-xl">
                <span className="font-label-md text-label-md text-on-surface">-1 Hr (Figma)</span>
                <span className="material-symbols-outlined text-danger text-sm">arrow_downward</span>
              </div>
            </div>
          </div>

          {/* Schedules */}
          <div className="bento-card md:col-span-4 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-title-lg text-title-lg text-on-surface">Schedules</h3>
                <span className="material-symbols-outlined text-primary">calendar_month</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">Automated time-zone alignment.</p>
            </div>
            <div className="grid grid-cols-7 gap-1 mt-4">
              <div className="aspect-square bg-surface-container rounded-lg text-center text-[10px] text-outline flex items-center justify-center">M</div>
              <div className="aspect-square bg-surface-container rounded-lg text-center text-[10px] text-outline flex items-center justify-center">T</div>
              <div className="aspect-square bg-surface-container rounded-lg text-center text-[10px] text-outline flex items-center justify-center">W</div>
              <div className="aspect-square bg-surface-container rounded-lg text-center text-[10px] text-outline flex items-center justify-center">T</div>
              <div className="aspect-square bg-surface-container rounded-lg text-center text-[10px] text-outline flex items-center justify-center">F</div>
              <div className="aspect-square bg-surface-container rounded-lg text-center text-[10px] text-outline flex items-center justify-center">S</div>
              <div className="aspect-square bg-surface-container rounded-lg text-center text-[10px] text-outline flex items-center justify-center">S</div>
              <div className="aspect-square bg-surface-container-low rounded-lg"></div>
              <div className="aspect-square bg-surface-container-low rounded-lg"></div>
              <div className="aspect-square bg-primary text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-sm">14</div>
              <div className="aspect-square bg-surface-container-low rounded-lg"></div>
              <div className="aspect-square bg-surface-container-low rounded-lg"></div>
              <div className="aspect-square bg-accent text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-sm">17</div>
              <div className="aspect-square bg-surface-container-low rounded-lg"></div>
            </div>
          </div>

          {/* Encrypted Comms */}
          <div className="bento-card md:col-span-4 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-title-lg text-title-lg text-on-surface">Encrypted Comms</h3>
                <span className="material-symbols-outlined text-warning-dark">shield_lock</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">End-to-end encrypted messaging and video infrastructure.</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant">
              <div className="w-8 h-8 rounded-full bg-warning/20 text-warning-dark flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm">lock</span>
              </div>
              <div className="flex-grow">
                <div className="h-2 bg-outline-variant rounded-lg w-3/4 mb-2"></div>
                <div className="h-2 bg-outline-variant rounded-lg w-1/2"></div>
              </div>
            </div>
          </div>

          {/* Command Deck */}
          <div className="bento-card md:col-span-4 p-6 flex flex-col justify-between border-t-4 border-danger">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-title-lg text-title-lg text-on-surface">Command Deck</h3>
                <span className="material-symbols-outlined text-danger">dashboard</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">Your centralized hub for active requests, matching analytics, and portfolio management.</p>
            </div>
            <div className="flex gap-2">
              <div className="h-12 flex-1 bg-surface-container rounded-lg border border-outline-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-textSecondary">bar_chart</span>
              </div>
              <div className="h-12 flex-1 bg-surface-container rounded-lg border border-outline-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-textSecondary">pie_chart</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How it Works */}
      <section className="bg-bg2 border-y border-slate-200 py-20 relative overflow-hidden shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-textPrimary">How Skill Exchange Works</h2>
            <p className="text-textSecondary text-base sm:text-lg max-w-2xl mx-auto">
              Follow our simple, zero-financial-friction system to start sharing your talent today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative google-card google-card-hover rounded-3xl p-8 flex flex-col space-y-4">
                <span className="absolute top-4 right-6 text-5xl font-black text-slate-100 select-none">{step.step}</span>
                <h3 className="text-xl font-bold text-textPrimary">{step.title}</h3>
                <p className="text-textSecondary text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-textPrimary">Popular Categories</h2>
          <p className="text-textSecondary text-sm sm:text-base">Exchange tokens in these highly sought-after skills and fields.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {skillsList.map((skill, idx) => (
            <span 
              key={idx} 
              className="bg-bg2 border border-slate-200 hover:border-primary text-textPrimary hover:text-primary text-xs sm:text-sm font-semibold rounded-full px-5 py-2.5 cursor-pointer transition-all hover:scale-105 shadow-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-textPrimary">Trusted by Knowledge Swappers</h2>
          <p className="text-textSecondary text-base sm:text-lg">Read about the learning transformations happening on our platform every day.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div key={idx} className="google-card google-card-hover rounded-3xl p-6 flex flex-col justify-between shadow-elevation1">
              <div className="space-y-4">
                <div className="flex text-warning">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-textSecondary text-sm italic leading-relaxed">"{rev.review}"</p>
              </div>

              <div className="flex items-center space-x-3 pt-6 mt-6 border-t border-slate-100">
                <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full border border-slate-100" />
                <div>
                  <h4 className="text-sm font-bold text-textPrimary">{rev.name}</h4>
                  <p className="text-xs text-textSecondary">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expandable FAQs Accordion */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <HelpCircle className="w-10 h-10 text-primary mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-black text-textPrimary">Frequently Asked Questions</h2>
          <p className="text-textSecondary text-sm sm:text-base">Everything you need to know about SkillxPro.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="google-card rounded-3xl overflow-hidden transition-all"
              >
                <button 
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between font-bold text-textPrimary text-sm sm:text-base hover:text-primary transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className={`text-sm transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary font-black' : 'text-textSecondary'}`}>
                    ▼
                  </span>
                </button>
                
                <div 
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-48 border-t border-slate-100 p-6 bg-slate-50' : 'max-h-0'
                  }`}
                >
                  <p className="text-textSecondary text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 sm:p-12 shadow-elevation2 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Ready to Share Your Skills?
          </h2>
          
          <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto">
            Register your account today and unlock a borderless marketplace of skilled teaching exchanges instantly.
          </p>

          <div className="pt-4">
            {user ? (
              <Link 
                to="/dashboard" 
                className="inline-flex bg-white hover:bg-slate-50 text-primary font-bold px-8 py-4 rounded-full transition-all shadow-md active:scale-95 transform"
              >
                Enter the Dashboard
              </Link>
            ) : (
              <Link 
                to="/login?tab=register" 
                className="inline-flex bg-white hover:bg-slate-50 text-primary font-bold px-8 py-4 rounded-full transition-all shadow-md active:scale-95 transform"
              >
                Get 200 Welcome Tokens
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
