import express from 'express'
import { linkedInCallback, getUser } from '../controller/Auth.controller.js'

const AuthRotues = express.Router()

AuthRotues.get('/callback', linkedInCallback)
AuthRotues.get('/get-user', getUser)

export default AuthRotues