import express  from "express";
import { authMiddleWare } from "./middleware";
import { PrismaClient } from "../../packages/db/generated/prisma";
import { prismaClient } from "db/client";

const app = express();

app.post('/api/v1/website', authMiddleWare, async(req,res) => {
    const userId = req.userId!
    const { url } = req.body;
    
    const data = await prismaClient.websites.create({
        data:{
            url,
            userId
        }
    })
    res.json({
        id: data.id
    })
})

app.get('/api/v1/websites/status', authMiddleWare ,(req,res) => {

})

app.get('/api/v1/websites', authMiddleWare ,(req,res) => {

})

app.delete('/api/v1/websites', authMiddleWare ,(req,res) => {

})

app.listen(3000, () => {
    console.log("Server is up and running on 3000")
})