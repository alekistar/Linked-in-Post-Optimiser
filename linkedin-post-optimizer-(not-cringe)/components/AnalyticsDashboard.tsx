import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TrendingUp, Users, Activity, Eye, Linkedin, RefreshCw, Lock, BarChart2, Link as LinkIcon, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock data state
  const [stats, setStats] = useState({
    reach: '0',
    engagement: '0%',
    visits: '0',
    cringe: '0%'
  });

  const [growthData, setGrowthData] = useState<number[]>([]);
  
  // Strategy Comparison Data
  const [comparisonMode, setComparisonMode] = useState<'engagement' | 'reach'>('engagement');
  const [comparisonData, setComparisonData] = useState([
      { tone: 'Founder', engagement: 4.8, reach: 12500 },
      { tone: 'Builder', engagement: 3.2, reach: 8900 },
      { tone: 'Student', engagement: 5.5, reach: 15200 },
  ]);

  // Load persistence
  useEffect(() => {
    const connected = localStorage.getItem('linkedin_connected') === 'true';
    const savedUrl = localStorage.getItem('linkedin_profile');
    if (connected && savedUrl) {
        setIsConnected(true);
        setProfileUrl(savedUrl);
        generateStats(savedUrl);
    }
  }, []);

  const generateStats = (url: string) => {
      const seed = url.length;
      setStats({
          reach: (seed * 1234 % 50000).toLocaleString(),
          engagement: ((seed % 50) / 10 + 1.5).toFixed(1) + '%',
          visits: (seed * 45 % 2000).toString(),
          cringe: '99.9%'
      });
      setGrowthData(Array.from({length: 7}, (_, i) => 20 + (seed * (i+1) % 80)));
  };

  const handleConnect = () => {
    if (!profileUrl.includes('linkedin.com/in/')) {
        setError('Please enter a valid LinkedIn profile URL (e.g. linkedin.com/in/you)');
        return;
    }
    setError('');
    setIsConnecting(true);
    
    // Simulate a real authentication delay and data fetch
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      // Persist
      localStorage.setItem('linkedin_connected', 'true');
      localStorage.setItem('linkedin_profile', profileUrl);
      
      generateStats(profileUrl);
    }, 2000);
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
        // Update stats with slight variations
        setStats(prev => ({
            ...prev,
            visits: (parseInt(prev.visits) + Math.floor(Math.random() * 10)).toString(),
            reach: (parseInt(prev.reach.replace(/,/g, '')) + Math.floor(Math.random() * 500)).toLocaleString()
        }));
        setLoading(false);
    }, 1500);
  };

  const handleDisconnect = () => {
      setIsConnected(false);
      setProfileUrl('');
      setStats({ reach: '0', engagement: '0%', visits: '0', cringe: '0%' });
      localStorage.removeItem('linkedin_connected');
      localStorage.removeItem('linkedin_profile');
  };

  if (!isConnected) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
              <Card glow="purple" className="p-8 max-w-md w-full space-y-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-neon-blue/10 rounded-full flex items-center justify-center border border-neon-blue/30 mb-4">
                        <Linkedin className="w-8 h-8 text-neon-blue" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Connect LinkedIn</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Link your account to track real-time engagement, post performance, and audience growth analytics.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase mb-1 block">LinkedIn Profile URL</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <input 
                                type="text" 
                                value={profileUrl}
                                onChange={(e) => setProfileUrl(e.target.value)}
                                placeholder="https://linkedin.com/in/username"
                            className="app-input w-full rounded-lg py-2.5 pl-10 pr-4 text-sm transition-all"
                            />
                        </div>
                        {error && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {error}</p>}
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 text-xs text-yellow-700 dark:text-yellow-200 text-left flex gap-2">
                        <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                            <strong>Privacy First:</strong> We safely analyze public metrics. No posting permission required for analytics.
                        </span>
                    </div>

                    <Button 
                        onClick={handleConnect} 
                        isLoading={isConnecting}
                        className="w-full bg-[#0077b5] border-[#0077b5] text-white hover:bg-[#006097] hover:shadow-[0_0_20px_rgba(0,119,181,0.4)]"
                    >
                        {isConnecting ? 'Verifying Profile...' : 'Link Account'}
                    </Button>
                  </div>
              </Card>
          </div>
      );
  }

  const statItems = [
    { label: 'Avg. Reach', value: stats.reach, trend: '+18%', icon: Eye, color: 'text-blue-400' },
    { label: 'Engagement Rate', value: stats.engagement, trend: '+2.1%', icon: Activity, color: 'text-green-400' },
    { label: 'Profile Visits', value: stats.visits, trend: '+12%', icon: Users, color: 'text-purple-400' },
    { label: 'Cringe Reduction', value: stats.cringe, trend: 'Max', icon: TrendingUp, color: 'text-neon-cyan' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Analytics</h2>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-600 dark:text-slate-500 font-mono">Connected: {profileUrl.replace('https://linkedin.com/in/', '@')}</p>
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleDisconnect} className="text-xs h-8 px-3 text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 hover:bg-red-500/10">
                Disconnect
            </Button>
            <Button variant="ghost" onClick={refreshData} disabled={loading} className="text-xs h-8 px-3">
                <RefreshCw className={`w-3 h-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Syncing...' : 'Sync Data'}
            </Button>
          </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">
                {stat.trend}
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {loading ? <div className="h-8 w-24 bg-white/10 animate-pulse rounded" /> : stat.value}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Strategy Comparison Chart */}
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-neon-purple" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Strategy Comparison</h3>
                </div>
                <div className="flex bg-slate-100 dark:bg-white/5 rounded p-1">
                    <button 
                        onClick={() => setComparisonMode('engagement')}
                        className={`text-xs px-3 py-1 rounded transition-all ${comparisonMode === 'engagement' ? 'bg-neon-purple text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        Engagement
                    </button>
                    <button 
                        onClick={() => setComparisonMode('reach')}
                        className={`text-xs px-3 py-1 rounded transition-all ${comparisonMode === 'reach' ? 'bg-neon-cyan text-black font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        Reach
                    </button>
                </div>
            </div>
            
            <div className="space-y-6">
                {comparisonData.map((item, idx) => {
                    const maxVal = comparisonMode === 'engagement' ? 6 : 20000;
                    const val = comparisonMode === 'engagement' ? item.engagement : item.reach;
                    const percent = (val / maxVal) * 100;
                    const displayVal = comparisonMode === 'engagement' ? `${val}%` : val.toLocaleString();
                    const color = idx === 0 ? 'bg-neon-purple' : idx === 1 ? 'bg-neon-cyan' : 'bg-blue-500';

                    return (
                        <div key={item.tone} className="relative group">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-bold text-slate-800 dark:text-slate-200">{item.tone} Tone</span>
                                <span className="font-mono text-neon-cyan">{displayVal}</span>
                            </div>
                            <div className="h-3 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${color} rounded-full transition-all duration-1000 ease-out group-hover:brightness-110`} 
                                    style={{ width: loading ? '0%' : `${percent}%` }}
                                >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" style={{ content: '""' }} />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                {item.tone === 'Student' && 'High virality potential due to relatability.'}
                                {item.tone === 'Founder' && 'Consistent engagement from loyal followers.'}
                                {item.tone === 'Builder' && 'Niche reach, high technical authority.'}
                            </p>
                        </div>
                    );
                })}
            </div>
        </Card>

        {/* Growth Chart */}
        <Card className="p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Growth</h3>
              <select className="app-input rounded text-xs px-2 py-1 outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
              </select>
          </div>
          <div className="h-48 flex items-end justify-between gap-2 mt-auto">
            {growthData.map((h, i) => (
              <div key={i} className="w-full bg-slate-200 dark:bg-white/5 hover:bg-neon-cyan/20 rounded-t-lg transition-all relative group cursor-pointer">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neon-cyan/40 to-neon-cyan rounded-t-lg transition-all duration-700 ease-out group-hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                  style={{ height: `${loading ? 0 : h}%` }}
                />
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-xs text-white px-2 py-1 rounded pointer-events-none transition-opacity">
                    {Math.floor(h * 10)} views
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-slate-500 dark:text-slate-500 font-mono border-t border-slate-300/60 dark:border-white/5 pt-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </Card>
      </div>
    </div>
  );
};