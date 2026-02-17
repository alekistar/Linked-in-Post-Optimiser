import React, { useEffect, useState } from 'react';
import { Tone, OptimizedPost, ScheduledPost, ViewMode } from './types';
import { generateOptimizedPosts } from './services/geminiService';
import { ToneSelector } from './components/ToneSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Navigation } from './components/Navigation';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ContentCalendar } from './components/ContentCalendar';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { Sparkles, Terminal, Linkedin, Moon, Sun } from 'lucide-react';

type ThemeMode = 'light' | 'dark';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('generator');
  const [draft, setDraft] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>(Tone.BUILDER);
  const [results, setResults] = useState<OptimizedPost[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    const storedTheme = window.localStorage.getItem('theme-mode');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('theme-mode', theme);
  }, [theme]);

  const handleGenerate = async () => {
    if (!draft.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const optimizedPosts = await generateOptimizedPosts(draft, selectedTone);
      setResults(optimizedPosts);
    } catch (err) {
      setError("Failed to generate posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = (post: OptimizedPost, date: string) => {
    const newScheduledPost: ScheduledPost = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      scheduledDate: date
    };
    setScheduledPosts([...scheduledPosts, newScheduledPost]);
    setView('calendar');
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-shell min-h-screen selection:bg-cyan-300/30 dark:selection:bg-cyan-500/30 selection:text-slate-900 dark:selection:text-white pb-20">
      
      {/* Header */}
      <header className="app-header sticky top-0 z-50 backdrop-blur-lg border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('generator')} role="button">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-neon-blue to-neon-cyan flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="app-brand font-bold text-xl tracking-tight">
              Post<span className="text-neon-cyan">Optimizer</span>
            </span>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle md:hidden inline-flex items-center justify-center rounded-lg p-2.5 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="hidden md:flex items-center gap-4 text-xs font-mono app-muted">
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle inline-flex items-center gap-2 rounded-lg px-3 py-2 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              System Online
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        
        <Navigation currentView={view} onChange={setView} />

        {view === 'analytics' && <AnalyticsDashboard />}
        
        {view === 'calendar' && <ContentCalendar scheduledPosts={scheduledPosts} />}

        {view === 'generator' && (
          <div className="animate-in fade-in duration-500">
             {/* Hero */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-500">
                Make LinkedIn <span className="text-neon-cyan relative">
                  Authentic
                  <svg className="absolute w-full h-2 -bottom-1 left-0 text-neon-cyan" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Stop sounding like a sales robot. Transform your rough thoughts into high-engagement content that people actually want to read.
              </p>
            </div>

            {/* Input Section */}
            <div className="grid gap-8">
              <Card glow="cyan" className="p-1">
                <div className="app-panel p-6 md:p-8 rounded-lg">
                  
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
                      <Terminal className="w-4 h-4 text-neon-cyan" />
                      1. Input Rough Draft
                    </label>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="e.g. I launched a new feature today. It was hard. We had bugs. But now it works. I'm happy."
                      className="app-input w-full h-40 rounded-lg p-4 transition-all resize-none font-mono text-sm"
                    />
                  </div>

                  <div className="mb-8">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-neon-purple" />
                      2. Select Persona
                    </label>
                    <ToneSelector selectedTone={selectedTone} onSelect={setSelectedTone} />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleGenerate} 
                      isLoading={loading}
                      disabled={!draft.trim()}
                      className="w-full md:w-auto"
                    >
                      Generate Versions
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {error && (
                    <div className="mt-4 p-4 rounded bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-sm text-center">
                      {error}
                    </div>
                  )}
                </div>
              </Card>

              {/* Results Section */}
              {results && (
                <div id="results">
                  <ResultsDisplay 
                    results={results} 
                    original={draft} 
                    onSchedule={handleSchedule}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-300/60 dark:border-white/10 py-8 text-center text-slate-600 dark:text-slate-500 text-sm">
        <p>© 2025 PostOptimizer AI. Built for the builders.</p>
      </footer>

    </div>
  );
};

export default App;
