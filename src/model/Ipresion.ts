import mongoose,{ Schema, AggregatePaginateModel } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface IPresion extends Document {
    id                                : Number;
    dateOfCreated   : Date;
    registroPresionAlta  : Number;
    registroPresionBaja  : Number;
    userID                    : Object;
}

const presionSchema: Schema = new Schema({
    id                                : Number,
    dateOfCreated : { 
        type: Date,
        default: Date.now
    },
    registroPresionAlta  : Number,
    registroPresionBaja : Number,
    userID :{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'users'
    }
})

presionSchema.plugin(mongooseAggregatePaginate);

interface Presion<T extends Document> extends AggregatePaginateModel<T> {}

// Note: OverwriteModelError: Cannot overwrite `Certificates` model once compiled. error
export const Presion = (mongoose.models.presion || mongoose.model<IPresion>('presion', presionSchema, "presion"));