import { Context } from "hono";
import { Next } from "hono";
import { decode } from "hono/jwt";

const RoleMiddleware = (params: number) =>{
    return async (c: Context, next: Next) => {
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
                const {payload} = await decode(token)

                if(!payload){
                    return c.json({
                        status: "error",
                        message: "Token tidak valid"
                    }, 401)
                }

                if(payload.role !== params){
                    return c.json({
                        status: "error",
                        message: "Tidak memiliki akses"
                    }, 403)
                }

                await next()
            } catch (error: any) {
                return c.json({
                    status: "error",
                    message: error.message
                }, 401)   
            }
    }
}

export default RoleMiddleware