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
exports.consultarEspecialidadesByID = exports.consultarEspecialidades = void 0;
const Specialities_1 = require("../model/Specialities");
const consultarEspecialidades = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundSpecialities = yield Specialities_1.Specialities.aggregate([
            {
                $match: { "status": "A" }
            }
        ]);
        const res = foundSpecialities;
        //console.log("res ", res)
        return res;
    }
    catch (error) {
        return error.message;
    }
});
exports.consultarEspecialidades = consultarEspecialidades;
const consultarEspecialidadesByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundSpecialities = yield Specialities_1.Specialities.findById(id);
        const res = foundSpecialities;
        //console.log("res ", res)
        return res;
    }
    catch (error) {
        return error.message;
    }
});
exports.consultarEspecialidadesByID = consultarEspecialidadesByID;
//# sourceMappingURL=SpecialitiesServices.js.map