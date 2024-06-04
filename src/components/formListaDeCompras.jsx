import ImageContainer from '../components/groupsForms/ImageContainer'
import { Button, Card, Input, Link, Select, SelectItem,  } from '@nextui-org/react';
import '../styles/global.css'
import '../styles/formGroups.css'

export default function FormListaDeCompras(props) {
    return (
        <Card className='p-4'>
            <form id="crearShopListForm">
                <ImageContainer rightImageSrc='/public/images/listaDeCompras.png'/>

                <div className="form-group flex-row">
                    <div className="form-group-item item-nombre-grupo">
                        <label htmlFor="nombreGrupo">Nombre del grupo:</label>
                        <input type="text" id="nombreGrupo" name="nombreGrupo" className="input-field" />
                    </div>
                </div>

                <div style={{margin: "20px"}}>
                    <Button className="submitBtn font-semibold fs-5" type="submit">Crear</Button>
                    <Button style={{marginLeft: '10px'}} as={Link} className="cancelarBtn font-semibold fs-5" href='/home'>Cancelar</Button>
                </div>
            </form>
        </Card>
    )
}
