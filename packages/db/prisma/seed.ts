// import { PrismaClient } from "../generated/prisma";
// const prisma = new PrismaClient();

// const seed = async() => {
//     try{
//         console.log("We are starting it");

//         const user1 = await prisma.user.create({
//             data:{
//                 email: "VanshchitranshUNIQU11E1@gmail.com",
//                 clerkId: "user_2z8QqevXQWnDyGvCfkZo8i9xUhW"
//             }
//         });

//         const website1 = await prisma.websites.create({
//             data:{
//                 url: "https://example.com",
//                 userId: user1.id,
//             }
//         });

//         const validator1 = await prisma.validator.create({
//             data:{
//                 id: "100",
//                 publicKey: "thisIsUnique11",
//                 location:"RMP",
//                 ip:"127.0.1.1",
//             }
//         })

//         const Tick1 = await prisma.websiteTicks.create({
//             data:{
//                 websiteId: website1.id,
//                 validatorId: validator1.id,
//                 timeStamps: new Date(),
//                 status: "Good",
//                 latency: 150.5,
//             }
//         });

//         const Tick2 = await prisma.websiteTicks.create({
//             data:{
//                 websiteId: website1.id,
//                 validatorId: validator1.id,
//                 timeStamps: new Date(Date.now()  - (60 * 1000 * 10)),
//                 status: "Good",
//                 latency: 250.2
//             }
//         });

//         const Tick3 = await prisma.websiteTicks.create({
//             data:{
//                 websiteId: website1.id,
//                 validatorId: validator1.id,
//                 timeStamps: new Date(Date.now() - (60 * 1000 * 20)),
//                 status: "Bad",
//                 latency: 60.09
//             }
//         })
//     }catch(err){
//         console.log("Here is the error, ", err);
//     } finally{
//         await prisma.$disconnect();
//     }
// }

// seed().then(() => {
//     console.log("Seed is running")
//     process.exit(0)
// })
// .catch((error) => {
//     console.log("Seed failed")
//     process.exit(1)
// })

import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

const seed = async() => {
    try{
        console.log("We are starting it");

        // UPDATED: Use your actual Clerk user ID
        const user1 = await prisma.user.create({
            data:{
                email: "your-email@gmail.com", // Replace with your actual email
                clerkId: "user_2z8QqevXQWnDyGvCfkZo8i9xUhW" // Your actual Clerk ID from the token
            }
        });

        const website1 = await prisma.websites.create({
            data:{
                url: "https://example.com",
                userId: user1.id,
            }
        });

        const validator1 = await prisma.validator.create({
            data:{
                id: "100",
                publicKey: "thisIsUnique11",
                location:"RMP",
                ip:"127.0.1.1",
            }
        })

        // Create multiple ticks for better visualization
        const now = new Date();
        
        // Recent good tick
        const Tick1 = await prisma.websiteTicks.create({
            data:{
                websiteId: website1.id,
                validatorId: validator1.id,
                timeStamps: now,
                status: "Good",
                latency: 150.5,
            }
        });

        // Tick from 5 minutes ago
        const Tick2 = await prisma.websiteTicks.create({
            data:{
                websiteId: website1.id,
                validatorId: validator1.id,
                timeStamps: new Date(now.getTime() - (5 * 60 * 1000)),
                status: "Good",
                latency: 250.2
            }
        });

        // Tick from 10 minutes ago (Bad status)
        const Tick3 = await prisma.websiteTicks.create({
            data:{
                websiteId: website1.id,
                validatorId: validator1.id,
                timeStamps: new Date(now.getTime() - (10 * 60 * 1000)),
                status: "Bad",
                latency: 0
            }
        });

        // Tick from 15 minutes ago
        const Tick4 = await prisma.websiteTicks.create({
            data:{
                websiteId: website1.id,
                validatorId: validator1.id,
                timeStamps: new Date(now.getTime() - (15 * 60 * 1000)),
                status: "Good",
                latency: 180.3
            }
        });

        // Add a second website for testing
        const website2 = await prisma.websites.create({
            data:{
                url: "https://google.com",
                userId: user1.id,
            }
        });

        // Add ticks for second website
        const Tick5 = await prisma.websiteTicks.create({
            data:{
                websiteId: website2.id,
                validatorId: validator1.id,
                timeStamps: now,
                status: "Good",
                latency: 89.5,
            }
        });

        console.log("Seed data created successfully!");
        console.log("User ID:", user1.id);
        console.log("Website 1 ID:", website1.id);
        console.log("Website 2 ID:", website2.id);
        console.log("Validator ID:", validator1.id);

    }catch(err){
        console.log("Here is the error, ", err);
    } finally{
        await prisma.$disconnect();
    }
}

seed().then(() => {
    console.log("Seed completed successfully")
    process.exit(0)
})
.catch((error) => {
    console.log("Seed failed:", error)
    process.exit(1)
})