"use client"
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Plus, 
  Settings, 
  Bell,
  RefreshCw,
  ChevronDown, 
  ChevronRight, 
  Globe, 
  Clock, 
  Zap,
  Trash2,
  ExternalLink,
  X
} from 'lucide-react';

// Types
interface UptimeWindow {
  timestamp: string;
  status: 'up' | 'down';
  responseTime: number;
}

interface Tick {
  id: string;
  createdAt: string;
  status: boolean;
  latency: number;
}

interface Website {
  id: string;
  url: string;
  ticks: Tick[];
}

interface TransformedWebsite {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'degraded';
  uptime: number;
  responseTime: number;
  lastChecked: string;
  uptimeHistory: UptimeWindow[];
}

// Custom Hook for Website Management
const useWebsites = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate mock data for demonstration
  const mockWebsites: Website[] = [];

  function generateMockTicks(isUp: boolean, avgLatency: number): Tick[] {
    const ticks: Tick[] = [];
    const now = new Date();
    
    // Generate ticks for the last 30 minutes (every 30 seconds)
    for (let i = 60; i >= 0; i--) {
      const tickTime = new Date(now.getTime() - i * 30 * 1000);
      const randomVariation = (Math.random() - 0.5) * 100;
      const latency = isUp ? Math.max(50, avgLatency + randomVariation) : 0;
      
      // Simulate occasional downtime
      const status = isUp ? (Math.random() > 0.05) : false;
      
      ticks.push({
        id: `tick-${i}`,
        createdAt: tickTime.toISOString(),
        status,
        latency: Math.round(latency)
      });
    }
    
    return ticks;
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setWebsites([]);
      setLoading(false);
    }, 1000);
  }, []);

  const refreshWebsites = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update with fresh mock data
    const updatedWebsites = websites.map(site => ({
      ...site,
      ticks: generateMockTicks(
        site.ticks.length > 0 ? site.ticks[site.ticks.length - 1].status : true,
        site.ticks.length > 0 ? site.ticks[site.ticks.length - 1].latency : 200
      )
    }));
    
    setWebsites(updatedWebsites);
    setLoading(false);
  };

  const addWebsite = async (url: string): Promise<boolean> => {
    try {
      const newWebsite: Website = {
        id: Date.now().toString(),
        url,
        ticks: generateMockTicks(true, 200 + Math.random() * 300)
      };
      
      setWebsites(prev => [...prev, newWebsite]);
      return true;
    } catch (error) {
      console.error('Failed to add website:', error);
      return false;
    }
  };

  const removeWebsite = async (id: string): Promise<boolean> => {
    try {
      setWebsites(prev => prev.filter(site => site.id !== id));
      return true;
    } catch (error) {
      console.error('Failed to remove website:', error);
      return false;
    }
  };

  return {
    websites,
    loading,
    refreshWebsites,
    addWebsite,
    removeWebsite
  };
};

// Utility Functions
const extractDomainName = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
};

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

const aggregateTicksToThreeMinuteWindows = (ticks: Tick[]): UptimeWindow[] => {
  if (!ticks || ticks.length === 0) {
    // Return empty windows for the last 30 minutes if no ticks
    const now = new Date();
    const windows: UptimeWindow[] = [];
    
    for (let i = 9; i >= 0; i--) {
      const windowEnd = new Date(now.getTime() - i * 3 * 60 * 1000);
      windows.push({
        timestamp: windowEnd.toISOString(),
        status: 'down' as const,
        responseTime: 0
      });
    }
    
    return windows;
  }

  const sortedTicks = [...ticks].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const now = new Date();
  const windows: UptimeWindow[] = [];
  
  for (let i = 9; i >= 0; i--) {
    const windowStart = new Date(now.getTime() - (i + 1) * 3 * 60 * 1000);
    const windowEnd = new Date(now.getTime() - i * 3 * 60 * 1000);
    
    const windowTicks = sortedTicks.filter(tick => {
      const tickTime = new Date(tick.createdAt);
      return tickTime >= windowStart && tickTime < windowEnd;
    });
    
    let status: 'up' | 'down' = 'down';
    let avgResponseTime = 0;
    
    if (windowTicks.length > 0) {
      const hasDownTick = windowTicks.some(tick => !tick.status);
      status = hasDownTick ? 'down' : 'up';
      
      const successfulTicks = windowTicks.filter(tick => tick.status);
      if (successfulTicks.length > 0) {
        avgResponseTime = Math.round(
          successfulTicks.reduce((sum, tick) => sum + tick.latency, 0) / successfulTicks.length
        );
      }
    }
    
    windows.push({
      timestamp: windowEnd.toISOString(),
      status,
      responseTime: avgResponseTime
    });
  }
  
  return windows;
};

