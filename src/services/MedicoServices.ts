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