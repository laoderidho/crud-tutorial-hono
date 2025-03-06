import { Hono } from "hono";
import BookController from "../../../controller/Admin/Book/BookController"
const book = new Hono()

const bookController = new BookController()

book.post("/add-book", bookController.addBook)

export default book;