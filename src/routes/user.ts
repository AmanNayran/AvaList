import { Router } from "express"
import UserController from '../controller/user'

const userRoute = Router()

userRoute.post('/singup', UserController.cadastrar)
userRoute.get('/list', UserController.listaUser)
userRoute.post('/singin', UserController.autenticar)


export default userRoute
