import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, Rocket, ShieldCheck, Zap, 
  Layers, Laptop, Code, Briefcase, GitCommit, 
  Users, Trophy, Calendar, Award, ArrowLeft, 
  Sun, Moon, Search, X, Check, Clock, ExternalLink, 
  Github, Linkedin, Building2, ChevronRight, FolderOpen, Sparkles, Compass,
  Activity, BarChart3, Star, Share2, Copy, Eye, SlidersHorizontal, ChevronDown, CheckCircle2,
  FileText, Globe, Heart, MessageSquare, Send, Mail, MapPin, Menu, ArrowUpRight
} from 'lucide-react';
import { JOURNEY_DATA } from './data/journeyData.js';

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme') || localStorage.getItem('gkm_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const [activePhaseId, setActivePhaseId] = useState('year-1');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [activeSkillTab, setActiveSkillTab] = useState('year-3');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [starredIds, setStarredIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gkm_starred_milestones')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      html.classList.add('dark', 'dark-theme');
      body.classList.add('dark', 'dark-theme');
    } else {
      html.classList.remove('dark', 'dark-theme');
      body.classList.remove('dark', 'dark-theme');
    }
    try {
      localStorage.setItem('portfolio-theme', theme);
      localStorage.setItem('gkm_theme', theme);
    } catch (e) {}
  }, [theme]);

  // Synchronize cross-tab and cross-page theme changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'portfolio-theme' || e.key === 'gkm_theme') {
        if (e.newValue === 'dark' || e.newValue === 'light') {
          setTheme(e.newValue);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('gkm_starred_milestones', JSON.stringify(starredIds));
  }, [starredIds]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleStar = (mId, e) => {
    e.stopPropagation();
    setStarredIds(prev => 
      prev.includes(mId) ? prev.filter(id => id !== mId) : [...prev, mId]
    );
  };

  const handleCopyLink = (mId, e) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${mId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(mId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const popularTags = [
    "AIT Bangkok", "UP Police", "MediaWiki", "AKTU Rank 5", 
    "PrayagrajRooms", "GFG VP", "Google Cloud", "Anthropic"
  ];

  const activePhase = useMemo(() => {
    return JOURNEY_DATA.phases.find(p => p.id === activePhaseId) || JOURNEY_DATA.phases[1];
  }, [activePhaseId]);

  const activePhaseMilestones = useMemo(() => {
    if (!JOURNEY_DATA || !JOURNEY_DATA.milestones) return [];
    return JOURNEY_DATA.milestones.filter(m => {
      if (m.phaseId !== activePhaseId) return false;
      if (selectedCategory === 'starred') {
        if (!starredIds.includes(m.id)) return false;
      } else if (selectedCategory !== 'all' && m.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchDesc = m.shortDescription.toLowerCase().includes(q);
        const matchOrg = m.organization.toLowerCase().includes(q);
        const matchSkills = m.skills.some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchOrg && !matchSkills) return false;
      }
      return true;
    });
  }, [activePhaseId, selectedCategory, searchQuery, starredIds]);

  const semesterBoxes = useMemo(() => {
    if (!activePhase || !activePhase.semesters) return [];
    return activePhase.semesters.map(sem => {
      const items = activePhaseMilestones.filter(m => m.semesterId === sem.id);
      return {
        ...sem,
        items
      };
    });
  }, [activePhase, activePhaseMilestones]);

  const statsCounter = useMemo(() => {
    return [
      { label: "Merged Wikimedia Patches", val: "15+", sub: "MediaWiki Core & Gerrit", icon: GitCommit, color: "text-blue-500" },
      { label: "Conference Participants", val: "650+", sub: "Gemini & GFG Student Leader", icon: Users, color: "text-purple-500" },
      { label: "International & Cyber Fellowships", val: "2", sub: "AIT Bangkok & UP Police", icon: Award, color: "text-emerald-500" },
      { label: "Academic Standing", val: "Rank 1", sub: "Branch Topper & AKTU Rank 5", icon: Trophy, color: "text-amber-500" }
    ];
  }, []);

  const renderIcon = (iconName, className = "w-4 h-4") => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'Rocket': return <Rocket className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Laptop': return <Laptop className={className} />;
      case 'Code': return <Code className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'GitCommit': return <GitCommit className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      case 'Calendar': return <Calendar className={className} />;
      case 'Award': return <Award className={className} />;
      default: return <Code className={className} />;
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 relative overflow-x-hidden">
      
      {/* 1. ULTRA-PREMIUM UNIFIED HEADER NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-md py-3' 
          : 'bg-white/75 dark:bg-slate-950/75 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-800/60 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo & Identifier */}
          <a href="index.html" className="flex items-center gap-3 group text-decoration-none">
            <img src="assets/images/profile/Gautam_Kumar_Maurya.jpg" alt="Gautam Kumar Maurya Logo" className="w-10 h-10 rounded-xl object-cover border-2 border-blue-600 shadow-md group-hover:scale-105 transition-transform duration-200" />
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <span>Gautam K. Maurya</span>
                <span className="text-blue-500 text-xs">✓</span>
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">@gkm563</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="index.html" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portfolio</span>
            </a>
            <a href="certifications.html" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Certifications</a>
            <a href="achievements.html" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Achievements</a>
            <a href="ait-global-innovation-internship.html" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">GIIP Thailand</a>
            <a href="up-police-internship.html" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">UP Police</a>
            <a href="open-source-contributions.html" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Wikimedia</a>
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              aria-label="Toggle Theme" 
              title="Toggle Theme"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-105 shadow-sm">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Resume Download CTA */}
            <a 
              href="assets/docs/Gautam_Kumar_Maurya_Resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all hover:scale-105">
              <FileText className="w-4 h-4" />
              <span>Resume</span>
            </a>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Overlay & Panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md lg:hidden transition-all duration-300">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative ml-auto w-4/5 max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img src="assets/images/profile/Gautam_Kumar_Maurya.jpg" alt="Gautam Kumar Maurya Logo" className="w-9 h-9 rounded-xl object-cover border-2 border-blue-600" />
                  <span className="font-bold text-slate-900 dark:text-white">Navigation</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-4 text-base font-medium text-slate-700 dark:text-slate-200">
                <a href="index.html" className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 text-blue-600" />
                  <span>Main Portfolio Home</span>
                </a>
                <a href="certifications.html" className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">40+ Certifications</a>
                <a href="achievements.html" className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Honors & Awards</a>
                <a href="index.html#projects" className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Projects</a>
                <a href="index.html#experience" className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Internships & Research</a>
                <a href="index.html#leadership" className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Leadership Roles</a>
              </nav>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <a href="./ait-global-innovation-internship.html" className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center justify-between">
                  <span>GIIP-2026 Thailand</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a href="./up-police-internship.html" className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-medium text-sm flex items-center justify-between">
                  <span>APCSIP-2026 Cyber</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a href="./open-source-contributions.html" className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-medium text-sm flex items-center justify-between">
                  <span>Wikimedia Open Source</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <a href="assets/docs/Gautam_Kumar_Maurya_Resume.pdf" target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md">
                <FileText className="w-4 h-4" /> Download Resume
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. Premium Hero Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Engineering Growth & Leadership Tracker</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          My B.Tech Journey & Technical Evolution
        </h1>
        
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">
          An interactive timeline documenting Gautam's academic toppers, international research fellowships, open-source code contributions, and community leadership from Pre-College to B.Tech Graduation.
        </p>

        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white shadow-xl backdrop-blur-xl mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{JOURNEY_DATA.meta.currentStatusText}</span>
        </div>

        {/* 3. INTERACTIVE IMPACT METRICS COUNTER BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          {statsCounter.map((st, i) => (
            <div key={i} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-blue-500/50 shadow-xl group">
              <div className="flex items-center justify-between mb-2">
                <st.icon className={`w-5 h-5 ${st.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">Verified</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-0.5 group-hover:text-blue-500 transition-colors">
                {st.val}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-snug">
                {st.label}
              </div>
              <div className="text-[11px] font-medium text-slate-400">
                {st.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE STEPPER TIMELINE PROGRESS BAR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between relative">
            {/* Horizontal Line Connector */}
            <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 z-0"></div>
            
            {JOURNEY_DATA.phases.map((ph, idx) => {
              const isActive = activePhaseId === ph.id;
              return (
                <button 
                  key={ph.id}
                  onClick={() => setActivePhaseId(ph.id)}
                  className={`relative z-10 flex flex-col items-center gap-1 group transition-all`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs transition-all duration-300 ${isActive ? 'bg-blue-500 text-white ring-4 ring-blue-500/30 scale-110 shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                    0{idx + 1}
                  </div>
                  <span className={`text-[11px] font-bold transition-colors ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {ph.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. PRIMARY PHASE SELECTOR CARDS (Dynamic Era Controls) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-500" />
            <span>Select Focus Era</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">4 Active Eras</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {JOURNEY_DATA.phases.map((phase) => {
            const isActive = activePhaseId === phase.id;
            const totalItems = JOURNEY_DATA.milestones.filter(m => m.phaseId === phase.id).length;

            return (
              <div 
                key={phase.id}
                onClick={() => setActivePhaseId(phase.id)}
                className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] ${isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-500/10 dark:bg-slate-900 shadow-2xl scale-[1.02]' : 'opacity-85 hover:opacity-100'}`}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/30 flex items-center justify-center">
                      {renderIcon(phase.icon, "w-5 h-5")}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[11px] font-extrabold">
                      {totalItems} Milestones
                    </span>
                  </div>
                  <div className="font-extrabold text-base text-slate-900 dark:text-white leading-snug mb-1">
                    {phase.title}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">
                    {phase.subtitle}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400">{phase.period}</span>
                  {isActive ? (
                    <span className="text-blue-500 flex items-center gap-1 font-bold">
                      <span>Active Focus</span>
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-slate-400 hover:text-blue-500 flex items-center gap-1">
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. INTERACTIVE COMPETENCY & SKILL MATRIX SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold text-purple-500 uppercase tracking-wider mb-1">
                <BarChart3 className="w-4 h-4" />
                <span>Technical Skill Evolution Matrix</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Core Competencies Acquired Over Time
              </h3>
            </div>

            {/* Skill Era Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {JOURNEY_DATA.skillEvolution.map(se => (
                <button 
                  key={se.phaseId}
                  onClick={() => setActiveSkillTab(se.phaseId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${activeSkillTab === se.phaseId ? 'bg-purple-500 text-white shadow-md scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                  {se.phaseTitle.split(' ')[0]} {se.phaseTitle.split(' ')[1] || ''}
                </button>
              ))}
            </div>
          </div>

          {/* Render Active Skill Tab Grid */}
          {JOURNEY_DATA.skillEvolution.map(se => {
            if (se.phaseId !== activeSkillTab) return null;
            return (
              <div key={se.phaseId} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {se.skills.map((sk, skIdx) => (
                  <div key={skIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:-translate-y-1 transition-transform">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs">
                        #{skIdx + 1}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white">{sk.name}</div>
                        <div className="text-[11px] font-semibold text-slate-400">{sk.level}</div>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. ACTIVE ERA SEARCH BAR & QUICK FILTER CHIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          
          {/* Active Phase Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold text-blue-500 uppercase tracking-wider mb-1">
                {renderIcon(activePhase.icon, "w-4 h-4")}
                <span>Focused Era View</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {activePhase.title} ({activePhase.period})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                {activePhase.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Classifications:</span>
              {activePhase.semesters.map(s => (
                <span key={s.id} className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-extrabold">
                  {s.num}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Filter Tags Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200 dark:border-slate-800/80 pt-1">
            <span className="text-xs font-extrabold text-slate-400 shrink-0">Popular Tags:</span>
            {popularTags.map((tag, tIdx) => (
              <button 
                key={tIdx}
                onClick={() => setSearchQuery(searchQuery === tag ? '' : tag)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold shrink-0 transition-all ${searchQuery === tag ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                #{tag}
              </button>
            ))}
          </div>

          {/* Live Search & Category Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-1 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${activePhase.shortTitle}...`}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Chips */}
            <div className="md:col-span-2 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button 
                onClick={() => setSelectedCategory('starred')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${selectedCategory === 'starred' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-900/60 text-amber-500 border border-slate-200 dark:border-slate-800 hover:border-amber-500'}`}>
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Starred ({starredIds.length})</span>
              </button>

              {JOURNEY_DATA.categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${selectedCategory === cat.id ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/40 shadow-sm' : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-400'}`}>
                  {renderIcon(cat.icon, "w-3.5 h-3.5")}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 8. SEQUENTIAL SEMESTER BOXES WITH ADVANCED CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 flex-1 space-y-10">
        {semesterBoxes.map((semBox, boxIdx) => (
          <div key={semBox.id} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
            
            {/* Semester Box Sequential Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-500 border border-blue-500/30 flex items-center justify-center font-extrabold text-sm">
                  0{boxIdx + 1}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {semBox.title}
                  </h3>
                  {semBox.desc && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {semBox.desc}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-extrabold">
                  {semBox.items.length} Milestones
                </span>
              </div>
            </div>

            {/* Milestone Cards Grid Inside Semester Box */}
            {semBox.items.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                <FolderOpen className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <span>No milestones found matching your category/search filters in {semBox.num}.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {semBox.items.map(m => {
                  const isStarred = starredIds.includes(m.id);
                  return (
                    <div 
                      key={m.id}
                      id={m.id}
                      onClick={() => setActiveModalItem(m)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 cursor-pointer flex flex-col justify-between group transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-blue-500/60 hover:shadow-2xl">
                      <div>
                        {/* Card Top Meta */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[11px] font-extrabold uppercase tracking-wider">
                            {m.category}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => toggleStar(m.id, e)}
                              className="p-1 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title={isStarred ? "Unstar Milestone" : "Star Milestone"}>
                              <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>

                            <button 
                              onClick={(e) => handleCopyLink(m.id, e)}
                              className="p-1 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Copy Milestone Link">
                              {copiedId === m.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>

                            {m.status === 'completed' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-extrabold flex items-center gap-1">
                                <Check className="w-3 h-3" /> Completed
                              </span>
                            )}
                            {m.status === 'current' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[11px] font-extrabold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> Current Focus
                              </span>
                            )}
                          </div>
                        </div>

                        <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors leading-snug">
                          {m.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 font-medium">
                          {m.shortDescription}
                        </p>

                        {/* Key Story Highlights */}
                        <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                          <div>
                            <span className="font-extrabold text-blue-600 dark:text-blue-400 uppercase text-[10px] block">What Happened</span>
                            <span className="text-slate-600 dark:text-slate-400 font-medium">{m.whatHappened}</span>
                          </div>
                          <div>
                            <span className="font-extrabold text-blue-600 dark:text-blue-400 uppercase text-[10px] block">Why It Mattered</span>
                            <span className="text-slate-600 dark:text-slate-400 font-medium">{m.whyItMattered}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom CTA */}
                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-extrabold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1">
                          <span>Read Story & Evidence</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[11px] text-slate-400 font-bold">{m.startDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        ))}
      </section>

      {/* 9. Slide-Up Detailed Modal Drawer */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl">
            <button 
              onClick={() => setActiveModalItem(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
              title="Close Modal">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                {activeModalItem.category}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{activeModalItem.startDate} – {activeModalItem.endDate}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
              {activeModalItem.title}
            </h2>

            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-6 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>{activeModalItem.organization} · {activeModalItem.role} ({activeModalItem.location})</span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">
              {activeModalItem.fullDescription}
            </p>

            {/* Growth Story Breakdown */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 mb-6 text-xs sm:text-sm">
              <div>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 uppercase text-xs block mb-0.5">Detailed Story</span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{activeModalItem.whatHappened}</span>
              </div>
              <div>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 uppercase text-xs block mb-0.5">Strategic Significance</span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{activeModalItem.whyItMattered}</span>
              </div>
              <div>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 uppercase text-xs block mb-0.5">Technical & Soft Learning</span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{activeModalItem.whatILearned}</span>
              </div>
              <div>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 uppercase text-xs block mb-0.5">Long-Term Impact</span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{activeModalItem.impact}</span>
              </div>
            </div>

            {/* LinkedIn & Verified Photos Gallery */}
            {activeModalItem.evidence && activeModalItem.evidence.images && activeModalItem.evidence.images.length > 0 && (
              <div className="mb-6">
                <span className="font-extrabold text-slate-400 text-xs uppercase tracking-wider block mb-2">Verified Photos & Media</span>
                <div className="grid grid-cols-2 gap-3">
                  {activeModalItem.evidence.images.map((imgUrl, imgIdx) => (
                    <div 
                      key={imgIdx} 
                      onClick={() => setLightboxImage(imgUrl)}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video cursor-pointer bg-slate-100 dark:bg-slate-900">
                      <img src={imgUrl} alt="LinkedIn Media Evidence" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                        <Eye className="w-4 h-4" /> Expand Image
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Badges */}
            <div className="mb-6">
              <span className="font-extrabold text-slate-400 text-xs uppercase tracking-wider block mb-2">Competencies & Tools</span>
              <div className="flex flex-wrap gap-2">
                {activeModalItem.skills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-extrabold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Evidence Links */}
            {activeModalItem.evidence && (
              <div>
                <span className="font-extrabold text-slate-400 text-xs uppercase tracking-wider block mb-2">Verified Documents & Links</span>
                <div className="flex flex-wrap gap-2">
                  {activeModalItem.evidence.links && activeModalItem.evidence.links.map((l, i) => (
                    <a key={i} href={l} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center gap-1.5 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> Full Report Page
                    </a>
                  ))}
                  {activeModalItem.evidence.github && (
                    <a href={activeModalItem.evidence.github} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors">
                      <Github className="w-3.5 h-3.5" /> GitHub Repository
                    </a>
                  )}
                  {activeModalItem.evidence.certificate && (
                    <a href={activeModalItem.evidence.certificate} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors">
                      <Trophy className="w-3.5 h-3.5" /> Certificate PDF
                    </a>
                  )}
                  {activeModalItem.evidence.linkedin && (
                    <a href={activeModalItem.evidence.linkedin} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 text-xs font-bold flex items-center gap-1.5 transition-colors">
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn Post
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 10. Lightbox Image Zoom Viewer Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl" onClick={() => setLightboxImage(null)}>
          <div className="relative max-w-4xl w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-red-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <img src={lightboxImage} alt="Expanded Evidence" className="max-h-[85vh] w-auto rounded-2xl shadow-2xl object-contain border border-slate-800" />
          </div>
        </div>
      )}

      {/* 11. ULTRA-PROPER RICH FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl pt-12 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Footer Grid 4-Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Profile & Degree Bio */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-3">
                <img src="assets/images/profile/Gautam_Kumar_Maurya.jpg" alt="Gautam Kumar Maurya" className="w-10 h-10 rounded-full object-cover border-2 border-blue-500" />
                <div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white">Gautam Kumar Maurya</div>
                  <div className="text-xs text-blue-500 font-semibold">gkm563</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                B.Tech in Computer Science & Engineering (Data Science) scholar at United Institute of Technology (UIT Prayagraj), affiliated with Dr. A.P.J. Abdul Kalam Technical University (AKTU Lucknow).
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Prayagraj, Uttar Pradesh, India</span>
              </div>
            </div>

            {/* Column 2: B.Tech Journey Eras */}
            <div className="space-y-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                B.Tech Journey Eras
              </div>
              <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <li><button onClick={() => setActivePhaseId('pre-college')} className="hover:text-blue-500 transition-colors">🎓 Pre-College (92.67%)</button></li>
                <li><button onClick={() => setActivePhaseId('year-1')} className="hover:text-blue-500 transition-colors">🚀 1st Year (Topper & C/Python)</button></li>
                <li><button onClick={() => setActivePhaseId('year-2')} className="hover:text-blue-500 transition-colors">🛡️ 2nd Year (AKTU Rank 5 & MediaWiki)</button></li>
                <li><button onClick={() => setActivePhaseId('year-3')} className="hover:text-blue-500 transition-colors">⚡ 3rd Year (AIT Bangkok & UP Police)</button></li>
              </ul>
            </div>

            {/* Column 3: Impact Portals */}
            <div className="space-y-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Special Impact Portals
              </div>
              <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <li><a href="ait-global-innovation-internship.html" className="hover:text-blue-500 transition-colors">AIT Bangkok International Research</a></li>
                <li><a href="up-police-internship.html" className="hover:text-blue-500 transition-colors">UP Police Cyber Security Fellowship</a></li>
                <li><a href="open-source-contributions.html" className="hover:text-blue-500 transition-colors">MediaWiki Open Source Gerrit Patches</a></li>
                <li><a href="https://prayagrajrooms.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">PrayagrajRooms Housing Platform</a></li>
                <li><a href="faq.html" className="hover:text-blue-500 transition-colors">Frequently Asked Questions & Contact</a></li>
              </ul>
            </div>

            {/* Column 4: Verified Profiles */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Connect & Open Source
              </div>
              <div className="flex flex-wrap gap-2">
                <a href="https://github.com/gkm563" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-500 hover:text-white transition-all" title="GitHub">
                  <Github className="w-4 h-4" />
                </a>
                <a href="https://www.linkedin.com/in/gkm563/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-500 hover:text-white transition-all" title="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://gerrit.wikimedia.org/r/q/owner:gkm563" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-500 hover:text-white transition-all" title="Wikimedia Gerrit">
                  <GitCommit className="w-4 h-4" />
                </a>
                <a href="https://t.me/gkm563" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-500 hover:text-white transition-all" title="Telegram">
                  <Send className="w-4 h-4" />
                </a>
              </div>
              <p className="text-[11px] text-slate-400">
                Contact: <a href="mailto:gautamkumarmaurya563@gmail.com" className="text-blue-500 hover:underline">gautamkumarmaurya563@gmail.com</a>
              </p>
            </div>

          </div>

          {/* Bottom Copyright & Tech Stack */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
            <div>
              © 2026 Gautam Kumar Maurya (gkm563). All Rights Reserved.
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span>Built with React 18 & Tailwind CSS</span>
              <span>·</span>
              <span className="text-emerald-500 font-bold">Deployed on GitHub Pages</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
