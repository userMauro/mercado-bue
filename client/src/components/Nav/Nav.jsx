import React from 'react'
import { Link } from 'react-router-dom';

import "../../styles/Nav/Nav.css"
import imgSettings from "../../assets/config.png"

export default function Nav () {

    return (
        <div className="Nav">
            <ul>
                <input type="text" placeholder='Buscar productos, marcas y más...' />
                <Link id="link" to="/"><li>Comprar</li></Link>
                <Link id="link" to="/sell"><li>Vender</li></Link>
                <Link id="link" to="/favorites"><li>Favoritos</li></Link>
                <Link to="/settings"><li><img src={imgSettings} alt ="settings" /></li></Link>
            </ul>
        </div>
    );
};