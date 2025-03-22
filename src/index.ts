import { Hono } from 'hono'
import routes from './router/routes'
import { cors } from 'hono/cors'

const app = new Hono();

app.use("/api/*", cors({
    origin: process.env.HOSST_FRONT_END,
    credentials: true
}))

console.log(process.env.HOSST_FRONT_END)

app.route("/api", routes)

export default app