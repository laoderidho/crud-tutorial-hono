import { Context } from "hono";
import User from "../../interfaces/User";

class AuthController {
    async testAkun(c: Context){
        
        const data: User = await c.req.json();

        return c.json({
            status: "success",
            data: data
        })

    }
}


export default AuthController;