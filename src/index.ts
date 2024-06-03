import { Hono } from 'hono'
import routes from './router/routes'

const app = new Hono();

app.route("/api", routes)

export default app