import {Tabs, Tab, Card, CardBody, CardHeader, CardFooter, Button, Link, Input} from '@nextui-org/react';
import calcularDeudas from '../utils/logicaNegocio';
import calcularSaldos from '../utils/calcularSaldos';
import MapListbox from './mapListBox';
import React from 'react';
import { useState } from 'react';
import { getUsuarios, getGrupos, getGastos, getSaldos, getCurrentUser } from "../utils/utilities"


export default function GroupDetails(props) {
    let [id,setId] = useState(props.id);
    let [grupos, setGrupos] = useState(getGrupos());
    let [usuarios, setUsuarios] = useState(getUsuarios())
    let [grupo, setGrupo] = useState(grupos[id]);
    let [editMode, setEditMode] = useState(grupo.gastos.map(x => false));
    let [newName, setNewName] = useState("");
    let [nuevaDeuda, setNuevaDeuda] = useState("");
    let [gastos,setGastos] = useState(getGastos());
    const [editingGroup, setEditingGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState(grupo.nombre);
    const [editingMember, setEditingMember] = useState(null);
    const [newMemberName, setNewMemberName] = useState(null);

    const [nombreGasto, setNombreGasto] = useState('');

    const handleNombre = (e) => setNombreGasto(e.target.value);

    const [montoGasto, setMontoGasto] = useState(0);

    const handleMonto = (e) => setMontoGasto(e.target.value);

    const [formGasto, setfFormGasto] = useState(false);

    const switchFormGasto = () => setfFormGasto(!formGasto);

    calcularSaldos(id, grupo.gastos, gastos)
    let [metaSaldos, setMetaSaldos] = useState(getSaldos())
    let [deudas, setDeudas] = useState(calcularDeudas(metaSaldos[id], grupo.integrantes))
    
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

    function imprimirNombres(gastos, usuarios,id){
        var index = 0;
        var names = ""
        var deudor;
        console.log(gastos[id])
        for (deudor in gastos[id].deudores){
            if (index == 0){
                names += " " + usuarios[gastos[id].deudores[deudor]].nombre
                index++;
            }
            else{
                names += ", " + usuarios[gastos[id].deudores[deudor]].nombre
            }
        }
        return names;
    }

    const crearGasto = (e) => {
        e.preventDefault();
        console.log({nombre: nombreGasto, monto: montoGasto});
    }

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
                                <Button color="warning" onClick={() => switchFormGasto()}>Nuevo gasto</Button>
                                {formGasto && (
                                    <Card className="crearGasto">
                                        <CardHeader>Ingrese los datos!</CardHeader>
                                        <CardBody>
                                            <form>
                                                <label>Nombre del gasto:</label><br/>
                                                <input type="text" value={nombreGasto} onChange={handleNombre}/><br/>
                                                <label>Monto:</label><br/>
                                                <input type="number" value={montoGasto} onChange={handleMonto}/><br/>
                                                <label htmlFor="dropdown">Quién pagó:</label><br/>
                                                <select id="quienPago">
                                                {grupo.integrantes.map((id, index) => {
                                                    return <option value={id}>{usuarios[id].nombre}</option>
                                                })}
                                                </select>
                                                {grupo.integrantes.map((id, index) => {
                                                    return (
                                                        <ul>
                                                            <li key={id}>
                                                                <label content={usuarios[id].nombre}>
                                                                    <input type="checkbox" id="deudor"></input>
                                                                    {usuarios[id].nombre}
                                                                </label>
                                                            </li>
                                                        </ul>
                                                    )
                                                })}
                                                <Button onClick={() => crearGasto} color="warning" type="submit">Crear Gasto</Button>
                                            </form>
                                        </CardBody>
                                    </Card>
                                )}
                                {Object.entries(deudas).map(([nombre, deuda]) =>
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
                                                        <span>{usuarios[nombre].nombre}</span>
                                                        <button onClick={() => startEditingMemberName(nombre)}>
                                                            <img style={{width: '15px', marginLeft: '15px'}} src="/src//icons/edit.svg" alt="Edit" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            <p style={{color: deudas[nombre] < 0 ? 'red' : 'green'}}>Saldo: {deuda}</p>
                                        </CardBody>
                                    </Card>
                                ))}
                            </Tab>
                            <Tab key="gastos" title="Gastos">
                                {grupo.gastos.map((id, index) =>
                                    <Card className='p-4'>
                                        <CardBody>
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                {editMode[index] ? <Input value={newName} onValueChange={setNewName} className='max-w-[220px]' label="Nombre"></Input> : <b>{gastos[id].nombre}</b>}
                                                <Button color='primary' onClick={() => {
                                                    if(editMode[index]) {
                                                        const gruposSerializados = JSON.stringify(grupos);
                                                        const itemSerializado = JSON.stringify(gastos[id]);
                                                        const copiaItem = { ...gastos[id] };
                                                        copiaItem.nombre = newName;
                                                        copiaItem.deuda = nuevaDeuda;
                                                        const nuevoItemSerializado = JSON.stringify(copiaItem);
                                                        const nuevosGruposSerializados = gruposSerializados.replace(itemSerializado, nuevoItemSerializado);
                                                        window.sessionStorage.setItem('grupos', nuevosGruposSerializados);
                                                        setGrupos(JSON.parse(nuevosGruposSerializados));
                                                        setGrupo(JSON.parse(nuevosGruposSerializados)[id]);
                                                    }
                                                    setNewName(gastos[id].nombre);
                                                    setNuevaDeuda(gastos[id].deuda);
                                                    setEditMode(editMode.map((x, i) => i != index ? x : !x));
                                                }}>{editMode[index] ? "Guardar" : "Editar"}</Button>
                                            </div>
                                            <p>Quien pagó: {usuarios[gastos[id].payer].nombre}</p>
                                            <p>Monto Total: {gastos[id].monto}</p>
                                            <p>Fecha: {gastos[id].fecha}</p>
                                            {editMode[index] ? <Input endContent={<p style={{fontSize: '14px'}}>c/u</p>} className='max-w-[220px]' label="Deuda" value={nuevaDeuda} onValueChange={setNuevaDeuda}></Input> : <p style={{color: 'red'}}>Deuda: {gastos[id].reparto[gastos[id].deudores.at(0)]} c/u</p>}
                                            <p>Deudores: {gastos[id].deudores.length > 0 && imprimirNombres(gastos,usuarios,id)}</p>
                                        </CardBody>
                                    </Card>
                                )}
                            </Tab>
                            <Tab key="saldos" title="Saldos">
                                <MapListbox id_grupo = {id}></MapListbox>
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