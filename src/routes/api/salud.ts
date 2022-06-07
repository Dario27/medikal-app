
import { Router, Response, Request } from "express";
import { existsPacient, findAllByIndicators, 
    findNewIdImc, 
    findUserById, 
    saveRecordsGlucemia,
    saveRecordsIMC, 
    saveRecordsPresion } from "./../../services/SaludServices";
import { ICertificate } from "./../../model/Certificates";
import { TypePeriodGlu } from "./../../model/Interfaces/TypePeriodGlu";
import { calcularIMCPaciente } from "../../Utils/Utils";
import { IGlucemia } from "../../model/IGlucemia";
import { IMasa } from "../../model/IMasa";
import { IPresion } from "../../model/Ipresion";
import { IRecords } from "../../model/Records";
import { TypeIndicators } from "../../model/Interfaces/TypeIndicators";
import { verifyToken } from "../../Utils/VerifyToken";

const router: Router = Router();

router.get("/all", async(req:Request, res:Response)=>{
    const token: String = req.headers.authorization   
    //const email = req.headers["email"]
    const params = {
         typeIndicators : req.query.type,
         offset:req.query.offset || 1,
         limit: req.query.limit || 10
    }
    console.log("typeIndicators => ", params.typeIndicators)
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
        //const { isPacient, data} = await existsPacient(dataToken)
        const id = await findNewIdImc(dataToken.userId, TypeIndicators.glucemia)
        
        const dataGlucemia : IGlucemia ={
            id: id,
            dateOfCreated: new Date(new Date().toISOString()),
            cantGlucemia : registro_glucemia,
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
        //const { isPacient, data} = await existsPacient(dataToken)
        const id = await findNewIdImc(dataToken.userId, TypeIndicators.sobrepeso)
        
        const dataIMC : IMasa ={
            id:id,
            dateOfCreated: new Date(new Date().toISOString()),
            cantImc : IMC,
            pesoReg : peso,
            alturaReg:estatura,
            userID: dataToken.userId
        }

        const newRecord = await saveRecordsIMC(dataIMC)

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
        //const { isPacient, data} = await existsPacient(dataToken)
        const id = await findNewIdImc(dataToken.userId, TypeIndicators.presionArterial)

        const dataPresion : IPresion ={
            id: id,
            dateOfCreated: new Date(new Date().toISOString()),
            registroPresionAlta : presionAlta,
            registroPresionBaja:presionBaja,
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

export default router;
