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
const TypeLogin_1 = require("../../model/Interfaces/TypeLogin");
const MedicoServices_1 = require("../../services/MedicoServices");
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
    const cedula = body.identification;
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
        if (cedula.length === 0 || cedula === undefined) {
            return res.status(400).json({
                "message": "Error en el campo cedula, esta vacio o indefinido"
            });
        }
        else {
            const userData = {
                fName: nombres,
                lName: apellidos,
                birthDate: birthDate,
                phone: phone,
                password: passwordEncrypt,
                age: currentEdad,
                email: email,
                bloodType: bloodType,
                gender: genre,
                identification: cedula
            };
            const foundUsers = yield (0, UserServices_1.findOneAndVerify)(_email);
            if (foundUsers === null) {
                //console.log("data users: ", userData)
                const result = yield (0, UserServices_1.createUser)(userData);
                const _token = jsonwebtoken.sign({ userId: result._id, email: result.email, cedula: result.cedula }, config_1.default.get("jwtSecret"));
                const tokenLogin = "Bearer " + _token;
                const response = yield (0, Utils_1.firstLogin)(userData.email, password, tokenLogin);
                return res.status(200).json(response);
            }
            else {
                const dataUserResponse = {
                    message: "Usuario ya se encuentra registrado",
                    status: false
                };
                return res.status(400).json(dataUserResponse); //mensaje de error 
            }
        }
    }
    catch (error) {
        const errorResponse = {
            message: "Error: " + error.message,
            status: false
        };
        return res.status(404).json(errorResponse);
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const password = body.password;
    const email = body.email;
    const type = body.type;
    try {
        console.log("email ", email);
        const encryptSecretKey = config_1.default.get("key");
        console.log("encryptSecretKey =>", encryptSecretKey);
        if (type === TypeLogin_1.TypeLogin.paciente) { // si es 2:Logueamos con al app al paciente
            const foundUser = yield (0, UserServices_1.findOneAndVerify)(email);
            console.log("users =>", foundUser);
            if (foundUser !== null) {
                const passwTextB64 = foundUser.password;
                console.log("pass1 ", passwTextB64);
                const passwText = (0, Utils_1.decryptPassw)(passwTextB64, encryptSecretKey);
                console.log("constrase??a plana => ", passwText);
                var data = null;
                if (foundUser === null) {
                    data = {
                        message: "Usuario no existe",
                        status: false
                    };
                    return res.status(404).json(data);
                }
                else {
                    if (password === passwText) {
                        const _token = jsonwebtoken.sign({ userId: foundUser._id, email: foundUser.email, cedula: foundUser.identification }, config_1.default.get("jwtSecret"));
                        data = {
                            message: "Usuario encontrado",
                            status: true,
                            token: _token
                        };
                        return res.status(200).send(data);
                    }
                    else {
                        data = {
                            message: "Usuario o Contrase??a incorrectas",
                            status: false
                        };
                        return res.status(400).send(data);
                    }
                }
            }
            else {
                const rdata = {
                    message: "Usuario no existe",
                    status: false
                };
                return res.status(404).json(rdata);
            }
        }
        else { // si es 1:Logueamos al medico desde el portal web
            const foundMedico = yield (0, MedicoServices_1.verifyMedicoByEmail)(email);
            console.log("medico =>", foundMedico);
            if (foundMedico !== null) {
                const passwTextB64 = foundMedico.password;
                console.log("pass1 ", passwTextB64);
                const passwText = (0, Utils_1.decryptPassw)(passwTextB64, encryptSecretKey);
                console.log("constrase??a plana => ", passwText);
                if (password === passwText) {
                    const _token = jsonwebtoken.sign({ userId: foundMedico._id, email: foundMedico.email, cedula: foundMedico.identification }, config_1.default.get("jwtSecret"));
                    data = {
                        message: "Medico encontrado",
                        status: true,
                        token: _token
                    };
                    return res.status(200).send(data);
                }
                else {
                    data = {
                        message: "Usuario o Contrase??a incorrectas",
                        status: false
                    };
                    return res.status(400).send(data);
                }
            }
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
                if (yield (0, Utils_1.sendMail)(userData.email, codeValidator)) {
                    return res.status(200).json({
                        message: "Correo enviado con exito",
                        status: "success"
                    });
                }
                else {
                    return res.status(400).json({
                        message: "No se podido enviar el correo",
                        status: "fail"
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: "Error, no se ha podido generar el codigo temporal",
                    status: "Fail"
                });
            }
        }
        else {
            return res.status(400).json({
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
                message: "Codigo ingresado inv??lido",
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
        return res.status(404).json(errorResponse);
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
                message: "Contrase??a modificada",
                status: "success"
            });
        }
        else {
            return res.status(400).json({
                message: "Error al actualizar su contrase??a",
                status: "fail"
            });
        }
    }
    catch (error) {
        const errorResponse = {
            message: "Error: " + error.message,
            status: false
        };
        return res.status(404).json(errorResponse);
    }
}));
router.get('/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _token = req.headers.authorization;
    //console.log("auth => ", _token)
    const token1 = _token.split(' ');
    //console.log("token1 =>", token1)
    const token = token1[1];
    console.log("token =>", token);
    var err = null;
    var emailUser = null;
    jsonwebtoken.verify(token, config_1.default.get("jwtSecret"), (errorToken, data) => {
        console.log("errorToken", errorToken);
        if (errorToken) {
            err = errorToken;
            return res.status(400).json({ status: "forbidden", message: err.message });
        }
        else {
            console.log("data =>", JSON.stringify(data));
            console.log("email => ", data.email);
            emailUser = data.email;
        }
    });
    const data = yield (0, Utils_1.dataProfile)(emailUser);
    if (data === null) {
        return res.status(400).json({
            message: "Usario no encontrado",
            status: "fail"
        });
    }
    else {
        return res.status(200).json(data);
    }
}));
router.post("/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log("body-update-user => ", body);
    const nombres = body.fName;
    const apellidos = body.lName;
    const birthDate = body.birthDate;
    const bloodType = body.bloodType;
    const phone = body.phone;
    const genre = body.gender;
    const cedula = body.identification;
    const token1 = req.headers.authorization;
    const tokenArray = token1.split(' ');
    const token = tokenArray[1];
    console.log("token =>", token);
    try {
        var err = null;
        var emailUser = null;
        if (cedula.length === 0 || cedula === undefined) {
            return res.status(400).json({
                "message": "Error en el campo cedula, esta vacio o indefinido"
            });
        }
        else {
            jsonwebtoken.verify(token, config_1.default.get("jwtSecret"), (errorToken, data) => {
                console.log("errorToken", errorToken);
                if (errorToken) {
                    err = errorToken;
                    return res.status(400).json({ status: "forbidden", message: err.message });
                }
                else {
                    console.log("data =>", JSON.stringify(data));
                    console.log("email => ", data.email);
                    emailUser = data.email;
                }
            });
            const user = {
                email: emailUser,
                fName: nombres,
                lName: apellidos,
                bloodType: bloodType,
                birthDate: birthDate,
                phone: phone,
                gender: genre,
                identification: cedula
            };
            const result = yield (0, UserServices_1.userUpdate)(user);
            if (result !== null || result !== undefined) {
                return res.status(200).json({ "message": "Datos actualizados con exito" });
            }
            else {
                return res.status(404).json({ "message": "Error al actualizar los datos" });
            }
        }
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
}));
exports.default = router;
//# sourceMappingURL=user.js.map