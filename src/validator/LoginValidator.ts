import {z} from 'zod'

const LoginValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
})

export default LoginValidator