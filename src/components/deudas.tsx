import React, { useEffect, useState } from "react"

const Deudas = (props:any)=>{
    console.log(props.numero_grupo)
    const [atributos, setAtributos] = useState(0);

    const add = () =>{
        setAtributos((i) => i + 1);
        console.log("Se apreto el boton para add")
    } 
    return (
    <div>
        <div>El Numero que tengo es: {atributos}</div>
        <button onClick={e =>add}> Soy un boton</button>
    </div>)
}


export default Deudas