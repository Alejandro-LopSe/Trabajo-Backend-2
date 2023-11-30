
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