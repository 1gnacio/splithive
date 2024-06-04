import React from 'react';
import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import calcularSaldos, { saldar } from '../utils/calcularSaldos';
import { addScaleCorrector } from 'framer-motion';
import {getUsuarios, getSaldos} from "../utils/utilities"

export function MapListbox(props) {

    let [usuarios, setUsuarios] = useState(getUsuarios())
    let [metaSaldos, setMetaSaldos] = useState(getSaldos())

    return (
        <div>
            {Object.entries(metaSaldos[props.id_grupo]).map(([deudor, deudas]) => {
                return (
                    <div key={deudor}>
                        {Object.entries(deudas).map(([acreedor, monto]) => {
                            if (monto != 0 && acreedor != deudor) {
                                return (
                                    <ul>
                                        <li key={deudor}>
                                        <Card style={{background: "black", borderWidth: "2px", borderColor: "gold", display: "flex", justifyContent: "center", marginBottom: "10px"}}>
                                            <CardBody style={{color: "gold"}}>
                                                {usuarios[deudor].nombre} le debe {monto} a {usuarios[acreedor].nombre}
                                                <div>
                                                    <Button color="warning" style={{display: "flex", alignContent: "center", width: "auto"}} name="Saldar" onClick={() => {saldar(props.id_grupo, deudor, acreedor), window.location.reload()}}>Saldar</Button>
                                                </div>
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
