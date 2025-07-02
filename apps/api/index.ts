import express from "express";
import { authMiddleWare } from "./authMiddleWare";
import { PrismaClient } from "../../packages/db/generated/prisma";
import { prismaClient } from "db/client";
import { webcrypto } from "crypto";
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; 



app.post('/api/v1/website', authMiddleWare, async(req, res) => {
    try {
        const userId = req.userId!;
        const { url } = req.body;
        
        if (!url) {
            res.status(400).json({ error: 'URL is required' });
            return;
        }
        
      
        try {
            new URL(url);
        } catch (error) {
            res.status(400).json({ error: 'Invalid URL format' });
            return;
        }
        
      
        const existingWebsite = await prismaClient.websites.findFirst({
            where: {
                url,
                userId,
                disabled: false
            }
        });
        
        if (existingWebsite) {
            res.status(409).json({ error: 'Website already exists in your monitoring list' });
            return;
        }
        
        const data = await prismaClient.websites.create({
            data: {
                url,
                userId,
                disabled: false 
            }
        });
        
        res.status(201).json({
            id: data.id,
            url: data.url,
            message: 'Website added successfully'
        });
        
    } catch (error) {
        console.error('Error adding website:', error);
        res.status(500).json({ error: 'Failed to add website' });
        return;
    }
});


app.get('/api/v1/website/status', authMiddleWare, async(req, res) => {
    try {
        const websiteId = req.query.websiteId as string; 
        const userId = req.userId!;
        
        if (!websiteId) {
            res.status(400).json({ error: 'Website ID is required' });
            return;
        }
        
        const data = await prismaClient.websites.findFirst({
            where: {
                id: websiteId,
                userId: userId,
                disabled: false
            },
            include: {
                ticks: {
                    orderBy: {
                        timeStamps: 'desc'
                    },
                    take: 1000
                }
            }
        });
        
        if (!data) {
            res.status(404).json({ error: 'Website not found' });
            return;
        }
        
        res.json(data);
        
    } catch (error) {
        console.error('Error fetching website status:', error);
        res.status(500).json({ error: 'Failed to fetch website status' });
        return;
    }
});


app.get('/api/v1/websites', authMiddleWare, async(req, res) => {
    try {
        const userId = req.userId!;
        
        const allWebsites = await prismaClient.websites.findMany({
            where: {
                userId: userId,
                disabled: false
            },
            include: {
                ticks: {
                    orderBy: {
                        timeStamps: 'desc'
                    },
                    take: 1000
                }
            },
            orderBy: {
                url: 'asc'
            }
        });
        
        res.json(allWebsites);
        
    } catch (error) {
        console.error('Error fetching websites:', error);
        res.status(500).json({ error: 'Failed to fetch websites' });
        return;
    }
});


app.delete('/api/v1/website/:id', authMiddleWare, async(req, res) => {
    try {
        const websiteId = req.params.id;
        const userId = req.userId!;
        
        if (!websiteId) {
            res.status(400).json({ error: 'Website ID is required' });
            return;
        }

        const existingWebsite = await prismaClient.websites.findFirst({
            where: {
                id: websiteId,
                userId: userId,
                disabled: false
            }
        });

        if (!existingWebsite) {
            res.status(404).json({ error: 'Website not found or already deleted' });
            return;
        }

        const result = await prismaClient.websites.updateMany({
            where: {
                id: websiteId,
                userId: userId
            },
            data: {
                disabled: true
            }
        });
        
        if (result.count > 0) {
            res.json({ message: "Website deleted successfully" });
        } else {
            res.status(500).json({ error: 'Failed to delete website' });
            return;
        }
        
    } catch (error) {
        console.error('Error deleting website:', error);
        res.status(500).json({ error: 'Failed to delete website' });
        return;
    }
});

app.listen(4000, () => {
    console.log("Server is up and running on 4000");
});
