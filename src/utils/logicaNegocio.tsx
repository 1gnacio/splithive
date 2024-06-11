import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';
import { getGastos, getGrupos, getHives } from "../utils/utilities"
import calcularSaldos from './calcularSaldos';

export default function calcularDeudas(saldos, integrantes){
    if (!saldos) return {}
    var deudas = {}

    integrantes.forEach(id => {deudas[id] = 0})

    for (const integrante in saldos) {
        for (const acreedor in saldos[integrante]) {
            deudas[integrante] -= saldos[integrante][acreedor]
            deudas[acreedor] += saldos[integrante][acreedor]
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
        if (grupo.tipo !="gastos"){
            return;
        }
        grupo.gastos.forEach(idGasto =>{
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

export function relacionarUsuarioInvitado(usuario, grupo, invitado) {
    if (grupo) {
        const nuevoGrupos = getGrupos();
        const gastos = getGastos();
        const hives = getHives();
        nuevoGrupos[grupo].integrantes.push(usuario);
        hives[usuario].push(grupo)

        if (invitado) {
            const gastosGrupo = nuevoGrupos[grupo].gastos;

            if (nuevoGrupos[grupo].invitados) {
                nuevoGrupos[grupo].invitados = nuevoGrupos[grupo].invitados.filter(x => x != invitado)
            }

            gastosGrupo.forEach(e => {
                if (gastos[e].invitados && gastos[e].invitados[invitado]) {
                    const deuda = gastos[e].invitados[invitado]
                    gastos[e].reparto[usuario] = deuda
                    gastos[e].deudores.push(usuario)
                    delete gastos[e].invitados[`${invitado}`]
                }
            });

            calcularSaldos(grupo, gastosGrupo, gastos, true)
        }

        sessionStorage.setItem("grupos", JSON.stringify(nuevoGrupos))
        sessionStorage.setItem("hives", JSON.stringify(hives))
        sessionStorage.setItem("gastos", JSON.stringify(gastos))
    }
}

        