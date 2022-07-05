import {Medicos, IMedico} from "../model/Medico"

export const consultarMedicos = async () => {
    try {
        const medicos = await Medicos.aggregate([
            {
                $match: { "status":"A"}
            }
        ])
        return medicos
    } catch (error) {
        return error.message
    }
}

export const createMedico = async (dataMedico:IMedico) => {
    try {
        const medicosSave = await Medicos.create(dataMedico)
        return medicosSave
    } catch (error) {
        return error.message
    }
}

export const loginMedico = async (email:string, password:string) => {
    try {
        const data = await Medicos.findOne({ "email": email, "password": password})
        return data
    } catch (error) {
        return error.message
    }
}

export const verifyMedicoByIdentification = async (identification:string) => {
    try {
        const data = await Medicos.findOne({ "identification": identification})
        return data
    } catch (error) {
        return error.message
    }
}

export const verifyMedicoByEmail = async (email:any) => {
    try {
        const res = await Medicos.findOne({"email":email})
        if (res != null)
           return res   
        return null
    } catch (error) {
       return error.message
    }
}

export const editarDatosMedico = async (data:IMedico) => {
    try {
        const mediUpdate = await Medicos.findOneAndUpdate(
            { "email": data.email},
            { $set: {                
                "name" : data.name, 
                "lastName":data.lastName,
                "birthDate":data.birthDate,
                "phone":data.phone,
                "identification":data.identification,
                "gender":data.gender,
                "address":data.address,
            }},
            { new: true })    
            return mediUpdate
            
    } catch (error) {
       return error.message
    }
}

export const editarPasswordMedico = async (data:IMedico) => {
    try {
        const mediUpdate = await Medicos.findOneAndUpdate(
            { "email": data.email},
            { $set: {                
                "password" : data.password
            }},
            { new: true })
    
            return mediUpdate
    } catch (error) {
       return error.message
    }
}