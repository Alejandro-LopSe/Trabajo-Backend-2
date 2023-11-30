// deno-lint-ignore-file
export type Student = {
    id: string
    name: string
    email: string
    subjects:Array<Omit<Subject, "students">>
}

export type Teacher = {
    id: string
    name: string
    email: string
    subjects: Array<Omit<Subject,"teacher">>
}

export type Subject = {
    id: string
    year: number
    name: string
    teacher: Omit<Teacher,"subjects">
    students: Array<Omit<Teacher,"subjects">>
}

export type Error = {
    causa?: string
    code?: number
    message?: string
    value?: string
    path?: string
}

//Tipo para gestion de errores
export type Errormongo = {
    code?: number
    errorOrigin?: string
    Error?: string
    keyValue?: {}
    errors?: {
        [key: string]: {
            properties?:  {
                message?: string
                type?: string
                path?: string
                value?: string 
            }
            kind?: string
            _message?: string
        }
    } 
    _message?: string

}
