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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateHeight = exports.userUpdate = exports.verifyCode = exports.insCodeValidator = exports.updatePassword = exports.createUser = exports.findOneAndVerify = void 0;
const User_1 = require("../model/User");
const findOneAndVerify = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield User_1.User.findOne({ "email": email });
        //console.log("res user =>", res)
        if (res != null)
            return res;
        return null;
    }
    catch (error) {
        return error.message;
    }
});
exports.findOneAndVerify = findOneAndVerify;
/**
 * @param  {} users:IUser
 * @return return Model user created
 */
const createUser = (users) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield User_1.User.create(users);
        console.log("usuario registrado correctamente");
        return res;
    }
    catch (error) {
        return error.message;
    }
});
exports.createUser = createUser;
const updatePassword = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var userInfoUpdate = null;
    console.log("vamos actualizar la contraseña");
    try {
        userInfoUpdate = yield User_1.User.findOneAndUpdate({ "email": user.email }, { $set: {
                "password": user.password
            } }, { new: true });
        return userInfoUpdate;
    }
    catch (error) {
        console.error("error al grabar ", error.message);
        return error.message;
    }
});
exports.updatePassword = updatePassword;
const insCodeValidator = (code, email) => __awaiter(void 0, void 0, void 0, function* () {
    var validCode = null;
    console.log("guardamos el code ");
    try {
        validCode = yield User_1.User.findOneAndUpdate({ "email": email }, { $set: {
                "codeValidador": code
            } }, { new: true });
        return { validCode, insert: true };
    }
    catch (error) {
        console.error("error al grabar ", error.message);
        return error.message;
    }
});
exports.insCodeValidator = insCodeValidator;
const verifyCode = (code, email) => __awaiter(void 0, void 0, void 0, function* () {
    var verifySuccess = false;
    var userverified = null;
    console.log("validamos codigo 4 digitos");
    try {
        userverified = yield User_1.User.findOne({ "email": email, "codeValidador": code });
        if (userverified == null) {
            return userverified;
        }
        else {
            verifySuccess = true;
        }
        return verifySuccess;
    }
    catch (error) {
        console.error("error al grabar ", error.message);
        return error.message;
    }
});
exports.verifyCode = verifyCode;
/**
 * @param  {} dataUser:IUser
 * @return return Model user created
 */
const userUpdate = (dataUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userUpdate = yield User_1.User.findOneAndUpdate({ "email": dataUser.email }, { $set: {
                "fName": dataUser.fName,
                "lName": dataUser.lName,
                "birthDate": dataUser.birthDate,
                "phone": dataUser.phone,
                "identification": dataUser.identification,
                "bloodType": dataUser.bloodType,
                "gender": dataUser.gender
            } }, { new: true });
        return userUpdate;
    }
    catch (error) {
        console.error(error.message);
        return error.message;
    }
});
exports.userUpdate = userUpdate;
/**
 * @param  {} estatura:any
 * @return return Model user update field heigth
 */
const userUpdateHeight = (estatura, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userUpdate = yield User_1.User.findOneAndUpdate({ "email": email }, { $set: {
                "height": Number(estatura)
            } }, { new: true });
        console.log("Estatura actualizada con exito");
        return userUpdate;
    }
    catch (error) {
        console.error(error.message);
        return error.message;
    }
});
exports.userUpdateHeight = userUpdateHeight;
//# sourceMappingURL=UserServices.js.map