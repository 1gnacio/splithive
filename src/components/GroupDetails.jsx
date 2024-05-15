import {Tabs, Tab, Card, CardBody, CardHeader, Listbox, ListboxItem, CardFooter, Button, Link} from '@nextui-org/react';
import calcularDeudas from '../utils/logicaNegocio';
import calcularSaldos from '../utils/calcularSaldos';
import MapListbox from './mapListBox';
import React from 'react';
import { useEffect, useState } from 'react';

export default function GroupDetails(props) {
    let [id,setId] = useState(props.id);
    let [grupos, setGrupos] = useState(JSON.parse(window.sessionStorage.getItem("grupos")));
    let [grupo, setGrupo] = useState(grupos[id]);
    let [deudas, setDeudas] = useState(calcularDeudas(grupo.integrantes, grupo.gastos));
    let [saldos, setSaldos] = useState(calcularSaldos(grupo.integrantes, grupo.gastos));
    const [editingGroup, setEditingGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState(grupo.nombre);
    const [editingMember, setEditingMember] = useState(null);
    const [newMemberName, setNewMemberName] = useState(null);

    var currentDate = new Date();

    // Getting the current date components
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // Months are zero-based, so January is 0
    var day = currentDate.getDate();
    var fechaActual =(day < 10 ? "0" + day : day) + "-"+(month < 10 ? "0" + month : month) + "-" + year;
    

    const handleGroupNameEdit = (event) => {
        setNewGroupName(event.target.value);
    };

    const handleMemberNameEdit = (nombre) => (event) => {
        setNewMemberName(event.target.value);
    };

    const startEditingGroup = () => {
        setEditingGroup(true);
    };

    const startEditingMemberName = (nombre) => {
        setEditingMember(nombre);
        setNewMemberName(nombre);
    };

    const stopEditingGroup = () => {
        setEditingGroup(false);
    };
    
    const stopEditingMemberName = () => {
        setEditingMember(null);
        setNewMemberName(null);
    };

    const saveEdit = (type) => (event) => {
        let nuevosGrupos = [...grupos];
    
        if (type === "group") {
            nuevosGrupos[id].nombre = newGroupName;
            stopEditingGroup();
        } else if (type === "member") {
            const integrantesActualizados = grupo.integrantes.map(integrante => {
                if (integrante.nombre === editingMember) {
                    return {
                        ...integrante,
                        nombre: newMemberName
                    };
                }
                return integrante;
            });
    
            nuevosGrupos[id].integrantes = integrantesActualizados;
            stopEditingMemberName();
        }
    
        setGrupos(nuevosGrupos);
        window.sessionStorage.setItem("grupos", JSON.stringify(nuevosGrupos));
        window.location.reload();
    };

    return <div className="p-5">
                <Card className='p-4'>
                    <CardHeader>
                        <h4 className="font-bold text-large">
                            {editingGroup ? (
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={handleGroupNameEdit}
                                    autoFocus
                                />
                            ) : (
                                <>
                                    {grupo.nombre}
                                    <button name="edit" onClick={startEditingGroup}>
                                        <img style={{width: '15px', marginLeft: '15px'}} src="/src//icons/edit.svg" alt="Edit" />
                                    </button>
                                </>
                            )}
                        </h4>
                    </CardHeader>
                    <CardBody>
                        <Tabs aria-label="Options">
                            <Tab key="integrantes" title="Integrantes">
                                {Array.from(deudas,([nombre, deuda])=>
                                (
                                    <Card key={nombre} className='w-50 gap gap-2' style={{marginBottom: "10px"}}>
                                        <CardBody>
                                            <div>
                                                {editingMember === nombre ? (
                                                    <input
                                                        type="text"
                                                        value={newMemberName}
                                                        onChange={handleMemberNameEdit(nombre)}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <>
                                                        <span>{nombre}</span>
                                                        <button onClick={() => startEditingMemberName(nombre)}>
                                                            <img style={{width: '15px', marginLeft: '15px'}} src="/src//icons/edit.svg" alt="Edit" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            <p style={{color: deudas.get(nombre) < 0 ? 'red' : 'green'}}>Saldo: {deudas.get(nombre)}</p>
                                        </CardBody>
                                    </Card>
                                ))}
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
                            <Tab key="saldos" title="Saldos">
                                <MapListbox map_saldos = {saldos}></MapListbox>
                                {/* {Array.from(deudas,([nombre, deuda]) =>
                                (
                                    <Card key={nombre} className='w-50 gap gap-2' style={{marginBottom: "10px"}}>
                                        <CardBody>
                                            <div>
                                                {editingMember === nombre ? (
                                                    <input
                                                        type="text"
                                                        value={newMemberName}
                                                        onChange={handleMemberNameEdit(nombre)}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <>
                                                        <span>{nombre}</span>
                                                        <button onClick={() => startEditingMemberName(nombre)}>
                                                            <img style={{width: '15px', marginLeft: '15px'}} src="/src//icons/edit.svg" alt="Edit" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            <p style={{color: deudas.get(nombre) < 0 ? 'red' : 'green'}}>Saldo: {deudas.get(nombre)}</p>
                                            <Button onClick={e => {setDeudas(new Map(deudas.set(nombre, 0)));}}>Saldar</Button>
                                        </CardBody>
                                    </Card>
                                ))} */}
                            </Tab>
                        </Tabs>
                    </CardBody>
                    <CardFooter>
                        {editingGroup && (
                            <Button onClick={saveEdit("group")} color="primary">
                                Guardar
                            </Button>
                        )}
                        {editingMember && (
                            <Button onClick={saveEdit("member")} color="primary">
                                Guardar
                            </Button>
                        )}
                        <Button href='/home' as={Link} color="primary" showAnchorIcon variant="solid">
                            Volver
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        
}