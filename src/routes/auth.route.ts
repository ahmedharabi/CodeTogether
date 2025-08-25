import express, {Request, Response} from "express";
import{register} from "../controllers/auth.controller";
import passport from "passport";
const router=express.Router();

router.post("/register",register);
router.post("/login", passport.authenticate("local",{
    successRedirect:"/api/dashboard",
    failureRedirect:"/api/auth/failure"
}));

router.get("/google",passport.authenticate("google",{scope:["profile","email"]}))
router.get("/google/callback",passport.authenticate("google",{
    successRedirect:"/api/dashboard",
    failureRedirect:"/api/auth/failure",
    session:true
}))


router.get("/github",passport.authenticate("github",{scope:["user:email"]}));
router.get("/github/callback",passport.authenticate("github",{
    successRedirect:"/api/dashboard",
    failureRedirect:"/api/auth/failure",
    session:true
}))

router.get("/logout",(req:Request,res:Response)=>{
    req.logout(()=>{
        res.redirect("/api/auth/login");
    })})

export {router};