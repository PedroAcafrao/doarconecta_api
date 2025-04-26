import mysql from "mysql2"
import connect from  "@/lib/database"

export default async function(name: any,idade: any,peso: any){
    const pool = connect.pool
   const student =  await pool.student.create({name,idade,peso})
    return student
}