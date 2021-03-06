import config from "config";
import { Router, Response, Request } from "express";
import { IUser, User } from "../../model/User";
import { findOneAndVerify, createUser, updatePassword, insCodeValidator, verifyCode, userUpdate } from "../../services/UserServices";
import { convertDateWithMoment, decryptPassw, encrypt, firstLogin, sendMail, dataProfile } from "../../Utils/Utils"
import * as jsonwebtoken from "jsonwebtoken";
import { TypeLogin } from "../../model/Interfaces/TypeLogin";
import { verifyMedicoByEmail } from "../../services/MedicoServices";

const router: Router = Router();

router.post("/create", async(req:Request, res:Response)=>{
    
    const body = req.body

    console.log("body-create-user => ", body)
    
    const nombres :String      = body.fName
    const apellidos: String    = body.lName
    const birthDate:Date       = body.birthDate    
    const password: String     = body.password
    const email: String        = body.email
    const bloodType            = body.bloodType
    const phone: String        = body.phone
    const genre                          = body.gender
    const cedula: String       = body.identification

    console.log(" entrando al api de usuarios")
    const encryptSecretKey:any = config.get("key")
    //console.log("encryptSecretKey =>", encryptSecretKey)
    try {
        const _email:String  = email
        const anioNac = new Date(birthDate).getFullYear()
        console.log("anio Nac ", anioNac)
        const passwordEncrypt = encrypt(password, encryptSecretKey)
        const anioCurrent = new Date().getFullYear()
        const currentEdad = (anioCurrent-anioNac)

        if (cedula.length === 0 || cedula === undefined) {
            return res.status(400).json({
                "message":"Error en el campo cedula, esta vacio o indefinido"
            })
        }else{
            const userData: IUser = {            
                fName      : nombres,
                lName      : apellidos,
                birthDate  : birthDate,
                phone      : phone,
                password   : passwordEncrypt,
                age        : currentEdad,
                email      : email,
                bloodType  : bloodType, 
                gender     : genre,
                identification : cedula
            }       
            
            const foundUsers = await findOneAndVerify(_email)
            if (foundUsers === null) {
                //console.log("data users: ", userData)
                const result = await createUser(userData) 
                const _token = jsonwebtoken.sign({userId: result._id, email: result.email, cedula:result.cedula}, config.get("jwtSecret"))
                const tokenLogin = "Bearer "+_token
                const response = await firstLogin(userData.email, password, tokenLogin)
            
               return res.status(200).json(response);
    
            }else{
                const dataUserResponse = {
                    message : "Usuario ya se encuentra registrado",
                    status: false
                }
               return res.status(400).json(dataUserResponse) //mensaje de error 
    
            }     
        }
  
    } catch (error) {
        const errorResponse = {
            message : "Error: "+error.message,
            status: false
        }
        return res.status(404).json(errorResponse);
    }  

})

router.post('/login', async(req:Request, res:Response)=>{
    const body = req.body 
    const password      = body.password
    const email         = body.email
    const type = body.type

    try {

        console.log("email ", email)
        const encryptSecretKey:any = config.get("key")
        console.log("encryptSecretKey =>", encryptSecretKey)

        if (type === TypeLogin.paciente) { // si es 2:Logueamos con al app al paciente
            const foundUser = await findOneAndVerify(email)
            console.log("users =>", foundUser)
            if(foundUser !== null){            
                const passwTextB64 = foundUser.password 
                console.log("pass1 ", passwTextB64)
    
                const passwText = decryptPassw(passwTextB64, encryptSecretKey)
                console.log("constrase??a plana => ", passwText);
                var data = null
    
                if(foundUser === null){
                    data = {
                        message: "Usuario no existe",
                        status:  false                    
                    }
                    return res.status(404).json(data);
                }else{
                    if(password === passwText){
                        const _token = jsonwebtoken.sign({userId: foundUser._id, email: foundUser.email, cedula:foundUser.identification}, config.get("jwtSecret"))
                        data = {
                            message: "Usuario encontrado",
                            status:  true,
                            token: _token
                        }
                        return res.status(200).send(data)
                    }else{
                        data = {
                            message: "Usuario o Contrase??a incorrectas",
                            status:  false
                        }
                        return res.status(400).send(data)
                    }                
                }
            }else {
                const rdata = {
                    message: "Usuario no existe",
                    status:  false                    
                }
                return res.status(404).json(rdata);
            }            
        } else { // si es 1:Logueamos al medico desde el portal web
            const foundMedico = await verifyMedicoByEmail(email)
            console.log("medico =>", foundMedico)
            if (foundMedico !== null) {

                const passwTextB64 = foundMedico.password 
                console.log("pass1 ", passwTextB64)
                const passwText = decryptPassw(passwTextB64, encryptSecretKey)
                console.log("constrase??a plana => ", passwText)
                if(password === passwText){
                    const _token = jsonwebtoken.sign({userId: foundMedico._id, email: foundMedico.email, cedula:foundMedico.identification}, config.get("jwtSecret"))
                    data = {
                        message: "Medico encontrado",
                        status:  true,
                        token: _token
                    }
                    return res.status(200).send(data)
                }else{
                    data = {
                        message: "Usuario o Contrase??a incorrectas",
                        status:  false
                    }
                    return res.status(400).send(data)
                }
            }
        }
        
    } catch (error) {

        const errorResponse = {
            message : "Error: "+error.message,
            status: false
        }
        res.status(404).json(errorResponse);
    }

})

