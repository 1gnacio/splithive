import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';

export default function GroupDetails() {
    const grupo = {
        nombre: 'grupo1',
        integrantes: [{ nombre: 'Camila' }, { nombre: 'Mateo' }, { nombre: 'Ignacio' }, { nombre: 'Juan' }, { nombre: 'Manu' }, { nombre: 'Tomas' }],
        gastos: [{ nombre: "comida", deuda: 50, deudores: ["Camila", "Mateo"]}, { nombre: "factura de luz", deuda: 100, deudores: ["Juan", "Manu", "Ignacio"]}]
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