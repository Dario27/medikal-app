import { Router, Response, Request } from "express";
import config from "config";
import { encrypt } from "../../Utils/Utils";
import { IMedico } from "../../model/Medico";
import { consultarMedicos, createMedico, verifyMedicoByIdentification } from "../../services/MedicoServices";


const router: Router = Router();

router.get("/all", async(req:Request, res:Response)=>{
    try {
        const listMedicos:Array<IMedico> = await consultarMedicos()
        if (listMedicos.length === 0) {
            return res.status(400).json({"message":"No hay informacion disponible"})
        }else{
            const resp = listMedicos
            return res.status(200).json(resp)            
        }
    } catch (error) {
        return res.status(400).json({"errorMessage":error.message})
    }
})

router.post("/createmedico", async(req:Request, res:Response)=>{
    
    const body = req.body
    const email = body['email']
    const password = body['password']
    const identification = body['identification']
    const name = body['name']
    const lastName = body['lastName']
    const speciality = body['speciality']
    const birthDate:Date = body['birthDate']
    const  phone = body['phone']
    const gender = body['gender']
    const address = body['address']

    try {
        
        const encryptSecretKey:any = config.get("key")
        const passwordEncrypt = encrypt(password, encryptSecretKey)

        const anioNac = new Date(birthDate).getFullYear()        
        const anioCurrent = new Date().getFullYear()
        const age = (anioCurrent-anioNac)

        const dataMedico:IMedico={
            identification : identification,
            name : name,
            lastName:lastName,
            password:passwordEncrypt,
            specialityID:speciality,
            age:Number(age),
            birthDate:birthDate,
            email:email,
            phone:phone,
            gender:gender,
            address:address
        }

        console.log("dataMedico =>",dataMedico)

        const existsMedico = await verifyMedicoByIdentification(identification)
        if (existsMedico === null) {
            const resp = await createMedico(dataMedico)
            return res.status(200).json(resp)
        }else{
            return res.status(400).json({"message":"ya existe medico con la cedula ingresada"})
        }
        
    } catch (error) {
       return res.status(400).json(error.message)
    }
})

export default router;