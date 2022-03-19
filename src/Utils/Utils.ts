import moment from "moment"
import crypto from "crypto"
import nodemailer from "nodemailer"
import config from "config"

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

export const sendMail = async(email:any, linkVerify:any)=>{
  
  const host = config.get("smtpMail")// "smtp.gmail.com"
  const user = config.get("emailSend")//"chilansteven221@gmail.com"
  const passw = config.get("claveCorreo")//"CuentaGmail2022"

  const hostname = host.toString()
  const username = user.toString()
  const password = passw.toString()

  // config transport mail 
  const transporter = nodemailer.createTransport({
      host: hostname,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: username,
        pass: password,
      },
      logger: true
    });

  // send mail with defined transport object //<a href="https://www.duplichecker.com/">Duplicate Checker</a>
  const info = await transporter.sendMail({
      from: '"Info marketplacetes" <chilansteven221@gmail.com>',
      to: email,
      subject: "Recuperar contraseña",
      text: "Dar clic en el siguiente link, para resetear su clave.",
      html: `<p> Para poder resetear su contraseña, por favor dar clic <a href="${linkVerify}" target="_blank">aqui</a></p></br><p>Este link tiene estará disponible solo 5 minutos</p></br><p>En caso de no poder ingresar al link, copie y pega el enlace en su navegador</p></br><p> ${linkVerify}</p></p>`
  });

  console.log("Message sent: %s", info.response);

  return "email send"
}