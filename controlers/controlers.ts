
import { Studentmodel, Studentmodeltype } from "../mongo/models/student.ts";
import { Subjectmodel, Subjectmodeltype } from "../mongo/models/subject.ts";
import { Teachermodel, Teachermodeltype } from "../mongo/models/teacher.ts";
import { Subject, Teacher,Student } from "../mongo/types.ts";



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


    const {_id,name,email,subjects} = elem

    const subs: Subject[] = await Subjectmodel.find({_id: {$in: subjects}})
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
        name: name,
        email: email,
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

export const updatestudent = async ( elem: Studentmodeltype, id: string): Promise<Student> => {


    const {name,email} = elem
    const estudiante = await Studentmodel.findByIdAndUpdate({_id: id},{name: name, email: email})
    const final = await getstudent(estudiante!)
    return  final

}