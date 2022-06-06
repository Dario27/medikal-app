import mongoose,{ Schema } from 'mongoose';

export interface IGlucemia extends Document {
    id                                : Number;
    dateOfCreated : Date;
    cantGlucemia    : String;
}

const glucemiaSchema: Schema = new Schema({
    id: Number,
    dateOfCreated : { 
        type: Date,
        default: Date.now
    },
    cantGlucemia  : String
})

// Note: OverwriteModelError: Cannot overwrite `Certificates` model once compiled. error
export const Glucemia = (mongoose.models.glucemia || mongoose.model<IGlucemia>('glucemia', glucemiaSchema, "glucemia"));