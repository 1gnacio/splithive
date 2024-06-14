import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { useState } from 'react';
import { saldar } from '../utils/calcularSaldos';
import { getUsuarios, getSaldos, getApodos, getCurrentUser } from "../utils/utilities"
import '../styles/btn.css'

export function MapListbox(props) {

    let [usuarios, setUsuarios] = useState(getUsuarios())
    let [metaSaldos, setMetaSaldos] = useState(getSaldos())
    
    const apodos = getApodos()[getCurrentUser()];

    function getApodo(usuario) {
        if (!apodos || !apodos.hasOwnProperty(usuario) || apodos[usuario] == "") {
            return usuarios[usuario].nombre
        }
        return apodos[usuario]
    }

    return (
        <div>
            {Object.entries(metaSaldos[props.id_grupo]).map(([deudor, deudas]) => {
                return (
                    <div key={deudor}>
                        {Object.entries(deudas).map(([acreedor, monto]) => {
                            if (monto != 0 && acreedor != deudor) {
                                return (
                                    <ul>
                                        <li key={acreedor}>
                                        <Card style={{background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39", display: "flex", justifyContent: "center", marginBottom: "10px"}}>
                                            <CardBody style={{color: "black"}}>
                                            {deudor === getCurrentUser() ? (
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <p style={{ margin: 0 }}>Yo le debo ${monto} a {getApodo(acreedor)}</p>
                                                    <Button color='warning' variant="flat" style={{ marginLeft: "10px" }} name="Saldar" onClick={() => { saldar(props.id_grupo, deudor, acreedor); window.location.reload(); }}>
                                                        Saldar
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p>{acreedor === getCurrentUser() ? (`${getApodo(deudor)} me debe $${monto}`) : (`${getApodo(deudor)} le debe $${monto} a ${getApodo(acreedor)}`)}</p>
                                            )}

                                            </CardBody>
                                        </Card>
                                        </li>
                                    </ul>
                                );
                            }
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default MapListbox;
