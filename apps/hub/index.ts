import { randomUUIDv7, type ServerWebSocket } from "bun";
import type{IncomingMessage, SignupIncomingMessage} from "../../packages/common";
import { prismaClient } from 'db/client'
import { PublicKey } from "@solana/web3.js";
import nacl from 'tweetnacl';
import nacl_util from 'tweetnacl-util';

const availableValidators: { validatorId: string, socket: ServerWebSocket<unknown>, PublicKey: string }[] = []

const CALLBACKS: {[callbackId: string] : (data: IncomingMessage) => void} = {}
const cost_per_validation = 100;

Bun.serve({
    fetch(req,server){
        if(server.upgrade(req)){
            return;
        }
        return new Response("Upgrade failed", {status: 500});
    },
    port: 8001,
    websocket: {
        async message(ws: ServerWebSocket<unknown>, message: string){
            const data: IncomingMessage = JSON.parse(message);
            if(data.type === 'signup'){
                const verified = await verifyMessage(
                    `Signed Message for ${data.data.callBackId}, ${data.data.signedMessage}`,
                    data.data.publicKey,
                    data.data.signedMessage
                );
                if(verified){
                    await signupHandler(ws, data.data);
                }
            } else if(data.type === 'validate'){
                CALLBACKS[data.data.callBackId](data);
                // fix this
                // understand that setTimeout 
                // verifyMessag function 
                delete CALLBACKS[data.data.callBackId];
            }
        },
        async close(ws: ServerWebSocket<unknown>){
            availableValidators.splice(availableValidators.findIndex(v => v.socket === ws), 1);
        }
    },
});



const signupHandler = async(ws: ServerWebSocket<unknown>, {ip, publicKey, signedMessage, callBackId}: SignupIncomingMessage) => {
    const validatorDb = await prismaClient.validator.findFirst({
        where:{
            publicKey
        }
    });
    if(validatorDb){
        ws.send(JSON.stringify({
            type:'signup',
            data:{
                validatorId: validatorDb.id,
                callBackId,
            }
        }));

        availableValidators.push({
            validatorId: validatorDb.id,
            socket: ws, 
            PublicKey: validatorDb.publicKey,
        });
        return;
    }

    // Extract there location from ip is left to be done.
    const validator = await prismaClient.validator.create({
        data:{
            ip,
            publicKey,
            location: 'unknown'
        }
    });
    ws.send(JSON.stringify({
        type: 'signup',
        data:{
            validatorId: validator.id,
            callBackId,
        }
    }));
    availableValidators.push({
        validatorId: validator.id, 
        socket: ws, 
        PublicKey: validator.publicKey
    })
}





console.log("Hello via Bun!");