import { z } from "zod";


const messageRequired = {
  name: "Nama harus diisi",
  email: "Email harus diisi",
  password: "Password harus diisi",
  no_telp: "No Telp harus diisi",
  address: "Alamat Harus diisi",
  country_id: "NIK harus Diisi"
}


const messageMinError = {
  name: "Nama minimal 2 karakter",
  password: "Password minimal 8 karakter",
  no_telp: "No Telp minimal 10 karakter",
  country_id: "NIK minimal 16 karakter"
}

const maxError = {
  name: "Nama maksimal 255 karakter",
  password: "Password maksimal 255 karakter",
  no_telp: "No Telp maksimal 13 karakter",
  address: "Alamat maksimal 1000 karakter"
}

const UserValidator = z.object({
  name: z.string({required_error: messageRequired.name}).min(2, {message: messageMinError.name}).max(255, {message: maxError.name}),
  email: z.string({required_error: messageRequired.email}).email(),
  password: z.string({required_error: messageRequired.password}).min(8, {message: messageMinError.password}).max(255, {message: maxError.password}),
  no_telp: z.string({required_error: messageRequired.no_telp}).min(10, {message: messageMinError.no_telp}).max(13, {message: maxError.no_telp}),
  address: z.string({required_error: messageRequired.address}).max(1000, {message: maxError.address}),
  country_id: z.string({required_error: messageRequired.country_id}).min(16, {message: messageMinError.country_id})
});

export default UserValidator;