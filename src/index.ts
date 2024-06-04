import { Hono } from 'hono'
import routes from './router/routes'
import { cors } from 'hono/cors'

const app = new Hono();

app.use("/api/*", cors())

app.route("/api", routes)

export default app