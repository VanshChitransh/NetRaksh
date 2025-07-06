"use client"

import React, { useState } from 'react';
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
import useWebsites, { TransformedWebsite, UptimeWindow } from '@/hooks/useWebsites';


interface StatusIndicatorProps {
  status: 'Good' | 'Bad' | 'degraded' | 'no-data';
  size?: 'sm' | 'md' | 'lg';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3', 
    lg: 'w-4 h-4'
  };

  const statusClasses = {
   Good: 'bg-green-500 shadow-green-200',
    Bad: 'bg-red-500 shadow-red-200',
    degraded: 'bg-yellow-500 shadow-yellow-200',
    'no-data': 'bg-gray-400 shadow-gray-200'
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
      {data.map((point, index) => {
        let bgClass = '';
        let height = '';
        
        if (point.status === 'Good') {
          bgClass = 'bg-gradient-to-t from-green-400 to-green-500 hover:from-green-500 hover:to-green-600';
          height = `${Math.max(80, Math.min(100, (point.responseTime / 10) + 60))}%`;
        } else if (point.status === 'Bad') {
          bgClass = 'bg-gradient-to-t from-red-400 to-red-500 hover:from-red-500 hover:to-red-600';
          height = '20%';
        } else {
          bgClass = 'bg-gradient-to-t from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500';
          height = '10%';
        }
        
        return (
          <div
            key={index}
            className={`flex-1 rounded-sm transition-all duration-500 hover:opacity-80 cursor-pointer ${bgClass}`}
            style={{ height }}
            title={
              point.status === 'no-data' 
                ? `${new Date(point.timestamp).toLocaleTimeString()} - NO DATA`
                : `${new Date(point.timestamp).toLocaleTimeString()} - ${point.status.toUpperCase()} ${
                    point.responseTime > 0 ? `(${point.responseTime}ms)` : ''
                  }`
            }
          />
        );
      })}
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
      case 'Good': return 'Operational';
      case 'Bad': return 'Bad';
      case 'degraded': return 'Degraded';
      case 'no-data': return 'No Data';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return 'text-green-600';
      case 'Bad': return 'text-red-600';
      case 'degraded': return 'text-yellow-600';
      case 'no-data': return 'text-gray-600';
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
              <div className="text-lg font-bold text-gray-900">
                {website.status === 'no-data' ? '-' : `${website.uptime}%`}
              </div>
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
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>No Data</span>
                  </div>
                </div>
              </div>
              <UptimeChart data={website.uptimeHistory} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-3xl font-bold ${
                      website.status === 'no-data' ? 'text-gray-400' : 'text-green-600'
                    }`}>
                      {website.status === 'no-data' ? '-' : `${website.uptime}%`}
                    </div>
                    <div className="text-sm text-gray-500">24-hour uptime</div>
                  </div>
                  <Zap className={website.status === 'no-data' ? 'text-gray-400' : 'text-green-500'} size={28} />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-3xl font-bold ${
                      website.responseTime > 0 ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {website.responseTime > 0 ? `${website.responseTime}ms` : '-'}
                    </div>
                    <div className="text-sm text-gray-500">Last response time</div>
                  </div>
                  <Clock className={website.responseTime > 0 ? 'text-blue-500' : 'text-gray-400'} size={28} />
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
      setError(`An error occurred while adding the website. + ${error}`);
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


export default function Dashboard() {
  const { 
    transformedWebsites, 
    loading, 
    refreshWebsites, 
    addWebsite, 
    removeWebsite 
  } = useWebsites();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const totalSites = transformedWebsites.length;
  const upSites = transformedWebsites.filter(site => site.status === 'Good').length;
  const downSites = transformedWebsites.filter(site => site.status === 'Bad').length;
  const degradedSites = transformedWebsites.filter(site => site.status === 'degraded').length;
  const noDataSites = transformedWebsites.filter(site => site.status === 'no-data').length;

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


      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Activity className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DePIN UpTime Monitor</h1>
                <p className="text-sm text-gray-500">Decentralized website monitoring</p>
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

  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
              <div className="w-6 h-6 bg-red-500 rounded-full shadow-red-200 shadow-lg"></div>
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
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-600">{noDataSites}</div>
                <div className="text-sm text-gray-500">No Data</div>
              </div>
              <div className="w-6 h-6 bg-gray-400 rounded-full shadow-gray-200 shadow-lg"></div>
            </div>
          </div>
        </div>

        {showAddForm && (
         <AddWebsiteForm
           onAdd={handleAddSubmit}
           onCancel={() => setShowAddForm(false)}
         />
       )}

       <div className="space-y-6">
         {transformedWebsites.length === 0 ? (
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Activity className="text-gray-400" size={32} />
             </div>
             <h3 className="text-lg font-medium text-gray-900 mb-2">No websites being monitored</h3>
             <p className="text-gray-500 mb-6">Add your first website to start monitoring its uptime and performance.</p>
             <button 
               onClick={handleAddWebsite}
               className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
             >
               <Plus size={16} className="mr-2" />
               Add Your First Website
             </button>
           </div>
         ) : (
           transformedWebsites.map((website) => (
             <WebsiteCard
               key={website.id}
               website={website}
               onRemove={handleRemoveWebsite}
             />
           ))
         )}
       </div>
     </div>
   </div>
 );
}