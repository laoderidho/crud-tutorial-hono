import { Context } from "hono"
import { Next } from "hono"
import { verify } from "hono/jwt"
import { secretAccessToken } from "../../config/jwtSecrect"
import { prisma } from "../../utils/db";

const AuthMiddleware = async (c: Context, next: Next) => {
    // request token from header
    const token = c.req.header('Authorization')

    if(!token){
        return c.json({
            status: "error",
            message: "Token tidak ditemukan"
        }, 401)
    }

    // cek token
    try {
        const data = await verify(token, secretAccessToken)
        
        if(!data){
            return c.json({
                status: "error",
                message: "Token tidak valid"
            }, 401)
        }
    
        const {sub} = data

        const id = Number(sub)
        const getdata = await prisma.user.findUnique({
            where: {
                id: id
            }
        })

        if(!getdata){
            return c.json({
                status: "error",
                message: "User Tidak Ditemukan"
            }, 404)
        }

       return await next()
       
    } catch (error) {
        return c.json({
            status: "error",
            message: "Token tidak valid"
        }, 401)
    }

}

export default AuthMiddleware