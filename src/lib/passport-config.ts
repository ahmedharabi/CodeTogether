import {PassportStatic, Profile} from 'passport';
import { PrismaClient } from '@prisma/client';


import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import {Strategy as GoogleStrategy, VerifyCallback} from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

require('dotenv').config();
const prisma=new PrismaClient();

export default function initializePassport(passport:PassportStatic){
    // local login strategy
    passport.use(
        new LocalStrategy({usernameField:"email"},async (email,password,done)=>{
            try{
                const user=await prisma.user.findUnique({where:{email}});
                if(!user || !user.password_hash)return done(null,false,{message:"user not found"});

                const match=await bcrypt.compare(password,user.password_hash);
                if(!match)return done(null,false,{message:"invalid password"});

                return done(null,user);

            }catch (err){
                return done(err);
            }
        })
    )
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL:process.env.GOOGLE_CALLBACK_URL!,

        }, async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("Google profile:", profile);
                const email = profile.emails?.[0]?.value;
                const googleId = profile.id;
                const fullName = profile.displayName;
                const avatarUrl = profile.photos?.[0]?.value;
                let user = await prisma.user.findUnique({where: {google_id: profile.id}});
                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email: email!,
                            full_name: fullName,
                            google_id: googleId,
                            avatar_url: avatarUrl,
                        },
                    })
                }
                console.log("New user created:", user);
                return done(null,user);
            }catch (err){
                return done(err);
            }
        }
    ))
    passport.use(
        new GitHubStrategy({
            clientID:process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            callbackURL: process.env.GITHUB_CALLBACK_URL!,

        },async (_accessToken:string,_refreshToken:string,profile:Profile,done:VerifyCallback)=>{
            try{
                let user = await prisma.user.findUnique({where: {github_id: profile.id}});
                if(!user){

                    user=await prisma.user.create({
                        data:{
                            github_id:profile.id,
                            username: profile.username,
                            email:profile.emails?.[0]?.value ?? "",
                            full_name:profile.displayName,
                            avatar_url:profile.photos?.[0]?.value
                        }
                    })
                }
                return done(null,user);
            }catch (err){
                return done(err);
            }
        })
    )
    passport.serializeUser((user:any,done)=>{
        done(null,user.id);
    })
    passport.deserializeUser(async (id:string,done)=>{
        try{
            const user=await prisma.user.findUnique({where:{id}});
            done(null,user);
        }catch (err){
            done(err);
        }
    })
}