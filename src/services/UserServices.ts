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

export const verifyCode = async (code:number, email:string) => {
    var verifySuccess = false
    var userverified = null
    console.log("validamos codigo 4 digitos")
    try {
        userverified = await User.findOne({ "email": email, "codeValidador": code})
        if (userverified == null){
            return userverified
        }else{
            verifySuccess = true
        }
        return verifySuccess

    } catch (error) {
        console.error("error al grabar ",error.message);
        return error.message;
    } 
}

/**
 * @param  {} dataUser:IUser
 * @return return Model user created
 */
export const userUpdate = async (dataUser:IUser) => {
    try {
        const userUpdate = await User.findOneAndUpdate(
        { "email": dataUser.email},
        { $set: {                
            "fName" : dataUser.fName, 
            "lName":dataUser.lName,
            "birthDate":dataUser.birthDate,
            "phone":dataUser.phone,
            "identification":dataUser.identification,
            "bloodType":dataUser.bloodType,
            "gender":dataUser.gender
        }},
        { new: true })

        return userUpdate
    
    } catch (error) {
    console.error(error.message);
    return error.message;
    } 
}

/**
 * @param  {} estatura:any
 * @return return Model user update field heigth
 */
 export const userUpdateHeight = async (estatura:any, email:any) => {
    try {
        const userUpdate = await User.findOneAndUpdate(
        { "email": email},
        { $set: {                
            "height" : Number(estatura)
        }},
        { new: true })
        console.log("Estatura actualizada con exito")
        return userUpdate
    
    } catch (error) {
    console.error(error.message);
    return error.message;
    } 
}