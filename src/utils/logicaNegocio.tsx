import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';
import { getContactos, getUsuarios, getGrupos, getGastos, getHives, getCurrentUser } from "../utils/utilities"
import { useState } from "react"
import { getSaldos } from "../utils/utilities"

export default function calcularDeudas(id_grupo, integrantes){
    let [metaSaldos, setMetaSaldos] = useState(getSaldos())
    var deudas = {}

    integrantes.forEach(id => {deudas[id] = 0})

    for (const integrante in metaSaldos[id_grupo]) {
        for (const acreedor in metaSaldos[id_grupo][integrante]) {
            deudas[integrante] -= metaSaldos[id_grupo][integrante][acreedor]
            deudas[acreedor] += metaSaldos[id_grupo][integrante][acreedor]
        }
    }

    return deudas
}


export function calcularDeudasAtravesDeGrupos(grupos,current_deudor, currentUser){
    var deuda_acumulada = 0;
    var gruposDeUsuarios = getHives();
    var gastos = getGastos();
    var gruposDeudor =  gruposDeUsuarios[current_deudor]
    var gruposUser = gruposDeUsuarios[currentUser]
    var grupos_enComun = [];
    gruposDeudor.forEach(grupo =>{
        gruposUser.forEach(grupoUser =>{
            if (grupo == grupoUser){
                grupos_enComun.push(grupo)
            }
        })
    })
    var mapa_nombres_userid = new Map();
    console.log("Los grupos en comun son : " + grupos_enComun + "Con el usuario "+ current_deudor)
    grupos_enComun.forEach(idGrupo =>{
        console.log("Se chequea el grupo de id  " + idGrupo)
        var grupo = grupos[idGrupo]
        grupo.gastos.forEach(idGasto =>{
            console.log("Gaston con id " + idGasto)
            var gasto = gastos[idGasto]
            if (gasto.payer == currentUser){
                deuda_acumulada += gasto.reparto[current_deudor]
            }
            else if (gasto.reparto.hasOwnProperty(currentUser) && gasto.payer == current_deudor){

                deuda_acumulada -= gasto.reparto[currentUser]
            }
        })
    })
    console.log("Deuda acumulada es "+ deuda_acumulada)
    return deuda_acumulada;
}

        