import React from 'react';
import { useState } from 'react';
import { getGrupos, getUsuarios, getCurrentUser, getApodos } from "../utils/utilities"
import {Tabs, Tab, Card, CardBody, CardHeader, CardFooter, Button, Link, useDisclosure} from '@nextui-org/react';
import {
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter
  } from "@nextui-org/modal";
import inputStyle from "../styles/form.module.css"

export default function ShopListDisplay(props) {
    let [id,setId] = useState(props.id);
    let [grupos, setGrupos] = useState(getGrupos());
    let [grupo, setGrupo] = useState(grupos[id]);
    let [usuarios, setUsuarios] = useState(getUsuarios());
    let [apodos, setApodos] = useState(getApodos()[getCurrentUser()]);

    function calcularSaldos() {
        var saldos = {};
        var deudas = {};
        grupo.integrantes.forEach((integrante) => {
            saldos[integrante] = 0;
            deudas[integrante] = {};
        })
        for (const id in grupo.articulos) {
            if (grupo.articulos.hasOwnProperty(id) && grupo.articulos[id].comprado) {
                var reparto = (grupo.articulos[id].costo / grupo.integrantes.length);
                grupo.integrantes.forEach((integrante) => {
                    if (integrante === grupo.articulos[id].payer) { // Soy el payer, no debo plata
                        saldos[integrante] += reparto;
                    }
                    else { // NO soy el payer, debo dinero.
                        saldos[integrante] -= reparto;
                        if (grupo.articulos[id].payer in deudas[integrante]) { // Ya le debia plata?
                            var deuda_anterior = deudas[integrante][grupo.articulos[id].payer];
                            deudas[integrante][grupo.articulos[id].payer] = deuda_anterior + reparto;
                        }
                        else { // Si no le debia, seteo la deuda al valor del reparto.
                            deudas[integrante][grupo.articulos[id].payer] = reparto;
                        }
                        // chequear si el payer me debe a mi.
                        if (integrante in deudas[grupo.articulos[id].payer]) {
                            var deuda_payer = deudas[grupo.articulos[id].payer][integrante];
                            var deuda_integrante = deudas[integrante][grupo.articulos[id].payer];
                            if (deuda_payer == deuda_integrante) {
                                deudas[grupo.articulos[id].payer][integrante] = 0;
                                deudas[integrante][grupo.articulos[id].payer] = 0;
                            }
                            else if (deuda_payer > deuda_integrante) {
                                var diferencia = deuda_payer - deuda_integrante;
                                deudas[grupo.articulos[id].payer][integrante] = diferencia;
                                deudas[integrante][grupo.articulos[id].payer] = 0;
                            }
                            else if (deuda_integrante > deuda_payer) {
                                var diferencia = deuda_integrante - deuda_payer;
                                deudas[integrante][grupo.articulos[id].payer] = diferencia;
                                deudas[grupo.articulos[id].payer][integrante] = 0;
                            }
                        }
                    }
                })
            }
        }
        return [saldos, deudas];
    }

    function getApodo(usuario) {
        if (!apodos || !apodos.hasOwnProperty(usuario) || apodos[usuario] == "") {
            return usuarios[usuario].nombre
        }
        return apodos[usuario]
    }

    const [nuevoItem, setNuevoItem] = useState(false);

    const switchNuevoItem = () => setNuevoItem(!nuevoItem);

    const [nombreNuevoItem, setNombreNuevoItem] = useState('');

    const handleNuevoItem = (event) => {
        setNombreNuevoItem(event.target.value);
    }

    const agregarArticulo = () => {
        var id = obtenerItemID();
        grupo.articulos[id] = {nombre: nombreNuevoItem, comprado: false, costo: 0};
        sessionStorage.setItem("grupos", JSON.stringify(grupos));
        window.location.reload();
    }

    const {isOpen, onOpen, onClose} = useDisclosure();

    const [costoItem, setCostoItem] = useState(0);

    const handleCostoItem = (event) => {
        setCostoItem(event.target.value);
    }

    const [itemIndex, setItemIndex] = useState(0);

    const [nombreItemComprado, setNombreItemComprado] = useState('');

    const handleOpen = (index, nombre) => {
        setItemIndex(index);
        setNombreItemComprado(nombre);
        onOpen();
    }

    const pagarItem = () => {
        var itemComprado = {nombre: nombreItemComprado, comprado: true, costo: Number(costoItem), payer: Number(getCurrentUser())};
        grupo.articulos[itemIndex] = itemComprado;
        sessionStorage.setItem("grupos", JSON.stringify(grupos));
        window.location.reload();
    }

    function obtenerItemID() {
        var maxID = 0;
        for (const id in grupo.articulos) {
            if (grupo.articulos.hasOwnProperty(id)){
                if (Number(id) > Number(maxID)){
                    maxID = Number(id);
                }
            }
        }
        return maxID + 1;
    }

    function calcularSuma() {
        var suma = 0;
        Object.entries(grupo.articulos).map(([id, articulo]) => {
            suma += articulo.costo;
        })
        return suma;
    }

    var suma = calcularSuma();

    var [saldos, deudas] = calcularSaldos();

    console.log(deudas);

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
                            <Button color="warning" style={{marginBottom: '12px'}} onClick={() => switchNuevoItem()}>Nuevo artículo</Button>
                            {nuevoItem && (
                                <p>
                                    <label style={{color: 'gold'}}>Nombre:</label>
                                    <input style={{marginLeft: '10px', marginBottom: '12px'}} className={inputStyle.formInputStyle} type="text" value={nombreNuevoItem} onChange={handleNuevoItem}/>
                                    <Button style={{marginLeft: '10px'}} color="warning" onClick={() => agregarArticulo()}>Agregar</Button>
                                </p>
                            )}
                            <p style={{marginBottom: '14px', color:"gold"}}>Total: {suma}$</p>
                            {grupo.articulos.length === 0 ? (
                                <p style={{color:"gold"}}>No se han agregado artículos aún.</p>
                            ) : (
                                Object.entries(grupo.articulos).map(([id, articulo]) => {
                                    return (
                                        <Card key={id} style={{background: "black", borderWidth: "2px", borderColor: "gold", marginBottom: "10px"}}>
                                            <CardBody>
                                                <p style={{color: articulo.comprado ? "#17c964" : "gold"}}>{articulo.nombre}</p>
                                                {!articulo.comprado && (
                                                    <div>
                                                        <Button key={id} color="warning" onPress={() => handleOpen(id, articulo.nombre)}>Comprar artículo</Button>
                                                        <Modal isOpen={isOpen} onClose={onClose}>
                                                            <ModalContent>
                                                                {(onClose) => (
                                                                    <>
                                                                        <ModalHeader>Ingrese el costo:</ModalHeader>
                                                                        <ModalBody>
                                                                            <input style={{marginLeft: '10px', marginBottom: '12px'}} className={inputStyle.formInputStyle} type="number" value={costoItem} onChange={handleCostoItem}/>
                                                                        </ModalBody>
                                                                        <ModalFooter>
                                                                            <Button color="danger" variant="light" onPress={onClose}>Cerrar</Button>
                                                                            <Button color="warning" onClick={() => pagarItem()} onPress={onClose}>Pagar</Button>
                                                                        </ModalFooter>
                                                                    </>
                                                                )}
                                                            </ModalContent>
                                                        </Modal>
                                                    </div>
                                                )}
                                                {articulo.comprado && (
                                                    <p style={{color: "gold"}}>Costo: {articulo.costo}$ | Pagado por {articulo.payer === Number(getCurrentUser()) ? "mí" : getApodo(articulo.payer)}</p>
                                                )}
                                            </CardBody>
                                        </Card>
                                    )
                                })
                            )}
                        </Tab>
                        <Tab key="abejas" title="Abejas">
                            {grupo.integrantes.map((id, index) =>
                                <Card key={id} style={{background: "black", borderWidth: "2px", borderColor: "gold", marginBottom: "10px"}}>
                                    <CardBody>
                                        <p style={{color: "gold"}}>{getApodo(id)}</p>
                                        <p style={{color: (saldos[id] > 0 ? "#17c964" : 'red')}}>Saldo: ${saldos[id]}</p>
                                    </CardBody>
                                </Card>
                            )}
                        </Tab>
                        <Tab key="deudas" title="Deudas">
                            {Object.entries(deudas).map(([deudor, acreedores]) => {
                                return (
                                    <div key={deudor}>
                                        {Object.entries(acreedores).map(([acreedor, monto]) => {
                                            if (monto > 0) return (
                                                <Card key={acreedor} style={{background: "black", borderWidth: "2px", borderColor: "gold", display: "flex", justifyContent: "center", marginBottom: "10px"}}>
                                                    <CardBody style={{color: "gold"}}>
                                                        {deudor === getCurrentUser() ? (
                                                            <div>
                                                                Yo le debo ${monto} a {getApodo(acreedor)}
                                                                <Button color="warning" style={{display: "flex", alignContent: "center", width: "auto"}} name="Saldar" onClick={() => console.log(`saldado!`)}>Saldar</Button>
                                                            </div>
                                                        ) : (
                                                            <p>{acreedor === getCurrentUser() ? (`${getApodo(deudor)} me debe $${monto}`) : (`${getApodo(deudor)} le debe $${monto} a ${getApodo(acreedor)}`)}</p>
                                                        )}
                                                    </CardBody>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                )
                            })}
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
