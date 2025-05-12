import { Context } from "hono";
import { prisma } from "../../utils/db";
import Iborrow from "../../interfaces/Borrow";
import { secretAccessToken } from "../../config/jwtSecrect";
import { verify } from "hono/jwt";
import { statusBorrow, statusReturn } from "../../config/general";

class BorrowController {

    async borrowBook(c: Context){
        try {
            const borrow: Iborrow = await c.req.json();
            const token = c.req.header("Authorization");

            let { dateToNumber, idBook, idUser } = borrow;

            if(idUser === undefined) {
                if (!token) {
                    throw new Error("Authorization token is missing");
                }
                const data = await verify(token, secretAccessToken);
                const { sub } = data;
                idUser = Number(sub);
            }

            const dateReturn = new Date();
            dateReturn.setDate(dateReturn.getDate() + dateToNumber);

            await prisma.borrowing.create({
                data: {
                    bookId: idBook,
                    userId: idUser,
                    BorrowDateFr: new Date(Date.now()),
                    BorrowDateTo: dateReturn,
                    statusBorrowId: statusBorrow, 
                }
            });

            return c.json({
                message: "Buku Telah Dipinjam",
            }, 201);
            
        } catch (error) {
            
        }
    }

}

export default BorrowController;