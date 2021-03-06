
import { Router, Response, Request } from "express";
import { existsPacient, findAllByIndicators, 
    findLastRecordIMC, 
    findNewIdImc, 
    findUserById, 
    saveRecordsGlucemia,
    saveRecordsIMC, 
    saveRecordsPresion } from "./../../services/SaludServices";
//import { ICertificate } from "./../../model/Certificates";
import { TypePeriodGlu } from "./../../model/Interfaces/TypePeriodGlu";
import { calcularIMCPaciente, calcularPesoIdeal } from "../../Utils/Utils";
import { IGlucemia } from "../../model/IGlucemia";
import { IMasa } from "../../model/IMasa";
import { IPresion } from "../../model/Ipresion";
//import { IRecords } from "../../model/Records";
import { TypeIndicators } from "../../model/Interfaces/TypeIndicators";
import { verifyToken } from "../../Utils/VerifyToken";
import { userUpdateHeight } from "../../services/UserServices";

const router: Router = Router();

router.get("/all", async(req:Request, res:Response)=>{
    const token: String = req.headers.authorization   
    //const email = req.headers["email"]
    const params = {
         typeIndicators : req.query.type,
         offset:req.query.offset || 1,
         limit: req.query.limit || 10,
         page: req.query.page || 1
    }
    //console.log("typeIndicators => ", params.typeIndicators)
    const dataToken = await verifyToken(token)
    const dataAll  = await findAllByIndicators(await findUserById(dataToken.email), params)
    res.status(200).json(dataAll)
})

router.post("/glucemia", async(req:Request, res:Response)=>{
    
    const body = req.body;
    const periodo:string = body.periodo
    const registro_glucemia = body.registro_glucemia
    const token: String = req.headers.authorization   
    //const email = req.headers["email"]
    var respuesta = "";

    console.log("body ", body)
    try {
         switch (periodo) {
            case TypePeriodGlu.ayunas:
                if(registro_glucemia<70){ //-If registro_glucemia < 70 then MAL_CONTROL_HIPOGLUCEMIA
                    console.log("opcion1 ")
                    respuesta = "MAL CONTROL HIPOGLUCEMIA"
                }
            
                if(registro_glucemia >= 70 && registro_glucemia < 110) { //-If(registro_glucemia > =70 y registro_glucemia < 110) then BUEN_CONTROL_GLUCEMIA
                    console.log("opcion2 ")
                    respuesta = "BUEN CONTROL GLUCEMIA"
                }            
            
                if(registro_glucemia >= 110 && registro_glucemia < 130) { //-If (registro_glucemia >= 110 y registro_glucemia < = 130) then CONTROL_ACEPTABLE
                    
                    console.log("opcion3 ")
                    respuesta = "CONTROL ACEPTABLE"
                }
            
                if(registro_glucemia >= 130) { /*-If registro_glucemia > 130 MAL_CONTROL_HIPERGLUCEMIA */
                    console.log("opcion4 ")    
                    respuesta = "MAL CONTROL HIPERGLUCEMIA"
                }
                break

            case TypePeriodGlu.noAyunas:
                if(registro_glucemia<70){ //-If registro_glucemia < 70 then MAL_CONTROL_HIPOGLUCEMIA
                    console.log("opcion1-1 ")  
                    respuesta = "MAL CONTROL HIPOGLUCEMIA"
                }

                if(registro_glucemia >= 70 && registro_glucemia < 140){ //-If (registro_glucemia > =70 y registro_glucemia < 140) then BUEN_CONTROL_GLUCEMIA
                    console.log("opcion2-1 ")   
                    respuesta = "BUEN CONTROL GLUCEMIA"
                }

                if(registro_glucemia >= 140 && registro_glucemia <= 180){ //If (registro_glucemia >= 140 y registro_glucemia < = 180) then CONTROL_ACEPTABLE
                    console.log("opcion3-1 ")  
                    respuesta = "CONTROL ACEPTABLE"
                }

                if(registro_glucemia > 180 ){ /*-If registro_glucemia > 180 MAL_CONTROL_HIPERGLUCEMIA */                    
                    console.log("opcion4-1")  
                    respuesta = "MAL CONTROL HIPERGLUCEMIA"
                }
                break
        }

        const dataToken = await verifyToken(token)
        //console.log("1.0 dataToken => ", dataToken)
        const { isPacient, data} = await existsPacient(dataToken.email)
        const id = await findNewIdImc(data._id, TypeIndicators.glucemia)
        
        const dataGlucemia : IGlucemia ={
            id: id,
            dateOfCreated: new Date(new Date().toISOString()),
            cantGlucemia : Number(registro_glucemia),
            tipoGlucemia : respuesta,
            userID: dataToken.userId
        }

       await saveRecordsGlucemia(dataGlucemia)

        const resp = {
            message: "success"
        }
        res.status(200).json(resp)

    } catch (error) {
        const respErr = {
            message: error.message,
            status: "fail"
        }
        res.status(400).json(respErr)
    }

})

