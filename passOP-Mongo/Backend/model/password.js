import mongoose from 'mongoose'

const PasswordSchema = new mongoose.Schema({
    url: String,
    username: String,
    password: String,
    id: String
})

export const Passwords = mongoose.model('passwords', PasswordSchema)