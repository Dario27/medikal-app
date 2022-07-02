import { Router, Response, Request } from "express";
import { consultarEspecialidades } from "../../services/SpecialitiesServices";

const router: Router = Router();

router.get("/all", async(req:Request, res:Response)=>{
    
    const resp = await consultarEspecialidades()

    res.status(200).json(resp)
})

export default router;