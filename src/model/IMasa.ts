import mongoose,{ Schema } from 'mongoose';

export interface IMasa extends Document {
    id                                : Number;
    dateOfCreated : Date;
    cantImc                : Number;
    pesoReg                : String;
    alturaReg             : String;
}

const imcSchema: Schema = new Schema({
    id                                : Number,
    dateOfCreated : { 
        type: Date,
        default: Date.now
    },
    cantImc  : Number, 
    pesoReg: String,
    alturaReg : String
})

// Note: OverwriteModelError: Cannot overwrite `Certificates` model once compiled. error
export const Imc = (mongoose.models.imcrecords || mongoose.model<IMasa>('imcrecords', imcSchema, "imcrecords"));