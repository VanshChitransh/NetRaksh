import express  from "express";
import { authMiddleWare } from "./authMiddleWare";
import { PrismaClient } from "../../packages/db/generated/prisma";
import { prismaClient } from "db/client";
import { webcrypto } from "crypto";
import cors from 'cors'

const app = express();
app.use(express.json())
app.use(cors())

app.post('/api/v1/website', authMiddleWare, async(req,res) => {
    const userId = req.userId!
    const { url } = req.body;
    
    const data = await prismaClient.websites.create({
        data:{
            url,
            userId,
            // disabled: false
        }
    })
    res.json({
        id: data.id
    })
})

app.get('/api/v1/websites/status', authMiddleWare, async(req,res) => {
    const wesbiteId = req.query.websiteId! as unknown as string;
    const userId = req.userId;
    const data = await prismaClient.websites.findFirst({
        where:{
            id: wesbiteId,
            userId,
            disabled: false
        },include:{
            ticks: true
        }
    })
    res.json(data);

})

app.get('/api/v1/websites', authMiddleWare, async(req,res) => {
    const userId = req.userId;
    const allWebsites = await prismaClient.websites.findMany({
        where:{
            userId: userId,
            disabled: false
        }, include:{
            ticks: true
        }
    })
    res.json(allWebsites);
})

app.delete('/api/v1/websites', authMiddleWare, async(req,res) => {
    const websiteId = req.body.wesbiteId;
    const userId = req.userId!;
    const result = await prismaClient.websites.update({
        where:{
            id: websiteId,
            userId
        },
        data:{
            disabled: true
        }
    })
    if(result){
        res.json({msg: "Deleted"})
    }
})

app.listen(4000, () => {
    console.log("Server is up and running on 3000")
})