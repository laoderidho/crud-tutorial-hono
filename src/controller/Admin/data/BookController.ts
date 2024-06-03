import { Context } from "hono";


class BookController{
    async test(c: Context){
        return c.json({
            status: "success",
            message: "Book Controller"
        }, 200)
    }
}

export default BookController