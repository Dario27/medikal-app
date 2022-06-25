import mongoose,{ Schema } from 'mongoose';
//console.log("schema user.....")
export interface IUser extends Document {
    fName                       : String;
    lName                       : String;
    email                         : String;
    birthDate               : Date;
    dateCreated        : Date;
    password              : String;
    phone                       : String;
    bloodType             : String;
    age                             : String;
    gender                     : String;
    codeValidador   : Number;
    identification  : String;
  }

  const userSchema: Schema = new Schema({
    fName           : String,
    lName           : String,
    email           : String,
    birthDate       : Date,
    password        : String,   
    dateCreated     : {
      type: Date,
      default: Date.now
    },
    phone           : String,
    bloodType       : String,
    age             : String,
    gender          : String,
    codeValidador   : {
      type: Number,
      default: '0o0'
    },
    identification   : String
  });
  
  // Note: OverwriteModelError: Cannot overwrite `User` model once compiled. error
  export const User = (mongoose.models.users || mongoose.model<IUser>('users', userSchema, "users"));