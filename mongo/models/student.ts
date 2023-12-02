// deno-lint-ignore-file no-unused-vars
import mongoose from "mongoose"
import { Student} from "../types.ts"
import { Subjectmodel } from "./subject.ts";

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

studentschema.post(`save`,async function (next){
    const fin =  await Subjectmodel.findByIdAndUpdate({$in: this.subjects},{$push: {students: this.id}})
    console.log(fin);
 })
studentschema.pre(`findOneAndUpdate`,function(next){
    const query =  this.getQuery()
    const updoc =  this.getUpdate()
    console.log(query,"------------------");
    const newupdoc =  this.getUpdate()

    //@ts-expect-error<se que $push existe>
    const final_update = updoc!.$push.subjects.reduce((acc: mongoose.Types.ObjectId[],elem: mongoose.Types.ObjectId)=>{
        if(!(query.estudiante!.subjects.includes(elem))){
            return [...acc,elem]
        }
        return [...acc]
    },[])

    this.setUpdate({
        //@ts-expect-error<se que $push existe>
        name: updoc!.name,
        //@ts-expect-error<se que $push existe>
        email: updoc!.email,
        $push: { subjects: final_update}
    })

    next()
})
export type Studentmodeltype = mongoose.Document & Omit<Student,"id" | "subjects"> & {subjects: mongoose.Types.ObjectId[] }
export const Studentmodel = mongoose.model<Studentmodeltype>("Student",studentschema)
