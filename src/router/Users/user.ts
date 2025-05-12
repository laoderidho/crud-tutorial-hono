import { Hono } from "hono";
import AuthMiddleware from "../../security/middleware/AuthMiddleware";
import RoleMiddleware from "../../security/middleware/RoleMiddleware";
import { userId } from "../../config/general";
import book from "./Book/book";
import borrow from "./Borrow/borrow";

const user = new Hono()

user.use(AuthMiddleware)
user.use(RoleMiddleware(userId))

user.get("/test", async (c) => {
    return c.json({
        status: "success",
        message: "Test Success"
    })
})

user.route("/book", book)
user.route("/borrow", borrow)

export default user;