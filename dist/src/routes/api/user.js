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
    const nombres = body.fName;
    const apellidos = body.lName;
    const birthDate = body.birthDate;
    const password = body.password;
    const email = body.email;
    const bloodType = body.bloodType;
    const phone = body.phone;
    const genre = body.gender;
    console.log(" entrando al api de usuarios");
    const encryptSecretKey = config_1.default.get("key");
    //console.log("encryptSecretKey =>", encryptSecretKey)
    try {
        const _email = email;
        const anioNac = new Date(birthDate).getFullYear();
        console.log("anio Nac ", anioNac);
        const passwordEncrypt = (0, Utils_1.encrypt)(password, encryptSecretKey);
        const anioCurrent = new Date().getFullYear();
        const currentEdad = (anioCurrent - anioNac);
        const userData = {
            fName: nombres,
            lName: apellidos,
            birthDate: birthDate,
            phone: phone,
            password: passwordEncrypt,
            age: currentEdad.toString(),
            email: email,
            bloodType: bloodType,
            gender: genre
        };
        const foundUsers = yield (0, UserServices_1.findOneAndVerify)(_email);
        if (foundUsers === null) {
            //console.log("data users: ", userData)
            const result = yield (0, UserServices_1.createUser)(userData);
            const _token = jsonwebtoken.sign({ userId: result._id, email: result.email }, config_1.default.get("jwtSecret"), { expiresIn: '86400s' });
            const tokenLogin = "Bearer " + _token;
            const response = yield (0, Utils_1.firstLogin)(userData.email, password, tokenLogin);
            res.json(response);
        }
        else {
            const dataUserResponse = {
                message: "Usuario ya se encuentra registrado",
                status: false
            };
            res.status(400).json(dataUserResponse); //mensaje de error 
        }
    }
    catch (error) {
        const errorResponse = {
            message: "Error: " + error.message,
            status: false
        };
        res.status(404).json(errorResponse);
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const password = body.password;
    const email = body.email;
    const apiKey = req.headers["x-api-key"];
    try {
        console.log("email ", email);
        const encryptSecretKey = config_1.default.get("key");
        console.log("encryptSecretKey =>", encryptSecretKey);
        /* const dataEnc = encrypt(password, encryptSecretKey)
        console.log("dataEnc =>", dataEnc) */
        const arrayToken = apiKey.split(' ')[1];
        console.log("arrayToken =>", arrayToken);
        const tokenValid = arrayToken;
        //console.log("keysecret => ", config.get("jwtSecret"))
        const verify = jsonwebtoken.verify(tokenValid, config_1.default.get("jwtSecret"), (errorToken) => {
            if (errorToken) {
                return res.json({ status: "forbidden", message: "token caducado" });
            }
        });
        if (typeof verify === "undefined") {
            const foundUser = yield (0, UserServices_1.findOneAndVerify)(email);
            console.log("users =>", foundUser);
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
    }
    catch (error) {
        const errorResponse = {
            message: "Error: " + error.message,
            status: false
        };
        res.status(404).json(errorResponse);
    }
}));
router.post("/forgotPassw", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const email = body.email;
    console.log("email param =>", email);
    try {
        const userData = yield (0, UserServices_1.findOneAndVerify)(email);
        if (userData != null) {
            //token1 = jsonwebtoken.sign({userId: userData._id, email: userData.email}, config.get("jwtSecret"), {expiresIn: '300s'})        
            //linkVerify = `http://localhost:1997/reset-password/${token1}`
            const codeValidator = Math.floor(1000 + Math.random() * 9000);
            console.log("codeValidator => ", codeValidator);
            const { insert } = yield (0, UserServices_1.insCodeValidator)(codeValidator, email);
            if (insert) {
                yield (0, Utils_1.sendMail)(userData.email, codeValidator);
                res.status(200).json({
                    message: "Correo enviado con exito",
                    status: "success"
                });
            }
            else {
                res.status(400).json({
                    message: "Error, no se ha podido generar el codigo temporal",
                    status: "Fail"
                });
            }
        }
        else {
            res.status(400).json({
                message: "Error, el usuario ingresado, no existe",
                status: "Fail"
            });
        }
    }
    catch (error) {
        return res.status(404).json({ message: error.message, status: "Fail", });
    }
}));
router.post('/verifyCode', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log("body => ", body);
    const codeValidator = body.resetToken;
    const email = body.email;
    try {
        const result = yield (0, UserServices_1.verifyCode)(codeValidator, email);
        if (result == null || !result) {
            return res.status(400).json({
                message: "Codigo ingresado inválido",
                status: "Fail",
            });
        }
        else {
            return res.status(200).json({
                message: "Codigo ingresado correctamente",
                status: result,
            });
        }
    }
    catch (error) {
        console.log("Error linea 187: " + error.message);
        const errorResponse = {
            message: "Error: " + error.message,
            status: false
        };
        res.status(404).json(errorResponse);
    }
}));
router.post('/newPassword', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log("body => ", body);
    const email = body.email;
    const newPassword = body.password;
    const resetToken = body.resetToken;
    try {
        const encryptSecretKey = config_1.default.get("key");
        const passwordEncrypt = (0, Utils_1.encrypt)(newPassword, encryptSecretKey);
        console.log("code token => ", resetToken);
        const UserData = {
            email: email,
            password: passwordEncrypt
        };
        console.log("user Data: ", UserData);
        const result = yield (0, UserServices_1.updatePassword)(UserData);
        console.log("result update=> ", result);
        if (result !== null) {
            return res.status(200).json({
                message: "Contraseña modificada",
                status: "success"
            });
        }
        else {
            return res.status(400).json({
                message: "Error al actualizar su contraseña",
                status: "fail"
            });
        }
    }
    catch (error) {
        const errorResponse = {
            message: "Error: " + error.message,
            status: false
        };
        res.status(404).json(errorResponse);
    }
}));
exports.default = router;
//# sourceMappingURL=user.js.map