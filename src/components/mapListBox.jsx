import React from 'react';
import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import calcularSaldos, { saldar } from '../utils/calcularSaldos';
import { addScaleCorrector } from 'framer-motion';
import {getUsuarios} from "../utils/utilities"

export function MapListbox(props) {

    let [usuarios, setUsuarios] = useState(getUsuarios());
    let [metaSaldos, setMetaSaldos] = useState(JSON.parse(sessionStorage.getItem("saldos")))

    return (
        <div>
            {Object.entries(metaSaldos[props.id_grupo]).map(([deudor, deudas]) => {
                return (
                    <div key={deudor}>
                        {Object.entries(deudas).map(([acreedor, monto]) => {
                            if (monto != 0) {
                                return (
                                    <ul>
                                        <li key={deudor}> 
                                            {usuarios[deudor].nombre} le debe {monto} a {usuarios[acreedor].nombre}
                                            <div>
                                                <Button name="Saldar" onClick={() => {saldar(props.id_grupo, deudor, acreedor), window.location.reload()}}>Saldar</Button>
                                            </div>
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
