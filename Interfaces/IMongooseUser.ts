import { Document } from 'mongoose';

export interface IMongooseUser extends Document {
  name: string;
  email: string;
  gateWay: string;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string | null;
}
