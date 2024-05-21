import React from 'react';
import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import calcularSaldos from '../utils/calcularSaldos';
import { addScaleCorrector } from 'framer-motion';
import {getUsuarios} from "../utils/utilities"

export function MapListbox(props) {

    let [saldos, setSaldos] = useState(props.map_saldos);
    let [usuarios, setUsuarios] = useState(getUsuarios());
    console.log(saldos);

    return (
        /* <div>
            {Array.from(saldos).map(([deudor, deudas]) => {
                return (
                    <div key={deudor}>
                        {Array.from(deudas).map(([acreedor, monto]) => {
                            return (
                                <ul>
                                    <li key={deudor}> 
                                        {usuarios[deudor].nombre} le debe {monto} a {usuarios[acreedor].nombre}
                                        <div>
                                            <button>Saldar</button>
                                        </div>
                                    </li>
                                </ul>
                            );
                        })}
                    </div>
                );
            })}
        </div> */
        <div>
            {Object.entries(saldos).map(([deudor, deudas]) => {
                return (
                    <div key={deudor}>
                        {Object.entries(deudas).map(([acreedor, monto]) => {
                            return (
                                <ul>
                                    <li key={deudor}> 
                                        {usuarios[deudor].nombre} le debe {monto} a {usuarios[acreedor].nombre}
                                        <div>
                                            <button>Saldar</button>
                                        </div>
                                    </li>
                                </ul>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default MapListbox;
