// deno-lint-ignore-file

import { Studentmodel, Studentmodeltype } from "../mongo/models/student.ts";
import { Subjectmodel, Subjectmodeltype } from "../mongo/models/subject.ts";
import { Teachermodel, Teachermodeltype } from "../mongo/models/teacher.ts";
import { Subject, Teacher,Student, Errormongo} from "../mongo/types.ts";


//Gestion de errores
export const geterror = (error: any): Errormongo[]=>{

    const EM: Errormongo = error as Errormongo
    if(EM.code){
        if(EM.code===11000){
            return [{
                code: EM.code,
                errorOrigin: "MongoDB",
                Error: `ya existe este atibuto ${JSON.stringify(EM.keyValue)}`
            }]
        }
    }else if(EM.errors){
        const errores = Object.keys(EM.errors).map((elem)=>{

            return {
                code: 1,
                errorOrigin: "Mongoose Error",
                Error: EM._message,
                path: EM.errors?.[elem].properties?.path,
                Cause: EM.errors?.[elem]._message,
                value: EM.errors?.[elem].properties?.value,
                type: EM.errors?.[elem].kind
            }
        })

        return errores
    }else if(error.name ==="CastError"){
        if( error.kind ==="ObjectId" ){
            console.log(error);
            
            const errores = [{
                code: 2,
                errorOrigin: "Mongo Error id",
                Error: "La id esta mal introducida, ha de tener 24 caracteres",
                path: error.path,
                Cause: "Invalid _id",
                value: error.value._id,
                type: error.name
            }]
            return errores
        }
        return [error]
        
    }else if(error.message.includes("Cannot destructure property '_id'")){
        const errores = [{
            code: 3,
            errorOrigin: "Request",
            Error: "La id no se encuentra en la base de datos",
            path: error.path,
            Cause: "Invalid property",
            value: error.value,
            type: "Not Found"
        }]
        return errores
        
    }
    console.log(error.message);
    
    return [{code: 0},EM]
}

export const getsubject = async ( elem: Subjectmodeltype): Promise<Subject> => {


    const {_id,name,year,teacher,students} = elem

    const tea = await Teachermodel.findById(teacher)

    const est = await Studentmodel.find({_id: {$in: students}})

    return {
        id: _id.toString(),
        name: name,
        year: year,
        teacher: {
            id: tea!._id,
            name: tea!.name,
            email: tea!.email
        },
        students: est.map((elem)=>({
            id: elem._id,
            name: elem.name,
            email: elem.email
        }))

    }
    
}
export const getstudent = async ( elem: Studentmodeltype): Promise<Student> => {


    const {_id} = elem

    const est = await Studentmodel.findById(_id)
    const subs: Subject[] = await Subjectmodel.find({_id: {$in: est!.subjects}})
    const sub = await  Promise.all(subs.map(async (elem)=>{
        const teacher = await Teachermodel.findById(elem.teacher)
        return {
            id: elem.id,
            name: elem.name,
            year: elem.year,
            teacher: {
                id: teacher!.id,
                name: teacher!.name,
                email: teacher!.email
            }
        }
    }))

    return {
        id: _id.toString(),
        name: est!.name,
        email: est!.email,
        subjects: sub
    }
}
export const getteacher = async ( elem: Teachermodeltype): Promise<Teacher> => {


    const {_id,name,email,subjects} = elem

    
    //array de asignaturas
    const sub: Subject[]= await Subjectmodel.find({_id: {$in: subjects}})

    //array de estudiantes en cada asignatura
    const subjectsarr: Subject[]= await Promise.all(sub.map(async (sub): Promise<Subject>=>{

        const students: Student[]= await Studentmodel.find({_id: {$in: sub.students}})
        
        return {
            id: sub.id,
            name: sub.name,
            year: sub.year,
            teacher: sub.teacher,
            students: students.map((elem)=>({
                id: elem.id,
                name: elem.name,
                email: elem.email
            }))
    
        }
    })) 

    return {
        id: _id.toString(),
        name: name,
        email: email,
        subjects: subjectsarr
    }
    
}

export const updatestudent = async ( elem: Studentmodeltype, _id: string): Promise<Student> => {


    const estudiante = await Studentmodel.findByIdAndUpdate({_id: _id},{name: elem.name, email: elem.email, $push: { subjects: elem.subjects}})
    const final = await getstudent(estudiante!)
    return  final

}