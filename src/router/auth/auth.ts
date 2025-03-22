import { Hono } from "hono";
import AuthController from "../../controller/Auth/AuthController";

const auth = new Hono();

const authController = new AuthController();

auth.post('/register', authController.register)
auth.post('/login', authController.login)
auth.post('/refresh-token', authController.refreshToken)

export default auth