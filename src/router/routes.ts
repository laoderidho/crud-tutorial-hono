import { Hono } from "hono";
import auth from "./auth/auth";
import user from "./Users/user";
import admin from "./Admin/admin";

const routes = new Hono();

routes.get('/', (c) => {
  return c.text('Hello Hono!')
})

routes.route('/auth', auth) 
routes.route('/user', user)
routes.route('/admin', admin)

export default routes