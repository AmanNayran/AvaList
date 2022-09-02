import { Router } from "express"
import ReadController from '../controller/read'

const readRoute = Router()

readRoute.post('/list', ReadController.CreateRead)
readRoute.get('/list', ReadController.listaRead)
readRoute.delete('/list', ReadController.deleteRead)

export default readRoute