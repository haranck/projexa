import mongoose, {Document} from 'mongoose'
import { IssueStatus,IssueType } from '../../../../../domain/enums/IssueEnums'
import { IAttachement } from '../../../../../domain/entities/Issue/IIssueEntity';

export interface IssueDocument extends Document {
    workspaceId:string;
    projectId:string;
    parentIssueId?:string|null;
    sprintId?:string|null;
    key:string;
    title:string;
    description?:string|null;
    issueType:IssueType;
    status:IssueStatus;
    attachements?:IAttachement[]|null;
    assigneeId?:string|null;
    startDate?:Date|null;
    endDate?:Date|null;
    createdBy:string;
    createdAt:Date;
    updatedAt:Date;
}

const attachementSchema = new mongoose.Schema<IAttachement>({
    type: { type: String, enum: ['link', 'file'], required: true },
    url: { type: String, required: true },
    fileName: { type: String }
},{_id:false});

const issueSchema = new mongoose.Schema({
    workspaceId:{
        type:String,
        required:true,
        index:true 
    },
    projectId:{
        type:String,
        required:true,
        index:true
    },
    parentIssueId:{
        type:String,
        default:null,
        index:true
    },
    sprintId:{
        type:String,
        default:null,
        index:true
    },
    key:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        default:null,
        trim:true
    },
    issueType:{
        type:String,
        enum:Object.values(IssueType),
        required:true,
        index:true
    },
    status:{
        type:String,
        enum:Object.values(IssueStatus),
        required:true,
        default:IssueStatus.TODO,
        index:true
    },
    attachements:{
        type:[attachementSchema],
        default:[]
    },
    assigneeId:{
        type:String,
        default:null
    },
    startDate:{
        type:Date,
        default:null
    },
    endDate:{
        type:Date,
        default:null
    },
    createdBy:{
        type:String,
        required:true
    },
    
}, { timestamps: true })

issueSchema.index({workspaceId:1,projectId:1}) 
issueSchema.index({workspaceId:1,projectId:1,issueType:1})
issueSchema.index({workspaceId:1,projectId:1,status:1})
issueSchema.index({workspaceId:1,projectId:1,assigneeId:1})

export const IssueModel = mongoose.model<IssueDocument>('Issue',issueSchema)
