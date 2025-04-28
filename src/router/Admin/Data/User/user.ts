import userController from "../../../../controller/Admin/data/userController";
import { Hono } from "hono";

const user = new Hono()

const UserController = new userController()

user.post('/change-role', UserController.changeRole)
user.get('/get-user', UserController.getData)
user.get('/get-user/:id', UserController.getDataById)
user.get('/get-role', UserController.getRole)

export default user

