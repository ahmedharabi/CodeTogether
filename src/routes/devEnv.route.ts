import express, {RequestHandler} from "express";
import {createDevEnv,startDevEnv} from "../controllers/devEnv.controller";
import {workspaceExists} from "../middlewares/workspaceMiddleware";
import {projectHasNoDevEnv,projectHasDevEnv,projectExistsInWorkspace,projectExists} from "../middlewares/projectMiddleware";
import {userIsWorkspaceOwner,userIsWorkspaceMember} from "../middlewares/userMiddleware";
import {isAuthenticated} from "../middlewares/authMiddleware";

const router=express.Router({ mergeParams: true });



router.post("/",isAuthenticated, workspaceExists, projectExists, userIsWorkspaceOwner, projectExistsInWorkspace, projectHasNoDevEnv,
    createDevEnv);
router.post("/start",isAuthenticated,workspaceExists,projectExists,userIsWorkspaceMember,projectExistsInWorkspace,projectHasDevEnv,
    startDevEnv)

export {router}