import {Response,Request} from "express";
import {prisma} from "../lib/prisma";
import fs from 'fs';
import path from 'path';


// create a dev env
// start a dev env
// delete dev env
 // /api/workspaces/:workspaceId/projects/:projectId/devenv/
// workspace and project exist -> project inside that workspace -> the project dosen't have a devenv -> the user is the owner fo the workspace

const createDevEnv=async (req:Request,res:Response)=>{
    const projectId=req.params.projectId;


    const devEnv=await prisma.devEnvironment.create({
        data:{
            projectId:projectId
        }
    })
    const BASE_VOLUMES_DIR=path.resolve("volumes");
    const volumesPath=path.join(BASE_VOLUMES_DIR,devEnv.id);
    await fs.promises.mkdir(volumesPath,{recursive:true});
    //create the volume and then update the path in the devEnv 





}


