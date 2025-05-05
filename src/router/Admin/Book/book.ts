import { Hono } from "hono";
import BookController from "../../../controller/Admin/Book/BookController"
const book = new Hono()

const bookController = new BookController()

book.post("/add-book", bookController.addBook)
book.get("/get-book", bookController.getBook)
book.get("/get-book/:id", bookController.getBookById)
book.post("/update-book/:id", bookController.updateBook)
book.post("/search-book", bookController.searchBook)
export default book;