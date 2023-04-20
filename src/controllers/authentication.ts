import express,{Request, Response } from "express";

import { createUser, getUserByEmail } from "../db/users";
import { random, authentication } from "../helpers";

export const login = async(req:Request, res:Response) => {
    try{
        const {email, password} = req.body;
        if(!email || !password) return res.sendStatus(400).json({message:"Missing fields"});
        const user = await getUserByEmail(email).select('+authentication.password +authentication.salt');
        if(!user) return res.sendStatus(400);
        const expectedHash = authentication(user[0].authentication.salt,password);
        if(expectedHash !== user[0].authentication.password) return res.sendStatus(400);

        const salt = random();
        user[0].authentication.sessionToken = authentication(salt,user[0]._id.toString());
        await user[0].save();
        res.cookie('DIVYANSHU-AUTH',user[0].authentication.sessionToken,{domain:'localhost',path:'/',})
        return res.status(200).json(user).end();
    }
    catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const register  = async(req:Request, res:Response) => {
    try {
        const {email, password, username} = req.body;
        if(!email || !password || !username) return res.sendStatus(400).json({message:"Missing fields"});
        const existingUser = await getUserByEmail(email);
        if(existingUser.length) return res.sendStatus(400);

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication:{
                salt,
                password:authentication(salt,password)
            }
        })
        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}