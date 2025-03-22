import { Context } from "hono";
import User from "../../interfaces/User";
import { Prisma, PrismaClient } from "@prisma/client";
import Login from "../../interfaces/Login";
import  { sign, verify } from 'hono/jwt'
import UserValidator from "../../validator/UserValidator";
import LoginValidator from "../../validator/LoginValidator";
import { ZodError } from 'zod'
import { userId } from "../../config/general";
import { secretAccessToken } from "../../config/jwtSecrect";
import { setCookie, getCookie } from "hono/cookie";

class AuthController {
    async register(c: Context){
        try {
            // user ini ada di interfaces User
            const user: User = await c.req.json();

            UserValidator.parse(user);

            const {email, name, password, no_telp, country_id, address} = user;

            const getIdCountry = await new PrismaClient().user.findUnique({
                where: {
                    country_id: country_id
                }
            });

            if(getIdCountry){
                return c.json({
                    status: "error",
                    message: "NIK sudah Tedaftar"
                }, 400)
            }

            const prisma = new PrismaClient();
            await  prisma.user.create({
                    data: {
                        email: email,
                        name: name,
                        password: await Bun.password.hash(password),
                        no_telp : no_telp,
                        roleId : userId,
                        country_id: country_id,
                        address: address
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

        try {
            const user : Login = await c.req.json();

            const prisma = new PrismaClient();

            LoginValidator.parse(user);

            const {email, password} = user;

            const data = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })

            if(!data){
                return c.json({
                    status: "error",
                    message: "Password atau email Salah"
                }, 401)
            }

            const compare = await Bun.password.verify(password, data.password);

            if(!compare ){
                return c.json({
                    status: "error",
                    message: "Password atau email Salah"
                }, 401)
            }

            const payload = {
                sub: data.id,
                role: data.roleId,
                exp: Math.floor(Date.now() / 1000) + 60 * 180
            }

            const refreshPayload = {
                sub: data.id,
                role: data.roleId,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
            };


            const token = await sign(payload, secretAccessToken)
            
            const refreshToken = await sign(refreshPayload, secretAccessToken)

            setCookie(c, 'refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: true,
                sameSite: 'None'
            })

            return c.json({
                status: "success",
                message: "Berhasil Login",
                token: token
            }, 201)

        } catch (error) {
            if(error instanceof ZodError){
                return c.json({
                     status: "error",
                     message: error.errors.map(err => err.message)
                }, 400)
            }
            return c.json({
                status: "error",
                message: "Server Error"
            }, 500) 
        }

        
    }

    async refreshToken(c: Context){
        try {
            const token = getCookie(c, 'refreshToken');

            if(!token){
                return c.json({
                    status: "error",
                    message: "Token tidak ditemukan"
                }, 401)
            }

            const dataJwt = await verify(token, secretAccessToken);

            const {sub, role} = dataJwt;

            const id = Number(sub);
            const roleId = Number(role);

            if(!dataJwt){
                return c.json({
                    status: "error",
                    message: "Token tidak valid"
                }, 401)
            }

            const prisma = new PrismaClient();

            const data = await prisma.user.findUnique({
                where: {
                    id: id,
                    roleId: roleId
                }
            })

            if(!data){
                return c.json({
                    status: "error",
                    message: "data tidak ada"
                }, 401)
            }   

            const payload = {
                sub: dataJwt.sub,
                role: dataJwt.role,
                exp: Math.floor(Date.now() / 1000) + 60 * 180
            }

            const newToken = await sign(payload, secretAccessToken);

            return c.json({
                token: newToken
            }, 201)
        } catch (error) {
            return c.json({
                status: "error",
                message: "Token tidak valid"
            }, 401)
        }
    }
}


export default AuthController;