import React from 'react';
import { useState } from 'react';
import { getGrupos } from "../utils/utilities"
import {Tabs, Tab, Card, CardBody, CardHeader, CardFooter, Button, Link, Input} from '@nextui-org/react';

export default function RecaudacionDisplay(props) {
    let [id,setId] = useState(props.id);
    let [grupos, setGrupos] = useState(getGrupos());
    let [grupo, setGrupo] = useState(grupos[id]);
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
                                    Lleguemos a los {grupo.objetivo} pesos!
                                </CardBody>
                            </Card>  
                        </Tab>
                        <Tab key="donaciones" title="Donaciones">
                            {/* {Object.entries(grupo)} */}
                            <Card>
                                <CardBody>
                                    Lista de donaciones!
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
    );
}
