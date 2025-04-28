
export function getdataUser(id: number){
    return `select u.id, u.email, u.name, u.no_telp, r.name as roleName 
            from user u join role r on u.roleId = r.id where u.id != ${id} limit 300`
}
