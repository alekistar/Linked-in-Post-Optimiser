import React from 'react';
import { ScheduledPost } from '../types';
import { Card } from './ui/Card';
import { Clock, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';

interface ContentCalendarProps {
  scheduledPosts: ScheduledPost[];
}

export const ContentCalendar: React.FC<ContentCalendarProps> = ({ scheduledPosts }) => {
  const days = Array.from({ length: 35 }, (_, i) => i + 1); // Mock month
  const today = new Date().getDate();

  const getPostsForDay = (day: number) => {
    return scheduledPosts.filter(p => {
        const d = new Date(p.scheduledDate);
        return d.getDate() === day && d.getMonth() === new Date().getMonth();
    });
  };

  const addToGoogleCalendar = (post: ScheduledPost) => {
    const date = new Date(post.scheduledDate);
    
    // Create start and end times
    const startTime = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    // Default duration: 30 minutes
    const endDate = new Date(date.getTime() + 30 * 60 * 1000);
    const endTime = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', `LinkedIn Post: ${post.headline}`);
    url.searchParams.append('details', `Content:\n${post.content}\n\nTags:\n${post.tags.join(' ')}\n\n(Scheduled via PostOptimizer)`);
    url.searchParams.append('dates', `${startTime}/${endTime}`);
    url.searchParams.append('location', 'LinkedIn');
    
    window.open(url.toString(), '_blank');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Content Calendar</h2>
        <div className="text-sm font-mono text-neon-cyan">
          {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <Card className="p-6 bg-black/20">
        <div className="grid grid-cols-7 gap-4 mb-4 text-center text-xs font-mono text-slate-500 uppercase">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-2 md:gap-4">
          {days.map((day) => {
             const posts = getPostsForDay(day);
             const isToday = day === today;
             
             return (
              <div 
                key={day} 
                className={`
                  min-h-[80px] md:min-h-[120px] rounded-lg border p-2 flex flex-col gap-1 transition-all hover:bg-white/5
                  ${isToday ? 'border-neon-cyan/50 bg-neon-cyan/5' : 'border-white/5 bg-white/5'}
                `}
              >
                <span className={`text-xs font-bold ${isToday ? 'text-neon-cyan' : 'text-slate-500'}`}>
                  {day}
                </span>
                
                {posts.map(post => (
                  <div key={post.id} className="group relative">
                    <div className="text-[10px] p-1.5 rounded bg-neon-purple/20 border border-neon-purple/30 text-neon-purple truncate cursor-pointer hover:bg-neon-purple/30">
                      {post.headline}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute hidden group-hover:block z-20 w-56 p-3 bg-slate-900 border border-white/20 rounded-lg shadow-xl -top-2 left-full ml-2 text-xs text-slate-300">
                      <div className="flex items-center gap-1 mb-2 text-neon-cyan font-bold">
                         <Clock className="w-3 h-3" />
                         {new Date(post.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <p className="mb-2 line-clamp-3">{post.headline}</p>
                      <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            addToGoogleCalendar(post);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-1.5 rounded transition-colors text-white"
                      >
                        <CalendarIcon className="w-3 h-3" />
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4 border-l-4 border-l-neon-cyan">
            <h3 className="font-bold text-white mb-4">Upcoming Schedule</h3>
            {scheduledPosts.length === 0 ? (
                <p className="text-sm text-slate-500">No posts scheduled yet.</p>
            ) : (
                <ul className="space-y-3">
                    {scheduledPosts.sort((a,b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()).map(post => (
                        <li key={post.id} className="flex items-center justify-between gap-4 text-sm bg-white/5 p-3 rounded-lg group hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="flex flex-col items-center justify-center bg-black/40 w-12 h-12 rounded border border-white/10">
                                    <span className="text-xs text-slate-500 uppercase">{new Date(post.scheduledDate).toLocaleString('default', {month:'short'})}</span>
                                    <span className="font-bold text-neon-cyan">{new Date(post.scheduledDate).getDate()}</span>
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="font-medium text-white truncate">{post.headline}</span>
                                    <span className="text-xs text-slate-400">{new Date(post.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => addToGoogleCalendar(post)}
                                className="p-2 text-slate-400 hover:text-neon-cyan hover:bg-neon-cyan/10 rounded-full transition-all"
                                title="Add to Google Calendar"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
      </div>
    </div>
  );
};