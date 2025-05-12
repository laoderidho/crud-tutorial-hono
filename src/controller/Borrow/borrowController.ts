import { Context } from "hono";
import { prisma } from "../../utils/db";
import Iborrow from "../../interfaces/Borrow";
import { secretAccessToken } from "../../config/jwtSecrect";
import { verify } from "hono/jwt";
import { statusBorrow, statusNeedAproval, statusReturn, userId } from "../../config/general"; 
import { getBorrowData, lastBorrow, searchBorrowData } from "../../query/Borrow/borrowquery";
import ISearchBorrow from "../../interfaces/SearchBorrow";

class BorrowController {

    async borrowBook(c: Context){
        try {
            const borrow: Iborrow = await c.req.json();
            const token = c.req.header("Authorization");

            let { dateToNumber, idBook, idUser } = borrow;

            // auth verify
            if (!token) {
                throw new Error("Authorization token is missing");
            }
            const data = await verify(token, secretAccessToken);
            const { sub, role } = data;

            if(idUser === undefined) {
                idUser = Number(sub);
            }

            const dateReturn = new Date();
            dateReturn.setDate(dateReturn.getDate() + dateToNumber);

            let borrowStatus: number = statusBorrow

            if(role === userId){
                const count = await prisma.borrowing.count({
                    where:{
                        userId: Number(sub),
                        statusBorrowId: {
                            in: [statusBorrow, statusNeedAproval]
                        }
                    }
                })

                if(count!==0){
                    return c.json({
                        status: 'error', 
                        message: "Anda Hanya Boleh Meminjam 1 buku Harus ke Admin untuk meminjam lebih dari 1 buku"
                    }, 400)
                }

                borrowStatus = statusNeedAproval
            }
            
            await prisma.borrowing.create({
                data: {
                    bookId: idBook,
                    userId: idUser,
                    BorrowDateFr: new Date(Date.now()),
                    BorrowDateTo: dateReturn,
                    statusBorrowId: borrowStatus, 
                }
            });

            return c.json({
                message: "Buku Telah Dipinjam",
            }, 201);
            
        } catch (error) {
            
        }
    }

    async borrowData(c: Context){
        try {
            
            const data = await prisma.$queryRawUnsafe(getBorrowData());

            return c.json({
                status: "success",
                data: data,
            }, 200)

        } catch (error) {
            return c.json({
                message: "Error",
            }, 500);
        }
    }

    async searchBorrow(c: Context){
        try {
            
            const searchBorrow: ISearchBorrow = await c.req.json();

            const { keyword, categoryId } = searchBorrow;

            const data = await prisma.$queryRawUnsafe(searchBorrowData(keyword, categoryId));

            return c.json({
                status: "success",
                data: data,
            }, 200)

        } catch (error) {
            return c.json({
                status: "Error"
            }, 500)            
        }
    }

    async getdataLastBorrow(c: Context) {
        try {
            const token = c.req.header("Authorization");
            
            if (!token) {
                throw new Error("token tidak ditemukan");
            }

            const dataAuth = await verify(token, secretAccessToken);

            const {sub} = dataAuth

            const data = await prisma.$queryRawUnsafe(lastBorrow(Number(sub)))

            return c.json({
                status: "success",
                data: data
            }, 200)

        } catch (error) {
            return c.json({
                status: "error"
            }, 500)
        }
    }

    async aprovalBorrow(c: Context){
        try {
            const req = await c.req.json()

            const {borrowId} = req

            await prisma.borrowing.update({
                where: {
                    id: Number(borrowId)
                }, 
                data: {
                    statusBorrowId: statusBorrow
                }
            })

            return c.json({
                status: "success",
                message: "buku telah disetujui untuk dipinjam"
            }, 200)
            

        } catch (error: any) {
            return c.json({
              status: "error",
              message: error 
            }, 500)
        }
    }
}

export default BorrowController;