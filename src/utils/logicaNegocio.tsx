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