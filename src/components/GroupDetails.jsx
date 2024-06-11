import {Tabs, Tab, Card, CardBody, CardHeader, CardFooter, Button, Link, Input, Badge} from '@nextui-org/react';
import calcularDeudas from '../utils/logicaNegocio';
import calcularSaldos from '../utils/calcularSaldos';
import MapListbox from './mapListBox';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { getUsuarios, getGrupos, getGastos, getSaldos, getApodos, getInvitados, getCurrentUser } from "../utils/utilities"
import inputStyle from "../styles/form.module.css"


export default function GroupDetails(props) {
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    let [id,setId] = useState(props.id.split('-')[0]);
    let [grupos, setGrupos] = useState(getGrupos());
    let [usuarios, setUsuarios] = useState(getUsuarios());
    const [apodos, setApodos] = useState(getApodos()[currentUser]);
    let [grupo, setGrupo] = useState(grupos[id]);
    let [editMode, setEditMode] = useState(grupo.gastos.map(x => false));
    let [newName, setNewName] = useState("");
    let [nuevaDeuda, setNuevaDeuda] = useState("");
    let [gastos,setGastos] = useState(getGastos());
    const [editingGroup, setEditingGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState(grupo.nombre);
    const [editingMember, setEditingMember] = useState(null);
    const [newMemberName, setNewMemberName] = useState(null);
    const [invitados, setInvitados] = useState(getInvitados())
    const [deudaInvitados, setDeudaInvitados] = useState(grupo.gastos
        .filter(x => gastos[x].invitados)
        .map(x => gastos[x].invitados)
        .reduce((acc, e) => {
            Object.keys(e).forEach(k => {
                if (acc[k]) {
                    acc[k] -= e[k]
                } else {
                    acc[k] = e[k] * -1
                }
            });
            
            return acc;
    }, {}))

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

    const [deudores, setDeudores] = useState([]);
    const handleNuevoDeudor = (id) => {
        document.getElementById("errorGasto").style.display = "none";
        document.getElementById("crearGastoBtn").disabled = false;
        let deudores_ = []
        if (deudores.includes(id)) {
            deudores_ = deudores.filter(x => x != id)
        } else {
            deudores_ = [...deudores, id]
        }
        setDeudores(deudores_)

        grupo.integrantes.forEach(function(integrante) {
            document.getElementById('porcentaje' + integrante).value = "";
            document.getElementById('porcentaje' + integrante).placeholder = 0;
            document.getElementById('porcentaje' + integrante).disabled = true;
        })
        deudores_.forEach(function(deudor) {
            document.getElementById('porcentaje' + deudor).disabled = false;
            document.getElementById('porcentaje' + deudor).placeholder = Math.round((100 / deudores_.length) * 100) / 100;
        })
    }

    const handlePorcentaje = (e, id) => {
        document.getElementById("errorGasto").style.display = "none";
        document.getElementById("crearGastoBtn").disabled = false;

        let total = 0;
        let sinP = [];
        grupo.integrantes.forEach(function(integrante) {
            total += Number(document.getElementById('porcentaje' + integrante).value);
            if (document.getElementById('deudor' + integrante).checked && document.getElementById('porcentaje' + integrante).value == "") {
                sinP.push(integrante);
            }
        })

        if (total > 100) {
            document.getElementById("errorGasto").style.display = "block";
            document.getElementById("errorGasto").innerHTML = "La suma de los porcentajes no puede superar el 100%.";
            document.getElementById("errorGasto").style.color = "red";
            document.getElementById("errorGasto").style.fontWeight = "bold";
            document.getElementById("errorGasto").style.fontSize = "14px";
            document.getElementById("crearGastoBtn").disabled = true;
            return;
        }
        else if (sinP.length == 0 && total != 100) {
            document.getElementById("errorGasto").style.display = "block";
            document.getElementById("errorGasto").innerHTML = "La suma de los porcentajes debe ser igual a 100%.";
            document.getElementById("errorGasto").style.color = "red";
            document.getElementById("errorGasto").style.fontWeight = "bold";
            document.getElementById("errorGasto").style.fontSize = "14px";
            document.getElementById("crearGastoBtn").disabled = true;
            return;
        }

        let porcentaje = (100 - total) / sinP.length;
        sinP.forEach(function(integrante) {
            document.getElementById('porcentaje' + integrante).placeholder = porcentaje;
        })
    }

        

    const saveEdit = (type) => (event) => {
        let nuevosGrupos = {...grupos};
    
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

    function getApodo(usuario) {
        if (!apodos || !apodos.hasOwnProperty(usuario) || apodos[usuario] == "") {
            return usuarios[usuario].nombre
        }
        return apodos[usuario]
    }

    function imprimirNombres(id){
        return gastos[id].deudores.filter(x => x != gastos[id].payer).map(x => getApodo(x)).reduce((acc, e) => acc + ", " + e);
    }

    function imprimirInvitadosDeudores(id) {
        let nombres = ""

        if (gastos[id].invitados) {
            nombres = Object.keys(gastos[id].invitados).map(x => invitados[x].nombre).reduce((acc, e) => acc + ", " + e)
        }

        return nombres;
    }

    const crearGasto = (e) => {
        e.preventDefault();

        var deudores = [];
   
        grupo.integrantes.forEach(function(integrante) {
            if (document.getElementById('deudor' + integrante).checked) {
                deudores.push(integrante);
            }
        });

        var fecha = new Date();

        var anio = fecha.getFullYear();
        var mes = fecha.getMonth() + 1;
        var dia = fecha.getDate();

        var fechaString = dia + '/' + mes + '/' + anio;

        var porcentajes = {};
        grupo.integrantes.forEach(function(integrante) {
            porcentajes[integrante] = Number(document.getElementById('porcentaje' + integrante).value) == "" ? Number(document.getElementById('porcentaje' + integrante).placeholder) : Number(document.getElementById('porcentaje' + integrante).value);
        });

        var repartos = {};
        // var reparto = Math.round((montoGasto / (deudores.length + 1)) * 100) / 100;
        // deudores.forEach(deudor => {
        //     repartos[deudor] = reparto
        // })

        grupo.integrantes.forEach(integrante => {
            if (deudores.includes(integrante)) {
                repartos[integrante] = Math.round((montoGasto * porcentajes[integrante] / 100) * 100) / 100;
            } else {
                repartos[integrante] = 0;
            }
        })
        
        console.log(repartos);

        var nuevoGasto = {nombre: nombreGasto, deudores: deudores, payer: Number(document.getElementById('quienPago').value), monto: Number(montoGasto), fecha: fechaString, reparto: repartos};

        var maxID = 0
        for (const id in gastos) {
            if (gastos.hasOwnProperty(id)) {
                if (Number(id) > Number(maxID)) {
                    maxID = Number(id)
                }
            }
        }

        gastos[maxID + 1] = nuevoGasto;

        grupos[id].gastos.push(maxID + 1);

        sessionStorage.setItem("gastos", JSON.stringify(gastos));

        sessionStorage.setItem("grupos", JSON.stringify(grupos));
    
        //window.location.reload();
    }

    return <div className="p-5">
                <Card className='p-4' style={{background: "black"}}>
                    <CardHeader>
                        <h4 className="font-bold text-large" style={{color: "gold"}}>
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
                        <Tabs aria-label="Options" color="warning">
                            <Tab key="integrantes" title="Integrantes">
                                <Button color="warning" style={{marginBottom: '12px'}} onClick={() => switchFormGasto()}>Nuevo gasto</Button>
                                {formGasto && (
                                    <Card className="crearGasto" style={{background: "black", borderWidth: "2px", borderColor: "gold", marginBottom: "10px"}}>
                                        <CardHeader style={{color: 'gold'}}>Ingrese los datos!</CardHeader>
                                        <CardBody>
                                            <form id="formGasto">
                                                <label style={{color: 'gold'}}>Nombre del gasto:</label><br/>
                                                <input className={inputStyle.formInputStyle} type="text" value={nombreGasto} onChange={handleNombre}/><br/>
                                                <label style={{color: 'gold'}}>Monto:</label><br/>
                                                <input className={inputStyle.formInputStyle} type="number" value={montoGasto} onChange={handleMonto}/><br/>
                                                <label style={{color: 'gold'}} htmlFor="dropdown">Quién pagó:</label><br/>
                                                <select id="quienPago">
                                                {grupo.integrantes.map((id, index) => {
                                                    return <option value={id}>{getApodo(id)}</option>
                                                })}
                                                </select>
                                                <br/>
                                                <label htmlFor="dropdown">Quienes participaron:</label>
                                                {grupo.integrantes.map((id, index) => {
                                                    return (
                                                        <ul>
                                                            <li key={id} style={{ display: "flex", alignItems: "center" }}>
                                                                <label content={getApodo(id)} style={{color: 'gold', flexGrow: 1}}>
                                                                    <input type="checkbox" id={"deudor" + id} onClick={() => handleNuevoDeudor(id)}></input>
                                                                    {getApodo(id)}
                                                                </label>
                                                                <p style={{marginRight: "400px"}}>
                                                                    <Input type="number" 
                                                                    endContent={<p style={{fontSize: '14px'}}>%</p>} 
                                                                    className='max-w-[220px]'
                                                                    disabled 
                                                                    id={"porcentaje" + id} 
                                                                    placeholder="0" 
                                                                    onChange={handlePorcentaje}
                                                                    style={{ width: "100px", textAlign: "right", marginRight: "0px",
                                                                    MozAppearance: "textfield",
                                                                    WebkitAppearance: "none",
                                                                    appearance: "textfield"}}>
                                                                        </Input>
                                                                </p>
                                                            </li>
                                                        </ul>
                                                    )
                                                })}
                                                <Button id="crearGastoBtn" onClick={crearGasto} color="warning" type="submit">Crear Gasto</Button> <p id="errorGasto"></p>
                                            </form>
                                        </CardBody>
                                    </Card>
                                )}
                                {Object.entries(deudas).map(([nombre, deuda]) =>
                                (
                                    <Card key={nombre} className='w-50 gap gap-2' style={{background: "black", borderWidth: "2px", borderColor: "gold", marginBottom: "10px"}}>
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
                                                        <span style={{color: "gold"}}>{getApodo(nombre)}</span>
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
                                {grupo.invitados?.map(x => {
                                    const invitado = invitados[x]
                                    return <Card key={x} className='w-50 gap gap-2' col style={{background: "black", borderWidth: "2px", borderColor: "gold", marginBottom: "10px"}}>
                                        <CardBody>
                                            <Badge color='warning' content="Invitado" className='p-1 mt-2'>
                                                <span style={{color: "gold"}}>{invitado.nombre}</span>
                                            </Badge>
                                            <p style={{color: deudaInvitados[x] < 0 ? 'red' : 'green'}}>Saldo: {deudaInvitados[x] ?? 0}</p>
                                        </CardBody>
                                    </Card>
                                })}
                            </Tab>
                            
                            <Tab key="gastos" title="Gastos">
                                {grupo.gastos.map((gastoId, index) =>
                                    <Card className='p-4' style={{background: "black", borderWidth: "2px", borderColor: "gold", marginBottom: "10px"}}>
                                        <CardBody>
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                {editMode[index] ? <Input value={newName} onValueChange={setNewName} className='max-w-[220px]' label="Nombre"></Input> : <b style={{color: "gold"}}>{gastos[gastoId].nombre}</b>}
                                                <Button color='warning' onClick={() => {
                                                    if(editMode[index]) {
                                                        const gastosSerializados = JSON.stringify(gastos);
                                                        const itemSerializado = JSON.stringify(gastos[gastoId]);
                                                        let totalDeudores = Object.keys(gastos[gastoId].reparto).length - 1;
                                                        Object.keys(gastos[gastoId].reparto).forEach(e => {
                                                            gastos[gastoId].reparto[e] = nuevaDeuda
                                                        })
                                                        if (gastos[gastoId].invitados) {
                                                            totalDeudores += Object.keys(gastos[gastoId].invitados).length;
                                                            Object.keys(gastos[gastoId].invitados).forEach(e => {
                                                                gastos[gastoId].invitados[e] = nuevaDeuda
                                                            })
                                                        }
                                                        gastos[gastoId].nombre = newName;
                                                        gastos[gastoId].monto = totalDeudores * nuevaDeuda;
                                                        const nuevoItemSerializado = JSON.stringify(gastos[gastoId]);
                                                        const nuevosGastosSerializados = gastosSerializados.replace(itemSerializado, nuevoItemSerializado);
                                                        window.sessionStorage.setItem('gastos', nuevosGastosSerializados);
                                                        setGastos(JSON.parse(nuevosGastosSerializados));
                                                    }
                                                    setNewName(gastos[gastoId].nombre);
                                                    setNuevaDeuda(gastos[gastoId].monto / ((Object.keys(gastos[gastoId].reparto).length - 1) + (Object.keys(gastos[gastoId].invitados ?? {}).length)));
                                                    setEditMode(editMode.map((x, i) => i != index ? x : !x));
                                                }}>{editMode[index] ? "Guardar" : "Editar"}</Button>
                                            </div>
                                            <p style={{color: "gold"}}>Quien pagó: {getApodo(gastos[gastoId].payer)}</p>
                                            <p style={{color: "gold"}}>Monto Total: {gastos[gastoId].monto}</p>
                                            <p style={{color: "gold"}}>Fecha: {gastos[gastoId].fecha}</p>
                                            
                                            { Object.values(gastos[gastoId].reparto).every(value => value == Object.values(gastos[gastoId].reparto)[0]) && (editMode[index] ?
                                                <Input endContent={<p style={{fontSize: '14px'}}>c/u</p>} className='max-w-[220px]' label="Deuda" value={nuevaDeuda} onValueChange={setNuevaDeuda}></Input> :
                                                <p style={{color: 'red'}}>Deuda: {gastos[gastoId].monto / ((Object.keys(gastos[gastoId].reparto).length - 1) + (Object.keys(gastos[gastoId].invitados ?? {}).length))} c/u</p>)}
                                            
                                            {Object.values(gastos[gastoId].reparto).every(value => value == Object.values(gastos[gastoId].reparto)[0]) && <p style={{color: "gold"}}>Deudores: {gastos[gastoId].deudores.length > 0 && imprimirNombres(gastoId)}</p>}
                                            {gastos[gastoId].invitados && Object.values(gastos[gastoId].reparto).every(value => value == Object.values(gastos[gastoId].reparto)[0]) && <p style={{color: "gold"}}>Invitados deudores: {imprimirInvitadosDeudores(gastoId)}</p>}
                                        
                                            {Object.values(gastos[gastoId].reparto).every(value => value == Object.values(gastos[gastoId].reparto)[0]) || <p>Deuda: {Object.entries(gastos[gastoId].reparto).map(([key, value]) => {
                                                if (value != 0) {
                                                    return <p style={{marginLeft:"10px", color: "gold"}}>{getApodo(key)}: ${value}</p>
                                                }
                                            })}</p>}
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
                        <Button href='/home' as={Link} color="warning" showAnchorIcon variant="solid">
                            Volver
                        </Button>
                    </CardFooter>
                </Card>
            </div>
}