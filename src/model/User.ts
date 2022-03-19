import mongoose,{ Schema } from 'mongoose';
console.log("schema user.....")
export interface IUser extends Document {
    nombres         : String;
    apellidos       : String;
    email           : String;
    anioNac         : Number;
    dateCreated     : Date;
    password        : String;
    altura          : String;
    peso            : String;
    sexo            : String;
    phone           : String; 
    edad            : String;
  }

  const userSchema: Schema = new Schema({
    nombres         : String,
    apellidos       : String,
    email           : String,
    anioNac         : Number,
    password        : String,   
    dateCreated     : {
      type: Date,
      default: Date.now
    },
    altura          : String,
    peso            : String,
    sexo            : String,
    phone           : String,
    edad            : String
  });
  
  // Note: OverwriteModelError: Cannot overwrite `User` model once compiled. error
  export const User = (mongoose.models.users || mongoose.model<IUser>('users', userSchema, "users"));