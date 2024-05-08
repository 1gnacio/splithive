import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';
import calcularDeudas from '../utils/logicaNegocio';
import React from 'react';
import { useEffect, useState } from 'react';

export default function GroupDetails(props) {


    let [id,setId] = useState(props.id)
    let [grupos, setGrupos] = useState(null)
    let [grupo, setGroup] = useState(JSON.parse(window.sessionStorage.getItem("grupos"))[id])


    var currentDate = new Date();

    // Getting the current date components
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // Months are zero-based, so January is 0
    var day = currentDate.getDate();
    var fechaActual =(day < 10 ? "0" + day : day) + "-"+(month < 10 ? "0" + month : month) + "-" + year;
    var sgrupo = {
        nombre: 'grupo1',
        integrantes: [{ nombre: 'Camila' }, { nombre: 'Mateo' }, { nombre: 'Ignacio' }, { nombre: 'Juan' }, { nombre: 'Manu' }, { nombre: 'Tomas' }],
        gastos: [{ nombre: "comida", montoTotal:100, fecha:fechaActual,payer: "Camila",deuda: 50, deudores: ["Camila", "Mateo"]}, { nombre: "factura de luz", montoTotal: 400,fecha:fechaActual,payer:"Camila",deuda: 100, deudores: ["Camila","Juan", "Manu", "Ignacio"]}]
    };
    return <div className="p-5">
<Card className='p-4'>
        <CardHeader>
            <h4 className="font-bold text-large">
                {grupo.nombre}
            </h4>
        </CardHeader>
        <CardBody>
            <Tabs aria-label="Options">
                <Tab key="integrantes" title="Integrantes">
                    {Array.from(calcularDeudas(grupo.integrantes,grupo.gastos),([nombre,deuda])=>
                    (
                        <Card key={nombre} className='w-50 gap gap-2'>
                        <CardBody>
                            <b>{nombre}</b>
                            <p style={{color: deuda < 0 ? 'red' : 'green'}}>Saldo: {deuda}</p>                            
                        </CardBody>
                        </Card>
                    ))
                    }
                </Tab>
                <Tab key="gastos" title="Gastos">
                    <Card>
                        <CardBody>
                        <Listbox
                            items={grupo.gastos}
                            aria-label="Gastos"
                            onAction={(key) => alert(key)}
                        >
                            {(item) => (
                            <ListboxItem
                                key={item.nombre}
                                color={"default"}
                                className={""}
                            >
                                <b>{item.nombre}</b>
                                <p>Quien pagó: {item.payer}</p>
                                <p>Monto Total: {item.montoTotal}</p>
                                <p>Fecha: {item.fecha}</p>
                                <p style={{color: 'red'}}>Deuda: {item.deuda} c/u</p>
                                <p>Deudores: {item.deudores.length > 0 && item.deudores.reduce((acc, x) => acc + ", " + x)}</p>
                            </ListboxItem>
                            )}
                        </Listbox>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </CardBody>
        <CardFooter>
            <Button href='/home' as={Link} color="primary" showAnchorIcon variant="solid">
                Volver
            </Button>
        </CardFooter>
    </Card>
    </div>
        
}