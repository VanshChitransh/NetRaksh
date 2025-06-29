// "use client"

// import { useAuth } from "@clerk/nextjs";
// import { useEffect, useState } from "react";
// import axios from "axios";
// const API_BACKEND_URL = "http://localhost:4000";


// interface Website{
//     id: string
//     url: string
//     ticks: {
//         id: string
//         createdAt: string
//         status: boolean
//         latency: number
//     }[];
// }

// const useWebsite = () => {
//     const { getToken } = useAuth();
//     const [websites, setWebsites] = useState<Website[]>([]);

//     const refreshWebsite = async() => {
//         const token = await getToken();
//         const response = await axios.get(`${API_BACKEND_URL}/api/v1/websites`,{
//             headers:{
//                 Authorization: token,
//             }
//         })
//         setWebsites(response.data.websites);
//     }
    
//     useEffect(() => {
//         refreshWebsite();
//         const interval = setInterval(() => {
//             refreshWebsite();
//         }, 1000 * 60 * 1);
//         return () => {clearInterval(interval)};
//     },[])
    
//     return { websites, refreshWebsite };
// };

// export default useWebsite


"use client"

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BACKEND_URL = "http://localhost:4000";

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

interface UseWebsitesReturn {
    websites: Website[];
    loading: boolean;
    refreshWebsites: () => Promise<void>;
    addWebsite: (url: string) => Promise<boolean>;
    removeWebsite: (id: string) => Promise<boolean>;
}

const useWebsites = (): UseWebsitesReturn => {
    const { getToken } = useAuth();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const refreshWebsites = async (): Promise<void> => {
        try {
            const token = await getToken();
            const response = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setWebsites(response.data.websites || []);
        } catch (error) {
            console.error('Failed to refresh websites:', error);
            setWebsites([]);
        } finally {
            setLoading(false);
        }
    };

    const addWebsite = async (url: string): Promise<boolean> => {
        try {
            const token = await getToken();
            const response = await axios.post(
                `${API_BACKEND_URL}/api/v1/websites`,
                { url },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            if (response.status === 200 || response.status === 201) {
                await refreshWebsites(); // Refresh the list after adding
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to add website:', error);
            return false;
        }
    };

    const removeWebsite = async (id: string): Promise<boolean> => {
        try {
            const token = await getToken();
            const response = await axios.delete(`${API_BACKEND_URL}/api/v1/websites/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            if (response.status === 200 || response.status === 204) {
                await refreshWebsites(); // Refresh the list after removing
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to remove website:', error);
            return false;
        }
    };
    
    useEffect(() => {
        refreshWebsites();
        const interval = setInterval(() => {
            refreshWebsites();
        }, 1000 * 60 * 1); // Refresh every minute
        
        return () => {
            clearInterval(interval);
        };
    }, []);
    
    return { 
        websites, 
        loading, 
        refreshWebsites, 
        addWebsite, 
        removeWebsite 
    };
};

export default useWebsites;