import mysql from "mysql2";
import db from "../../db";


export default async function handler(req:any, res:any) {
  try {
    const [rows] = await db.execute('SELECT * FROM tblUsuario');
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao conectar ao banco de dados' });
  }
}