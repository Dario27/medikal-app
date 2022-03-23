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
const config_1 = __importDefault(require("config"));
const express_1 = require("express");
const UserServices_1 = require("../../services/UserServices");
const Utils_1 = require("../../Utils/Utils");
const jsonwebtoken = __importStar(require("jsonwebtoken"));
//import Mail from "nodemailer/lib/mailer";
const router = (0, express_1.Router)();
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log("body-create-user => ", body);
    const nombres = body.nombres;
    const apellidos = body.apellidos;
    const anioNac = body.anioNac;
    const password = body.password;
    const email = body.email;
    const altura = body.altura;
    const peso = body.peso;
    const sexo = body.sexo;
    const phone = body.phone;
    const fecha = new Date();
    const dateCreated = fecha.getTime();
    console.log(" entrando al api de usuarios");
    const encryptSecretKey = config_1.default.get("key");
    //console.log("encryptSecretKey =>", encryptSecretKey)
    try {
        const _email = email;
        const passwordEncrypt = (0, Utils_1.encrypt)(password, encryptSecretKey);
        const anioCurrent = new Date().getFullYear();
        const currentEdad = (anioCurrent - anioNac);
        const userData = {
            nombres: nombres,
            apellidos: apellidos,
            anioNac: anioNac,
            phone: phone,
            password: passwordEncrypt,
            altura: altura,
            peso: peso,
            sexo: sexo,
            edad: currentEdad.toString(),
            email: email
        };
        const foundUsers = yield (0, UserServices_1.findOneAndVerify)(_email);
        if (foundUsers === null) {
            //console.log("data users: ", userData)
            const result = yield (0, UserServices_1.createUser)(userData);
            const response = {
                message: "Guardado con éxito...",
                status: true,
                data: result
            };
            res.json(response);
        }
        else {
            const dataUserResponse = {
                menssage: "Usuario ya se encuentra registrado",
                status: false
            };
            res.json(dataUserResponse);
        }
    }
    catch (error) {
        const errorResponse = {
            menssage: "Error: " + error.message,
            status: false
        };
        res.json(errorResponse);
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const password = body.password;
    const email = body.email;
    try {
        const encryptSecretKey = config_1.default.get("key");
        console.log("encryptSecretKey =>", encryptSecretKey);
        /* const dataEnc = encrypt(password, encryptSecretKey)
        console.log("dataEnc =>", dataEnc) */
        const foundUser = yield (0, UserServices_1.findOneAndVerify)(email);
        const passwTextB64 = foundUser.password;
        console.log("pass1 ", passwTextB64);
        const passwText = (0, Utils_1.decryptPassw)(passwTextB64, encryptSecretKey);
        console.log("constraseña plana => ", passwText);
        var data = null;
        if (password === passwText) {
            data = {
                message: "Usuario encontrado",
                status: true,
                dataUserLogin: foundUser
            };
        }
        else {
            data = {
                message: "Usuario o Contraseña incorrectas",
                status: false
            };
        }
        res.send(data);
    }
    catch (error) {
        console.log("Error => /login " + error.message);
    }
}));
router.post("/forgotPassw", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const email = body.email;
    console.log("email param =>", email);
    var linkVerify = null;
    var token = null;
    try {
        const userData = yield (0, UserServices_1.findOneAndVerify)(email);
        if (userData != null) {
            token = jsonwebtoken.sign({ userId: userData._id, email: userData.email }, config_1.default.get("jwtSecret"), { expiresIn: '300s' });
            linkVerify = `http://localhost:1997/reset-password/${token}`;
        }
        yield (0, Utils_1.sendMail)(userData.email, linkVerify);
        res.status(200).json({
            status: "success",
            message: "Correo enviado con exito",
            data: {
                token: token,
                linkReset: linkVerify
            }
        });
    }
    catch (error) {
        return res.status(200).json({ status: "Fail", message: "Error linea 143 => " + error.message });
    }
}));
router.post('/new-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log("body => ", body);
    const tokenHeader = req.headers.tokens;
    const email = body.email;
    const newPassword = body.password;
    const arrayToken = tokenHeader.split(' ')[1];
    try {
        const UserData = {
            email: email,
            password: newPassword
        };
        //console.log("tokenHeader=> ", arrayToken)
        const token = arrayToken;
        //console.log("keysecret => ", config.get("jwtSecret"))
        const verify = jsonwebtoken.verify(token, config_1.default.get("jwtSecret"), (errorToken) => {
            if (errorToken) {
                return res.json({ status: "forbidden", message: "token caducado" });
            }
            else {
            }
        });
        if (typeof verify === "undefined") {
            console.log("verify => ", verify);
            console.log("user Data: ", UserData);
            const result = yield (0, UserServices_1.updatePassword)(UserData);
            console.log("result update=> ", result);
            if (result !== null) {
                return res.json({
                    status: "success",
                    mensaje: "Contraseña modificada"
                });
            }
            else {
                return res.json({
                    status: "fail",
                    mensaje: "Error al actualizar su contraseña"
                });
            }
        }
    }
    catch (error) {
        console.log("Error linea 187: " + error.message);
        return "Error linea 187: " + error.message;
    }
}));
exports.default = router;
//# sourceMappingURL=user.js.map