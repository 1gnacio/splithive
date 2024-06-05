import React, { useState } from "react";
import login from "../styles/login.module.css"
import { Button, Input } from "@nextui-org/react";
import {getUsuarios} from "../utils/utilities"
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { EyeFilledIcon } from "../styles/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../styles/EyeSlashFilledIcon";

export default function Login(){

    let [username,setUsername] = useState(null)
    let [password,setPassword] = useState(null)
    let [okContra,setOkContra] = useState(false)
    let [okUsername,setOkUsername] = useState(false)

    
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    function handleSubmit(){
        var userCorrect = handleUsername();
        if (!userCorrect){
            return
        }
        var passCorrect = handelPassword();
        console.log(passCorrect)
        if (passCorrect){
            console.log("Contraseña correcta")
            navigate("/home")
        }
        var usuarios = getUsuarios();
        var user;
        for (user in usuarios){
            if (!usuarios.hasOwnProperty(user)){
                continue
            }
            if (usuarios[user].usuario == username){
                sessionStorage.setItem("userID",JSON.stringify(user))
                navigate("/home")
            }
        }
    }

    function onChangeUser(e){
        setOkUsername(false)
        setUsername(e.target.value)
    }

    function onChangePass(e){
        setOkContra(false)
        setPassword(e.target.value)
    }

    function handleUsername(){
        let usuarios = getUsuarios();
        var user;
        for (user in usuarios){
            if (!usuarios.hasOwnProperty(user)){
                continue;
            }
            if (usuarios[user].usuario == username){
                return true
            }
        }
        setOkUsername(true)
        return false
    }

    function handelPassword(){
        let usuarios = getUsuarios();
        var user;
        for (user in usuarios){
            if (!usuarios.hasOwnProperty(user)){
                continue;
            }
            if (usuarios[user].usuario == username){
                if (usuarios[user].pass == password){
                    return true
                }
                return false
            }
        }
        setOkContra(true)
        return false
    }


    return(
    <div className={login.main_body}>
        <div className={login.username_bar}>
            <div className={login.username_info}>Username</div>
            <Input className={login.bar} isInvalid={okUsername}
                errorMessage="Usuario No existe" onChange={(e => {onChangeUser(e)})} type="username"></Input>
        </div>
        <div className={login.password_bar}>
            <div className={login.password_info}>Password</div>
            <Input className={login.bar} isInvalid={okContra}
                errorMessage="Contraseña incorrecta" type={isVisible ? "text" : "password"} onChange={(e =>{onChangePass(e)})}
                endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                    }>

            </Input>
        </div>
        <Button onClick={e => {handleSubmit()}}>Login</Button>
    </div> 
    );
}