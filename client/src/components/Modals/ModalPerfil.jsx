import React from "react"
import { useState } from "react"

export default function ModalPerfil () {
    const [visible, setVisible] = useState(true)

    const onOffModal = () => {
        setVisible(!visible)
    }

    return (
        <div visible={visible} class="none fixed h-full w-full z-10 shadow-md bg-gray-700">
            <div class="flex flex-col justify-center items-center rounded-md shadow-md bg-white">
                Modal
                <button onClick={onOffModal}>Cancel</button>
            </div>
        </div>
    )
}