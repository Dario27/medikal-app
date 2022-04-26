import mongoose,{ Schema } from 'mongoose';

export interface ICertificate extends Document {
    dateOfCreated : Date;
    imc           : String;
    cantGlucemia  : String;
    cantPreArt    : String;
}

const certificateSchema: Schema = new Schema({
    dateOfCreated : { 
        type: Date,
        default: Date.now
    },
    imc           : String,
    cantGlucemia  : String,
    cantPreArt    : String
})

// Note: OverwriteModelError: Cannot overwrite `Certificates` model once compiled. error
export const Certificates = (mongoose.models.certificates || mongoose.model<ICertificate>('certificates', certificateSchema, "certificates"));