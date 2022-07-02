import { Specialities } from "../model/Specialities";

export const consultarEspecialidades = async () => {

    try {
        const foundSpecialities = await Specialities.aggregate([
            { 
                $match: { "status": "A"}
            }
        ])
        const res = foundSpecialities        
        //console.log("res ", res)
        return res
    } catch (error) {
       return error.message
    }
}

export const consultarEspecialidadesByID = async (id:any) => {

    try {
        const foundSpecialities = await Specialities.findById(id);
        const res = foundSpecialities        
        //console.log("res ", res)
        return res
    } catch (error) {
       return error.message
    }
}