router.post("/forgotPassw", async(req:Request, res:Response) => {
    const body = req.body

    const email  = body.email
    console.log("email param =>", email)
    try {
        const userData = await findOneAndVerify(email)
        if(userData != null){
            //token1 = jsonwebtoken.sign({userId: userData._id, email: userData.email}, config.get("jwtSecret"), {expiresIn: '300s'})        
            //linkVerify = `http://localhost:1997/reset-password/${token1}`
            const codeValidator = Math.floor(1000 + Math.random() * 9000)
            console.log("codeValidator => ", codeValidator)

            const { insert } = await insCodeValidator(codeValidator, email)
            if(insert){
                if(await sendMail(userData.email, codeValidator)){
                    return res.status(200).json({                    
                        message: "Correo enviado con exito",
                        status:  "success"
                    })
                }else {
                    return res.status(400).json({                    
                        message: "No se podido enviar el correo",
                        status:  "fail"
                    })
                }

                
            }else{
                return res.status(400).json({
                    message: "Error, no se ha podido generar el codigo temporal",
                    status:  "Fail"
                }) 
            }
        }else{
           return res.status(400).json({
                message: "Error, el usuario ingresado, no existe",
                status:  "Fail"
            }) 
        }
        
    } catch (error) {
        return res.status(404).json({message: error.message, status: "Fail", })
    }

})

router.post('/verifyCode', async (req:Request, res:Response) => {
    const body = req.body
    console.log("body => ", body) 
    const codeValidator = body.resetToken
    const email = body.email
    try {
        const result = await verifyCode(codeValidator, email)
        if(result == null || !result){
            return res.status(400).json({                
                message:"Codigo ingresado inv??lido", 
                status:"Fail",
            })
        }else{
            return res.status(200).json({                
                message:"Codigo ingresado correctamente",
                status: result,
            })
        }

    } catch (error) {
        console.log("Error linea 187: " + error.message)
        const errorResponse = {
            message : "Error: "+error.message,
            status: false
        }
        return res.status(404).json(errorResponse);
    }

})

router.post('/newPassword', async (req:Request, res:Response) => {

    const body = req.body
    console.log("body => ", body)    
    const email  = body.email
    const newPassword = body.password
    const resetToken = body.resetToken

    try {
        
        const encryptSecretKey:any = config.get("key")
        const passwordEncrypt = encrypt(newPassword, encryptSecretKey)
        console.log("code token => ", resetToken)

        const UserData:IUser = {
            email: email,
            password: passwordEncrypt
        }

        console.log("user Data: ",UserData)
        const result = await updatePassword(UserData)
        console.log("result update=> ",result)

        if(result !==null){
        return res.status(200).json({            
            message:"Contrase??a modificada",
            status:"success"
        })
        }else{
            return res.status(400).json({                
                message:"Error al actualizar su contrase??a",
                status:"fail"
            })
        }
        
    } catch (error) {

        const errorResponse = {
            message : "Error: "+error.message,
            status: false
        }
        return res.status(404).json(errorResponse);
    }
    
    
})

router.get('/profile', async (req:Request, res:Response) => {

    const _token: String = req.headers.authorization
    //console.log("auth => ", _token)
    const token1 = _token.split(' ')
   //console.log("token1 =>", token1)
    const token:any = token1[1]
    console.log("token =>", token)
    
    var err = null
    var emailUser = null
    jsonwebtoken.verify(token, config.get("jwtSecret"), (errorToken:any, data:any) =>{
        console.log("errorToken", errorToken)
        if(errorToken) {
            err = errorToken
            return res.status(400).json({ status:"forbidden", message:err.message})
        }else{
            console.log("data =>", JSON.stringify(data))
            console.log("email => ", data.email)
            emailUser = data.email
        }
    })

   const data = await dataProfile(emailUser)
   if(data === null){
    return res.status(400).json({
        message: "Usario no encontrado",
        status:"fail"
    })
   }else{
    return res.status(200).json(
        data
    )
   }    
})

router.post("/edit", async(req:Request, res:Response)=>{
    const body = req.body

    console.log("body-update-user => ", body)
    
    const nombres :String     = body.fName
    const apellidos: String    = body.lName
    const birthDate:Date       = body.birthDate
    const bloodType            = body.bloodType
    const phone: String        = body.phone
    const genre                = body.gender
    const cedula: String       = body.identification

    const token1: String = req.headers.authorization
    const tokenArray = token1.split(' ')
    const token:any = tokenArray[1]
    console.log("token =>", token)

    try {

        var err = null
        var emailUser = null

        if (cedula.length === 0 || cedula === undefined) {
            return res.status(400).json({
                "message":"Error en el campo cedula, esta vacio o indefinido"
            })
        } else {
            jsonwebtoken.verify(token, config.get("jwtSecret"), (errorToken:any, data:any) =>{
                console.log("errorToken", errorToken)
                if(errorToken) {
                    err = errorToken
                    return res.status(400).json({ status:"forbidden", message:err.message})
                }else{
                    console.log("data =>", JSON.stringify(data))
                    console.log("email => ", data.email)
                    emailUser = data.email
                }
            })
    
            const user:IUser = {
                email: emailUser,
                fName : nombres,
                lName : apellidos,
                bloodType : bloodType,
                birthDate : birthDate,
                phone: phone,
                gender : genre,
                identification : cedula
            }
            const result = await userUpdate(user)
            if (result !== null || result !== undefined) {
                return res.status(200).json({"message":"Datos actualizados con exito"})
            }else{
                return res.status(404).json({"message":"Error al actualizar los datos"})
            }
        }
        
    } catch (error) {
        return res.status(400).json(error.message)
    }
})

export default router;