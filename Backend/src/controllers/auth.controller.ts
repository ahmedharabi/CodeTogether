import {Request,Response} from "express";
import bcrypt from "bcrypt";
import {PrismaClient} from"@prisma/client";
import passport from "passport";

const prisma=new PrismaClient();

const register=async (req:Request,res:Response)=>{
    const {email,password,full_name,username}=req.body;
    const hash=await bcrypt.hash(password,12);
    await prisma.user.create({data:{email,password_hash:hash,full_name,username}});
    res.send("user registered");
}



const logout=(req:Request,res:Response)=>{
    req.logout(()=>{
        res.redirect("/api/auth/login");
    })
}
export{register,logout,};