import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';

export default function calcularDeudas(integrantes,gastos){

    var map = new Map();
    integrantes.forEach(element => {
        map.set(element.nombre,0)
    });
    gastos.forEach(gasto =>{
        gasto.deudores.forEach(deudor =>{
            if (deudor ==gasto.payer){
                map.set(deudor,map.get(deudor) + gasto.montoTotal - gasto.deuda)
            }
            else{
                map.set(deudor, map.get(deudor) - gasto.deuda)
            }
                
        })
    })

    return map
}

export function calcularDeudasAtravesDeGrupos(grupos,current_deudor){
    var deuda_acumulada = 0;
    var mapa_nombres_userid = new Map();
    grupos.forEach(grupo =>{
        grupo.integrantes.forEach(integrante =>{
            mapa_nombres_userid.set(integrante.nombre,integrante.userID)
        })
    })
    grupos.forEach(grupo =>{
        grupo.gastos.forEach(gasto =>{

            if (current_deudor== mapa_nombres_userid.get(gasto.payer)){
                
                deuda_acumulada -= gasto.deuda
            }
            else if (mapa_nombres_userid.get(gasto.payer) == 6){
                gasto.deudores.forEach(deudor =>{

                    if (!(mapa_nombres_userid.get(deudor) == 6)){
                        if (mapa_nombres_userid.get(deudor) == current_deudor){
                            deuda_acumulada += gasto.deuda
                        }
                    }
    
                })
            }
        })
    })
    console.log("Deuda acumulada es "+ deuda_acumulada)
    return deuda_acumulada;
}

        