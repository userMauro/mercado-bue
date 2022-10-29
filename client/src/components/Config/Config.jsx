import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import "../../styles/Config/Config.css"
import { signOut } from '../../redux/user.slice'


export default function Config () {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const username = useSelector(state => state.userReducer.username)
    
    const logOut = () => {
        if (window.confirm('Confirma para desloguear')) {
            try {
                localStorage.removeItem('logCredentials'); 
                dispatch(signOut())
                navigate('/auth/login')
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className="Config">

            <h1>{username}</h1>

            <ul>
                <Link className="config-item" to="/profile"><li>Perfil</li></Link>
                <Link className="config-item" to="/config"><li>Opcion 2</li></Link>
                <Link className="config-item" to="/config"><li>Opcion 3</li></Link>
                <li onClick={() => logOut()}>Desloguear</li>
            </ul>
        </div>
    )
}