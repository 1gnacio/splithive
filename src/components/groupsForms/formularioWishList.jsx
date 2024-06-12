import { useEffect, useState } from 'react';
import { Button, Card, Input, Link, Textarea } from '@nextui-org/react';
import { getGrupos, getHives, getCurrentUser } from "../../utils/utilities";
import ImageContainer from './ImageContainer';
import '../../styles/global.css';
import '../../styles/formGroups.css';

export default function FormularioDivisionDeGastos(props) {
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const [grupos, setGrupos] = useState(getGrupos());
    const [hives, setHives] = useState(getHives());

    useEffect(() => {
        const form = document.getElementById("crearWishListForm");
        const handleSubmit = (event) => {
            event.preventDefault();

            const nombreGrupo = document.getElementById("nombreGrupo").value;
            if (nombreGrupo === "") {
                alert("Se debe ingresar un nombre.");
                form.reset();
                return;
            }

            const textSaludo = document.getElementById("textSaludo").value;
            const textCuerpo = document.getElementById("textCuerpo").value;
            const textFinal = document.getElementById("textFinal").value;

            let maxID = 0;
            for (const id in grupos) {
                if (grupos.hasOwnProperty(id)) {
                    if (Number(id) > Number(maxID)) {
                        maxID = Number(id);
                    }
                }
            }

            const integrantes = [Number(currentUser)];
            hives[currentUser].push(maxID + 1);

            const nuevaWishList = {
                nombre: nombreGrupo,
                tipo: "WishList",
                admins: integrantes,
                integrantes: integrantes,
                infoSaludo: textSaludo,
                infoCuerpo: textCuerpo,
                infoFinal: textFinal,
                deseos: [],
                publico: true,
            };

            const updatedGrupos = { ...grupos, [maxID + 1]: nuevaWishList };
            const updatedHives = { ...hives };

            setGrupos(updatedGrupos);
            setHives(updatedHives);

            sessionStorage.setItem('grupos', JSON.stringify(updatedGrupos));
            sessionStorage.setItem('hives', JSON.stringify(updatedHives));

            window.location.href = '/home';
            form.reset();
        };

        form.addEventListener("submit", handleSubmit);

        return () => {
            form.removeEventListener("submit", handleSubmit);
        };
    }, [currentUser, grupos, hives]);

    return (
        <Card className='p-4'>
            <form id="crearWishListForm">
                <ImageContainer rightImageSrc='/public/images/wishList.png' />
                <div className="form-group">
                    <label htmlFor="nombreGrupo" className='form-group-item'> Nombre de la Wish-List:</label>
                    <Input
                        className='form-group-item'
                        classNames={{
                            label: ["text-black/50 dark:text-white/90"],
                            input: ["bg-yellow-300", "text-black/90 dark:text-white/90"],
                            innerWrapper: "bg-yellow-300",
                            inputWrapper: [
                                "shadow-md",
                                "!bg-yellow-300",
                                "dark:bg-blue-500/60",
                                "backdrop-blur-xl",
                                "backdrop-yellow-300",
                                "hover:bg-yellow-300",
                                "dark:hover:bg-default/70",
                                "group-data-[focus=false]:bg-yellow-200/50",
                                "dark:group-data-[focus=false]:bg-default/60",
                                "!cursor-text",
                            ],
                        }}
                        type="text" id="nombreGrupo" name="nombreGrupo"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="textSaludo" className='form-group-item'>Mensaje para las abejas-madrinas:</label>
                    <Textarea
                        labelPlacement="outside"
                        placeholder="Saludo inicial" id="textSaludo" color="warning"
                        className='form-group-item'
                        maxRows={2}
                        classNames={{
                            label: ["text-black/50 dark:text-white/90"],
                            input: ["bg-yellow-300", "text-black/90 dark:text-white/90"],
                            innerWrapper: "bg-yellow-300",
                            inputWrapper: [
                                "shadow-md",
                                "!bg-yellow-300",
                                "dark:bg-blue-500/60",
                                "backdrop-blur-xl",
                                "backdrop-yellow-300",
                                "hover:bg-yellow-300",
                                "dark:hover:bg-default/70",
                                "group-data-[focus=false]:bg-yellow-200/50",
                                "dark:group-data-[focus=false]:bg-default/60",
                                "!cursor-text",
                            ],
                        }}
                    />
                    <Textarea
                        labelPlacement="outside"
                        placeholder="Cuerpo del mensaje" id="textCuerpo" color="warning"
                        className='form-group-item max-h-xs'
                        minRows={4}
                        classNames={{
                            label: ["text-black/50 dark:text-white/90"],
                            input: ["bg-yellow-300", "text-black/90 dark:text-white/90"],
                            innerWrapper: "bg-yellow-300",
                            inputWrapper: [
                                "shadow-md",
                                "!bg-yellow-300",
                                "dark:bg-blue-500/60",
                                "backdrop-blur-xl",
                                "backdrop-yellow-300",
                                "hover:bg-yellow-300",
                                "dark:hover:bg-default/70",
                                "group-data-[focus=false]:bg-yellow-200/50",
                                "dark:group-data-[focus=false]:bg-default/60",
                                "!cursor-text",
                            ],
                        }}
                    />
                    <Textarea
                        labelPlacement="outside"
                        placeholder="Mensaje final" id="textFinal" color="warning"
                        className='form-group-item'
                        maxRows={2}
                        classNames={{
                            label: ["text-black/50 dark:text-white/90"],
                            input: ["bg-yellow-300", "text-black/90 dark:text-white/90"],
                            innerWrapper: "bg-yellow-300",
                            inputWrapper: [
                                "shadow-md",
                                "!bg-yellow-300",
                                "dark:bg-blue-500/60",
                                "backdrop-blur-xl",
                                "backdrop-yellow-300",
                                "hover:bg-yellow-300",
                                "dark:hover:bg-default/70",
                                "group-data-[focus=false]:bg-yellow-200/50",
                                "dark:group-data-[focus=false]:bg-default/60",
                                "!cursor-text",
                            ],
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className='form-group-item'>Los items deberán ser agregados en el grupo, sólo por el administrador</label>
                </div>
                <div style={{ margin: "20px", display: "flex", gap: "5px" }}>
                    <Button className="submitBtn font-semibold fs-5" type="submit">Crear</Button>
                    <Button as={Link} className="cancelarBtn font-semibold fs-5" href='/home'>Cancelar</Button>
                </div>
            </form>
        </Card>
    );
}
