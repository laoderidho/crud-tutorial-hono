import { Hono } from "hono";
import AuthMiddleware from "../../security/middleware/AuthMiddleware";
import RoleMiddleware from "../../security/middleware/RoleMiddleware";
import book from "./Book/book";

const admin = new Hono()

admin.use(AuthMiddleware)
admin.use(RoleMiddleware("admin"))

admin.get("/test", async (c) => {
    return c.json({
        status: "success",
        message: "Test Success"
    })
})

admin.route("/book", book)

export default admin;