router.post("/imc", async(req:Request, res:Response)=>{ 

    const body = req.body;
    const estatura = body.height
    const peso = body.weight
    const cintura = body.waist
    const token: String = req.headers.authorization    
    var response = null
    try {

        const IMC = calcularIMCPaciente(estatura, peso)

        if (IMC <=16) {
            response = {
                status : "success",
                IMC : IMC,
                message : "NIVEL DE PESO BAJO SEVERO"
            }
           // return res.status(200).json(response)
        }

        if (IMC <=18.5 && IMC <= 18.50) {            
            response = {
                status : "success",
                IMC : IMC,
                message : "NIVEL DE PESO BAJO"
            }
           // return res.status(200).json(response)
        }
        if (IMC >=18.6 && IMC <= 24.90) {        
            response = {
                status : "success",
                IMC : IMC,
                message : "NIVEL DE PESO NORMAL"
            }
           // return res.status(200).json(response)
        }
        if (IMC >=25.0 && IMC <= 29.90) {
            response = {
                status : "success",
                IMC : IMC,
                message : "SOBREPESO"
            }
           // return res.status(200).json(response)
        }
        if (IMC >=30.0 && IMC <= 35.0) {
            response = {
                status : "success",
                IMC : IMC,
                message : "OBESIDAD NIVEL 1"
            }
           // return res.status(200).json(response)
        }

        if (IMC >=35.1 && IMC <= 40.0) {
            response = {
                status : "success",
                IMC : IMC,
                message : "OBESIDAD NIVEL 2"
            }
            //return res.status(200).json(response)
        }

        if (IMC > 40.1) {
            response = {
                status : "success",
                IMC : IMC,
                message : "OBESIDAD NIVEL 3"
            }
        }

        const dataToken = await verifyToken(token)
        const { isPacient, data} = await existsPacient(dataToken.email)
        const id = await findNewIdImc(data._id, TypeIndicators.peso)
        
        const dataIMC : IMasa ={
            id:id,
            dateOfCreated: new Date(new Date().toISOString()),
            cantImc : IMC,
            pesoReg : Number(peso),
            alturaReg: Number(estatura),
            waist: cintura,
            tipoPeso : response.message,
            userID: dataToken.userId
        }

        await saveRecordsIMC(dataIMC) //graba la tabla en imcrecords
        if (data.height !== Number(estatura)) {
            await userUpdateHeight(Number(estatura), dataToken.email)
        }

        const resp = {
            message: "success"
        }

        return res.status(200).json(resp)

    } catch (error) {
        const respErr = {
            message: error.message,
            status: "fail"
        }
        res.status(400).json(respErr)
    }
})

