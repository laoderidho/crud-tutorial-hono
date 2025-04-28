import {z} from "zod" 

const messageRequired = {
    id: "user Tidak Ada",
    roleId: "Role tidak ada"
}

const VRole = z.object({
    id: z.number({required_error: messageRequired.id}),
    roleId: z.number({required_error: messageRequired.roleId})
})

export default VRole