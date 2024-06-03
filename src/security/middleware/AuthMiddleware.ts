import { Context } from "hono"
import { Next } from "hono"
import { verify } from "hono/jwt"


const AuthMiddleware = async (c: Context, next: Next) => {
    const token = c.req.header('Authorization')

    if(!token){
        return c.json({
            status: "error",
            message: "Token tidak ditemukan"
        }, 401)
    }

    // cek token
    try {
        const data = await verify(token, "MySecretKey")
        if(!data){
            return c.json({
                status: "error",
                message: "Token tidak valid"
            }, 401)
        }
        await next()
    } catch (error) {
        return c.json({
            status: "error",
            message: "Token tidak valid"
        }, 401)
    }

}

export default AuthMiddleware