const transformWebsiteData = (websites: Website[] = []): TransformedWebsite[] => {
  return websites.map(site => {
    const uptimeHistory = aggregateTicksToThreeMinuteWindows(site.ticks);
    
    // Calculate uptime for last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentTicks = site.ticks?.filter(tick => 
      new Date(tick.createdAt) >= oneDayAgo
    ) || [];
    
    const uptime = recentTicks.length > 0 
      ? Math.round((recentTicks.filter(tick => tick.status).length / recentTicks.length) * 100 * 10) / 10
      : 0;
    
    // Get latest tick for current status
    const latestTick = site.ticks && site.ticks.length > 0 
      ? site.ticks.reduce((latest, current) => 
          new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
        )
      : null;
    
    let status: 'up' | 'down' | 'degraded' = 'down';
    let responseTime = 0;
    
    if (latestTick) {
      if (latestTick.status) {
        status = latestTick.latency > 1000 ? 'degraded' : 'up';
        responseTime = latestTick.latency;
      } else {
        status = 'down';
      }
    }
    
    const lastChecked = latestTick 
      ? getRelativeTime(new Date(latestTick.createdAt))
      : 'Never';
    
    const name = extractDomainName(site.url);
    
    return {
      id: site.id,
      name,
      url: site.url,
      status,
      uptime,
      responseTime,
      lastChecked,
      uptimeHistory
    };
  });
};

// Components
interface StatusIndicatorProps {
  status: 'up' | 'down' | 'degraded';
  size?: 'sm' | 'md' | 'lg';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3', 
    lg: 'w-4 h-4'
  };

  const statusClasses = {
    up: 'bg-green-500 shadow-green-200',
    down: 'bg-red-500 shadow-red-200',
    degraded: 'bg-yellow-500 shadow-yellow-200'
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${statusClasses[status]} rounded-full shadow-lg`} 
    />
  );
};

interface UptimeChartProps {
  data: UptimeWindow[];
}

const UptimeChart: React.FC<UptimeChartProps> = ({ data }) => {
  return (
    <div className="flex items-end space-x-1 h-16 bg-gray-50 p-2 rounded-lg">
      {data.map((point, index) => (
        <div
          key={index}
          className={`flex-1 rounded-sm transition-all duration-500 hover:opacity-80 cursor-pointer ${
            point.status === 'up' 
              ? 'bg-gradient-to-t from-green-400 to-green-500 hover:from-green-500 hover:to-green-600' 
              : 'bg-gradient-to-t from-red-400 to-red-500 hover:from-red-500 hover:to-red-600'
          }`}
          style={{ 
            height: point.status === 'up' 
              ? `${Math.max(80, Math.min(100, (point.responseTime / 10) + 60))}%`
              : '20%' 
          }}
          title={`${new Date(point.timestamp).toLocaleTimeString()} - ${point.status.toUpperCase()} ${
            point.responseTime > 0 ? `(${point.responseTime}ms)` : ''
          }`}
        />
      ))}
    </div>
  );
};

interface WebsiteCardProps {
  website: TransformedWebsite;
  onRemove?: (id: string) => void;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'up': return 'Operational';
      case 'down': return 'Down';
      case 'degraded': return 'Degraded';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'degraded': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(website.id);
    }
  };

  const handleVisitSite = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(website.url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300">
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <StatusIndicator status={website.status} size="lg" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <span>{website.name}</span>
                <button
                  onClick={handleVisitSite}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title="Visit website"
                >
                  <ExternalLink size={16} />
                </button>
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Globe size={14} />
                <span>{website.url}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className={`text-sm font-medium ${getStatusColor(website.status)}`}>
                {getStatusText(website.status)}
              </div>
              <div className="text-xs text-gray-500">
                Last checked {website.lastChecked}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{website.uptime}%</div>
              <div className="text-xs text-gray-500">Uptime</div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {website.responseTime > 0 ? `${website.responseTime}ms` : '-'}
              </div>
              <div className="text-xs text-gray-500">Response</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRemove}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove website"
              >
                <Trash2 size={16} />
              </button>
              <div className="flex items-center">
                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-gray-100 p-6 bg-gradient-to-br from-gray-50 to-white animate-in slide-in-from-top duration-300">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock size={16} className="mr-2" />
                  Uptime History (Last 30 minutes)
                </h4>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Operational</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Downtime</span>
                  </div>
                </div>
              </div>
              <UptimeChart data={website.uptimeHistory} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-green-600">{website.uptime}%</div>
                    <div className="text-sm text-gray-500">24-hour uptime</div>
                  </div>
                  <Zap className="text-green-500" size={28} />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      {website.responseTime > 0 ? `${website.responseTime}ms` : '-'}
                    </div>
                    <div className="text-sm text-gray-500">Last response time</div>
                  </div>
                  <Clock className="text-blue-500" size={28} />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-3xl font-bold ${getStatusColor(website.status)}`}>
                      {getStatusText(website.status)}
                    </div>
                    <div className="text-sm text-gray-500">Current status</div>
                  </div>
                  <StatusIndicator status={website.status} size="lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface AddWebsiteFormProps {
  onAdd: (url: string) => Promise<boolean>;
  onCancel: () => void;
}

