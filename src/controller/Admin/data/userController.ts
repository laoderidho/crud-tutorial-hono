import { Context } from "hono";
import { PrismaClient } from "@prisma/client";
import { getdataUser, getDataRole } from "../../../query/Admin/data/dataQuery";
import IRole from '../../../interfaces/Admin/Data/Role'
import VRole from '../../../validator/Admin/Data/Role'
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

            const prisma = new PrismaClient()

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

            const prisma = new PrismaClient()

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
            
            const prisma = new PrismaClient()

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
            
            const prisma = new PrismaClient()

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
}