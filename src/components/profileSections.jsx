import { Tab, Tabs, useDisclosure, Modal, ModalBody, ModalContent, Button, ModalHeader, ModalFooter, Input, Link, Accordion, AccordionItem } from "@nextui-org/react"
import { calcularDeudasAtravesDeGrupos } from '../utils/logicaNegocio';
import { getContactos, getApodos, getUsuarios, getGrupos, getGastos, getHives, getCurrentUser } from "../utils/utilities"
import { useEffect, useState } from "react";
import { contactos } from "../../public/contactos.astro";

export default function ProfileSections() {
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const [contactos, setContactos] = useState(getContactos()[currentUser]);
    const [apodos, setApodos] = useState(getApodos()[currentUser]);
    const [usuarios, setUsuarios] = useState(getUsuarios());
    const [grupos, setGrupos] = useState(getGrupos());
    const [gastos, setGastos] = useState(getGastos());
    const [editingContact, setEditingContact] = useState(false);
    const [editingContactId, setEditingContactId] = useState(0);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [otrasAbejas, setOtrasAbejas] = useState([]);
    const [deudaContactos, setDeudaContactos] = useState([]);

    const startEditingContact = (usuario) => {
        setEditingContact(true);
        setEditingContactId(usuario);
    }

    const stopEditingContact = () => {
        setEditingContact(false);
    };

    const handleContactEdit = (e) => {
        var _apodos = {...apodos};
        _apodos[editingContactId] = e.target.value;
        var _contactos = JSON.parse(sessionStorage.getItem('contactos'));
        _contactos[currentUser] = _apodos;
        sessionStorage.setItem('contactos', JSON.stringify(_contactos));
        setApodos(_apodos);
    };

    useEffect(() => {
        const contactosDeudores = Object.values(gastos)
        .map((x, index) => {
            return { 
                id: index, 
                valor: { 
                    esAcreedor: x.payer == currentUser, 
                    deudores: x.deudores.filter(y => y != currentUser && contactos.some(z => z == y))
                }}
            })
        .filter(x => x.valor.esAcreedor && x.valor.deudores.length > 0)
        .map(x => { 
            return { 
                id: x.id, 
                usuarios: x.valor.deudores
            }})

        const contactosAcreedores = Object.values(gastos)
            .map((x, index) => { 
                return { 
                    id: index, 
                    valor: {
                        payer: x.payer,
                        esDeudor: x.deudores.some(y => y == currentUser) && x.payer != currentUser
                    }
                }
            })
            .filter(x => x.valor.esDeudor && contactos.some(z => z == x.valor.payer))
            .map(x => { 
                return { 
                    id: x.id, 
                    usuarios: [x.valor.payer]
                }
            })

        setDeudaContactos(obtenerDetalleDeudas(contactosDeudores, contactosAcreedores))

        const otrosDeudores = Object.values(gastos)
            .map((x, index) => {
                return { 
                    id: index, 
                    valor: { 
                        esAcreedor: x.payer == currentUser, 
                        deudores: x.deudores.filter(y => y != currentUser && (contactos.length === 0 || !contactos.some(z => z == y)))
                    }}
                })
            .filter(x => x.valor.esAcreedor && x.valor.deudores.length > 0)
            .map(x => { 
                return { 
                    id: x.id, 
                    usuarios: x.valor.deudores
                }})

        const otrosAcreedores = Object.values(gastos)
            .map((x, index) => { 
                return { 
                    id: index, 
                    valor: {
                        payer: x.payer,
                        esDeudor: x.deudores.some(y => y == currentUser) && x.payer != currentUser
                    }
                }
            })
            .filter(x => x.valor.esDeudor && (contactos.length === 0 || !contactos.some(z => z == x.valor.payer)))
            .map(x => { 
                return { 
                    id: x.id, 
                    usuarios: [x.valor.payer]
                }
            });

        setOtrasAbejas(obtenerDetalleDeudas(otrosDeudores, otrosAcreedores))
    }, [])

    function obtenerDetalleDeudas(deudores, acreedores) {
        const otrosGastos = deudores.concat(...acreedores);
        const otrasDeudas = [];
        const otrosUsuariosUnicos = [];

        otrosGastos.forEach(x => {
            x.usuarios.forEach(y => {
                if (!otrosUsuariosUnicos.some(z => z == y)) {
                    otrosUsuariosUnicos.push(y);
                    const monto = calcularDeudasAtravesDeGrupos(grupos, currentUser, y) * -1;
                    if (monto != 0) {
                        const nombres = Object.values(grupos)
                            .filter(w => w.gastos 
                                && w.gastos.some(z => z == x.id)
                                && w.integrantes.some(z => z == currentUser)
                                && w.integrantes.some(z => z == y))
                            .map(w => {return w.nombre})

                        otrasDeudas.push({ 
                            gastos: nombres.map(w => generarDetalle(
                                        gastos[x.id].payer == currentUser,
                                        gastos[x.id].nombre,
                                        gastos[x.id].reparto[currentUser],
                                        w)), 
                            monto: monto, 
                            usuario: y
                        })
                    }
                } else {
                    otrasDeudas.filter(z => z.usuario == y).forEach(z => {
                        const nombres = Object.values(grupos)
                            .filter(w => w.gastos 
                                && w.gastos.some(z => z == x.id)
                                && w.integrantes.some(z => z == currentUser)
                                && w.integrantes.some(z => z == y))
                            .map(w => {return w.nombre})

                            nombres.map(w => z.gastos.push(generarDetalle(
                                gastos[x.id].payer == currentUser,
                                gastos[x.id].nombre,
                                gastos[x.id].reparto[currentUser],
                                w)))
                    })
                }
            })
        });

        return otrasDeudas;
    }

    function generarDetalle(esDeudor, gasto, monto, grupo) {
        return `${esDeudor ? "Me debe" : "Le debo"}: ${gasto} por $${monto} en ${grupo}`
    }

    function agregarBee(onClose) {
            var usuarios = getUsuarios();
            var user = document.getElementById('usuarioBee').value;
            var nombre =0;
            var existe = false;
            for (const key in usuarios){
                if (usuarios.hasOwnProperty(key)){
                    if (usuarios[key].usuario == user){
                        existe = true
                        nombre = key
                        break
                    }
                }
            }
            if (!existe) {
                alert('El usuario no existe. Desea invitarlo? (funcionalidad no implementada)');
                return;
            }
            var esContacto = false;
            
            contactos.forEach((contacto) => {
                if (contacto == nombre) {
                    esContacto = true;
                }
            });
            if (esContacto) {
                alert('El usuario ya es un contacto');
                return;
            }
            
            contactos.push(Number(nombre))
            var lista_contactos = getContactos();
            lista_contactos[currentUser] = contactos
            sessionStorage.setItem('contactos', JSON.stringify(lista_contactos));

            document.getElementById('usuarioBee').innerText = "";
            window.location.reload();
            onClose();
    };

    function getApodo(usuario) {
        if (!apodos || !apodos.hasOwnProperty(usuario) || apodos[usuario] == "") {
            return usuarios[usuario].nombre
        }
        return apodos[usuario]
    }

    return <><Tabs>
    <Tab key="contactos" title="Contactos">
        <div className="container">
            <div style={{display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "60%",
                marginBottom: "1em"}}>
                <h1 className="text-gradient">Bees</h1> 
                <Button onPress={onOpen}>Nueva abeja</Button>
            </div>
            <div className="contact-list">
                {deudaContactos && deudaContactos.map((x, index) => {
                        const color = x.monto < 0 ? 'red' : 'green';
                        let deudaText = <></>;
                        if (x.monto < 0){
                            deudaText = <>Debo en total: <span style={{color: color}}>${x.monto * -1}</span></>
                        }
                        else if (x.monto > 0){
                            deudaText = <>Me debe en total: <span style={{color: color}}>${x.monto}</span></>
                        }
                        return <div key={index} href={`/${usuarios[x.usuario].nombre}`} className="contact-card">
                            {/* <p>{getApodo(x.usuario)}
                                    <button name="edit" onClick={"startEditingContact"}>
                                        <img style={{width: '15px', marginLeft: '15px'}} src="/src//icons/edit.svg" alt="Edit" />
                                    </button>
                            </p> */}
                            {
                                editingContact && editingContactId == x.usuario ? (
                                    <p><input
                                        type="text"
                                        value={getApodo(x.usuario)}
                                        onChange={handleContactEdit}
                                        autoFocus/>
                                        <button name="edit" onClick={stopEditingContact}>
                                        <img style={{width: '15px', marginLeft: '15px'}} src="/public//images/check.png" alt="save" />
                                        </button>
                                    </p>
                                ) : (
                                    <p>{getApodo(x.usuario)}
                                        <button name="edit" onClick={() => startEditingContact(x.usuario)}>
                                        <img style={{width: '15px', marginLeft: '15px'}} src="/src//icons/edit.svg" alt="Edit" />
                                        </button>
                                    </p>
                                )
                            }
                            <p>{deudaText}</p>
                            <Accordion>
                                <AccordionItem key="1" aria-label="Detalle" title="Detalle">
                                {x.gastos.map((x, index) => {
                                    return <p key={index}>{x}</p>
                                })}
                                </AccordionItem>
                            </Accordion>
                        </div>
                })}
            </div>
            <Button className="mt-4" href='/home' as={Link} color="primary" showAnchorIcon variant="solid">
                Volver
            </Button>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">Agregar abeja</ModalHeader>
                <ModalBody>
                    <Input type="text" label="Usuario" id="usuarioBee" minLength={2} required></Input>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onPress={() => agregarBee(onClose)}>
                        Agregar al panal
                    </Button>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Cancelar
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
      </Modal>
    </Tab>
    <Tab key="otros" title="Otras abejas">
        <div className="container">
            <div style={{display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "60%",
                marginBottom: "1em"}}>
                <h1 className="text-gradient">Otras abejas</h1>
            </div>
            <div className="contact-list">
                {otrasAbejas && otrasAbejas.map((x, index) => {
                        const color = x.monto < 0 ? 'red' : 'green';
                        let deudaText = <></>;
                        if (x.monto < 0){
                            deudaText = <>Debo en total: <span style={{color: color}}>${x.monto * -1}</span></>
                        }
                        else if (x.monto > 0){
                            deudaText = <>Me debe en total: <span style={{color: color}}>${x.monto}</span></>
                        }
                        return <div key={index} href={`/${usuarios[x.usuario].nombre}`} className="contact-card">
                            <p>Nombre: {usuarios[x.usuario].nombre}</p>
                            <p>{deudaText}</p>
                            <Accordion>
                                <AccordionItem key="1" aria-label="Detalle" title="Detalle">
                                {x.gastos.map((x, index) => {
                                    return <p key={index}>{x}</p>
                                })}
                                </AccordionItem>
                            </Accordion>
                        </div>
                })}
            </div>
            <Button className="mt-4" href='/home' as={Link} color="primary" showAnchorIcon variant="solid">
                Volver
            </Button>
        </div>
    </Tab>
</Tabs>
<style is="global">
    {`
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    .contact-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 2rem;
    }

    .contact-card {
        background-color: white;
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
        color: black;
        text-decoration: none;
        transition: transform 0.3s ease-in-out;
    }

    .contact-card:hover {
        transform: translateY(-5px);
    }

    .modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
        background-color: #fefefe;
        margin: 10% auto;
        padding: 20px;
        border-radius: 8px;
        width: 80%;
        max-width: 500px;
    }

    .text-gradient {
        font-size: 4rem;
        font-weight: 700;
        line-height: 1;
        text-align: center;
        background-image: linear-gradient(to right, #f12711, #f5af19);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
`}
</style></>
}