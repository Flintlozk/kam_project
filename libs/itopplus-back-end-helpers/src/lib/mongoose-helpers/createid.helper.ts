import mongoose from 'mongoose';
export function createMongooseId(): string {
  return mongoose.Types.ObjectId().toHexString();
}
