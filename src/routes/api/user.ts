import config from "config";
import { Router, Response, Request } from "express";
import { IUser, User } from "../../model/User";
import { findOneAndVerify, createUser, updatePassword } from "../../services/UserServices";
import { convertDateWithMoment, decryptPassw, encrypt, sendMail } from "../../Utils/Utils"
import * as jsonwebtoken from "jsonwebtoken";
//import Mail from "nodemailer/lib/mailer";

const router: Router = Router();

router.post("/create", async(req:Request, res:Response)=>{
    
    const body = req.body

    console.log("body-create-user => ", body)
    
    const nombres :String      = body.nombres
    const apellidos: String    = body.apellidos
    const anioNac:number       = body.anioNac    
    const password: String     = body.password
    const email: String        = body.email
    const altura               = body.altura
    const peso                 = body.peso
    const sexo                 = body.sexo
    const phone: String        = body.phone

    const fecha = new Date()
    const dateCreated   = fecha.getTime()
  
    console.log(" entrando al api de usuarios")
    const encryptSecretKey:any = config.get("key")
    //console.log("encryptSecretKey =>", encryptSecretKey)
    try {
        const _email:String  = email


        const passwordEncrypt = encrypt(password, encryptSecretKey)
        const anioCurrent = new Date().getFullYear()
        const currentEdad = (anioCurrent-anioNac)

        const userData:IUser = {            
            nombres    : nombres,
            apellidos  : apellidos,
            anioNac    : anioNac,
            phone      : phone,
            password   : passwordEncrypt,
            altura     : altura,
            peso       : peso,
            sexo       : sexo,
            edad       : currentEdad.toString(),
            email      : email        
        }
        
        const foundUsers = await findOneAndVerify(_email)
        if (foundUsers === null) {
            //console.log("data users: ", userData)
            const result = await createUser(userData) 
            const response = {
                message: "Guardado con éxito...",
                status: true,
                data:result
            }
            res.json(response);
        }else{
            const dataUserResponse = {
                menssage : "Usuario ya se encuentra registrado",
                status: false
            }
            res.json(dataUserResponse); 
        }
  
    } catch (error) {
        const errorResponse = {
            menssage : "Error: "+error.message,
            status: false
        }
        res.json(errorResponse);
    }  

})


router.post('/login', async(req:Request, res:Response)=>{
    const body = req.body 
    const password      = body.password
    const email         = body.email

    try {

        const encryptSecretKey:any = config.get("key")
        console.log("encryptSecretKey =>", encryptSecretKey)

        /* const dataEnc = encrypt(password, encryptSecretKey)
        console.log("dataEnc =>", dataEnc) */
        

        const foundUser = await findOneAndVerify(email)
        const passwTextB64 = foundUser.password 

        console.log("pass1 ", passwTextB64)

        const passwText = decryptPassw(passwTextB64, encryptSecretKey)
        console.log("constraseña plana => ", passwText);

        var data = null
        if(password === passwText){
            data = {
                message: "Usuario encontrado",
                status:  true,
                dataUserLogin: foundUser
            }
        }else{
            data = {
                message: "Usuario o Contraseña incorrectas",
                status:  false
            }
        }
        
        res.send(data)

    } catch (error) {
        console.log("Error => /login " +error.message)
    }

})

router.post("/forgotPassw", async(req:Request, res:Response) => {
    const body = req.body

    const email  = body.email
    console.log("email param =>", email)
    var linkVerify = null
    var token = null
    try {
        const userData = await findOneAndVerify(email)
        if(userData !=null){
            token = jsonwebtoken.sign({userId: userData._id, email: userData.email}, config.get("jwtSecret"), {expiresIn: '300s'})        
            linkVerify = `http://localhost:1997/reset-password/${token}`
        }

        await sendMail(userData.email, linkVerify)

        res.status(200).json({
            status:  "success",
            message: "Correo enviado con exito", 
            data:{
                token:     token, 
                linkReset: linkVerify 
            }
        })
        
    } catch (error) {
        return res.status(200).json({status:  "Fail", message:"Error linea 143 => "+error.message})
    }

})


router.post('/new-password', async (req:Request, res:Response) => {
    const body = req.body
    console.log("body => ", body)
    const tokenHeader = req.headers.tokens

    const email  = body.email
    const newPassword = body.password
    
    const arrayToken = tokenHeader.split(' ')[1]

    try {
        const UserData:IUser = {
            email: email,
            password: newPassword
        }

        //console.log("tokenHeader=> ", arrayToken)
        const token = arrayToken

        //console.log("keysecret => ", config.get("jwtSecret"))
        const verify = jsonwebtoken.verify(token, config.get("jwtSecret"), (errorToken:any) =>{
            if(errorToken) {
                return res.json({ status:"forbidden", message:"token caducado"})
            }else{
                
            }
        })

        if(typeof verify === "undefined"){
            console.log("verify => ",verify)
            console.log("user Data: ",UserData)
            const result = await updatePassword(UserData)
            console.log("result update=> ",result)

            if(result !==null){
            return res.json({
                status:"success",
                mensaje:"Contraseña modificada"
            })
            }else{
            return res.json({
                status:"fail",
                mensaje:"Error al actualizar su contraseña"
            })
            }
        }
    } catch (error) {
        console.log("Error linea 187: " + error.message)
        return "Error linea 187: " + error.message        
    }
    
    
})

export default router;