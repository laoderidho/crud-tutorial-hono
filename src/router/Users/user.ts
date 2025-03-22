import { Hono } from "hono";
import AuthMiddleware from "../../security/middleware/AuthMiddleware";
import RoleMiddleware from "../../security/middleware/RoleMiddleware";
import { userId } from "../../config/general";

const user = new Hono()

user.use(AuthMiddleware)
user.use(RoleMiddleware(userId))

user.get("/test", async (c) => {
    return c.json({
        status: "success",
        message: "Test Success"
    })
})

export default user;