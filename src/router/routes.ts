import { Hono } from "hono";
import auth from "./auth/auth";
import user from "./Users/user";

const routes = new Hono();

routes.get('/', (c) => {
  return c.text('Hello Hono!')
})

routes.route('/auth', auth) 
routes.route('/user', user)

export default routes