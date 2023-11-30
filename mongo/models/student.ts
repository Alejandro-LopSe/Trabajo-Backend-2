// deno-lint-ignore-file no-unused-vars
import mongoose from "mongoose"
import { Student} from "../types.ts"
import { Subjectmodel } from "./subject.ts";

const Schema = mongoose.Schema

const studentschema = new Schema({
    name: {type: String, required: true, unique:true},
    email: {type: String, required: true},
    subjects: [{type: Schema.Types.ObjectId, unique: true}]
})


studentschema.path("name").validate(async (e)=>{

    const n = await Studentmodel.findOne({name: e})
    if(n)return false

    return true
})


studentschema.path("subjects").validate(async (subjects)=>{

    try {
        if(subjects.length === 0)return true
        const is = subjects.some((e: mongoose.Types.ObjectId)=>{
            return mongoose.isValidObjectId(e)
        }) 
        
        if(!is) return false

        const stu = await Subjectmodel.find({_id: {$in: subjects}})

        return subjects.length === stu.length;

    } catch (error) {
        return false
    }
})

studentschema.post(`save`,async (next)=>{
    const fin =  await Subjectmodel.findByIdAndUpdate({$in: next.subjects},{$push: {students: next.id}})
    console.log(fin);
 })
 /*studentschema.pre(`updateOne`,async (next)=>{
    const fin =  await Subjectmodel.findByIdAndUpdate({$in: next.subjects},{$push: {students: next.id}})
    console.log(fin);
 })*/
export type Studentmodeltype = mongoose.Document & Omit<Student,"id" | "subjects"> & {subjects: mongoose.Types.ObjectId[] }
export const Studentmodel = mongoose.model<Studentmodeltype>("Student",studentschema)
