import React from 'react'
import { useParams } from 'react-router-dom'
// import axios from 'axios'

// import URL from "../../URL"
// import { validate } from '../../utils/validate'

export default function ConfirmEmail () {
    const { token } = useParams()
    // console.log(token)

    return (
        <div>
            Bien: {token}
        </div>
    )
}