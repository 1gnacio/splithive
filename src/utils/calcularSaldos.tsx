import { getGrupos } from '../utils/utilities'

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

            if (deudor in saldos[gastos[id].payer]) {
                var deuda_payer = saldos[gastos[id].payer][deudor];
                var deuda_integrante = saldos[deudor][gastos[id].payer];
                if (deuda_payer == deuda_integrante) {
                    saldos[gastos[id].payer][deudor] = 0;
                    saldos[deudor][gastos[id].payer] = 0;
                }
                else if (deuda_payer > deuda_integrante) {
                    var diferencia = deuda_payer - deuda_integrante;
                    saldos[gastos[id].payer][deudor] = diferencia;
                    saldos[deudor][gastos[id].payer] = 0;
                }
                else if (deuda_payer < deuda_integrante) {
                    var diferencia = deuda_integrante - deuda_payer;
                    saldos[deudor][gastos[id].payer] = diferencia;
                    saldos[gastos[id].payer][deudor] = 0;
                }
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
