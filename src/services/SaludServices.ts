import { Records, IRecords } from "../model/Records";
import { ICertificate, Certificates } from "../model/Certificates"
import  { Firebase } from "../../config/firebase"

export const saveRecords = async (email:any, certificates:ICertificate) => {
    const firebase = new Firebase()
    try {
        
        const listCertificate = []
        listCertificate.push(certificates)

        //await Certificates.create(certificates)
        const records:IRecords = {
            userID : email,
            certificates : listCertificate
        }

        /* const api = 'BBhMdg1jsx90NgDBRY4pa89llR0AOAjk50q5RboBG1J45OaEORhm7RwW41GsS76Ai5BsiWd6MjRvqYXEV5tnjeM'        
        const app = firebase.runFirebase()
        await firebase.getTokenMessaging(app, api) */
        
        var res = null
        const { isPacient, data} = await existsPacient(email)
        if(!isPacient){
            res = await Records.create(records)
        }else{
            const listCertificate = data.certificates.concat(certificates)
            const updateCertificate:IRecords = await Records.findOneAndUpdate({"userID": email},{$set:{"certificates":listCertificate}},{new:true})
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
        if (dataPac != null){
            return { isPacient: true, data:dataPac}
        }else{
            return { isPacient: false, data:null}
        }
    } catch (error) {
        return error.message
    }    
}