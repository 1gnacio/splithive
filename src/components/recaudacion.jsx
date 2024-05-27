import React from 'react';
import { useState } from 'react';
import { getGrupos, getDonaciones, getUsuarios } from "../utils/utilities"
import {Tabs, Tab, Card, CardBody, CardHeader, CardFooter, Button, Link, Progress} from '@nextui-org/react';

export default function RecaudacionDisplay(props) {
    let [id,setId] = useState(props.id);
    let [grupos, setGrupos] = useState(getGrupos());
    let [grupo, setGrupo] = useState(grupos[id]);
    let [donaciones, setDonaciones] = useState(getDonaciones());
    let [usuarios, setUsuarios] = useState(getUsuarios());

    var suma = 0;
    grupo.donaciones.map((id, index) =>
        suma += donaciones[id].monto
    )
    var porcentajeProgreso = suma * 100 / grupo.objetivo

    var labelProgreso = (suma < grupo.objetivo) ? "Lleguemos a los " + grupo.objetivo + " pesos!" : "Meta Cumplida!"

    return (
        <div className="p-5">
            <Card className='p-4' style={{background: "black"}}>
                <CardHeader>
                    <h4 className="font-bold text-large" style={{color: "gold"}}>
                        {grupo.nombre}
                    </h4>
                </CardHeader>
                <CardBody>
                    <Tabs aria-label="Options" color="warning" radius="full">
                        <Tab key="info" title="Info">
                            <Card style={{background: "black", borderWidth: "2px", borderColor: "gold"}}>
                                <CardBody>
                                    <Progress size="lg" color="warning" style={{color:"gold"}} label={labelProgreso} value={porcentajeProgreso}/>
                                    {suma >= grupo.objetivo ? (
                                        <p style={{color: "gold"}}>Cumplimos con el objetivo!! Muchas gracias a aquellos que colaboraron!!</p>
                                    ) : (
                                        <p style={{color: "gold"}}>Vamos {suma} pesos! Faltan {grupo.objetivo - suma} para cumplir nuestro objetivo!</p>
                                    )}
                                    <div>
                                        <Button color="warning">Donar!</Button>
                                    </div>
                                </CardBody>
                            </Card>  
                        </Tab>
                        <Tab key="donaciones" title="Donaciones">
                            {grupo.donaciones.length === 0 ? (
                                <p style={{color:"gold"}}>No se han recibido donaciones aún.</p>
                            ) : (
                                grupo.donaciones.map((id, index) =>
                                    <Card key={id} style={{background: "black", borderWidth: "2px", borderColor: "gold"}}>
                                        <CardBody>
                                            <p style={{color: "gold"}}>Donante: {usuarios[donaciones[id].donante].nombre}</p>
                                            <p style={{color: "gold"}}>Monto: {donaciones[id].monto}</p>
                                            <p style={{color: "gold"}}>Fecha: {donaciones[id].fecha}</p>
                                            <p style={{color: "gold"}}>Mensaje: {(donaciones[id].mensaje != '') ? donaciones[id].mensaje : "No se adjuntó mensaje."}</p>
                                        </CardBody>
                                    </Card>
                                )
                            )}
                        </Tab>
                    </Tabs>
                </CardBody>
                <CardFooter>
                    <Button href='/home' as={Link} color="warning" showAnchorIcon variant="solid">
                        Volver
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
