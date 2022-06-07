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
exports.findNewIdImc = exports.findUserById = exports.findAllByIndicators = exports.saveRecordsPresion = exports.saveRecordsIMC = exports.createRecords = exports.existsPacient = exports.saveRecordsGlucemia = void 0;
const Records_1 = require("../model/Records");
const IGlucemia_1 = require("../model/IGlucemia");
const IMasa_1 = require("../model/IMasa");
const Ipresion_1 = require("../model/Ipresion");
const User_1 = require("../model/User");
const saveRecordsGlucemia = (dataGlucemia) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responseGlucemia = yield IGlucemia_1.Glucemia.create(dataGlucemia);
        const res = responseGlucemia;
        //console.log("res ", res)
        return res;
    }
    catch (error) {
        return error.message;
    }
});
exports.saveRecordsGlucemia = saveRecordsGlucemia;
const existsPacient = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(" email exists =>", email);
        const dataPac = yield User_1.User.findOne({ "email": email });
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
const saveRecordsIMC = (dataIMC) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responseMasa = yield IMasa_1.Imc.create(dataIMC);
        const res = responseMasa;
        return res;
    }
    catch (error) {
        return error.message;
    }
});
exports.saveRecordsIMC = saveRecordsIMC;
const saveRecordsPresion = (dataPresion) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responsePresion = yield Ipresion_1.Presion.create(dataPresion);
        const res = responsePresion;
        return res;
    }
    catch (error) {
        return error.message;
    }
});
exports.saveRecordsPresion = saveRecordsPresion;
const findAllByIndicators = (ObjectId, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const labelsCustom = {
            totalDocs: 'total_size',
            docs: params.typeIndicators,
            limit: 'limit',
            page: 'currentPage',
            nextPage: 'next',
            prevPage: 'prev',
            totalPages: 'totalPages',
        };
        const options = {
            pagination: true,
            limit: params.limit,
            offset: params.offset,
            customLabels: labelsCustom
        };
        var res = null;
        var aggregate = null;
        switch (params.typeIndicators) {
            case "imc":
                aggregate = IMasa_1.Imc.aggregate([
                    {
                        $match: { "userID": ObjectId }
                    }
                ]);
                yield IMasa_1.Imc.aggregatePaginate(aggregate, options, function (err, result) {
                    res = result;
                });
                break;
            case "presion":
                aggregate = Ipresion_1.Presion.aggregate([
                    {
                        $match: { "userID": ObjectId }
                    }
                ]);
                yield Ipresion_1.Presion.aggregatePaginate(aggregate, options, function (err, result) {
                    res = result;
                });
                break;
            case "glucemia":
                aggregate = IGlucemia_1.Glucemia.aggregate([
                    {
                        $match: { "userID": ObjectId }
                    }
                ]);
                yield IGlucemia_1.Glucemia.aggregatePaginate(aggregate, options, function (err, result) {
                    res = result;
                });
                break;
            default:
                res = {
                    "message": "No existe indicador",
                    "status": "fail"
                };
                break;
        }
        return res;
    }
    catch (error) {
        return error.message;
    }
});
exports.findAllByIndicators = findAllByIndicators;
const findUserById = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resp = yield User_1.User.findOne({ "email": email });
        //console.log("data user => ", resp)
        return resp._id;
    }
    catch (error) {
        return error.message;
    }
});
exports.findUserById = findUserById;
const findNewIdImc = (ObjectId, typeIndicators) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var idNew = 0;
        var data = null;
        switch (typeIndicators) {
            case "imc":
                data = yield IMasa_1.Imc.aggregate([
                    {
                        $match: { "userID": ObjectId }
                    },
                    {
                        $sort: {
                            id: -1
                        }
                    }
                ]);
                break;
            case "glucemia":
                data = yield IGlucemia_1.Glucemia.aggregate([
                    {
                        $match: { "userID": ObjectId }
                    },
                    {
                        $sort: {
                            id: -1
                        }
                    }
                ]);
                break;
            case "presion":
                data = yield Ipresion_1.Presion.aggregate([
                    {
                        $match: { "userID": ObjectId }
                    },
                    {
                        $sort: {
                            id: -1
                        }
                    }
                ]);
                break;
            default:
                break;
        }
        if (data.length > 0) {
            idNew = (data[0].id) + 1;
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