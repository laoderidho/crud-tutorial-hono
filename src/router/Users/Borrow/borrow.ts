import { Hono } from "hono";
import BorrowController from "../../../controller/Borrow/borrowController";

const borrow = new Hono();
const borrowController = new BorrowController();
borrow.post("/borrow-book", borrowController.borrowBook);

export default borrow;
