import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';

export default function calcularSaldos(id_grupo, id_gastos, gastos, force = false){

    // Resultado: <Clave>: integrante. <Valor>: lista de gente a quien le debo, y cuanto.

    var metaSaldos = JSON.parse(sessionStorage.getItem("saldos"))
    var saldos = {};
    if (!metaSaldos || force) {
        metaSaldos = {}
    }
    else if (id_grupo in metaSaldos) {
        saldos = metaSaldos[id_grupo]
    }

    let gastosProcesados = JSON.parse(sessionStorage.getItem("gastosProcesados"))
    if (!gastosProcesados || force) gastosProcesados = {}

    id_gastos.forEach(id =>{
        if (!force && id in gastosProcesados) return;
        gastosProcesados[id] = 1

        gastos[id].deudores.forEach(deudor =>{
            if (!(deudor in saldos)) {
                saldos[deudor] = {}
            }

            if (gastos[id].payer in saldos[deudor]) {
                var saldo_anterior = saldos[deudor][gastos[id].payer]
                saldos[deudor][gastos[id].payer] = saldo_anterior + gastos[id].reparto[deudor]
            }
            else {
                saldos[deudor][gastos[id].payer] = gastos[id].reparto[deudor]
            }
        })
    })

    metaSaldos[id_grupo] = saldos

    sessionStorage.setItem("gastosProcesados", JSON.stringify(gastosProcesados))
    sessionStorage.setItem("saldos", JSON.stringify(metaSaldos))

    return saldos
}

export const saldar = (id_grupo, id_deudor, id_acreedor) => {
    var metaSaldos = JSON.parse(sessionStorage.getItem("saldos"))
    if (!metaSaldos) return

    metaSaldos[id_grupo][id_deudor][id_acreedor] = 0
    sessionStorage.setItem("saldos", JSON.stringify(metaSaldos))
}
