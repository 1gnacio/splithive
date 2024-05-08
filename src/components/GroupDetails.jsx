import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';
import { useEffect, useState } from 'react';

export default function GroupDetails({ id }) {
    const [grupo, setGrupo] = useState(undefined);

    useEffect(() => {
        const grupos = JSON.parse(window.sessionStorage.getItem('grupos'));
        setGrupo(grupos[(Number(id) - 1)])
    }, []);

    return <div className="p-5">
        {grupo &&
<Card className='p-4'>
        <CardHeader>
            <h4 className="font-bold text-large">
                {grupo.nombre}
            </h4>
        </CardHeader>
        <CardBody>
            <Tabs aria-label="Options">
                <Tab key="integrantes" title="Integrantes">
                    {grupo.integrantes.map(x => {
                        const deuda = grupo.gastos.filter(y => y.deudores.includes(x.nombre)).map(y => y.deuda).reduce((acc, y) => acc + y, 0);

                        return <Card key={x.nombre} className='w-50 gap gap-2'>
                        <CardBody>
                            <b>{x.nombre}</b>
                            <p style={{color: deuda > 0 ? 'red' : 'green'}}>Deuda: {deuda}</p>                            
                        </CardBody>
                    </Card>
                    })}
                </Tab>
                <Tab key="gastos" title="Gastos">
                    <Card>
                        <CardBody>
                        {grupo.gastos.length > 0 &&
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
                                <p style={{color: 'red'}}>Deuda: {item.deuda} c/u</p>
                                <p>Deudores: {item.deudores.length > 0 && item.deudores.reduce((acc, x) => acc + ", " + x)}</p>
                            </ListboxItem>
                            )}
                        </Listbox>}
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
    </Card>}
    </div>
        
}