import { Context } from "hono";
import User from "../../interfaces/User";
import { Prisma, PrismaClient } from "@prisma/client";
import Login from "../../interfaces/Login";
import  { sign } from 'hono/jwt'
import UserValidator from "../../validator/UserValidator";
import LoginValidator from "../../validator/LoginValidator";
import {ZodError} from 'zod'

class AuthController {
    async register(c: Context){
        try {
            // user ini ada di interfaces User
            const user: User = await c.req.json();

           UserValidator.parse(user);


            const prisma = new PrismaClient();
            await  prisma.user.create({
                    data: {
                        email: user.email,
                        name: user.name,
                        password: await Bun.password.hash(user.password),
                        no_telp : user.no_telp,
                        roleId : user.roleId
                    }
            })

            return c.json({
                status: "success",
                message: "User berhasil ditambahkan"
            }, 201)

        } catch (error: any) {
           if(error instanceof ZodError){
                return c.json({
                     status: "error",
                     message: error.errors.map(err => err.message)
                }, 400)
           } 
           if(error instanceof Prisma.PrismaClientKnownRequestError){
               if(error.code === 'P2002'){
                   return c.json({
                       status: "error",
                       message: "Email sudah terdaftar"
                   }, 400)
               }
           }

            return c.json({
                status: "error",
                message: "Server Error"
            }, 500)
        }
    }

    async login(c: Context){

        const user : Login = await c.req.json();

        const prisma = new PrismaClient();

        LoginValidator.parse(user);

        const data = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        })

        if(!data){
            return c.json({
                status: "error",
                message: "Password atau email Salah"
            }, 400)
        }

        const compare = await Bun.password.verify(user.password, data.password);

        if(!compare ){
            return c.json({
                status: "error",
                message: "Password atau email Salah"
            }, 400)
        }

        const payload = {
            sub: data.id,
            role: data.roleId === 1 ? "admin" : "user",
            exp: Math.floor(Date.now() / 1000) + 60 * 180
        }

        const secret = "MySecretKey";

        const token = await sign(payload, secret)

        return c.json({
            status: "success",
            message: "Berhasil Login",
            token: token
        }, 201)
    }
}


export default AuthController;