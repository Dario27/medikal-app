import mongoose,{ Schema, AggregatePaginateModel } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface IMasa extends Document {
    id            : Number;
    dateOfCreated : Date;
    cantImc                : Number;
    pesoReg                : Number;
    alturaReg             : Number;
    waist                 : Number;
    userID                    : Object;
}

const imcSchema: Schema = new Schema({
    id            : Number,
    dateOfCreated : { 
        type: Date,
        default: Date.now
    },
    cantImc  : Number, 
    pesoReg: Number,
    alturaReg : Number,
    waist       : Number,
    userID :{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'users'
    }
})

imcSchema.plugin(mongooseAggregatePaginate);

interface Imc<T extends Document> extends AggregatePaginateModel<T> {}

// Note: OverwriteModelError: Cannot overwrite `Certificates` model once compiled. error
export const Imc = (mongoose.models.imcrecords || mongoose.model<IMasa>('imcrecords', imcSchema, "imcrecords"));
