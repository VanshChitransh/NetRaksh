export interface SignupIncomingMessage{
    ip: string;
    publicKey: string;
    signedMessage: string;
    callBackId: string;
}

export interface ValidateIncomingMessage{
    signedMessage: string;
    callBackId: string; 
    status: "Good" | "Bad";
    latency: Number;
    websiteId: string;
    validatorId: string;

}

// The above two Request would be sent by the client (in this case it would be the validators)

export interface SingupOutgoingMessage{
    validatorId: string; 
    callBackId: string; 
}

export interface ValidateOutgoingMessage{
    callBackId: string;
    websiteId: string; 
    url: string;
}

// These are the outgoing messages from the HUB!!

export type IncomingMessage = {
    type: 'signup'
    data: SignupIncomingMessage
} | {
    type: 'validate'
    data: ValidateIncomingMessage
}

export type OutgoingMessage = {
    type: 'signup'
    data: SingupOutgoingMessage
} | {
    type: 'validate'
    data: ValidateOutgoingMessage
}