import React, { useState } from 'react';
import { getGrupos, getUsuarios, getCurrentUser, agregarIntegrante, getWishes } from "../utils/utilities";
import { Tabs, Tab, Card, CardBody, CardHeader, CardFooter, Button, Link, Input } from '@nextui-org/react';
import { HeartIcon } from './HeartIcon';
import WishListItems from './WishListItems';
import "../styles/btn.css";
import CerrarSesion from './cerrarsesion';
import "../styles/global.css"

//import { wishes } from '../../public/wishes.astro';

export default function WishListDisplay(props) {
    let [id, setId] = useState(props.id);
    let [grupos, setGrupos] = useState(getGrupos());
    let [grupo, setGrupo] = useState(grupos[id]);
    let [usuarios, setUsuarios] = useState(getUsuarios());
    let [wishes, setWishes] = useState(getWishes());
    const [newWishName, setNewWishName] = useState("");
    const [newWishLink, setNewWishLink] = useState("");

    const user = getCurrentUser();
    const isUserInGroup = grupo.integrantes.includes(parseInt(user));
    const isAdmin = grupo.admins.includes(Number(user));

    const addToHive = (id) => {
        agregarIntegrante(user, id);
        window.location.reload();
    };

    const handleAddWish = (e) => {
        e.preventDefault();

        const newWish = {
            nombre: newWishName,
            link: newWishLink,
            comprado: false,
        };
        console.log(newWish);
        // Find the next available ID for the wish
        var maxID = 0
        for (const id in wishes) {
            if (wishes.hasOwnProperty(id)) {
                if (Number(id) > Number(maxID)) {
                    maxID = Number(id)
                }
            }
        }

        // Add the new wish to wishes object
        var updatedWishes = {
            ...wishes,
            [maxID+1]: newWish
        }
        setWishes(updatedWishes)
        // Update grupo.deseos with the new wish ID
        const updatedGrupo = {
            ...grupo,
            deseos: [...(grupo.deseos || []), maxID+1],
        };

        // Update the component state
        setGrupo(updatedGrupo);

        // Update the grupos object
        const updatedGrupos = { ...grupos, [id]: updatedGrupo };
        setGrupos(updatedGrupos);

        // Save to session storage
        sessionStorage.setItem('wishes', JSON.stringify(updatedWishes));
        sessionStorage.setItem('grupos', JSON.stringify(updatedGrupos));

        // Reset the form fields
        setNewWishName("");
        setNewWishLink("");
    };

    return (
        <div className="p-5">
            <Card className='p-4' style={{ background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39" }}>
                <CardHeader className='header'>
                   
                   <h4 className="font-bold text-large" style={{color: "black"}}>
                       {grupo.nombre}
                   </h4>

                   {user && (
                       <CerrarSesion client:only></CerrarSesion>
                   )}

               </CardHeader>
                <CardBody>
                    <Tabs aria-label="Options" variant="underlined" radius="full">
                        <Tab key="info" title="Info">
                            <Card style={{ background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39" }}>
                                <CardBody>
                                    <h4 className="text-large"> {grupo.infoSaludo} </h4>
                                    <h4 className="text-large" style={{ color: "black", marginTop: "10px" }}>
                                        {grupo.infoCuerpo}
                                    </h4>
                                    <h4 className="text-large" style={{ color: "black", marginTop: "10px" }}>
                                        {grupo.infoFinal}
                                    </h4>
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="Wish-List" title="Wish-List">
                            <Card style={{ background: "transparent", borderWidth: "1px", borderColor: "#FFBB39" }}>
                                <WishListItems client:only wishes={wishes} setWishes={setWishes} id={id} />
                            </Card>
                        </Tab>
                        {isAdmin && (
                            <Tab key="Agregar-deseo" title="Agregar deseo">
                                <Card style={{ background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39" }}>
                                    <CardBody>
                                        <form onSubmit={handleAddWish}>
                                            <div style={{ marginTop: "15px" }}>
                                                <Input
                                                    fullWidth
                                                    clearable
                                                    bordered
                                                    placeholder="Wish Name"
                                                    variant="bordered"
                                                    value={newWishName}
                                                    color = "warning"
                                                    onChange={(e) => setNewWishName(e.target.value)}
                                                />
                                            </div>
                                            <div style={{ marginTop: "15px" }}>
                                                <Input 
                                                    fullWidth
                                                    clearable
                                                    bordered
                                                    placeholder="Wish Link"
                                                    variant="bordered"
                                                    value={newWishLink}
                                                    color = "warning"
                                                    onChange={(e) => setNewWishLink(e.target.value)}
                                                />
                                            </div>
                                            <Button onClick={(e)=>{handleAddWish(e)}} type="submit" color="warning" style={{ marginTop: "15px" }}>
                                                Add Wish
                                            </Button>
                                        </form>
                                    </CardBody>
                                </Card>
                            </Tab>
                        )}
                    </Tabs>
                </CardBody>
                <CardFooter>
                    {user && (
                        <Button href='/home' as={Link} color="warning" showAnchorIcon variant="solid">
                            My Hive
                        </Button>
                    )}

                    <Button style={{ marginLeft: "10px" }} href='/publico' as={Link} color="warning" showAnchorIcon variant="solid">
                        Más grupos públicos
                    </Button>

                    {user && !isUserInGroup && (
                        <Button style={{ marginLeft: "auto" }} onClick={() => { addToHive(id) }}
                            isIconOnly aria-label="Like" title="Add to my hive" color="warning" className="btn-grupo unirse-btn">
                            <HeartIcon />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
