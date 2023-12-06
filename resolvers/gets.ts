
// deno-lint-ignore-file
// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import {  Errormongo, Student,Subject,Teacher } from "../mongo/types.ts";
import { Studentmodel, Studentmodeltype } from "../mongo/models/student.ts";
import { Teachermodeltype , Teachermodel} from "../mongo/models/teacher.ts";
import { Subjectmodel, Subjectmodeltype } from "../mongo/models/subject.ts";
import { geterror, getstudent, getsubject, getteacher, updatestudent } from "../controlers/controlers.ts";


export const get_student = async (req: Request<{_id: string},{},{}>, res: Response<Student | Errormongo[]>)=>{

    try{

        const {_id} = req.params
        const student = new Studentmodel({
            _id: _id
        })
        const final = await getstudent(student)
        res.status(200).send(final)

    }catch(error){
        const me: Errormongo[] = geterror(error)

        res.status(400).send(me)
    }
}

export const get_teacher = async (req: Request<{_id: string},{},{}>, res: Response<Teacher | Errormongo[]>)=>{

    try{

        const {_id} = req.params
        const teacher = new Teachermodel({
            _id: _id
        })
        const final = await getteacher(teacher)
        res.status(200).send(final)

    }catch(error){
        const me: Errormongo[] = geterror(error)

        res.status(400).send(me)
    }
}

export const get_subject = async (req: Request<{_id: string},{},{}>, res: Response<Subject | Errormongo[]>)=>{

    try{
        const {_id} = req.params
        const subject = new Subjectmodel({
            _id: _id
        })
        const final = await getsubject(subject)
        res.status(200).send(final)

    }catch(error){
        const me: Errormongo[] = geterror(error)

        res.status(400).send(me)
    }
}