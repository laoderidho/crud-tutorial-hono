import { Hono } from "hono";
import AuthController from "../../controller/Auth/AuthController";

const auth = new Hono();

const authController = new AuthController();

auth.post('/register', authController.register)
auth.post('/login', authController.login)

export default auth