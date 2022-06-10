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
        console.log(" email exists =>", email)
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
            
        const labelsCustom = {
            totalDocs: 'total_size',
            docs: params.typeIndicators,
            limit: 'limit',
            page: 'currentPage',
            nextPage: 'next',
            prevPage: 'prev',
            totalPages: 'totalPages',
        }

        const _offset = params.offset
        var offset = null
        if (_offset >1) {
            offset = ((_offset -1)*parseInt(params.limit.toString()))
        } else{
            offset = 0
        }
        const options = {
            pagination : true, 
            limit: params.limit , 
            offset: offset,
            page: params.page,
            customLabels :labelsCustom
        }

        var res = null
        var aggregate = null

        console.log("opcion pagination => ", options)

        switch (params.typeIndicators) {
            case "imc":
                aggregate = Imc.aggregate([
                    { 
                        $match:{ "userID": ObjectId}
                    },
                    { 
                        $sort: { 
                            id: -1
                        }
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
                    },
                    {
                        $sort:{
                            id:-1
                        }
                    }
                ])
                await Presion.aggregatePaginate(aggregate, options,function (err:any, result:AggregatePaginateResult<IPresion>) {
                    res = result;
                });
                break;
            case "glucemia":
                aggregate = Glucemia.aggregate([
                    { 
                        $match:{ "userID": ObjectId}
                    },
                    {
                        $sort:{
                            id:-1
                        }
                    }
                ])
                await Glucemia.aggregatePaginate(aggregate, options,function (err:any, result:AggregatePaginateResult<IGlucemia>) {
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

export const findNewIdImc = async (ObjectId:any, typeIndicators:any)=>{
    try {
        var idNew = 0
        var data = null
        switch (typeIndicators) {
            case "imc":
                data = await Imc.aggregate([
                    { 
                        $match: { "userID": ObjectId}
                    },
                    {
                        $sort:{
                            id:-1
                        }
                    }
                ])
                break;
            case "glucemia":
                data = await Glucemia.aggregate([
                    { 
                        $match: { "userID": ObjectId}
                    },
                    {
                        $sort:{
                            id:-1
                        }
                    }
                ])
                break;
            case "presion":
                data = await Presion.aggregate([
                    { 
                        $match: { "userID": ObjectId}
                    },
                    {
                        $sort:{
                            id:-1
                        }
                    }
                ])
                break;
            default:
                break;
        }

        console.log("data new id =>", data)
        
        if (data.length > 0) {
            idNew = (data[0].id)+1
        }else{
            idNew = 1
        }
        
        return idNew

    } catch (error) {
        return error.message
    }
}

export const findLastRecordIMC = async (objectId:any) => {

    try {
        const lastRecord = await Imc.aggregate([
            { 
                $match:{ "userID": objectId}
            },
            { 
                $sort:{
                    id:-1
                }
            }
        ])
        return lastRecord

    } catch (error) {
        return error.message
    }
}