
import { Router, Response, Request } from "express";
import { saveRecords } from "./../../services/SaludServices";
import { ICertificate } from "./../../model/Certificates";
import { TypePeriodGlu } from "./../../model/Interfaces/TypePeriodGlu";
import { calcularIMCPaciente } from "../../Utils/Utils";
import { IGlucemia } from "../../model/IGlucemia";
import { IMasa } from "../../model/IMasa";
import { IPresion } from "../../model/Ipresion";

const router: Router = Router();


router.post("/glucemia", async(req:Request, res:Response)=>{
    
    const body = req.body;
    const periodo:string = body.periodo
    const registro_glucemia = body.registro_glucemia
    const email = req.headers["email"]
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

        const dataGlucemia : IGlucemia ={
            dateOfCreated: new Date(new Date().toISOString()),
            cantGlucemia : registro_glucemia
        }

        const listGlucemia = []
        listGlucemia.push(dataGlucemia)

        const certificates:ICertificate = {    
            glucemia : listGlucemia
        }

        const newRecord = await saveRecords(email, certificates)

        const resp = {
            message: respuesta,
            data: newRecord,
            status: "success"
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
    const email = req.headers["email"]
    var response = null
    try {

        const IMC = calcularIMCPaciente(estatura, peso)

        if (IMC <=16) {            
            response = {
                status : "success",
                IMC : IMC,
                message : "NIVEL DE PESO BAJO SEVERO"
            }
            return res.status(200).json(response)
        }

        if (IMC <=18.5 && IMC <= 18.50) {            
            response = {
                status : "success",
                IMC : IMC,
                message : "NIVEL DE PESO BAJO"
            }
            return res.status(200).json(response)
        }
        if (IMC >=18.6 && IMC <= 24.90) {        
            response = {
                status : "success",
                IMC : IMC,
                message : "NIVEL DE PESO NORMAL"
            }
            return res.status(200).json(response)
        }
        if (IMC >=25.0 && IMC <= 29.90) {
            response = {
                status : "success",
                IMC : IMC,
                message : "SOBREPESO"
            }
            return res.status(200).json(response)
        }
        if (IMC >=30.0 && IMC <= 35.0) {
            response = {
                status : "success",
                IMC : IMC,
                message : "OBESIDAD NIVEL 1"
            }
            return res.status(200).json(response)
        }

        if (IMC >=35.1 && IMC <= 40.0) {
            response = {
                status : "success",
                IMC : IMC,
                message : "OBESIDAD NIVEL 2"
            }
            return res.status(200).json(response)
        }

        if (IMC > 40.1) {
            response = {
                status : "success",
                IMC : IMC,
                message : "OBESIDAD NIVEL 3"
            }

            const dataIMC : IMasa ={
                dateOfCreated: new Date(new Date().toISOString()),
                cantImc : IMC
            }

            const listIMC = []
            listIMC.push(dataIMC)

            const certificates:ICertificate = {    
                imc : listIMC
            }

            const newRecord = await saveRecords(email, certificates)

            const resp = {
                message: response,
                data: newRecord,
                status: "success"
            }

            return res.status(200).json(resp)
        }

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
    const email = req.headers["email"]
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
            return  res.status(200).json(response)
        }
        if ((presionBaja >= 80 && presionBaja < 120) && (presionAlta >= 60 && presionAlta < 80)){
            respuestaMedica = "PRESION ARTERIAL NORMAL"
            console.log("opcion 2")
            response = {
                status: 200,
                message: respuestaMedica
            }
            return    res.status(200).json(response)
        }

        if ((presionBaja >= 130 && presionBaja < 140) && (presionAlta >= 85 && presionAlta < 90)){
            respuestaMedica = "PRESION ARTERIAL NORMAL ALTA"
            console.log("opcion 3")
            response = {
                status: 200,
                message: respuestaMedica
            }
            return    res.status(200).json(response)
        }

        if ((presionBaja >= 140 && presionBaja < 160) && (presionAlta >= 90 && presionAlta < 100)){
            respuestaMedica = "PRESION ARTERIAL  ALTA LEVE"
            console.log("opcion 4")
            response = {
                status: 200,
                message: respuestaMedica
            }
            return    res.status(200).json(response)
        }

        if ((presionBaja >= 160 && presionBaja < 180) && (presionAlta >= 100 && presionAlta < 110)){
            respuestaMedica = "PRESION ARTERIAL  ALTA MODERADA"
            console.log("opcion 5")
            response = {
                status: 200,
                message: respuestaMedica
            }
            return    res.status(200).json(response)
        }

        if(presionBaja >= 180 && presionAlta >= 110){
            respuestaMedica = "PRESION ARTERIAL  ALTA CRITICA"
            console.log("opcion 6")
            response = {
                status: 200,
                message: respuestaMedica
            }

            const dataPresion : IPresion ={
                dateOfCreated: new Date(new Date().toISOString()),
                registroPresionAlta : presionAlta,
                registroPresionBaja:presionBaja
            }

            const listPresion = []
            listPresion.push(dataPresion)

            const certificates:ICertificate = {    
                presion : listPresion
            }

            const newRecord = await saveRecords(email, certificates)

            const resp = {
                message: response,
                data: newRecord,
                status: "success"
            }

            return    res.status(200).json(resp)
        }

    } catch (error ) {
        const respErr = {
            message: error.message,
            status: "fail"
        }
        res.status(400).json(respErr)
    }
})

export default router;