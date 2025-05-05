import { Context } from "hono";
import { prisma } from "../../../utils/db";
import { getdataUser, getDataRole, getDataByKeyword } from "../../../query/Admin/data/dataQuery";
import IRole from '../../../interfaces/Admin/Data/Role'
import VRole from '../../../validator/Admin/Data/Role'
import IKeywordUser from "../../../interfaces/Admin/Data/KeywoardUser";
import { ZodError } from "zod";
import { decode } from "hono/jwt";

export default class userController {
    async getData(c: Context){
        try {
            
            const token = c.req.header('Authorization')

            if (!token) {
                return c.json({
                    status: "error",
                    message: "Authorization token is missing"
                }, 400);
            }

            const {payload} = await decode(token)

            const idUser = Number(payload.sub)

            const getData = await prisma.$queryRawUnsafe(getdataUser(idUser))

            return c.json({
                status: "success",
                data: getData
            }, 200)

        } catch (error) {
           return c.json({
                status: "Error"
            }, 500);
        }
    }

     async changeRole(c: Context ){
        try {
            const role : IRole = await c.req.json();

            VRole.parse(role)

            const {id, roleId} = role

            await prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    roleId: roleId
                }
            })
            return c.json({
                status: "success",
                message: "berhasil diubah"
            }, 200)

        } catch (error: any) {
            if(error instanceof ZodError){
                return c.json({
                        status: "error",
                        message: error.errors.map(err => err.message)
                }, 400)
            }
            
            return c.json({
                status: "error"
            }, 500)
        }
    }

    async getDataById(c: Context){
        try {
            const { id } = c.req.param()
            
            const getData = await prisma.user.findUnique({
                where: {
                    id: parseInt(id),
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    no_telp: true
                }
            })

            return c.json({
                status: "success",
                data: getData
            }, 200)

        } catch (error: any) {
            return c.json({
                status: "error",
                message: error.message
            }, 500)
        }
    }

    async getRole(c: Context){
        try {
            
            const getData = await prisma.$queryRawUnsafe(getDataRole())

            return c.json({
                status: "success",
                data: getData
            }, 200)
        } catch (error) {
            return c.json({

            }, 500)
        }
    }

    async searchUser(c: Context){
        try {
           
            const data : IKeywordUser = await c.req.json()

            const {keyword} = data
          
            const getData = await prisma.$queryRawUnsafe(getDataByKeyword(keyword))

            return c.json({
                status: "success",
                data: getData
            }, 200)

        } catch (error: any) {
            return c.json({
                status: "error",
                message: error.message
            }, 500)
        }
    }
}