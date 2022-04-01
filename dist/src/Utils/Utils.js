"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.firstLogin = exports.sendMail = exports.decryptPassw = exports.encrypt = exports.convertDateWithMoment = void 0;
const moment_1 = __importDefault(require("moment"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("config"));
const jsonwebtoken = __importStar(require("jsonwebtoken"));
const UserServices_1 = require("../services/UserServices");
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
const sendMail = (email, codeValidator) => __awaiter(void 0, void 0, void 0, function* () {
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
        from: `Info medikal-app <${username}>`,
        to: email,
        subject: "Recuperar contraseña",
        text: "Para restablecer su contraseña ingresar el codigo de verificacion.",
        html: `<p>Solicitud de recuperacion de contraseña, su codigo de verificacion es: <strong>${codeValidator}</strong> </p>`
    });
    console.log("Message sent: %s", info.response);
    return "email send";
});
exports.sendMail = sendMail;
const firstLogin = (email, passw, token) => __awaiter(void 0, void 0, void 0, function* () {
    const encryptSecretKey = config_1.default.get("key");
    console.log("encryptSecretKeyLogin =>", encryptSecretKey);
    const arrayToken = token.split(' ')[1];
    console.log("arrayTokenLogin =>", arrayToken);
    const tokenValid = arrayToken;
    const verify = jsonwebtoken.verify(tokenValid, config_1.default.get("jwtSecret"), (errorToken) => {
        if (errorToken) {
            return { status: "forbidden", message: "token caducado" };
        }
    });
    if (typeof verify === "undefined") {
        const foundUser = yield (0, UserServices_1.findOneAndVerify)(email);
        console.log("users =>", foundUser);
        const passwTextB64 = foundUser.password;
        console.log("pass1 ", passwTextB64);
        const passwText = (0, exports.decryptPassw)(passwTextB64, encryptSecretKey);
        console.log("constraseña plana => ", passwText);
        var data = null;
        if (passw === passwText) {
            data = {
                message: "Usuario logueado correctamente",
                status: true,
                token: tokenValid
            };
        }
        else {
            data = {
                message: "Usuario o Contraseña incorrectas",
                status: false
            };
        }
        return data;
    }
});
exports.firstLogin = firstLogin;
//# sourceMappingURL=Utils.js.map