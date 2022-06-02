import { Records, IRecords } from "../model/Records";
import { ICertificate } from "../model/Certificates"
import { IGlucemia } from "../model/IGlucemia";
import  { IMasa } from "../model/IMasa";
import { IPresion } from "../model/Ipresion";

export const saveRecordsGlucemia = async (email:any, dataGlucemia:IGlucemia) => {

    try {
        var res = null
        const { isPacient, data} = await existsPacient(email)
        if(isPacient){ 
            const listCertificate = data.certificates.glucemia.concat(dataGlucemia)
            console.log("listCertificate => ", listCertificate)
            const updateCertificate:IRecords = await Records.findOneAndUpdate({"userID": email},{$set:{"certificates.glucemia":listCertificate}},{new:true})
            res = updateCertificate
        }
        
        console.log("res ", res)
        return res
    } catch (error) {
       return error.message
    }
}

export const existsPacient = async (email:any) => {
    try {
        const dataPac = await Records.findOne({ "userID": email})
        console.log("data=> ", dataPac)
        if (dataPac != null){
            return { isPacient: true, data:dataPac}
        }else{
            return { isPacient: false, data:null}
        }
    } catch (error) {
        return error.message
    }    
}

export const createRecords = async (records: IRecords)=>{
    return await  Records.create(records)
}

export const saveRecordsIMC = async (email:any, dataIMC:IMasa) => {
   try {
        var res = null
        const { isPacient, data} = await existsPacient(email)
        if(isPacient){
            const listCertificate = data.certificates.imc.concat(dataIMC)
            console.log("listCertificate => ", listCertificate)
            const updateCertificate:IRecords = await Records.findOneAndUpdate({"userID": email},{$set:{"certificates.imc":listCertificate}},{new:true})
            res = updateCertificate
        }
        return res
   } catch (error) {
    return error.message
   }    
}

export const saveRecordsPresion = async (email:any, dataPresion:IPresion)=>{
    try {
        var res = null
        const { isPacient, data} = await existsPacient(email)
        if(isPacient){
            const listCertificate = data.certificates.presion.concat(dataPresion)
            console.log("listCertificate => ", listCertificate)
            const updateCertificate:IRecords = await Records.findOneAndUpdate({"userID": email},{$set:{"certificates.presion":listCertificate}},{new:true})
            res = updateCertificate
        }
        return res
    } catch (error) {
        return error.message
    }
}