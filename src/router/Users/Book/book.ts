import BookController from "../../../controller/Admin/Book/BookController";
import { Hono } from "hono";

const book = new Hono();

const bookController = new BookController();

book.get("/get-book", bookController.getBook);
book.get("/get-book/:id", bookController.getBookById);
book.post("/search-book", bookController.searchBook)

export default book;

