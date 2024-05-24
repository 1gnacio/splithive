import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import session from "../styles/session.module.css"
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { getCurrentUser, getUsuarios } from "../utils/utilities";

export default function CerrarSesion(){
    let [usuarios,setUsuarios] = useState(getUsuarios());
    let [currentUser, setCurrentUser] = useState(getCurrentUser());

    function cerrar(){
        sessionStorage.removeItem("userID")
        navigate("/")
    };
    return(
        <div className={session.cerrar}>
            <div>Estoy como: {usuarios[currentUser].nombre}</div>
            <Button className={session.button} onClick={(e => cerrar())}>
                <div className={session.text}>Cerrar Sesion</div>
            </Button>
        </div>
    )
}