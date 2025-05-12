export function getBorrowData(){
    return `select brs.id as borrowId, b.title, b.id as bookId, u.name, u.id as userId, brs.name as statusBorrowName, 
            br.BorrowDateFr, br.BorrowDateTo from book b join borrowing br on b.id  = br.bookId join 
            user u on u.id = br.userId join borrowstatus as brs on brs.id = br.statusBorrowId 
            where br.statusBorrowId in(1,3)`
}

export function lastBorrow(id: number){
    return `select brs.id as borrowId, b.title, b.id as bookId, u.name, u.id as userId, brs.name as statusBorrowName, 
            br.BorrowDateFr, br.BorrowDateTo from book b join borrowing br on b.id  = br.bookId join 
            user u on u.id = br.userId join borrowstatus as brs on brs.id = br.statusBorrowId 
            where br.statusBorrowId = 1 and u.id = ${id} order by borrowDateTo desc limit 1`
}

export function searchBorrowData(keyword: any, categoryId: number){

    let queryWhere = ``
    let queryCategory = ``
    
    if (!isNaN(keyword)) {
        let keywordNumber = Number(keyword)
        queryWhere = `or u.id = ${keywordNumber} or b.id = ${keywordNumber}`
    }

    if (categoryId !== 0) {
        queryCategory = `and brs.id = ${categoryId}`
    }

    return `select brs.id as borrowId, b.title, b.id as bookId, u.name, u.id as userId, brs.name as statusBorrowName, 
            br.BorrowDateFr, br.BorrowDateTo from book b join borrowing br on b.id  = br.bookId join 
            user u on u.id = br.userId join borrowstatus as brs on brs.id = br.statusBorrowId 
            where (b.title like '%${keyword}%' or u.name like '%${keyword}%' ${queryWhere}) ${queryCategory} `
}