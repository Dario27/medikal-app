import mongoose,{ Schema, AggregatePaginateModel } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface IGlucemia extends Document {
    id                                : Number;
    dateOfCreated : Date;
    cantGlucemia    : String;
    userID                    : Object;
}

const glucemiaSchema: Schema = new Schema({
    id: Number,
    dateOfCreated : { 
        type: Date,
        default: Date.now
    },
    cantGlucemia  : String,
    userID :{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'users'
    }
})

glucemiaSchema.plugin(mongooseAggregatePaginate);

interface Glucemia<T extends Document> extends AggregatePaginateModel<T> {}

// Note: OverwriteModelError: Cannot overwrite `Certificates` model once compiled. error
export const Glucemia = (mongoose.models.glucemia || mongoose.model<IGlucemia>('glucemia', glucemiaSchema, "glucemia"));