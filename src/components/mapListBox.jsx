import React from 'react';
import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import calcularSaldos from '../utils/calcularSaldos';


export function MapListbox(props) {

    let [saldos, setSaldos] = useState(props.map_saldos);
    console.log(saldos);
    const mapArray = Array.from(saldos);

    return (
        <div>
            {
                mapArray.map(([nombre, deudas]) => (
                    <div key={nombre}>
                        <div>
                            
                        </div>
                        Nombre: {nombre}, deudas: xd
                    </div>
                ))
            }
        </div>
    )
}

export default MapListbox;
