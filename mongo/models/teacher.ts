import mongoose from "mongoose"
import { Teacher} from "../types.ts"
import { Subjectmodel } from "./subject.ts";

const Schema = mongoose.Schema

const teacherschema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    subjects: [{type: Schema.Types.ObjectId, required:true}]
})


teacherschema.path("name").validate(async (e)=>{

    const n = await Teachermodel.findOne({name: e})
    if(n)return false

    return true
}, `Ya existe ese profesor`)

teacherschema.path("subjects").validate(async (e)=>{
    const ids = await Subjectmodel.find({_id: {$in: e}})

    return ids.length===e.length
}, "Error en las asignaturas")

export type Teachermodeltype = mongoose.Document & Omit<Teacher,"id" | "subjects"> & {subjects: mongoose.Types.ObjectId[] }
export const Teachermodel = mongoose.model<Teachermodeltype>("Teacher",teacherschema)