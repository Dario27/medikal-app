"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.decryptPassw = exports.encrypt = exports.convertDateWithMoment = void 0;
const moment_1 = __importDefault(require("moment"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("config"));
//const SecrectIv = (CryptoJS.lib.WordArray.random(128 / 8)).toString();
const SecrectIv = 'ABCDEF0123456789ABCDEF0123456789';
const convertDateWithMoment = (stringDate) => {
    return moment_1.default.utc(stringDate).format("YYYY-MM-DDTHH:MM:ss.SS+00:ss");
};
exports.convertDateWithMoment = convertDateWithMoment;
//Funcion para realizar la Encriptacion
const encrypt = (textPalin, encryptSecretKey) => {
    const secretKey = encryptSecretKey;
    const methodEncrypt = 'AES-256-CBC';
    const key = crypto_1.default.createHash('sha256').update(secretKey, 'utf-8').digest('hex').substring(0, 32);
    const iv = crypto_1.default.createHash('sha256').update(SecrectIv, 'utf-8').digest('hex').substring(0, 16);
    const encrypt = crypto_1.default.createCipheriv(methodEncrypt, key, iv);
    const aesEncrypter = encrypt.update(textPalin, 'utf-8', 'base64').concat(encrypt.final('base64'));
    return Buffer.from(aesEncrypter).toString('base64');
};
exports.encrypt = encrypt;
//Funcion para realizar la desencriptacion
const decryptPassw = (ciphertextB64, encryptSecretKey) => {
    const secretKey = encryptSecretKey;
    const methodEncrypt = 'AES-256-CBC';
    const key = crypto_1.default.createHash('sha256').update(secretKey, 'utf-8').digest('hex').substring(0, 32);
    const iv = crypto_1.default.createHash('sha256').update(SecrectIv, 'utf-8').digest('hex').substring(0, 16);
    const buff = Buffer.from(ciphertextB64, 'base64');
    ciphertextB64 = buff.toString('utf-8');
    const descrypt = crypto_1.default.createDecipheriv(methodEncrypt, key, iv);
    return descrypt.update(ciphertextB64, 'base64', 'utf-8').concat(descrypt.final('utf-8'));
};
exports.decryptPassw = decryptPassw;
const sendMail = (email, linkVerify) => __awaiter(void 0, void 0, void 0, function* () {
    const host = config_1.default.get("smtpMail"); // "smtp.gmail.com"
    const user = config_1.default.get("emailSend"); //"chilansteven221@gmail.com"
    const passw = config_1.default.get("claveCorreo"); //"CuentaGmail2022"
    const hostname = host.toString();
    const username = user.toString();
    const password = passw.toString();
    // config transport mail 
    const transporter = nodemailer_1.default.createTransport({
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
    const info = yield transporter.sendMail({
        from: '"Info marketplacetes" <chilansteven221@gmail.com>',
        to: email,
        subject: "Recuperar contraseña",
        text: "Dar clic en el siguiente link, para resetear su clave.",
        html: `<p> Para poder resetear su contraseña, por favor dar clic <a href="${linkVerify}" target="_blank">aqui</a></p></br><p>Este link tiene estará disponible solo 5 minutos</p></br><p>En caso de no poder ingresar al link, copie y pega el enlace en su navegador</p></br><p> ${linkVerify}</p></p>`
    });
    console.log("Message sent: %s", info.response);
    return "email send";
});
exports.sendMail = sendMail;
//# sourceMappingURL=Utils.js.map