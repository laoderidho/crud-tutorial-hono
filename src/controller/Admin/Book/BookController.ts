import { Context } from "hono";
import { prisma } from "../../../utils/db";
import  BookInterface  from "../../../interfaces/Book"
import { ZodError } from "zod";
import BookValidator from "../../../validator/BookValidator";
import IKeywordUser from "../../../interfaces/Admin/Data/KeywoardUser";
import { searchBook } from "../../../query/Admin/book/bookQuery";

class BookController {
    async addBook(c: Context){
        try {
            const book : BookInterface = await c.req.json();

             const parserValidator = BookValidator.safeParse(book);

            const {title, author, description, publisher, photo} = book;

           
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

            await prisma.book.create({
                data: {
                    title: title,
                    author: author,
                    description: description,
                    publisher: publisher,
                    photo: photo
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
           
            const books = await prisma.book.findMany({
                select: {
                    id: true,
                    title: true,
                    author: true,
                    photo: true,
                }
            });
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

    async getBookById(c: Context){
        try {

            const { id } = c.req.param();
           
            const book = await prisma.book.findUnique({
                where: {
                    id: parseInt(id)
                },
                select: {
                    id: true,
                    title: true,
                    author: true,
                    description: true,
                    publisher: true,
                    photo: true
                }
            })

            if(!book){
                return c.json({
                    status: "error",
                    message: "Buku tidak ditemukan"
                }, 404)
            }

            return c.json({
                status: "success",
                data: book
            }, 200)

        } catch (error: any) {
            return c.json({
                status: "error",
                message: error.message
            }, 500)
        }
    }

    async updateBook(c: Context){
        try {
            const { id } = c.req.param();
            const book : BookInterface = await c.req.json();

             const parserValidator = BookValidator.safeParse(book);

            const {title, author, description, publisher, photo} = book;

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

            const bookData = await prisma.book.findUnique({
                where: {
                    id: parseInt(id)
                }
            })

            if(!bookData){
                return c.json({
                    status: "error",
                    message: "Buku tidak ditemukan"
                }, 404)
            }

            await prisma.book.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    title: title,
                    author: author,
                    description: description,
                    publisher: publisher,
                    photo: photo
                }
            })

           return c.json({
                status: "success",
                message: "Buku berhasil diupdate"
            },200)

        }catch (error: any) {
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

    async searchBook(c: Context){
        try {
            const data : IKeywordUser = await c.req.json()
           
            const {keyword} = data
            
            const getData = await prisma.$queryRawUnsafe(searchBook(keyword))

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

    async deleteBook(c: Context){
        try {
            const { id } = c.req.param();

            const bookData = await prisma.book.findUnique({
                where: {
                    id: parseInt(id)
                }
            })

            if(!bookData){
                return c.json({
                    status: "error",
                    message: "Buku tidak ditemukan"
                }, 404)
            }

            await prisma.book.delete({
                where: {
                    id: parseInt(id)
                }
            })

           return c.json({
                status: "success",
                message: "Buku berhasil dihapus"
            },200)

        } catch (error: any) {
            return c.json({
                status: "error",
                message: error.message
            }, 500)
        }
    }
}

export default BookController;