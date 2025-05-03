
export function getdataUser(id: number){
    return `select u.roleId, u.id, u.email, u.name, u.no_telp, r.name as roleName 
            from user u join role r on u.roleId = r.id where u.id != ${id} limit 300`
}

export function getDataRole(){
    return `select id as value, name as label from role`
}

export function getDataByKeyword(keyword: string){
    return `select u.id,  u.roleId, u.email, u.name, u.no_telp, u.address, r.name as roleName 
            from user u join role r on u.roleId = r.id 
            where u.id != 1 and (u.name like '%${keyword}%' or u.id like '%${keyword}%')
            limit 300`
}
