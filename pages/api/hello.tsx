// pages/api/hello.js
import create from "@/handler/cadastrar_usuario"
export default async function handler(req:any, res:any) {
    if (req.method === 'GET') {
      res.status(200).json({ message: 'Olá, mundo!' })
    } else if (req.method === 'POST') {
      try{
      const {name,idade,peso} = req.body
      const criar = await create(name,idade,peso)
      if (criar){
        res.status(200).json({ message: 'criado com sucesso' })
      }else {
        res.status(400).json({ message: 'erro ao criar' })
    }}catch(err){
        console.error(err)
        res.status(500).json({message:'erro interno do servidor'})
    }
  }
}