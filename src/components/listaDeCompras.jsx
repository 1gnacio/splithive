import React from 'react';
import { useState } from 'react';
import { getGrupos, getDonaciones, getUsuarios, getCurrentUser } from "../utils/utilities"
import {Tabs, Tab, Card, CardBody, CardHeader, CardFooter, Button, Link, Progress} from '@nextui-org/react';

export default function ShopListDisplay(props) {
    let [id,setId] = useState(props.id);
    let [grupos, setGrupos] = useState(getGrupos());
    let [grupo, setGrupo] = useState(grupos[id]);
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
                        <Tab key="articulos" title="Artículos">

                        </Tab>
                        <Tab key="abejas" title="Abejas">

                        </Tab>
                        <Tab key="saldos" title="Saldos">

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
    )
}
