import { Records, IRecords } from "../model/Records";
import { ICertificate } from "../model/Certificates"
import { Glucemia, IGlucemia } from "../model/IGlucemia";
import  { IMasa, Imc } from "../model/IMasa";
import { IPresion, Presion } from "../model/Ipresion";
import { User } from "../model/User";
import { AggregatePaginateResult } from "mongoose"

export const saveRecordsGlucemia = async (dataGlucemia:IGlucemia) => {

    try {
        const responseGlucemia:IGlucemia = await Glucemia.create(dataGlucemia)
        const res = responseGlucemia        
        //console.log("res ", res)
        return res
    } catch (error) {
       return error.message
    }
}

export const existsPacient = async (email:any) => {
    try {
        const dataPac = await User.findOne({ "email": email})
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

export const saveRecordsIMC = async (dataIMC:IMasa) => {
   try {        
        const responseMasa:IMasa = await Imc.create(dataIMC)
       const res = responseMasa
        return res
   } catch (error) {
    return error.message
   }    
}

export const saveRecordsPresion = async (dataPresion:IPresion)=>{
    try {
        const responsePresion:IPresion = await Presion.create(dataPresion)
        const res = responsePresion
        return res
    } catch (error) {
        return error.message
    }
}

export const findAllByIndicators = async (ObjectId:any, params:any)=>{
    try {
            
        const options = {
            pagination : true, 
            limit: 10 , 
            page : params.page,
            offset: params.offset
        }

        var res = null
        var aggregate = null

        switch (params.typeIndicators) {
            case "imc":
                aggregate = Imc.aggregate([
                    { 
                        $match:{ "userID": ObjectId}
                    }
                ])
                await Imc.aggregatePaginate(aggregate, options,function (err:any, result:AggregatePaginateResult<IMasa>) {
                    res = result;
                });
                break;
            case "presion":
                aggregate = Presion.aggregate([
                    { 
                        $match:{ "userID": ObjectId}
                    }
                ])
                await Presion.aggregatePaginate(aggregate, options,function (err:any, result:AggregatePaginateResult<IMasa>) {
                    res = result;
                });
                break;
            case "glucemia":
                aggregate = Glucemia.aggregate([
                    { 
                        $match:{ "userID": ObjectId}
                    }
                ])
                await Glucemia.aggregatePaginate(aggregate, options,function (err:any, result:AggregatePaginateResult<IMasa>) {
                    res = result;
                });
                break;

            default:
                res = {
                    "message":"No existe indicador",
                    "status":"fail"
                }
                break;
        }

        return res

    } catch (error) {
        return error.message
    }
}

export const findUserById = async(email:any)=>{
    try {
        const resp = await User.findOne({ "email": email})
        //console.log("data user => ", resp)
        return resp._id
    } catch (error) {
        return error.message
    }
}

export const findNewIdImc = async (email:any, typeIndicators:any)=>{
    try {
        var idNew = 0
        const data = await Records.findOne({ "userID":email})

        if (data.certificates.presion.length > 0) {
            
        }else{
            idNew = 1
        }
        
        return idNew

    } catch (error) {
        return error.message
    }
}