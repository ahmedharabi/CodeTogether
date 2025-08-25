import {nanoid} from 'nanoid';
import {prisma} from "../lib/prisma";
import {addMember} from "./workspaceMember.service";

const createInvite=async (workspaceId:string,userId:string)=>{
    //code , user , workspace ,
    if(!workspaceId || ! userId){
        throw new Error("invalid userId or workspaceId");
    }
    const invite= await prisma.invite.create({
        data: {
            code: nanoid(10),
            workspaceId,
            userId
        }
    });
    return invite;
}
const verifyInvite=async (token:string)=>{
    if(!token){
        throw new Error("Invite code is missing or invalid.");

    }
    const invite=await prisma.invite.findFirst({
        where:{code:token}
    })
    return !!invite;
}
const acceptInvite=async (token:string,workspaceId:string,userId:string)=>{
    if(!token){
        throw new Error("token must be provided");
    }
    if(!workspaceId || !userId){
        throw new Error("userId or workspaceId is missing")
    }

    const valid=await verifyInvite(token);
    if(!valid){
        throw new Error("invalid invite");
    }
    const workspaceMember=await addMember(workspaceId,userId);
    return workspaceMember;
}

export {acceptInvite,verifyInvite,createInvite};