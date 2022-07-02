import moment from "moment"
import crypto from "crypto"
//import nodemailer from "nodemailer"
import config from "config"
import * as jsonwebtoken from "jsonwebtoken";
import { findOneAndVerify } from "../services/UserServices";
import {Genero} from "../model/Interfaces/Generos"
import nodemailer from "nodemailer"

//const SecrectIv = (CryptoJS.lib.WordArray.random(128 / 8)).toString();
const SecrectIv = 'ABCDEF0123456789ABCDEF0123456789';
export const convertDateWithMoment = (stringDate:string) => {
    return moment.utc(stringDate).format("YYYY-MM-DDTHH:MM:ss.SS+00:ss")
}

//Funcion para realizar la Encriptacion
export const encrypt = (textPalin:any, encryptSecretKey:any) => {

  const secretKey = encryptSecretKey
  const methodEncrypt = 'AES-256-CBC'

  const key = crypto.createHash('sha256').update(secretKey, 'utf-8').digest('hex').substring(0,32)
  const iv = crypto.createHash('sha256').update(SecrectIv, 'utf-8').digest('hex').substring(0,16)

  const encrypt = crypto.createCipheriv(methodEncrypt, key, iv)
  const aesEncrypter = encrypt.update(textPalin, 'utf-8','base64').concat(encrypt.final('base64'))

  return Buffer.from(aesEncrypter).toString('base64')
}

//Funcion para realizar la desencriptacion
export const decryptPassw = (ciphertextB64:any, encryptSecretKey:any) =>{
  
  const secretKey = encryptSecretKey
  const methodEncrypt = 'AES-256-CBC'

  const key = crypto.createHash('sha256').update(secretKey, 'utf-8').digest('hex').substring(0,32)
  const iv = crypto.createHash('sha256').update(SecrectIv, 'utf-8').digest('hex').substring(0,16)

  const buff = Buffer.from(ciphertextB64, 'base64')
  ciphertextB64 = buff.toString('utf-8')
  const descrypt = crypto.createDecipheriv(methodEncrypt, key, iv)
  return descrypt.update(ciphertextB64, 'base64', 'utf-8').concat(descrypt.final('utf-8'))
}

export const sendMail = async(email:any, codeValidator:any)=>{
  
  console.log(config.get("nameDb"))
  const hostSmtp: string= config.get("smtpMail")// "smtp.gmail.com"
  const user:string = config.get("userSmtp")//"chilansteven221@gmail.com"
  const passw:string = config.get("keySmtp")//"CuentaGmail2022"
  const username = config.get("userName")

  try {

    const config ={
      host: hostSmtp,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: user, // user aws provider
        pass: passw, // password aws provider
      }
    }
    const infoMsg ={
      to: email,
      from: `Info medikal-app <${username}>`,
      subject: "Recuperar contraseña",
      text: "Para restablecer su contraseña ingresar el codigo de verificacion.",
      html: `<p>Solicitud de recuperacion de contraseña, su codigo de verificacion es: <strong>${codeValidator}</strong> </p>`
    }

    const transporter = nodemailer.createTransport(config)

    // send mail with defined transport object
      const messageSend = await transporter.sendMail({
          from: infoMsg.from, // sender address
          to: infoMsg.to, // list of receivers
          subject: infoMsg.subject, // Subject line
          text: infoMsg.text, // plain text body
          html:infoMsg.html, // html body
      });

      console.log("Message sent: %s", messageSend);

      if (messageSend.messageId.length > 0) {
        return true
      }else{
        return false
      }   
  } catch (error) {
    console.log(error.message)
    return false
  }
}

export const firstLogin = async (email:any, passw:any, token:any) => {
  const encryptSecretKey:any = config.get("key")
  console.log("encryptSecretKeyLogin =>", encryptSecretKey)

  const arrayToken = token.split(' ')[1]
  console.log("arrayTokenLogin =>", arrayToken)
  const tokenValid = arrayToken
  
  const verify = jsonwebtoken.verify(tokenValid, config.get("jwtSecret"), (errorToken:any) =>{
    if(errorToken) {
        return { message:"token caducado", status:"forbidden"}
    }
  })

  if(typeof verify === "undefined"){
    const foundUser = await findOneAndVerify(email)
    console.log("users =>", foundUser)
    const passwTextB64 = foundUser.password 

    console.log("pass1 ", passwTextB64)

    const passwText = decryptPassw(passwTextB64, encryptSecretKey)
    console.log("constraseña plana => ", passwText);

    var data = null
    if(passw === passwText){
        data = {
            message       : "Usuario logueado correctamente",
            status        : true,
            token         : tokenValid
        }
    }else{
        data = {
            message: "Usuario o Contraseña incorrectas",
            status:  false
        }
    }
    
    return data
}
}

export const dataProfile = async (email:any) => { 

  try {
    const dataUser = await findOneAndVerify(email)
    return dataUser
  } catch (error) {
    return error.message
  }
}

export const calcularIMCPaciente =  (estatura: any, peso:any) => {
 
  const _estatura = (estatura*estatura)
  console.log("estatura =>" , estatura)
  const imc = parseFloat((peso/_estatura).toFixed(2))
  console.log("imc =>" , imc)
    return imc;
}

export const calcularPesoIdeal = (estatura:any, genero:any)=>{
  var pesoIdeal = 0  
  const estaturaCm = (estatura*100)
  try {
    if (genero === Genero.Masculino) { 
      console.log("Masculino pesoIdeal  => ", ((0.75*estaturaCm)-62.5))
      return pesoIdeal = ((0.75*estaturaCm)-62.5)
    }else{
      console.log("Femenino pesoIdeal  => ", ((0.675*estaturaCm)-56.25))
      return pesoIdeal = ((0.675*estaturaCm)-56.25)
    }
  } catch (error) {
    return error.message
  }
}