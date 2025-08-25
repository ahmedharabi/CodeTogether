import express, {RequestHandler} from "express";
import {acceptInvitation, createInvitation, verifyInvitation} from "../controllers/invites.controller";


const router=express.Router();

router.post("/", createInvitation as unknown as  RequestHandler)
router.get("/:token",verifyInvitation as unknown as RequestHandler)
router.post("/:token/accept",acceptInvitation as unknown as RequestHandler);

export {router};