router.post("/presionarterial", async(req:Request, res:Response)=>{
    const body = req.body;
    const presionAlta = body.alta
    const presionBaja = body.baja
    const token: String = req.headers.authorization   
    //const email = req.headers["email"]
    var respuestaMedica = ""
    var response = null
    try {

        if (presionBaja < 80 &&  presionAlta <60){
            console.log("opcion 1")
            respuestaMedica = "PRESION ARTERIAL BAJA"
            response = {
                status: 200,
                message: respuestaMedica
            }
           // return  res.status(200).json(response)
        }
        if ((presionBaja >= 80 && presionBaja < 120) && (presionAlta >= 60 && presionAlta < 80)){
            respuestaMedica = "PRESION ARTERIAL NORMAL"
            console.log("opcion 2")
            response = {
                status: 200,
                message: respuestaMedica
            }
           // return    res.status(200).json(response)
        }

        if ((presionBaja >= 130 && presionBaja < 140) && (presionAlta >= 85 && presionAlta < 90)){
            respuestaMedica = "PRESION ARTERIAL NORMAL ALTA"
            console.log("opcion 3")
            response = {
                status: 200,
                message: respuestaMedica
            }
           // return    res.status(200).json(response)
        }

        if ((presionBaja >= 140 && presionBaja < 160) && (presionAlta >= 90 && presionAlta < 100)){
            respuestaMedica = "PRESION ARTERIAL  ALTA LEVE"
            console.log("opcion 4")
            response = {
                status: 200,
                message: respuestaMedica
            }
           // return    res.status(200).json(response)
        }

        if ((presionBaja >= 160 && presionBaja < 180) && (presionAlta >= 100 && presionAlta < 110)){
            respuestaMedica = "PRESION ARTERIAL  ALTA MODERADA"
            console.log("opcion 5")
            response = {
                status: 200,
                message: respuestaMedica
            }
           // return    res.status(200).json(response)
        }

        if(presionBaja >= 180 && presionAlta >= 110){
            respuestaMedica = "PRESION ARTERIAL  ALTA CRITICA"
            console.log("opcion 6")
            response = {
                status: 200,
                message: respuestaMedica
            }
        }

        const dataToken = await verifyToken(token)
        const { isPacient, data} = await existsPacient(dataToken.email)
        const id = await findNewIdImc(data._id, TypeIndicators.presionArterial)

        const dataPresion : IPresion ={
            id: id,
            dateOfCreated: new Date(new Date().toISOString()),
            registroPresionAlta : Number(presionAlta),
            registroPresionBaja: Number(presionBaja),
            tipoPresion : respuestaMedica,
            userID: dataToken.userId
        }
        
        await saveRecordsPresion(dataPresion)

        const resp = {
            message:  "success"
        }

        return    res.status(200).json(resp)

    } catch (error ) {
        const respErr = {
            message: error.message,
            status: "fail"
        }
        res.status(400).json(respErr)
    }
})

router.get('/lastImc', async (req:Request, res:Response) => {
    try {
        const token: String = req.headers.authorization
        const dataToken = await verifyToken(token)
        const resp = await findLastRecordIMC(await findUserById(dataToken.email))
        var response = null

        if(resp !== null) {
            response = {
                id:resp[0].id,
                dateOfCreated: resp[0].dateOfCreated,
                cantImc : resp[0].cantImc,
                pesoReg : resp[0].pesoReg,
                alturaReg: resp[0].alturaReg,
                userID: dataToken.userId
            }
            console.log("response => ", response)
            return res.status(200).json(response)

        }else{
            console.log("else - response => ", response)
            return res.status(200).json({"message":"no hay registros"})
        }     

    } catch (error) {
        return res.status(400).json(error.message)
    }
})

router.post ('/pesoideal',async (req:Request, res:Response)=>{
    try {
        const body = req.body        
        const token: String = req.headers.authorization
        const dataToken = await verifyToken(token)
        const { isPacient, data} = await existsPacient(dataToken.email)
        const estatura = body.height
        const genero = data.gender
        var response = null
        const pesoIdeal = calcularPesoIdeal(estatura, genero)
        return res.status(200).json({"pesoIdeal":pesoIdeal})

    } catch (error) {
        return res.status(400).json({ error:error.message})
    }
})

export default router;
