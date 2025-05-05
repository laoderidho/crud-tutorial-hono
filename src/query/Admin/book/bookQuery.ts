export function searchBook(keyword: any) {
    if (!isNaN(keyword)) {
        return `SELECT id, title, author, photo FROM book WHERE id = ${parseInt(keyword)} LIMIT 1`;
    } else {
        return `SELECT id, title, author, photo FROM book WHERE title LIKE '%${keyword}%' LIMIT 300`;
    }
}