import React from "react";
import index from "../styles/index.module.css";
import {Image} from "@nextui-org/react";
import { navigate } from "astro/virtual-modules/transitions-router.js";


export default function Conexion(){
    return(
        <>
        <div className={index.conexion}>
          <a href="/login">
            <img src="/public/images/logIn.png" alt="Log In" className={index.button}/>
          </a>
          <a href="/registro">
            <img src="/public/images/signIn.png" alt="Sign In" className={index.button}/>
          </a>
          
        </div>
        <div className={index.helpbees} onClick={() => navigate("/publico")}>
          <Image className={index.image}width= {100}src = "/public/images/bee.png"/>
          <div className={index.helpbeesText}>HELP A BEE!</div>
        </div>
        

      </>
    )
}