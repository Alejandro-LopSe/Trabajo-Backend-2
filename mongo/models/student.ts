// deno-lint-ignore-file no-unused-vars
import mongoose from "mongoose"
import { Student} from "../types.ts"
import { Subjectmodel } from "./subject.ts";
import {checksubjects} from  "../../controlers/controlers.ts"

const Schema = mongoose.Schema

const studentschema = new Schema({
    name: {type: String, required: true, unique:true},
    email: {type: String, required: true},
    subjects: [{type: Schema.Types.ObjectId}]
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

studentschema.post(`save`,async function (doc,next){
    const fin =  await Subjectmodel.findByIdAndUpdate({$in: this.subjects},{$push: {students: this.id}})
    console.log(fin)
    next()
 })
 studentschema.pre(`findOneAndUpdate`,async function(next){
    const query =  this.getQuery()
    const updoc =  this.getUpdate()
    
        //@ts-expect-error>
        const final_update = checksubjects(updoc,query)
        console.log(query);
        const f = await Subjectmodel.findByIdAndUpdate({$in: final_update.$push.subjects}, {$push: {students: query.id}})
        console.log(f);
        console.log(1);
        
        this.setUpdate(final_update)
        
    
    
    next()
})


export type Studentmodeltype = mongoose.Document & Omit<Student,"id" | "subjects"> & {subjects: mongoose.Types.ObjectId[] }
export const Studentmodel = mongoose.model<Studentmodeltype>("Student",studentschema)
