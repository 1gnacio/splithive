import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import session from "../styles/session.module.css"
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { getCurrentUser, getUsuarios } from "../utils/utilities";

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User} from "@nextui-org/react";

export default function CerrarSesion(){
    let [usuarios,setUsuarios] = useState(getUsuarios());
    let [currentUser, setCurrentUser] = useState(getCurrentUser());

    function cerrar(){
        sessionStorage.removeItem("userID")
        navigate("/")
    };
    return(

        <div className="flex items-center gap-4" style={{display: "flex", justifyContent: "flex-end", marginTop: "20px", marginBottom: "20px"}}>
            <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Avatar
                isBordered
                as="button"
                className="transition-transform"
                src="../../../public/images/usuario.png"
                />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">{usuarios[currentUser].nombre}</p>
                <p className="font-semibold">{usuarios[currentUser].mail}</p>
                </DropdownItem>

                <DropdownItem key="logout" color="warning" onClick={(e => cerrar())}>
                Log Out
                </DropdownItem>
            </DropdownMenu>
            </Dropdown>
      </div>




        // <div className={session.cerrar}>
        //     <div>Estoy como: {usuarios[currentUser].nombre}</div>
        //     <Button className={session.button} onClick={(e => cerrar())}>
        //         <div className={session.text}>Cerrar Sesion</div>
        //     </Button>
        // </div>
    )
}
