import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';

export default function calcularSaldos(id_gastos, gastos){

    // Resultado: <Clave>: integrante. <Valor>: lista de gente a quien le debo, y cuanto.

    var saldos = new Map;

    id_gastos.forEach(id =>{
        gastos[id].deudores.forEach(deudor =>{
            
            if (!(saldos.has(deudor))) {
                saldos.set(deudor, new Map)
            }

            if (saldos.get(deudor).has(gastos[id].payer)) {
                var saldo_anterior = saldos.get(deudor).get(gastos[id].payer)
                saldos.set(deudor, saldos.get(deudor).set(gastos[id].payer, saldo_anterior + gastos[id].reparto[deudor]))
            }
            else {
                saldos.set(deudor, saldos.get(deudor).set(gastos[id].payer, gastos[id].reparto[deudor]))
            }
        })
    })

    return saldos
}
