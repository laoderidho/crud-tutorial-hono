import { Hono } from "hono";
import auth from "./auth/auth";

const routes = new Hono();

routes.get('/', (c) => {
  return c.text('Hello Hono!')
})

routes.route('/auth', auth) 

export default routes