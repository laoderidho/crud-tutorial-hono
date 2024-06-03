import { Context } from "hono";
import User from "../../interfaces/User";
import { PrismaClient } from "@prisma/client";
import Login from "../../interfaces/Login";
import  { sign } from 'hono/jwt'

class AuthController {
    async register(c: Context){
        try {
            // user ini ada di interfaces User
            const user: User = await c.req.json();

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
            return c.json({
                status: "error",
                message: error.message
            }, 400)
        }
    }

    async login(c: Context){
        const user : Login = await c.req.json();

        const prisma = new PrismaClient();

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
            exp: Date.now() + 1000 * 60 * 60 * 3
        }

        const secret = "MySecretKey"

        const token = await sign(payload, secret)

        return c.json({
            status: "success",
            message: "Berhasil Login",
            token: token
        }, 201)
    }
}


export default AuthController;