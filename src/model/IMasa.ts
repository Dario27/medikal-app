import mongoose,{ Schema } from 'mongoose';

export interface IMasa extends Document {
    dateOfCreated : Date;
    cantImc                : Number;
}

const imcSchema: Schema = new Schema({
    dateOfCreated : { 
        type: Date,
        default: Date.now
    },
    cantImc  : Number
})

// Note: OverwriteModelError: Cannot overwrite `Certificates` model once compiled. error
export const Imc = (mongoose.models.imcrecords || mongoose.model<IMasa>('imcrecords', imcSchema, "imcrecords"));