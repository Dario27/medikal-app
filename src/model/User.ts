import mongoose,{ Schema } from 'mongoose';
console.log("schema user.....")
export interface IUser extends Document {
    nombres         : String;
    apellidos       : String;
    email           : String;
    birthDate       : Date;
    dateCreated     : Date;
    password        : String;
    phone           : String;
    bloodType       : String;
    edad            : String;
    genre           : String;
  }

  const userSchema: Schema = new Schema({
    nombres         : String,
    apellidos       : String,
    email           : String,
    birthDate       : Date,
    password        : String,   
    dateCreated     : {
      type: Date,
      default: Date.now
    },
    phone           : String,
    bloodType       : String,
    edad            : String,
    genre           : String
  });
  
  // Note: OverwriteModelError: Cannot overwrite `User` model once compiled. error
  export const User = (mongoose.models.users || mongoose.model<IUser>('users', userSchema, "users"));