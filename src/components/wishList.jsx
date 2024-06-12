import React, { useState } from 'react';
import { getGrupos, getUsuarios, getCurrentUser, agregarIntegrante } from "../utils/utilities";
import { Tabs, Tab, Card, CardBody, CardHeader, CardFooter, Button, Link, Input } from '@nextui-org/react';
import { HeartIcon } from './HeartIcon';
import WishListItems from './WishListItems';
import "../styles/btn.css";

import { wishes } from '../../public/wishes.astro';

export default function WishListDisplay(props) {
    let [id, setId] = useState(props.id);
    let [grupos, setGrupos] = useState(getGrupos());
    let [grupo, setGrupo] = useState(grupos[id]);
    let [usuarios, setUsuarios] = useState(getUsuarios());
    const [newWishName, setNewWishName] = useState("");
    const [newWishLink, setNewWishLink] = useState("");

    const user = getCurrentUser();
    const isUserInGroup = grupo.integrantes.includes(parseInt(user));
    const isAdmin = grupo.admins.includes(parseInt(user));

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

        // Find the next available ID for the wish
        const newWishId = Object.keys(wishes).length;

        // Add the new wish to wishes object
        wishes[newWishId] = newWish;

        // Update grupo.deseos with the new wish ID
        const updatedGrupo = {
            ...grupo,
            deseos: [...(grupo.deseos || []), newWishId],
        };

        // Update the component state
        setGrupo(updatedGrupo);

        // Update the grupos object
        const updatedGrupos = { ...grupos, [id]: updatedGrupo };
        setGrupos(updatedGrupos);

        // Save to session storage
        sessionStorage.setItem('grupos', JSON.stringify(updatedGrupos));

        // Reset the form fields
        setNewWishName("");
        setNewWishLink("");
    };

    return (
        <div className="p-5">
            <Card className='p-4' style={{ background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39" }}>
                <CardHeader>
                    <h4 className="font-bold text-large" style={{ color: "black" }}>
                        {grupo.nombre}
                    </h4>
                </CardHeader>
                <CardBody>
                    <Tabs aria-label="Options" variant="underlined" radius="full">
                        <Tab key="info" title="Info">
                            <Card style={{ background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39" }}>
                                <CardBody>
                                    <h3 className="text-large"> {grupo.infoSaludo} </h3>
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
                                <WishListItems client:only id={id} />
                            </Card>
                        </Tab>
                        {isAdmin && (
                            <Tab key="Agregar-deseo" title="Agregar deseo">
                                <Card style={{ background: "#FEFCE8", borderWidth: "1px", borderColor: "#FFBB39" }}>
                                    <CardBody>
                                        <form onSubmit={handleAddWish}>
                                            <Input
                                                fullWidth
                                                clearable
                                                bordered
                                                placeholder="Wish Name"
                                                value={newWishName}
                                                onChange={(e) => setNewWishName(e.target.value)}
                                            />
                                            <Input
                                                fullWidth
                                                clearable
                                                bordered
                                                placeholder="Wish Link"
                                                value={newWishLink}
                                                onChange={(e) => setNewWishLink(e.target.value)}
                                            />
                                            <Button type="submit" color="warning" style={{ marginTop: "10px" }}>
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
