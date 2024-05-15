import {Tabs, Tab, Card, CardBody, CardHeader, CardFooter, Button, Link, Input} from '@nextui-org/react';
import calcularDeudas from '../utils/logicaNegocio';
import React from 'react';
import { useEffect, useState } from 'react';

export default function GroupDetails(props) {
    let [id,setId] = useState(props.id);
    let [grupos, setGrupos] = useState(JSON.parse(window.sessionStorage.getItem("grupos")));
    let [grupo, setGrupo] = useState(grupos[id]);
    let [deudas, setDeudas] = useState(calcularDeudas(grupo.integrantes, grupo.gastos))
    let [editMode, setEditMode] = useState(grupo.gastos.map(x => false));
    let [newName, setNewName] = useState("");
    let [nuevaDeuda, setNuevaDeuda] = useState("");
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
                                        {/* <CardBody>
                                            <div>
                                                <span>{nombre}</span>
                                                <button name="edit" onClick={startEditingGroup}>
                                                    <img style={{width: '15px', marginLeft: '15px'}} src="/src//icons/edit.svg" alt="Edit" />
                                                </button>
                                            </div>
                                            <p style={{color: deuda < 0 ? 'red' : 'green'}}>Saldo: {deuda}</p>
                                        </CardBody> */}
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
                                {grupo.gastos.map((item, index) => 
                                    <Card className='p-4'>
                                        <CardBody>
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                {editMode[index] ? <Input value={newName} onValueChange={setNewName} className='max-w-[220px]' label="Nombre"></Input> : <b>{item.nombre}</b>}
                                                <Button color='primary' onClick={() => {
                                                    if(editMode[index]) {
                                                        const gruposSerializados = JSON.stringify(grupos);
                                                        const itemSerializado = JSON.stringify(item);
                                                        const copiaItem = { ...item };
                                                        copiaItem.nombre = newName;
                                                        copiaItem.deuda = nuevaDeuda;
                                                        const nuevoItemSerializado = JSON.stringify(copiaItem);
                                                        const nuevosGruposSerializados = gruposSerializados.replace(itemSerializado, nuevoItemSerializado);
                                                        window.sessionStorage.setItem('grupos', nuevosGruposSerializados);
                                                        setGrupos(JSON.parse(nuevosGruposSerializados));
                                                        setGrupo(JSON.parse(nuevosGruposSerializados)[id]);
                                                    }
                                                    setNewName(item.nombre);
                                                    setNuevaDeuda(item.deuda);
                                                    setEditMode(editMode.map((x, i) => i != index ? x : !x));
                                                }}>{editMode[index] ? "Guardar" : "Editar"}</Button>
                                            </div>
                                            <p>Quien pagó: {item.payer}</p>
                                            <p>Monto Total: {item.montoTotal}</p>
                                            <p>Fecha: {item.fecha}</p>
                                            {editMode[index] ? <Input endContent={<p style={{fontSize: '14px'}}>c/u</p>} className='max-w-[220px]' label="Deuda" value={nuevaDeuda} onValueChange={setNuevaDeuda}></Input> : <p style={{color: 'red'}}>Deuda: {item.deuda} c/u</p>}
                                            <p>Deudores: {item.deudores.length > 0 && item.deudores.reduce((acc, x) => acc + ", " + x)}</p>
                                        </CardBody>
                                    </Card>
                                    )}
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