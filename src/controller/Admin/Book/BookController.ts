import { Context } from "hono";
import { PrismaClient } from "@prisma/client";
import  BookInterface  from "../../../interfaces/Book"
import { ZodError } from "zod";
import BookValidator from "../../../validator/BookValidator";

class BookController {
    async addBook(c: Context){
        try {
            const book : BookInterface = await c.req.json();

            BookValidator.parse(book);

            const {title, author, description, code, publisher} = book;

            const prisma = new PrismaClient();
            await prisma.book.create({
                data: {
                    title: title,
                    author: author,
                    description: description,
                    code: code,
                    publisher: publisher
                }
            })

            return c.json({
                status: "success",
                message: "Buku berhasil ditambahkan"
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
                message: error.message
            }, 500)
        }
    }

    async getBook(c: Context){
        try {
            const prisma = new PrismaClient();
            const books = await prisma.book.findMany();
            return c.json({
                status: "success",
                data: books
            }, 200)
        } catch (error: any) {
            return c.json({
                status: "error",
                message: error.message
            }, 500)
        }
    }
}

export default BookController;