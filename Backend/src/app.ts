import express from "express";
import session from "express-session";
import passport from "passport";
import initializePassport from "./lib/passport-config";
import {router as authRoutes} from "./routes/auth.route";
import {router as userRoutes} from "./routes/user.route";
import {router as inviteRoutes} from "./routes/invite.route";
import {router as workspaceRoutes} from "./routes/workspace.route";
import {ensureAuth} from "./utils/ensureAuth";
import { PrismaClient } from '@prisma/client';
import {Request,Response} from "express";
import {setupSignalHandler} from "./utils/signalHandlers";

const prisma = new PrismaClient();


const app=express();
setupSignalHandler();
initializePassport(passport);

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(session({
  secret: process.env.SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true in production
}));

 app.use(passport.initialize());
app.use(passport.session());

app.get("/",(req:Request,res:Response)=>{
  res.send("<a href='/api/auth/github'>auth with github</a>")
})

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/invite",inviteRoutes);
app.use("/api/workspaces",workspaceRoutes);

app.get('/api/dashboard', ensureAuth, (req, res) => {
  res.send(`Hello`);
});

app.listen(3001);


