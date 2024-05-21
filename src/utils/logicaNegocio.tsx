import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';
import { getContactos, getUsuarios, getGrupos, getGastos, getHives, getCurrentUser } from "../utils/utilities"

export default function calcularDeudas(integrantes,gastos){
    var listaGastos = getGastos();
    var map = new Map();
    integrantes.forEach(element => {
        map.set(element,0)
    });
    gastos.forEach(idGasto =>{
        var gasto = listaGastos[idGasto]
        console.log(gasto)
        gasto.deudores.forEach(deudor =>{
            if (deudor ==gasto.payer){
                map.set(deudor,map.get(deudor) + gasto.monto - gasto.reparto[deudor])
            }
            else{
                map.set(deudor, map.get(deudor) - gasto.reparto[deudor])
            }
                
        })
    })

    return map
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

        