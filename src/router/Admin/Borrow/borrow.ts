import { Hono } from "hono";
import BorrowController from "../../../controller/Borrow/borrowController";

const borrow = new Hono();
const borrowController = new BorrowController();

borrow.post("/borrow-book", borrowController.borrowBook);
borrow.get("/borrow-data", borrowController.borrowData);
borrow.post("/search", borrowController.searchBorrow)

export default borrow;