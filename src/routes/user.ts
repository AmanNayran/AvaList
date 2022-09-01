import { Router } from "express";
import usuarioController from '../controller/user'

const userRoute = Router();

userRoute.post('/singup', usuarioController.cadastrar)
userRoute.post('/singin', usuarioController.autenticar)
userRoute.get('/list', usuarioController.listaUser)
userRoute.post('/forgot', usuarioController.esqueciSenha)
userRoute.post('/reset', usuarioController.resetSenha)

export default userRoute;