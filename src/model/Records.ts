import mongoose,{ Schema, Types } from 'mongoose';
import { ICertificate } from '../model/Certificates'

export interface IRecords extends Document {     
    userID       : String
    certificates : Array<ICertificate>
}

const recordsSchema: Schema = new Schema({ 
    userID    : String,
    certificates : Array
})

// Note: OverwriteModelError: Cannot overwrite `Records` model once compiled. error
export const Records = (mongoose.models.records || mongoose.model<IRecords>('records', recordsSchema, "records"));