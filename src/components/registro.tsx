import React, { useState } from "react";
import registro from "../styles/registro.module.css"
import { Button, Input } from "@nextui-org/react";
import {getUsuarios} from "../utils/utilities"
import { navigate } from "astro/virtual-modules/transitions-router.js";

export default function Registro(){
    
    let [username,setUsername] = useState(null)
    let [okUsername,setOkUsername] = useState(false)
    
    let [password,setPassword] = useState(null)
    let [okContra,setOkContra] = useState(false)
    
    let [emailUser, setEmail] = useState(null)
    let [okEmail, setOkEmail] = useState(false)

    let [nombreUser,setNombre] = useState(null)
    let [okNombre, setOkNombre] = useState(false)


    function handleSubmit(){
        var userCorrect = handleUsername();
        if (!userCorrect){
            return
        }
        var passCorrect = handelPassword();
        if (!passCorrect){
            return
        }
        var emailCorrect = handleEmail()
        if (!emailCorrect){
            return
        }

        var newUser = {nombre:nombreUser, usuario:username, pass:password, mail:emailUser, alias:""}
        var usuarios = getUsuarios()
        var user;
        var maximo = 0;
        for (const key in usuarios){
            if (usuarios.hasOwnProperty(key)){
                if (Number(key) > Number(maximo)){
                    maximo = Number(key);
                }
            }
        }
        usuarios[maximo+1] = newUser
        sessionStorage.setItem("usuarios",JSON.stringify(usuarios))
        sessionStorage.setItem("userID",JSON.stringify(maximo+1))
        navigate("/home")
        
    }

    function onChangeUser(e){
        setOkUsername(false)
        setUsername(e.target.value)
    }

    function onChangePass(e){
        setOkContra(false)
        setPassword(e.target.value)
    }

    function onChaneEmail(e){
        setOkEmail(false)
        setEmail(e.target.value)
    }

    function onChangeNombre(e){
        setOkNombre(false)
        setNombre(e.target.value)
    }

    function handleUsername(){
        let usuarios = getUsuarios();
        var user;
        for (user in usuarios){
            if (!usuarios.hasOwnProperty(user)){
                continue;
            }
            if (usuarios[user].usuario == username){
                setOkUsername(true)
                return false
            }
        }
        
        return true
    }

    function handelPassword(){
        let usuarios = getUsuarios();
        var user;
        if (password == ""){
            setOkContra(true)
            return false    
        }
        
        return true
    }

    function handleEmail(){
        let usuarios = getUsuarios();
        var user;
        for (user in usuarios){
            if (!usuarios.hasOwnProperty(user)){
                continue
            }
            if (usuarios[user].email == emailUser){
                setOkEmail(true)
                return false
            }
        }
        return true
    }


    return(
    <div className={registro.main_body}>
        <div className={registro.username_bar}>
            <div className= {registro.username_info}>Nombre</div>
            <Input className={registro.name_bar} isInvalid={okNombre}
                errorMessage="Email ya esta en uso" onChange={(e => {onChangeNombre(e)})} type ="username">
            </Input>    
        </div>
        <div className={registro.username_bar}>
            <div className={registro.username_info}>Username</div>
            <Input className={registro.bar} isInvalid={okUsername}
                errorMessage="Usuario Ya existe" onChange={(e => {onChangeUser(e)})} type="username"></Input>
        </div>
        <div className={registro.password_bar}>
            <div className={registro.password_info}>Password</div>
            <Input className={registro.bar} isInvalid={okContra}
                errorMessage="Contraseña invalida" type={"password"} onChange={(e =>{onChangePass(e)})}></Input>
        </div>
        <div className={registro.username_bar}>
            <div className= {registro.username_info}>Email</div>
            <Input className={registro.bar_email} isInvalid={okEmail}
                errorMessage="Email ya esta en uso" onChange={(e => {onChaneEmail(e)})} type ="username">
            </Input>    
        </div>
        <Button onClick={e => {handleSubmit()}}>Registrarse</Button>
    </div> 
    );
}