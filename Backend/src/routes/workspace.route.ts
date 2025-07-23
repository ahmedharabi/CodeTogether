import express, {RequestHandler} from "express";
import {createWorkSpace,getWorkspaceById,updateWorkspace,deleteWorkspace,getWorkspacesForUser} from "../controllers/workspace.controller";

const router=express.Router();

router.get("/",getWorkspacesForUser as unknown as  RequestHandler);
router.get("/:id",getWorkspaceById);
router.post("/",createWorkSpace as unknown as  RequestHandler);
router.put("/:id",updateWorkspace as unknown as  RequestHandler);
router.delete("/:id",deleteWorkspace as unknown as  RequestHandler);

 export {router};