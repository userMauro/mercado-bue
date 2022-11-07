import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

// utils
import endpointURL from "../../utils/endpointURL"
import NotFound from '../NotFound/NotFound'
import Loader from '../Loader/Loader'
import { regex } from '../../utils/regex'


export default function ConfirmEmail () {
    const navigate = useNavigate()
    const { action } = useParams()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState(1)
    const [codes, setCodes] = useState({1: '', 2: '', 3: '', 4: '', 5: '', 6: ''})

    const [credentials, setCredentials] = useState({
        email: '',
        token: '',
        username: '',
        password: '',
        password2: ''
    })

    if (isLoading === true) return (
        <Loader />
    )

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const checkEmail = async() => {
        if (!regex(credentials.email, "email")) return setError('Email inválido')

        setIsLoading(true)

        try {
            const {data } = await axios.get(`${endpointURL}/auth/${action}/${credentials.email}`)
            setCredentials({
                ...credentials,
                token: data.msg,
            })
            setIsLoading(false)
            setError('')
            setStep(2)
        } catch (error) {
            setIsLoading(false)
            setError(error.response.data.msg)
        } 
    }

    let code;
    const handleCode = (e) => {
        const id = e.target.id[4].toString()
        const eValue = (e.target.value).toUpperCase().replace(/[^A-Z0-9]/,'')

        if (id >= 1 && id <= 6 ) {
            setCodes({
                ...codes,
                [id]: eValue
            })

            if (Number(id) !== 6) {
                document.getElementById(`code${Number(id) + 1}`).focus()
            } else {
                code = codes[1] + codes[2] + codes[3] + codes[4] + codes[5] + eValue

                // si están los 6 dígitos del code, lo envío al back
                if (code.length === 6) return checkCode(e)
            }
        }
    }

    const checkCode = async() => {
        setIsLoading(true)

        try {
            const { email, token } = credentials
            await axios.post(`${endpointURL}/auth/confirm/code`, {email, code, token})
            setIsLoading(false)
            setError('')
            setStep(3)
        } catch (error) {
            setIsLoading(false)
            setCodes({1: '', 2: '', 3: '', 4: '', 5: '', 6: ''})
            setError('Expired or invalid token')  
        }
    }

    const createAccount = async() => {
        if (!regex(credentials.username, "username")) return setError('Username inválido')

        setIsLoading(true)

        try {
            const { username, password, email } = credentials // hashear password en front o back? como se resuelve?
            await axios.post(`${endpointURL}/auth/register/create`, {username, password, email})
            setIsLoading(false)
            setError('')
            setStep(4)
        } catch (error) {
            setIsLoading(false)
            setError(error.response.data.msg)  
        }
    }

    const changePass = async() => {
        const { password, password2, email } = credentials

        if (password === '') return setError('Ingresa una contraseña nueva')
        if (password !== password2) return setError('Las contraseñas no coinciden')

        setIsLoading(true)

        try {
            await axios.put(`${endpointURL}/auth/resetPass/confirm`, {password, email})
            setIsLoading(false)
            setError('')
            setStep(4)
        } catch (error) {
            setIsLoading(false)
            setError(error.response.data.msg)  
        }
    }

    const toAuth = () => {
        setCredentials('')
        navigate('/auth/login')
    }

    // step 0: not fount 404
    if (action !== "register" && action !== "resetPass") return <NotFound />

    // step 1: confirmar email
    if (step === 1) return (
        <div class="flex flex-col w-screen h-screen justify-center items-center bg-yellow-400">
            <div class="flex flex-col w-2/5 h-4/6 justify-center rounded-md shadow-xl bg-white">
                <h1 class="text-5xl font-semibold text-yellow-400">Enviar código</h1>
                <h2 class="text-2xl font-extralight mb-10 text-gray-400">Ingresa tu email</h2>
                <input required 
                    class="pt-2 pb-2 w-full text-center outline-none rounded-md text-gray-400 bg-gray-100"
                    placeholder="ejemplo@mercadobue.com.ar" 
                    type="email" 
                    name="email" 
                    value={credentials.email} 
                    onChange={handleChange} 
                    spellCheck="false" 
                />
                <span id="error" class="text-sm text-red-500">{error}</span>
                <div class="flex flex-row justify-center mt-7 gap-4">
                    <button 
                        class="w-40 h-14 mb-2 text-lg text-shadow rounded-md text-white drop-shadow-md bg-yellow-400" 
                        type="submit" 
                        onClick={(e) => checkEmail(e)}> CONFIRMAR
                    </button>
                    <Link to="/auth/login">
                        <button class="w-40 h-14 mb-2 text-lg text-shadow rounded-md text-white drop-shadow-md bg-yellow-400" >
                            CANCELAR
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )

    // step 2: confirmar code
    if (step === 2) return (
        <div class="flex flex-col w-screen h-screen justify-center items-center bg-yellow-400">
            <div class="flex flex-col w-2/5 h-4/6 justify-center rounded-md shadow-xl bg-white">
                <h1 class="text-5xl font-semibold text-yellow-400">Revisa tu email</h1>
                <h2 class="text-2xl font-extralight mb-10 text-gray-400">Ingrese el código</h2>
                <div class="flex flex-row justify-center gap-4 mb-4">
                    <input class="w-11 h-12 text-2xl text-center rounded-md outline-none text-gray-400 border-gray-400 bg-gray-100" type="text" id="code1" value={codes[1]} onChange={handleCode} maxLength="1" autoFocus />
                    <input class="w-11 h-12 text-2xl text-center rounded-md outline-none text-gray-400 border-gray-400 bg-gray-100" type="text" id="code2" value={codes[2]} onChange={handleCode} maxLength="1" />
                    <input class="w-11 h-12 text-2xl text-center rounded-md outline-none text-gray-400 border-gray-400 bg-gray-100" type="text" id="code3" value={codes[3]} onChange={handleCode} maxLength="1" />
                    <input class="w-11 h-12 text-2xl text-center rounded-md outline-none text-gray-400 border-gray-400 bg-gray-100" type="text" id="code4" value={codes[4]} onChange={handleCode} maxLength="1" />
                    <input class="w-11 h-12 text-2xl text-center rounded-md outline-none text-gray-400 border-gray-400 bg-gray-100" type="text" id="code5" value={codes[5]} onChange={handleCode} maxLength="1" />
                    <input class="w-11 h-12 text-2xl text-center rounded-md outline-none text-gray-400 border-gray-400 bg-gray-100" type="text" id="code6" value={codes[6]} onChange={handleCode} maxLength="1" />
                </div>
                <span id="error" class="text-sm text-red-500 mb-4">{error}</span>
                <Link to="/auth/login">
                    <button class="w-40 h-14 mb-2 text-lg text-shadow rounded-md text-white drop-shadow-md bg-yellow-400">
                        CANCELAR
                    </button>
                </Link>

            </div>
        </div>
    )  

    // step 3: crear cuenta con username y pass / crear contraseña nueva
    if (step === 3) {
        if (action === "register") return (
            <div class="flex flex-col w-screen h-screen justify-center items-center bg-yellow-400">
                <div class="flex flex-col w-2/5 h-4/6 justify-center rounded-md shadow-xl bg-white">
                    <h1 class="text-4xl font-semibold text-yellow-400">{credentials.email}</h1>
                    <h2 class="text-2xl font-extralight mb-5 text-gray-400">Crea tu cuenta</h2>
                    <input required 
                        class="pt-2 pb-2 mb-2 w-full text-center outline-none rounded-md text-gray-400 bg-gray-100"
                        placeholder="Nombre de usuario" 
                        type="text" 
                        name="username" 
                        value={credentials.username} 
                        onChange={handleChange} 
                    />
                    <input required 
                        class="pt-2 pb-2 mb-2 w-full text-center outline-none rounded-md text-gray-400 bg-gray-100"
                        placeholder="Contraseña" 
                        type="password" 
                        name="password" 
                        value={credentials.password} 
                        onChange={handleChange} 
                    />
                    <input required 
                        class="pt-2 pb-2 mb-2 w-full text-center outline-none rounded-md text-gray-400 bg-gray-100"
                        placeholder="Repetir contraseña" 
                        type="password" 
                        name="password2" 
                        value={credentials.password2} 
                        onChange={handleChange} 
                    />
                    <span id="error" class="text-sm text-red-500 mb-4">{error}</span>
                    <div class="flex flex-row justify-center mt-7 gap-4">
                        <button 
                            class="w-40 h-14 mb-2 text-lg text-shadow rounded-md text-white drop-shadow-md bg-yellow-400" 
                            type="submit" 
                            onClick={createAccount}> CONFIRMAR
                        </button>
                        <Link to="/auth/login">
                            <button class="w-40 h-14 mb-2 text-lg text-shadow rounded-md text-white drop-shadow-md bg-yellow-400" >
                                CANCELAR
                            </button>
                        </Link>
                    </div>
                </div>
            </div>   
        )

        if (action === "resetPass") return (
            <div class="flex flex-col w-screen h-screen justify-center items-center bg-yellow-400">
                <div class="flex flex-col w-2/5 h-4/6 justify-center rounded-md shadow-xl bg-white">
                    <h1 class="text-4xl font-semibold text-yellow-400">{credentials.email}</h1>
                    <h2 class="text-2xl font-extralight mb-10 text-gray-400">Ingrese la nueva contraseña</h2>
                    <input required 
                        class="pt-2 pb-2 mb-2 w-full text-center outline-none rounded-md text-gray-400 bg-gray-100"
                        placeholder="Nueva contraseña" 
                        type="password" 
                        name="password" 
                        value={credentials.password} 
                        onChange={handleChange} 
                    />
                    <input required 
                        class="pt-2 pb-2 w-full text-center outline-none rounded-md text-gray-400 bg-gray-100"
                        placeholder="Repetir nueva contraseña" 
                        type="password" 
                        name="password2" 
                        value={credentials.password2} 
                        onChange={handleChange} 
                    />
                    <span id="error" class="text-sm text-red-500 mb-4">{error}</span>
                    <div class="flex flex-row justify-center mt-7 gap-4">
                        <button 
                            class="w-40 h-14 mb-2 text-lg text-shadow rounded-md text-white drop-shadow-md bg-yellow-400" 
                            type="submit" 
                            onClick={changePass}> CONFIRMAR
                        </button>
                        <Link to="/auth/login">
                            <button class="w-40 h-14 mb-2 text-lg text-shadow rounded-md text-white drop-shadow-md bg-yellow-400" >
                                CANCELAR
                            </button>
                        </Link>
                    </div>
                </div>
            </div> 
        )
    }

    // step 4: mensaje final
    if (step === 4) return (
        <div class="flex flex-col w-screen h-screen justify-center items-center bg-yellow-400">
            <div class="flex flex-col w-2/5 h-4/6 justify-center items-center rounded-md shadow-xl bg-white">
                <h1 class="text-4xl font-semibold text-yellow-400">{credentials.email}</h1>
                {(action === "register") && (<h2 class="text-2xl font-extralight mb-10 text-gray-400">¡Cuenta creada con éxito!</h2>)} 
                {(action === "resetPass") && (<h2 class="text-2xl font-extralight mb-10 text-gray-400">¡Contraseña modificada con éxito!</h2>)} 
                <button class="w-40 h-14 mb-2 text-lg text-shadow rounded-md text-white drop-shadow-md bg-yellow-400" type="submit" onClick={toAuth}>
                    REGRESAR
                </button>
            </div>
        </div>  
    )
}