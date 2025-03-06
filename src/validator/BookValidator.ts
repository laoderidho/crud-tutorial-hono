import {z} from "zod";

const messageRequired = {
    title: "Title Buku Harus Diisi",
    author: "Author Buku Harus Diisi",
    description: "Description Buku Harus Diisi",
    code: "Code Buku Harus Diisi",
    publisher: "Publisher Buku Harus Diisi"
};

const messageMaxError = {
    title: "Title Buku Maksimal 255 Karakter",
    author: "nama Author Maksumal 255 Karakter",
    description: "Description Buku Maksimal 255 Karakter",
    code: "Code Buku Maksimal 10 Karakter", 
    publisher: "Publisher Buku Maksimal 20 Karakter"   
}

const Bookvalidator = z.object({
    title: z.string({required_error: messageRequired.title}).max(255, {message: messageMaxError.title}),
    author: z.string({required_error: messageRequired.author}).max(255, {message: messageMaxError.author}),
    description: z.string({required_error: messageRequired.description}).max(255, {message: messageMaxError.description}),
    code: z.string({required_error: messageRequired.code}).max(10, {message: messageMaxError.code}),
    publisher: z.string({required_error: messageRequired.publisher}).max(20, {message: messageMaxError.publisher}),
});

export default Bookvalidator;