const AddWebsiteForm: React.FC<AddWebsiteFormProps> = ({ onAdd, onCancel }) => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!websiteUrl.trim()) {
      setError('Please enter a website URL');
      return;
    }

    if (!validateUrl(websiteUrl)) {
      setError('Please enter a valid URL (including http:// or https://)');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const success = await onAdd(websiteUrl);
      if (success) {
        setWebsiteUrl('');
        onCancel();
      } else {
        setError('Failed to add website. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while adding the website.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="url"
                  id="websiteUrl"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors caret-black text-black"
                  required
                  disabled={isSubmitting}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !websiteUrl.trim()}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>{isSubmitting ? 'Adding...' : 'Add Website'}</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const { websites, loading, refreshWebsites, addWebsite, removeWebsite } = useWebsites();
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const transformedWebsites = transformWebsiteData(websites);
  
  const totalSites = transformedWebsites.length;
  const upSites = transformedWebsites.filter(site => site.status === 'up').length;
  const downSites = transformedWebsites.filter(site => site.status === 'down').length;
  const degradedSites = transformedWebsites.filter(site => site.status === 'degraded').length;

  const handleAddWebsite = () => {
    setShowAddForm(true);
  };

  const handleAddSubmit = async (url: string): Promise<boolean> => {
    const success = await addWebsite(url);
    return success;
  };

  const handleRemoveWebsite = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this website from monitoring?')) {
      await removeWebsite(id);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshWebsites();
    setTimeout(() => setRefreshing(false), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your websites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Activity className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">UpTime Monitor</h1>
                <p className="text-sm text-gray-500">Real-time website monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings size={20} />
              </button>
              <button 
                onClick={handleAddWebsite}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                <Plus size={16} className="mr-2" />
                Add Website
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{totalSites}</div>
                <div className="text-sm text-gray-500">Total Websites</div>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Activity className="text-gray-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">{upSites}</div>
                <div className="text-sm text-gray-500">Operational</div>
              </div>
              <div className="w-6 h-6 bg-green-500 rounded-full shadow-green-200 shadow-lg"></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-600">{downSites}</div>
                <div className="text-sm text-gray-500">Down</div>
              </div>
              <div className="w-6 h-6 bg-red-500 rounded-full  shadow-red-200 shadow-lg"></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-600">{degradedSites}</div>
                <div className="text-sm text-gray-500">Degraded</div>
              </div>
              <div className="w-6 h-6 bg-yellow-500 rounded-full shadow-yellow-200 shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Add Website Form */}
        {showAddForm && (
          <AddWebsiteForm
            onAdd={handleAddSubmit}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Websites List */}
        <div className="space-y-4">
          {transformedWebsites.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Activity className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No websites monitored yet</h3>
              <p className="text-gray-500 mb-6">
                Add your first website to start monitoring its uptime and performance.
              </p>
              <button
                onClick={handleAddWebsite}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                <Plus size={20} className="mr-2" />
                Add Your First Website
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Monitored Websites ({transformedWebsites.length})
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              
              {transformedWebsites.map((website) => (
                <WebsiteCard
                  key={website.id}
                  website={website}
                  onRemove={handleRemoveWebsite}
                />
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>UpTime Monitor - Keep track of your websites' availability and performance</p>
            <p className="mt-2">
              Monitoring {totalSites} website{totalSites !== 1 ? 's' : ''} with real-time updates
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;