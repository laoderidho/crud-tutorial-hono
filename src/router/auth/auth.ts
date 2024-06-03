import { Hono } from "hono";
import AuthController from "../../controller/Auth/AuthController";

const auth = new Hono();

const authController = new AuthController();

auth.post('/test', authController.testAkun)

export default auth