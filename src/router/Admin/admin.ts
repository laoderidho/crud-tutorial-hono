import { Hono } from "hono";
import AuthMiddleware from "../../security/middleware/AuthMiddleware";
import RoleMiddleware from "../../security/middleware/RoleMiddleware";
import book from "./Book/book";
import data from "./Data/data";
import borrow from "./Borrow/borrow";
import { adminId } from "../../config/general";
const admin = new Hono()

admin.use(AuthMiddleware)
admin.use(RoleMiddleware(adminId))

admin.get("/test", async (c) => {
    return c.json({
        status: "success",
        message: "Test Success"
    })
})

admin.route("/book", book)
admin.route("/data", data)
admin.route("/borrow", borrow)

export default admin;