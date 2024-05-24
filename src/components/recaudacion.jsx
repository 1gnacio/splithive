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
            <Card className='p-4'>
                <CardHeader>
                    <h4 className="font-bold text-large">
                        {grupo.nombre}
                    </h4>
                </CardHeader>
                <CardBody>
                    <Tabs aria-label="Options">
                        <Tab key="info" title="Info">
                            <Card>
                                <CardBody>
                                    <Progress size="lg" color="success" label={labelProgreso} value={porcentajeProgreso}/>
                                    {suma >= grupo.objetivo ? (
                                        <p>Cumplimos con el objetivo!! Muchas gracias a aquellos que colaboraron!!</p>
                                    ) : (
                                        <p>Vamos {suma} pesos! Faltan {grupo.objetivo - suma} para cumplir nuestro objetivo!</p>
                                    )}
                                    <div>
                                        <Button>Donar!</Button>
                                    </div>
                                </CardBody>
                            </Card>  
                        </Tab>
                        <Tab key="donaciones" title="Donaciones">
                            {grupo.donaciones.map((id, index) =>
                                <Card key={id}>
                                    <CardBody>
                                        <p>Donante: {usuarios[donaciones[id].donante].nombre}</p>
                                        <p>Monto: {donaciones[id].monto}</p>
                                        <p>Fecha: {donaciones[id].fecha}</p>
                                        <p>Mensaje: {(donaciones[id].mensaje != '') ? donaciones[id].mensaje : "No se adjuntó mensaje."}</p>
                                    </CardBody>
                                </Card>
                            )}
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
    );
}
