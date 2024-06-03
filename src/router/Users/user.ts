import { Hono } from "hono";
import book from "./book";
import AuthMiddleware from "../../security/middleware/AuthMiddleware";


const user = new Hono()

user.use(AuthMiddleware)

// api endpoint 
user.route("/book", book)



export default user;