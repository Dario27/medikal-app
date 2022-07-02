import mongoose,{ Schema } from 'mongoose';

export interface IMedico extends Document {
    identification : String;
    name:String;
    lastName:String;
    password:String;
    specialityID:Object;
    age:Number;
    birthDate:Date;
    email:String;
    phone:String;
    gender:String;
    address:String;
    status:String;
}

const medicoSchema: Schema = new Schema({
    identification : String,
    name:String,
    lastName:String,
    password: String,
    specialityID:{
        type:Schema.Types.ObjectId,
        required:true,
        ref: 'specialties'
    },
    age:Number,
    birthDate:Date,
    email:String,
    phone:String,
    gender:String,
    address:String,
    status: {
        type:String,
        default:"A"
    }
})

  // Note: OverwriteModelError: Cannot overwrite `Medicos` model once compiled. error
  export const Medicos = (mongoose.models.medicos || mongoose.model<IMedico>('medicos', medicoSchema, "medicos"));