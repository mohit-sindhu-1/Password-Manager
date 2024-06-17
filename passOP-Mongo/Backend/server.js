import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { Passwords } from './model/password.js'
import cors from 'cors'

dotenv.config()
const app = express()
const port = 3000
app.use(bodyParser.json())
app.use(cors())

async function main() {
    const connection = mongoose.connect("mongodb://localhost:27017/passwords")
}

main()

app.get('/', async (req, res) => {
    const findResult = await Passwords.find({})
    res.json(findResult)
})

app.post('/', async (req, res) => {
    const password = req.body
    await Passwords.insertMany(password)
    res.send({ success: true, result: password })
})

app.put('/', async (req, res) => {
    const password = req.body
    await Passwords.updateOne({ id: password.id }, password)
    res.send({ success: true, result: password })
})

app.delete('/', async (req, res) => {
    const password = req.body
    await Passwords.deleteOne({ id: password.id })
    res.send({ success: true, result: password })
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})