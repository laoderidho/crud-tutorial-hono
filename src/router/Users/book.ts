import { Hono } from "hono";
import BookController from "../../controller/Admin/data/BookController";

const book = new Hono()
const bookController = new BookController()

book.get("/test", bookController.test)

export default book;