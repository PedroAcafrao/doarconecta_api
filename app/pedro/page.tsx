"use client"
import React,{useEffect, useState} from "react"
export default function(){
   const [mensagem, setmessage] = useState({})
   const [menssagem, setmesssage] = useState({})
  
      useEffect(()=>{
    const x = async function(){
        const response = await fetch("/api/hello")
        const data = await response.json()
        setmessage(JSON.stringify(data))
        console.log(JSON.stringify(data))
    }
    x()
},[menssagem])
   return(
   <> 
   <h1 className="text-black font-16">meu nome e pedro</h1>
    <p>tenho 20 anos</p>
    <button onClick={()=>setmesssage("oi")} className="bg-gray-900 text-white">teste api</button>
   </>
   )
}