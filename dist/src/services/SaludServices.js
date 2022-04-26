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
exports.existsPacient = exports.saveRecords = void 0;
const Records_1 = require("../model/Records");
const firebase_1 = require("../../config/firebase");
const saveRecords = (email, certificates) => __awaiter(void 0, void 0, void 0, function* () {
    const firebase = new firebase_1.Firebase();
    try {
        const listCertificate = [];
        listCertificate.push(certificates);
        //await Certificates.create(certificates)
        const records = {
            userID: email,
            certificates: listCertificate
        };
        /* const api = 'BBhMdg1jsx90NgDBRY4pa89llR0AOAjk50q5RboBG1J45OaEORhm7RwW41GsS76Ai5BsiWd6MjRvqYXEV5tnjeM'
        const app = firebase.runFirebase()
        await firebase.getTokenMessaging(app, api) */
        var res = null;
        const { isPacient, data } = yield (0, exports.existsPacient)(email);
        if (!isPacient) {
            res = yield Records_1.Records.create(records);
        }
        else {
            const listCertificate = data.certificates.concat(certificates);
            const updateCertificate = yield Records_1.Records.findOneAndUpdate({ "userID": email }, { $set: { "certificates": listCertificate } }, { new: true });
            res = updateCertificate;
        }
        console.log("res ", res);
        return res;
    }
    catch (error) {
        return error.message;
    }
});
exports.saveRecords = saveRecords;
const existsPacient = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataPac = yield Records_1.Records.findOne({ "userID": email });
        if (dataPac != null) {
            return { isPacient: true, data: dataPac };
        }
        else {
            return { isPacient: false, data: null };
        }
    }
    catch (error) {
        return error.message;
    }
});
exports.existsPacient = existsPacient;
//# sourceMappingURL=SaludServices.js.map