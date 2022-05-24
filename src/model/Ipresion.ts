import mongoose,{ Schema } from 'mongoose';

export interface IPresion extends Document {
    dateOfCreated   : Date;
    registroPresionAlta  : Number;
    registroPresionBaja  : Number;
}

const presionSchema: Schema = new Schema({
    dateOfCreated : { 
        type: Date,
        default: Date.now
    },
    registroPresionAlta  : Number,
    registroPresionBaja : Number
})

// Note: OverwriteModelError: Cannot overwrite `Certificates` model once compiled. error
export const Presion = (mongoose.models.presion || mongoose.model<IPresion>('presion', presionSchema, "presion"));