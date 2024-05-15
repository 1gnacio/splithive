import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';

export default function calcularSaldos(integrantes, gastos){

    // Resultado: <Clave>: integrante. <Valor>: lista de gente a quien le debo, y cuanto.

    var saldos = new Map();

    gastos.forEach(gasto =>{
        gasto.deudores.forEach(deudor =>{
            if (!saldos.has(deudor)) {
                saldos.set(deudor, new Map())
            }

            if (deudor != gasto.payer) {
                if (saldos.get(deudor).has(gasto.payer)) {
                    var saldo_anterior = saldos.get(deudor).get(gasto.payer)
                    saldos.set(deudor, saldos.get(gasto.payer).set(gasto.payer, saldo_anterior + gasto.deuda))
                }
                else {
                    saldos.set(deudor, saldos.get(deudor).set(gasto.payer, gasto.deuda))
                }
                saldos.set(deudor,saldos.get(deudor) + gasto.montoTotal - gasto.deuda)
            }
        })
    })

    return saldos
}
