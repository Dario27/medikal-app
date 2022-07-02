import mongoose,{ Schema } from 'mongoose';

export interface ISpecialities extends Document {
    nameSpeciality: String;
    status: String;
    icono: String;
    Description: String;
}

const specialitiesSchema: Schema = new Schema({
    nameSpeciality: String,
    status: String,
    icono: String,
    Description: String,
});

  // Note: OverwriteModelError: Cannot overwrite `Specialities` model once compiled. error
  export const Specialities = (mongoose.models.specialties || mongoose.model<ISpecialities>('specialties', specialitiesSchema, "specialties"));