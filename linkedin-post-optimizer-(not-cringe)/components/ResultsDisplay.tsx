import React, { useState, useCallback, useMemo } from 'react';
import { OptimizedPost } from '../types';
import { suggestTrendingHashtags } from '../services/geminiService';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Copy, Check, Share2, AlertCircle, CalendarPlus, Hash, Sparkles, Linkedin, Send } from 'lucide-react';

interface ResultsDisplayProps {
  results: OptimizedPost[];
  original: string;
  onSchedule: (post: OptimizedPost, date: string) => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = React.memo(({ results, original, onSchedule }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  
  // Scheduling State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedPostForSchedule, setSelectedPostForSchedule] = useState<OptimizedPost | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  
  // Hashtag State
  const [loadingHashtags, setLoadingHashtags] = useState<number | null>(null);
  const [extraHashtags, setExtraHashtags] = useState<{[key: number]: string[]}>({});

  // Publish State
  const [publishingIndex, setPublishingIndex] = useState<number | null>(null);

  const formatHashtag = useCallback((tag: string) => {
    const cleaned = tag
      .trim()
      .replace(/^#+/, '')
      .replace(/\s+/g, '')
      .replace(/[^\p{L}\p{N}_]/gu, '');

    return cleaned ? `#${cleaned}` : '';
  }, []);

  const getFormattedHashtags = useCallback((post: OptimizedPost, index: number) => {
    const combinedTags = [...post.tags, ...(extraHashtags[index] || [])]
      .map(formatHashtag)
      .filter(Boolean);

    return Array.from(new Set(combinedTags));
  }, [extraHashtags, formatHashtag]);

  const getFullText = useCallback((post: OptimizedPost, index: number) => {
    const hashtags = getFormattedHashtags(post, index);
    const hashtagBlock = hashtags.length > 0 ? `\n\n${hashtags.join(' ')}` : '';
    return `${post.headline}\n\n${post.content}${hashtagBlock}`.trim();
  }, [getFormattedHashtags]);

  const handleCopy = useCallback((index: number, post: OptimizedPost) => {
    const text = getFullText(post, index);
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, [getFullText]);

  const handlePublish = async (index: number, post: OptimizedPost) => {
      // 1. Check connection (simulated)
      const isConnected = localStorage.getItem('linkedin_connected') === 'true';
      
      setPublishingIndex(index);
      
      // 2. Always copy to clipboard first as fallback/convenience
      const text = getFullText(post, index);
      await navigator.clipboard.writeText(text);

      setTimeout(() => {
          if (isConnected) {
              // Simulated API publish
              // In a real app, this would POST to LinkedIn API
              // Here we simulate success then open window
              alert("Published successfully via API! (Simulation)\n\nWe will also open LinkedIn so you can verify.");
          } else {
              // Fallback
              alert("Text copied to clipboard!\n\nOpening LinkedIn for you to paste...");
          }
          
          window.open('https://www.linkedin.com/feed/', '_blank');
          setPublishingIndex(null);
          setCopiedIndex(index); // Show checkmark on copy button too
          setTimeout(() => setCopiedIndex(null), 2000);
      }, 1000);
  };

  const openScheduleModal = (post: OptimizedPost) => {
    setSelectedPostForSchedule(post);
    setScheduleModalOpen(true);
    // Default to tomorrow 9am
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    setScheduleDate(tomorrow.toISOString().slice(0, 16));
  };

  const handleConfirmSchedule = () => {
    if (selectedPostForSchedule && scheduleDate) {
      onSchedule(selectedPostForSchedule, scheduleDate);
      setScheduleModalOpen(false);
      setSelectedPostForSchedule(null);
    }
  };

  const handleBoostHashtags = useCallback(async (post: OptimizedPost, index: number) => {
    setLoadingHashtags(index);
    try {
      const tags = await suggestTrendingHashtags(post.content);
      setExtraHashtags(prev => ({ ...prev, [index]: tags }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHashtags(null);
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
          Optimized Versions
        </h2>
        <button 
          onClick={() => setShowComparison(!showComparison)}
          className="text-xs md:text-sm text-neon-cyan hover:underline flex items-center gap-1"
        >
          {showComparison ? 'Hide Comparison' : 'Show Before/After Growth Hack'}
          <Share2 className="w-3 h-3" />
        </button>
      </div>

      {showComparison && (
        <Card glow="purple" className="mb-8 border-neon-purple/50">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4 text-neon-purple">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold">Growth Hack: The "Before vs. After" Post</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Screenshot this card and post it to show your audience how you iterate on content. High engagement format!
            </p>
            <div className="grid md:grid-cols-2 gap-6 bg-slate-100/80 dark:bg-black/40 p-4 rounded-lg border border-slate-300/60 dark:border-white/5">
              <div>
                <span className="text-xs font-mono text-red-400 mb-2 block uppercase tracking-wider">Before (Cringe/Robot)</span>
                <p className="text-sm text-slate-500 dark:text-slate-400 italic line-through decoration-red-500/50">{original.substring(0, 150)}...</p>
              </div>
              <div className="border-l border-slate-300/60 dark:border-white/10 md:pl-6">
                <span className="text-xs font-mono text-green-400 mb-2 block uppercase tracking-wider">After (Authentic)</span>
                <p className="text-sm text-slate-700 dark:text-slate-200">{results[0].content.substring(0, 150)}...</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {results.map((post, index) => (
          <Card key={index} className="flex flex-col h-full hover:border-neon-cyan/30 transition-colors">
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-2 py-1 rounded-full bg-white/5 text-xs font-mono text-slate-400 border border-white/10">
                  Option 0{index + 1}
                </span>
                <div className="flex gap-2">
                   <button
                    onClick={() => openScheduleModal(post)}
                    className="p-2 hover:bg-slate-900/5 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-neon-purple"
                    title="Schedule Post"
                  >
                    <CalendarPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(index, post)}
                    className={`
                      p-2 rounded-full transition-all duration-300 flex items-center justify-center
                      ${copiedIndex === index 
                        ? 'bg-green-500/20 text-green-400 scale-110 shadow-[0_0_15px_rgba(74,222,128,0.4)] rotate-0' 
                        : 'hover:bg-slate-900/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }
                    `}
                    title="Copy for LinkedIn"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 animate-in zoom-in spin-in-50 duration-300" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white leading-tight">
                {post.headline}
              </h3>

              <div className="flex-grow whitespace-pre-wrap text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 font-light">
                {post.content}
              </div>

              <div className="mt-auto space-y-4">
                <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.map((tag, tagIndex) => {
                        const normalizedTag = formatHashtag(tag);
                        if (!normalizedTag) return null;
                        return (
                          <span key={`${normalizedTag}-${tagIndex}`} className="text-xs text-neon-blue">{normalizedTag}</span>
                        );
                    })}
                    {extraHashtags[index]?.map((tag, tagIndex) => {
                        const normalizedTag = formatHashtag(tag);
                        if (!normalizedTag) return null;
                        return (
                          <span key={`${normalizedTag}-${tagIndex}`} className="text-xs text-neon-purple animate-in fade-in zoom-in">{normalizedTag}</span>
                        );
                    })}
                    </div>
                    
                    {!extraHashtags[index] && (
                        <button 
                            onClick={() => handleBoostHashtags(post, index)}
                            disabled={loadingHashtags === index}
                            className="text-xs flex items-center gap-1 text-slate-500 hover:text-neon-cyan transition-colors"
                        >
                            {loadingHashtags === index ? (
                                <span className="animate-pulse">Analyzing niche trends...</span>
                            ) : (
                                <>
                                    <Sparkles className="w-3 h-3" />
                                    AI Hashtag Boost
                                </>
                            )}
                        </button>
                    )}
                </div>

                <div className="border-t border-slate-300/60 dark:border-white/10 pt-3 flex flex-col gap-3">
                  <p className="text-xs text-slate-600 dark:text-slate-500">
                    <span className="text-slate-700 dark:text-slate-400 font-medium">Why it works:</span> {post.toneExplanation}
                  </p>
                  
                  <button
                    onClick={() => handlePublish(index, post)}
                    disabled={publishingIndex === index}
                    className="w-full flex items-center justify-center gap-2 bg-[#0077b5]/20 hover:bg-[#0077b5]/30 border border-[#0077b5]/50 text-[#0077b5] hover:text-white font-medium py-2 rounded-lg transition-all duration-300 group"
                  >
                    {publishingIndex === index ? (
                         <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Publishing...
                         </>
                    ) : (
                         <>
                            <Linkedin className="w-4 h-4 fill-current" />
                            Copy to LinkedIn
                            <Send className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                         </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={scheduleModalOpen} 
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule Post"
      >
        <div className="space-y-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
                Pick a time to automatically publish this post to your calendar.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">DATE & TIME</label>
                <input 
                    type="datetime-local" 
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                className="app-input w-full rounded px-3 py-2"
                />
            </div>
            <div className="pt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setScheduleModalOpen(false)}>Cancel</Button>
                <Button onClick={handleConfirmSchedule}>Confirm Schedule</Button>
            </div>
        </div>
      </Modal>

    </div>
  );
});