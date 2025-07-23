import {prisma} from "../lib/prisma";


const addMember=async (workspaceId:string,userId:string)=>{
    const existing=await prisma.workspaceMember.findFirst({
        where:{workspaceId,userId}
    })
    if(existing){
        throw new Error("User is already a member of this workspace");
    }

    return await prisma.workspaceMember.create({
        data: {
            userId,
            workspaceId
        }
    });
}
const removeMember=async (workspaceId:string,userId:string)=>{
    const existing=await prisma.workspaceMember.findFirst({
        where:{workspaceId,userId}
    })
    if(!existing){
        throw new Error("User is not member of this workspace");
    }

     return await prisma.workspaceMember.delete({
        where:{
            userId_workspaceId: {
                userId,
                workspaceId,
            },
        }
    });
}