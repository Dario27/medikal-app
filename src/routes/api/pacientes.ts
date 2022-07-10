import { Router, Response, Request } from "express";
import { IUser } from "../../model/User";
import { consultarAllPacientes, listaPacientes } from "../../services/PacientesServices";


const router: Router = Router()

router.get("/consultar/all", async(req:Request, res:Response)=>{
    try {
        const listPacientes:Array<IUser> = await consultarAllPacientes()
        if (listPacientes.length === 0) {
            return res.status(400).json({"message":"No hay informacion disponible"})
        }else{
            const resp = listPacientes
            return res.status(200).json(resp)            
        }
    } catch (error) {
        return res.status(400).json({"errorMessage":error.message})
    }
})

router.get('/consultar/pacientes', async (req:Request, res:Response)=>{
    try {
        const params = {
            typeIndicators: req.query.typeIndicators,
            offset:req.query.offset || 1,
            limit: req.query.limit || 10,
            page: req.query.page || 1
        }
        const resListaPacientes:Array<IUser> = await listaPacientes(params)
        return res.status(200).json(resListaPacientes)
    } catch (error) {
        return res.status(400).json(error.message)
    }
})

export default router;