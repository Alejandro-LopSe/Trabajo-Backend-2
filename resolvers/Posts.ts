// deno-lint-ignore-file
// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { Error, Errormongo, Student,Subject,Teacher } from "../mongo/types.ts";
import { Studentmodel, Studentmodeltype } from "../mongo/models/student.ts";
import { Teachermodeltype , Teachermodel} from "../mongo/models/teacher.ts";
import { Subjectmodel, Subjectmodeltype } from "../mongo/models/subject.ts";
import { geterror, getstudent, getsubject, getteacher } from "../controlers/controlers.ts";


export const base =  (_req: Request, res: Response)=>{
    res.status(200).send("Operativo")
}
export const post_student = async (req: Request<{},{},Studentmodeltype>, res: Response<Student | Errormongo[]>)=>{

    try{

        const {name,email,subjects} = req.body
        const student = new Studentmodel({
            name,
            email,
            subjects
        })
        await student.save()
        const final = await getstudent(student)
        res.status(200).send(final)

    }catch(error){
        const me: Errormongo[] = geterror(error)

        res.status(400).send(me)
    }
}
export const post_teacher= async (req: Request<{},{},Teachermodeltype>, res: Response<Teacher | Errormongo[]>)=>{

    try{

        const {name,email,subjects} = req.body
        const teacher = new Teachermodel({
            name,
            email,
            subjects
        })
        await teacher.save()
        const final = await getteacher(teacher)
        res.status(200).send(final)


    }catch(error){
        const me: Errormongo[] = geterror(error)

        res.status(400).send(me)
    }
}
export const post_subject= async (req: Request<{},{},Subjectmodeltype>, res: Response<Subject | Errormongo[]>)=>{

    try{
        const {name, year,teacher,students} = req.body
        const subject = new Subjectmodel({
            name,
            year,
            teacher,
            students
        })

        await subject.save()
        const final = await getsubject(subject)
        res.status(200).send(final)

    }catch(error){
        const me: Errormongo[] = geterror(error)

        res.status(400).send(me)
    }
}

