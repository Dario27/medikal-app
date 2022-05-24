import mongoose,{ Schema } from 'mongoose';
import { IGlucemia } from './IGlucemia';
import { IMasa } from './IMasa';
import { IPresion } from './Ipresion';

export interface ICertificate extends Document {
   glucemia  : Array<IGlucemia>;
    imc              : Array<IMasa>;
    presion     : Array<IPresion>;
}

const certificateSchema: Schema = new Schema({
    glucemia         : Array,
    imc                      : Array,
    cantPreArt    : Array,
})

// Note: OverwriteModelError: Cannot overwrite `Certificates` model once compiled. error
export const Certificates = (mongoose.models.certificates || mongoose.model<ICertificate>('certificates', certificateSchema, "certificates"));