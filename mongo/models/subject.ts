// deno-lint-ignore-file no-unused-vars

import mongoose from "mongoose"
import {Subject} from "../types.ts"
import { Teachermodel } from "./teacher.ts";
import { Studentmodel } from "./student.ts";

const Schema = mongoose.Schema

const subjectschema = new Schema({
    name: {type: String, required: true, unique: true},
    year: {type: Number, required: true},
    teacher: {type: Schema.Types.ObjectId,required: true},
    students: [{type: Schema.Types.ObjectId}]
})

subjectschema.path("teacher").validate(async function (teacher: mongoose.Types.ObjectId) {
    try {
        
        if(!mongoose.isValidObjectId(teacher)) {
            throw  {
                code: 1,
                message: "Validacion fallida, en Subject: Teacher id, no valida o no existe"
            }
        }

        const tea = await Teachermodel.findById(teacher)

        if(!tea) {
            throw { 
                code: 1,
                message: "Validacion fallida, en Subject: teacher no encontrado"
            }
        }

        return true

    } catch (error) {
        return error
    }
})
subjectschema.path("name").validate(async function (name: string) {
    try {
        
        const exist =await Subjectmodel.findOne({name: name})
        if(exist) { 
            throw new Error("no valido")
        }
        return true

    } catch (error) {
        return false
    }
})
subjectschema.path("students").validate(async function (student: mongoose.Types.ObjectId[]) {
    try {
        if(student.length === 0)return true
        const is = student.some((e)=>{
            return mongoose.isValidObjectId(e)
        }) 
        
        if(!is) return false

        const stu = await Studentmodel.find({_id: {$in: student}})

        return student.length === stu.length;

    } catch (error) {
        return false
    }
})
subjectschema.path("year").validate( function (year: number) {
    try {
        const now = new Date()
        return year<=now.getFullYear()
        

    } catch (error) {
        return false
    }
})

//despues de save añadimos la asignatura al profesor y a los estudiantes si hay
subjectschema.post(`save`,async (doc,next)=>{ 
    const prof = await Teachermodel.findByIdAndUpdate(doc.teacher,{$push: {subjects: doc.id}})
    const stud = await Studentmodel.findByIdAndUpdate({$in: doc.students},{$push: {subjects: doc.id}})
    next()
})

export type Subjectmodeltype = mongoose.Document & Omit<Subject,"id" | "students" | "teacher"> & {
    teacher: mongoose.Types.ObjectId,
    students: mongoose.Types.ObjectId[]
}
export const Subjectmodel = mongoose.model<Subjectmodeltype>("Subject",subjectschema)