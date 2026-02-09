import React, { useState } from 'react';
import { Tone, OptimizedPost, ScheduledPost, ViewMode } from './types';
import { generateOptimizedPosts } from './services/geminiService';
import { ToneSelector } from './components/ToneSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Navigation } from './components/Navigation';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ContentCalendar } from './components/ContentCalendar';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { Sparkles, Terminal, Linkedin } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('generator');
  const [draft, setDraft] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>(Tone.BUILDER);
  const [results, setResults] = useState<OptimizedPost[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

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

  return (
    <div className="min-h-screen bg-neon-bg text-slate-200 selection:bg-neon-cyan/30 selection:text-white pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-neon-bg/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => setView('generator')} role="button">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-neon-blue to-neon-cyan flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Post<span className="text-neon-cyan">Optimizer</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              System Online
            </span>
            <span>v2.1.0 [Beta]</span>
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
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
                Make LinkedIn <span className="text-neon-cyan relative">
                  Authentic
                  <svg className="absolute w-full h-2 -bottom-1 left-0 text-neon-cyan" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Stop sounding like a sales robot. Transform your rough thoughts into high-engagement content that people actually want to read.
              </p>
            </div>

            {/* Input Section */}
            <div className="grid gap-8">
              <Card glow="cyan" className="p-1">
                <div className="bg-slate-900/50 p-6 md:p-8 rounded-lg">
                  
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">
                      <Terminal className="w-4 h-4 text-neon-cyan" />
                      1. Input Rough Draft
                    </label>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="e.g. I launched a new feature today. It was hard. We had bugs. But now it works. I'm happy."
                      className="w-full h-40 bg-black/40 border border-white/10 rounded-lg p-4 text-slate-200 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all resize-none font-mono text-sm placeholder:text-slate-600"
                    />
                  </div>

                  <div className="mb-8">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">
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
                    <div className="mt-4 p-4 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
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
      <footer className="mt-20 border-t border-white/5 py-8 text-center text-slate-600 text-sm">
        <p>© 2025 PostOptimizer AI. Built for the builders.</p>
      </footer>

    </div>
  );
};

export default App;
