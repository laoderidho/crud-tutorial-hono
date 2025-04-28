import { Hono } from "hono";
import user from '../Data/User/user'

const data = new Hono()

data.route("/user", user)

export default data