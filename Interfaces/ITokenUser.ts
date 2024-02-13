import { ObjectId, Types } from 'mongoose';

export interface ITokenUser {
    name: string;
    email: string;
    profileImage: string | null | undefined;
    _id: Types.ObjectId;
}
