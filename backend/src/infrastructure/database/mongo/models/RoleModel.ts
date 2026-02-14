import mongoose,{Document,Types} from "mongoose";

export interface RoleDocument extends Document {
    name: string;
    permissions: string[];
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const roleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    permissions:{
        type:[String],
        required:true
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const RoleModel = mongoose.model<RoleDocument>("Role",roleSchema);