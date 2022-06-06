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
exports.findNewIdImc = exports.findAllByIndicators = exports.saveRecordsPresion = exports.saveRecordsIMC = exports.createRecords = exports.existsPacient = exports.saveRecordsGlucemia = void 0;
const Records_1 = require("../model/Records");
const saveRecordsGlucemia = (email, dataGlucemia) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var res = null;
        const { isPacient, data } = yield (0, exports.existsPacient)(email);
        if (isPacient) {
            const listCertificate = data.certificates.glucemia.concat(dataGlucemia);
            console.log("listCertificate => ", listCertificate);
            const updateCertificate = yield Records_1.Records.findOneAndUpdate({ "userID": email }, { $set: { "certificates.glucemia": listCertificate } }, { new: true });
            res = updateCertificate;
        }
        console.log("res ", res);
        return res;
    }
    catch (error) {
        return error.message;
    }
});
exports.saveRecordsGlucemia = saveRecordsGlucemia;
const existsPacient = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataPac = yield Records_1.Records.findOne({ "userID": email });
        console.log("data=> ", dataPac);
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
const createRecords = (records) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Records_1.Records.create(records);
});
exports.createRecords = createRecords;
const saveRecordsIMC = (email, dataIMC) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var res = null;
        const { isPacient, data } = yield (0, exports.existsPacient)(email);
        if (isPacient) {
            const listCertificate = data.certificates.imc.concat(dataIMC);
            console.log("listCertificate => ", listCertificate);
            const updateCertificate = yield Records_1.Records.findOneAndUpdate({ "userID": email }, { $set: { "certificates.imc": listCertificate } }, { new: true });
            res = updateCertificate;
        }
        return res;
    }
    catch (error) {
        return error.message;
    }
});
exports.saveRecordsIMC = saveRecordsIMC;
const saveRecordsPresion = (email, dataPresion) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var res = null;
        const { isPacient, data } = yield (0, exports.existsPacient)(email);
        if (isPacient) {
            const listCertificate = data.certificates.presion.concat(dataPresion);
            console.log("listCertificate => ", listCertificate);
            const updateCertificate = yield Records_1.Records.findOneAndUpdate({ "userID": email }, { $set: { "certificates.presion": listCertificate } }, { new: true });
            res = updateCertificate;
        }
        return res;
    }
    catch (error) {
        return error.message;
    }
});
exports.saveRecordsPresion = saveRecordsPresion;
const findAllByIndicators = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataFound = yield Records_1.Records.aggregate([
            {
                $match: { "userID": email }
            }
        ]);
        return dataFound;
    }
    catch (error) {
        return error.message;
    }
});
exports.findAllByIndicators = findAllByIndicators;
const findNewIdImc = (email, typeIndicators) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var idNew = 0;
        const data = yield Records_1.Records.findOne({ "userID": email });
        if (data.certificates.presion.length > 0) {
        }
        else {
            idNew = 1;
        }
        return idNew;
    }
    catch (error) {
        return error.message;
    }
});
exports.findNewIdImc = findNewIdImc;
//# sourceMappingURL=SaludServices.js.map