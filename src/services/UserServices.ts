import { User, IUser } from "../model/User";

export const findOneAndVerify = async (email:any) => {
    try {
        const res = await User.findOne({"email":email})
        //console.log("res user =>", res)
        if (res != null)
           return res   
        return null
    } catch (error) {
       return error.message
    }
}

/**
 * @param  {} users:IUser
 * @return return Model user created
 */
 export const createUser = async(users:IUser)=>{
    try {
        
        const res = await User.create(users)
        console.log("usuario registrado correctamente")
        return res
    } catch (error) {
        return error.message
    }
}

export const updatePassword = async (user:IUser)=>{
    var userInfoUpdate = null
    console.log("vamos actualizar la contraseña")
    try {
        userInfoUpdate = await User.findOneAndUpdate(
            { "email": user.email},
            { $set: {                
                "password" : user.password
            }},
            { new: true }
        )
        return userInfoUpdate

    } catch (error) {
        console.error("error al grabar ",error.message);
        return error.message;
    } 
}

export const insCodeValidator = async (code: Number, email:string)=>{
    var validCode = null
    console.log("guardamos el code ")
    try {
        validCode = await User.findOneAndUpdate(
            { "email": email},
            { $set: {                
                "codeValidador" : code
            }},
            { new: true }
        )
        return {validCode, insert: true}

    } catch (error) {
        console.error("error al grabar ",error.message);
        return error.message;
    } 
}