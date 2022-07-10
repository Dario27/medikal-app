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
exports.listaPacientes = exports.consultarAllPacientes = void 0;
const IMasa_1 = require("../model/IMasa");
const IGlucemia_1 = require("../model/IGlucemia");
const Ipresion_1 = require("../model/Ipresion");
const User_1 = require("../model/User");
const consultarAllPacientes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pacientes = yield User_1.User.find();
        return pacientes;
    }
    catch (error) {
        return error.message;
    }
});
exports.consultarAllPacientes = consultarAllPacientes;
const listaPacientes = (params) => __awaiter(void 0, void 0, void 0, function* () {
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
        const _offset = params.offset;
        var offset = null;
        if (_offset > 1) {
            offset = ((_offset - 1) * parseInt(params.limit.toString()));
        }
        else {
            offset = 0;
        }
        const options = {
            pagination: true,
            limit: params.limit,
            offset: offset,
            page: params.page,
            customLabels: labelsCustom
        };
        var aggregate = null;
        var res = null;
        switch (params.typeIndicators) {
            case 'imc':
                aggregate = IMasa_1.Imc.aggregate([
                    {
                        $group: {
                            '_id': '$userID',
                            'totalImc': {
                                '$last': '$cantImc'
                            },
                            'totpeso': {
                                '$last': '$pesoReg'
                            },
                            'altura': {
                                '$last': '$alturaReg'
                            },
                            'cintura': {
                                '$last': '$waist'
                            },
                            'tipoPeso': {
                                '$last': '$tipoPeso'
                            },
                            'dateOfCreated': {
                                '$last': {
                                    '$dateToString': {
                                        'format': '%d/%m/%Y',
                                        'date': '$dateOfCreated'
                                    }
                                }
                            }
                        }
                    }, {
                        $lookup: {
                            'from': 'users',
                            'localField': '_id',
                            'foreignField': '_id',
                            'as': 'dataPacientes'
                        }
                    }, {
                        $replaceRoot: {
                            'newRoot': {
                                '$mergeObjects': [
                                    {
                                        '$arrayElemAt': [
                                            '$dataPacientes', 0
                                        ]
                                    }, '$$ROOT'
                                ]
                            }
                        }
                    }, {
                        $project: {
                            'dataPacientes': 0,
                            'age': 0,
                            'birthDate': 0,
                            'password': 0,
                            'codeValidador': 0,
                            'bloodType': 0,
                            'dateCreated': 0,
                            'height': 0,
                            '_id': 0,
                            '__v': 0
                        }
                    }
                ]);
                yield IMasa_1.Imc.aggregatePaginate(aggregate, options, function (err, result) {
                    res = result;
                });
                break;
            case 'glucemia':
                aggregate = IGlucemia_1.Glucemia.aggregate([
                    {
                        $group: {
                            '_id': '$userID',
                            'cantGlucemia': {
                                '$last': '$cantGlucemia'
                            },
                            'tipoGlucemia': {
                                '$last': '$tipoGlucemia'
                            },
                            'dateOfCreated': {
                                '$last': {
                                    '$dateToString': {
                                        'format': '%d/%m/%Y',
                                        'date': '$dateOfCreated'
                                    }
                                }
                            }
                        }
                    }, {
                        $lookup: {
                            'from': 'users',
                            'localField': '_id',
                            'foreignField': '_id',
                            'as': 'dataPacientes'
                        }
                    }, {
                        $replaceRoot: {
                            'newRoot': {
                                '$mergeObjects': [
                                    {
                                        '$arrayElemAt': [
                                            '$dataPacientes', 0
                                        ]
                                    }, '$$ROOT'
                                ]
                            }
                        }
                    }, {
                        $project: {
                            'dataPacientes': 0,
                            'age': 0,
                            'birthDate': 0,
                            'password': 0,
                            'codeValidador': 0,
                            'bloodType': 0,
                            'dateCreated': 0,
                            'height': 0,
                            '_id': 0,
                            '__v': 0
                        }
                    }
                ]);
                yield IGlucemia_1.Glucemia.aggregatePaginate(aggregate, options, function (err, result) {
                    res = result;
                });
                break;
            case 'presion':
                aggregate = Ipresion_1.Presion.aggregate([
                    {
                        $group: {
                            '_id': '$userID',
                            'presionSistolica': {
                                '$last': '$registroPresionBaja'
                            },
                            'presionDiastolica': {
                                '$last': '$registroPresionAlta'
                            },
                            'tipoPresion': {
                                '$last': '$tipoPresion'
                            },
                            'dateOfCreated': {
                                '$last': {
                                    '$dateToString': {
                                        'format': '%d/%m/%Y',
                                        'date': '$dateOfCreated'
                                    }
                                }
                            }
                        }
                    }, {
                        $lookup: {
                            'from': 'users',
                            'localField': '_id',
                            'foreignField': '_id',
                            'as': 'dataPacientes'
                        }
                    }, {
                        $replaceRoot: {
                            'newRoot': {
                                '$mergeObjects': [
                                    {
                                        '$arrayElemAt': [
                                            '$dataPacientes', 0
                                        ]
                                    }, '$$ROOT'
                                ]
                            }
                        }
                    }, {
                        $project: {
                            'dataPacientes': 0,
                            'age': 0,
                            'birthDate': 0,
                            'password': 0,
                            'codeValidador': 0,
                            'bloodType': 0,
                            'dateCreated': 0,
                            'height': 0,
                            '_id': 0,
                            '__v': 0
                        }
                    }
                ]);
                yield Ipresion_1.Presion.aggregatePaginate(aggregate, options, function (err, result) {
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
exports.listaPacientes = listaPacientes;
//# sourceMappingURL=PacientesServices.js.map