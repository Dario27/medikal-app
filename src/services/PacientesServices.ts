import { AggregatePaginateResult } from "mongoose";
import { TypeIndicators } from "../model/Interfaces/TypeIndicators";
import { IMasa, Imc } from "../model/IMasa";
import {Glucemia, IGlucemia} from "../model/IGlucemia";
import { IPresion, Presion } from "../model/Ipresion";
import { User, IUser } from "../model/User";

export const consultarAllPacientes = async () => {
    try {
        const pacientes = await User.find()
        return pacientes
    } catch (error) {
        return error.message
    }
}

export const listaPacientes = async (params:any) => {
    try {   

        const labelsCustom = {
            totalDocs: 'total_size',
            docs: params.typeIndicators,
            limit: 'limit',
            page: 'currentPage',
            nextPage: 'next',
            prevPage: 'prev',
            totalPages: 'totalPages',
        }

        const _offset = params.offset
        var offset = null
        if (_offset >1) {
            offset = ((_offset -1)*parseInt(params.limit.toString()))
        } else{
            offset = 0
        }
        const options = {
            pagination : true, 
            limit: params.limit , 
            offset: offset,
            page: params.page,
            customLabels :labelsCustom
        }
        var aggregate = null
        var res = null

        switch (params.typeIndicators) {
            case 'imc':
                aggregate = Imc.aggregate([
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
                        'height':0,
                        '_id': 0, 
                        '__v': 0
                      }
                    }
                ])
                await Imc.aggregatePaginate(aggregate, options,function (err:any, result:AggregatePaginateResult<IMasa>) {
                    res = result
                });
                break;
            case 'glucemia':
                aggregate = Glucemia.aggregate([
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
                        'height':0,
                        '_id': 0, 
                        '__v': 0
                      }
                    }
                ])
                await Glucemia.aggregatePaginate(aggregate, options,function (err:any, result:AggregatePaginateResult<IGlucemia>) {
                    res = result
                });
                break;
            case 'presion':
                aggregate = Presion.aggregate([
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
                        'height':0,
                        '_id': 0, 
                        '__v': 0
                      }
                    }
                ])
                await Presion.aggregatePaginate(aggregate, options,function (err:any, result:AggregatePaginateResult<IPresion>) {
                    res = result
                });
                break;
            default:
                res = {
                    "message":"No existe indicador",
                    "status":"fail"
                }
                break;
        }          
        return res
    } catch (error) {
        return error.message
    }
}