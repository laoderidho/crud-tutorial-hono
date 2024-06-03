import { Hono } from "hono";
import AuthMiddleware from "../../security/middleware/AuthMiddleware";
import RoleMiddleware from "../../security/middleware/RoleMiddleware";


const user = new Hono()

user.use(AuthMiddleware)
user.use(RoleMiddleware("user"))





export default user;