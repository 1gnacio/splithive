import React from 'react';
import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import calcularSaldos, { saldar } from '../utils/calcularSaldos';
import { addScaleCorrector } from 'framer-motion';
import {getUsuarios, getSaldos} from "../utils/utilities"
import '../styles/btn.css'

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
                                        <Card style={{background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39", display: "flex", justifyContent: "center", marginBottom: "10px"}}>
                                            <CardBody style={{color: "black"}}>
                                                {usuarios[deudor].nombre} le debe ${monto} a {usuarios[acreedor].nombre}
                                                <div>
                                                    <Button className="submitBtn" style={{display: "flex", alignContent: "center", width: "auto", marginTop: "5px"}} name="Saldar" onClick={() => {saldar(props.id_grupo, deudor, acreedor), window.location.reload()}}>Saldar</Button>
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
