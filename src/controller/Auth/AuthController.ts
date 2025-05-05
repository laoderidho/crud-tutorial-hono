import { Context } from "hono";
import User from "../../interfaces/User";
import { prisma } from "../../utils/db";
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

            const parserValidator = UserValidator.safeParse(user);

            if(!parserValidator.success){
                const errorMessages: Record<string, string> = parserValidator.error.errors.reduce((acc, err) => {
                    acc[err.path[0]] = err.message; 
                    return acc;
                }, {} as Record<string, string>);

                return c.json({
                    status: "error",
                    message: errorMessages
                },
                400)
            }
            
            const {email, name, password, no_telp, country_id, address} = user;

            const getIdCountry = await prisma.user.findUnique({
                where: {
                    country_id: country_id
                }
            });

            const getEmail = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if(getIdCountry){
                return c.json({
                    status: "error",
                    message: {
                        "country_id": "ktp tidak Valid"
                    }
                }, 400)
            }

            if(getEmail){
                return c.json({
                    status: "error",
                    message: {
                        "email": "email sudah terdaftar"
                    }
                }, 400)
            }

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
           
            return c.json({
                status: "error",
                message: "Server Error"
            }, 500)
        }
    }

    async login(c: Context){
        try {
            const user : Login = await c.req.json();

            const parserValidator = LoginValidator.safeParse(user);

            if(!parserValidator.success){
                const errorMessages: Record<string, string> = parserValidator.error.errors.reduce((acc, err) => {
                    acc[err.path[0]] = err.message; 
                    return acc;
                }, {} as Record<string, string>);

                return c.json({
                    status: "error",
                    message: errorMessages
                },
                400)
            }
            
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
                token: token,
                role: data.roleId
            }, 201)

        } catch (error) {
           
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