"use client"

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BACKEND_URL = "http://localhost:4000";


interface Tick {
    id: string;
    timeStamps: string; 
    status: 'Good' | 'Bad'; 
    latency: number;
}

interface Website {
    id: string;
    url: string;
    userId: string;
    disabled: boolean;
    ticks: Tick[];
}

interface UptimeWindow {
    timestamp: string;
    status: 'up' | 'down' | 'no-data';
    responseTime: number;
}

interface TransformedWebsite {
    id: string;
    name: string;
    url: string;
    status: 'up' | 'down' | 'degraded' | 'no-data';
    uptime: number;
    responseTime: number;
    lastChecked: string;
    uptimeHistory: UptimeWindow[];
}

interface UseWebsitesReturn {
    websites: Website[];
    transformedWebsites: TransformedWebsite[];
    loading: boolean;
    refreshWebsites: () => Promise<void>;
    addWebsite: (url: string) => Promise<boolean>;
    removeWebsite: (id: string) => Promise<boolean>;
}


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
    const now = new Date();
    const windows: UptimeWindow[] = [];
    
    for (let i = 9; i >= 0; i--) {
        const windowStart = new Date(now.getTime() - (i + 1) * 3 * 60 * 1000);
        const windowEnd = new Date(now.getTime() - i * 3 * 60 * 1000);
        
        if (!ticks || ticks.length === 0) {
            windows.push({
                timestamp: windowEnd.toISOString(),
                status: 'no-data',
                responseTime: 0
            });
            continue;
        }

        const sortedTicks = [...ticks].sort((a, b) => 
            new Date(a.timeStamps).getTime() - new Date(b.timeStamps).getTime()
        );
        
        const windowTicks = sortedTicks.filter(tick => {
            const tickTime = new Date(tick.timeStamps);
            return tickTime >= windowStart && tickTime < windowEnd;
        });
        
        if (windowTicks.length === 0) {
            windows.push({
                timestamp: windowEnd.toISOString(),
                status: 'no-data',
                responseTime: 0
            });
            continue;
        }
        
        
        const hasDownTick = windowTicks.some(tick => tick.status === 'Bad');
        const status: 'up' | 'down' = hasDownTick ? 'down' : 'up';
        
        const successfulTicks = windowTicks.filter(tick => tick.status === 'Good');
        const avgResponseTime = successfulTicks.length > 0
            ? Math.round(successfulTicks.reduce((sum, tick) => sum + tick.latency, 0) / successfulTicks.length)
            : 0;
        
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
        
        if (!site.ticks || site.ticks.length === 0) {
            return {
                id: site.id,
                name: extractDomainName(site.url),
                url: site.url,
                status: 'no-data' as const,
                uptime: 0,
                responseTime: 0,
                lastChecked: 'Never',
                uptimeHistory
            };
        }
        
      
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentTicks = site.ticks.filter(tick => 
            new Date(tick.timeStamps) >= oneDayAgo
        );
        
        const uptime = recentTicks.length > 0 
            ? Math.round((recentTicks.filter(tick => tick.status === 'Good').length / recentTicks.length) * 100 * 10) / 10
            : 0;
        
        
        const latestTick = site.ticks.reduce((latest, current) => 
            new Date(current.timeStamps) > new Date(latest.timeStamps) ? current : latest
        );
        
        let status: 'up' | 'down' | 'degraded' = 'down';
        let responseTime = 0;
        
        if (latestTick.status === 'Good') {
            status = latestTick.latency > 1000 ? 'degraded' : 'up';
            responseTime = latestTick.latency;
        } else {
            status = 'down';
        }
        
        const lastChecked = getRelativeTime(new Date(latestTick.timeStamps));
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


const useWebsites = (): UseWebsitesReturn => {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const refreshWebsites = async (): Promise<void> => {
        if (!isLoaded || !isSignedIn) {
            setWebsites([]);
            setLoading(false);
            return;
        }

        try {
            const token = await getToken();
            if (!token) {
                console.error('No authentication token available');
                setWebsites([]);
                setLoading(false);
                return;
            }
            
            const response = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setWebsites(response.data || []);
        } catch (error) {
            console.error('Failed to refresh websites:', error);
            setWebsites([]);
        } finally {
            setLoading(false);
        }
    };

    const addWebsite = async (url: string): Promise<boolean> => {
        if (!isLoaded || !isSignedIn) {
            console.error('User not authenticated');
            return false;
        }

        try {
            
            try {
                new URL(url);
            } catch {
                console.error('Invalid URL format');
                return false;
            }

            const token = await getToken();
            if (!token) {
                console.error('No authentication token available');
                return false;
            }
            
            const response = await axios.post(
                `${API_BACKEND_URL}/api/v1/website`,
                { url },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            if (response.status === 200 || response.status === 201) {
                await refreshWebsites(); 
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to add website:', error);
            return false;
        }
    };

    const removeWebsite = async (id: string): Promise<boolean> => {
        if (!isLoaded || !isSignedIn) {
            console.error('User not authenticated');
            return false;
        }

        try {
            const token = await getToken();
            if (!token) {
                console.error('No authentication token available');
                return false;
            }
            
            const response = await axios.delete(`${API_BACKEND_URL}/api/v1/website/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            if (response.status === 200 || response.status === 204) {
                await refreshWebsites();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to remove website:', error);
            return false;
        }
    };
    
    useEffect(() => {
        if (isLoaded) {
            refreshWebsites();
            
            const interval = setInterval(() => {
                refreshWebsites();
            }, 1000 * 60 * 1); 
            
            return () => {
                clearInterval(interval);
            };
        }
    }, [isLoaded, isSignedIn]);

    
    const transformedWebsites = transformWebsiteData(websites);
    
    return { 
        websites, 
        transformedWebsites,
        loading, 
        refreshWebsites, 
        addWebsite, 
        removeWebsite 
    };
};

export default useWebsites;


export type { Website, Tick, TransformedWebsite, UptimeWindow, UseWebsitesReturn };