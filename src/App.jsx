import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, Rocket, ShieldCheck, Zap, 
  Layers, Laptop, Code, Briefcase, GitCommit, 
  Users, Trophy, Calendar, Award, ArrowLeft, 
  Sun, Moon, Search, X, Check, Clock, ExternalLink, 
  Github, Linkedin, Building2, ChevronRight, FolderOpen
} from 'lucide-react';
import { JOURNEY_DATA } from './data/journeyData.js';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('gkm_theme') || 'dark');
  const [activePhaseId, setActivePhaseId] = useState('year-1');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      html.classList.add('dark');
      body.classList.add('dark');
    } else {
      html.classList.remove('dark');
      body.classList.remove('dark');
    }
    localStorage.setItem('gkm_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const activePhase = useMemo(() => {
    return JOURNEY_DATA.phases.find(p => p.id === activePhaseId) || JOURNEY_DATA.phases[1];
  }, [activePhaseId]);

  const activePhaseMilestones = useMemo(() => {
    if (!JOURNEY_DATA || !JOURNEY_DATA.milestones) return [];
    return JOURNEY_DATA.milestones.filter(m => {
      if (m.phaseId !== activePhaseId) return false;
      if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
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
  }, [activePhaseId, selectedCategory, searchQuery]);

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 relative overflow-x-hidden">
      
      {/* 1. Header Navbar */}
      <header className="sticky top-0 z-50 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <a href="index.html" className="flex items-center gap-3 group text-decoration-none">
            <img src="assets/images/profile/Gautam_Kumar_Maurya.jpg" alt="Gautam Kumar Maurya" className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 group-hover:scale-105 transition-transform" />
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white leading-tight">Gautam Kumar Maurya</div>
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">React B.Tech Engineering Journey</div>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <a href="index.html" className="px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Portfolio Home</span>
            </a>
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all hover:scale-105" title="Toggle Theme">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
          <GraduationCap className="w-4 h-4" />
          <span>United Institute of Technology (UIT) · AKTU Lucknow</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          4-Year B.Tech CSE (Data Science) React Journey
        </h1>
        
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          Select a timeline phase card below to explore Gautam's focused journey, sequential semester milestones, and engineering achievements.
        </p>

        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          <span>{JOURNEY_DATA.meta.currentStatusText}</span>
        </div>
      </section>

      {/* 3. PRIMARY PHASE SELECTOR CARDS (Top Hero Control) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {JOURNEY_DATA.phases.map((phase) => {
            const isActive = activePhaseId === phase.id;
            const totalItems = JOURNEY_DATA.milestones.filter(m => m.phaseId === phase.id).length;

            return (
              <div 
                key={phase.id}
                onClick={() => setActivePhaseId(phase.id)}
                className={`bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 ${isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-500/10 dark:bg-slate-900 shadow-xl' : 'opacity-85 hover:opacity-100'}`}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/30 flex items-center justify-center">
                      {renderIcon(phase.icon, "w-5 h-5")}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[11px] font-bold">
                      {totalItems} Items
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
                      <span>Active View</span>
                      <Check className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="text-slate-400 hover:text-blue-500">Click to View</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. ACTIVE FOCUSED PHASE HEADER & FILTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          
          {/* Active Phase Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">
                {renderIcon(activePhase.icon, "w-4 h-4")}
                <span>Focused Timeline View</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {activePhase.title} ({activePhase.period})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                {activePhase.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Semesters:</span>
              {activePhase.semesters.map(s => (
                <span key={s.id} className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-bold">
                  {s.num}
                </span>
              ))}
            </div>
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
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Chips */}
            <div className="md:col-span-2 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {JOURNEY_DATA.categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all ${selectedCategory === cat.id ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/40' : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-400'}`}>
                  {renderIcon(cat.icon, "w-3.5 h-3.5")}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. SEQUENTIAL SEMESTER BOXES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 flex-1 space-y-10">
        {semesterBoxes.map((semBox, boxIdx) => (
          <div key={semBox.id} className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
            
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
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-bold">
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
                {semBox.items.map(m => (
                  <div 
                    key={m.id}
                    onClick={() => setActiveModalItem(m)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 cursor-pointer flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/60 hover:shadow-xl">
                    <div>
                      {/* Card Top Meta */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[11px] font-bold uppercase tracking-wider">
                          {m.category}
                        </span>
                        
                        {m.status === 'completed' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Completed
                          </span>
                        )}
                        {m.status === 'current' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> Current Focus
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors leading-snug">
                        {m.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        {m.shortDescription}
                      </p>

                      {/* Key Story Highlights */}
                      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                        <div>
                          <span className="font-bold text-blue-600 dark:text-blue-400 uppercase text-[10px] block">What Happened</span>
                          <span className="text-slate-600 dark:text-slate-400">{m.whatHappened}</span>
                        </div>
                        <div>
                          <span className="font-bold text-blue-600 dark:text-blue-400 uppercase text-[10px] block">Why It Mattered</span>
                          <span className="text-slate-600 dark:text-slate-400">{m.whyItMattered}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Bottom CTA */}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1">
                        <span>Read Full Narrative & Evidence</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">{m.startDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}
      </section>

      {/* 6. Slide-Up Detailed Modal Drawer */}
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

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {activeModalItem.fullDescription}
            </p>

            {/* Growth Story Breakdown */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 mb-6 text-xs sm:text-sm">
              <div>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 uppercase text-xs block mb-0.5">Detailed Story</span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{activeModalItem.whatHappened}</span>
              </div>
              <div>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 uppercase text-xs block mb-0.5">Strategic Significance</span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{activeModalItem.whyItMattered}</span>
              </div>
              <div>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 uppercase text-xs block mb-0.5">Technical & Soft Learning</span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{activeModalItem.whatILearned}</span>
              </div>
              <div>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 uppercase text-xs block mb-0.5">Long-Term Impact</span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{activeModalItem.impact}</span>
              </div>
            </div>

            {/* Skill Badges */}
            <div className="mb-6">
              <span className="font-extrabold text-slate-400 text-xs uppercase tracking-wider block mb-2">Competencies & Tools</span>
              <div className="flex flex-wrap gap-2">
                {activeModalItem.skills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-semibold">
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
                    <a key={i} href={l} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> Full Report Page
                    </a>
                  ))}
                  {activeModalItem.evidence.github && (
                    <a href={activeModalItem.evidence.github} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                      <Github className="w-3.5 h-3.5" /> GitHub Repository
                    </a>
                  )}
                  {activeModalItem.evidence.certificate && (
                    <a href={activeModalItem.evidence.certificate} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                      <Trophy className="w-3.5 h-3.5" /> Certificate PDF
                    </a>
                  )}
                  {activeModalItem.evidence.linkedin && (
                    <a href={activeModalItem.evidence.linkedin} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn Post
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. Footer Section */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex flex-wrap justify-center gap-6 font-semibold">
            <a href="index.html" className="hover:text-blue-500 transition-colors">Portfolio Home</a>
            <a href="ait-global-innovation-internship.html" className="hover:text-blue-500 transition-colors">AIT Bangkok Fellowship</a>
            <a href="up-police-internship.html" className="hover:text-blue-500 transition-colors">UP Police Fellowship</a>
            <a href="open-source-contributions.html" className="hover:text-blue-500 transition-colors">Open Source Patches</a>
            <a href="faq.html" className="hover:text-blue-500 transition-colors">FAQ & Contact</a>
          </div>
          <p>© 2026 Gautam Kumar Maurya (gkm563). B.Tech Computer Science & Engineering (Data Science).</p>
        </div>
      </footer>

    </div>
  );
}
