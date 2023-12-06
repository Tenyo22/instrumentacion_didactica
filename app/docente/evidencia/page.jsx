'use client'

import Navbar from '@/app/components/Navbar'
import { user, validateToken, validateTokenAPI } from '@/app/js/auth/token'
import { validatePDF } from '@/app/js/docentes/evidencia'
import { getPeriodo } from '@/app/js/jefedivision/periodo'
import { Button, styled } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {

    const [usuario, setUsuario] = useState('')
    const [periodo, setPeriodo] = useState('')
    const [files, setFiles] = useState([])

    const evidencia = useSearchParams().get('name')
    // console.log(evidencia.get('name'))

    const fetchNavbar = async () => {
        user(setUsuario)
        const { periodoActual } = await getPeriodo()
        setPeriodo(periodoActual ? periodoActual.year : '')
    }

    useEffect(() => {
        validateToken()
        validateTokenAPI()

        fetchNavbar()
    }, [])

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handleFileChange = event => {
        const file = event.target.files && event.target.files[0]
        if (!file) return
        console.log('Files is', file)

        const bandera = validatePDF(file)
        if(!bandera) return

        event.target.value = null
        setFiles([...files, file])

        console.log(event.target.value)
        console.log(file)
        console.log(file.name)
    }

    const handleDeleteFile = index => {
        const updateFile = [...files]
        updateFile.splice(index, 1)
        setFiles(updateFile)
    }

    const handleViewFile = file => {
        const fileURL = URL.createObjectURL(file)
        window.open(fileURL, '_blank')
    }

    const handleSendFiles = () => {
        console.log(files)
    }

    return (
        <>
            <Navbar home={"/docente"} usuario={usuario} periodo={periodo} />
            <section className='container mt-4 d-flex flex-column align-items-center'>
                <section className='text-center'>
                    <h1>{evidencia}</h1>
                    <Button component='label' variant='contained' className='fs-4'>
                        <i className='bi bi-cloud-arrow-up-fill me-2'></i>
                        Upload File
                        <VisuallyHiddenInput type='file' accept='.pdf' onChange={handleFileChange} />
                    </Button>
                </section>
                <section className='mt-4' style={{overflowX:'auto'}}>
                    {files.length > 0 ? (
                        <section className='d-flex flex-column align-items-center'>
                            <div className='table-responsive'>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th>Ver</th>
                                            <th>Nombre de archivo</th>
                                            <th>Tamaño</th>
                                            <th>Quitar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {files.map((file, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <button className='btn btn-info' onClick={() => handleViewFile(file)}>
                                                        <i className='bi bi-file-earmark-pdf-fill'></i>
                                                    </button>
                                                </td>
                                                <td>{file.name}</td>
                                                <td>{file.size}</td>
                                                <td>
                                                    <button className='btn btn-danger' onClick={() => handleDeleteFile(index)}>
                                                        <i className='bi bi-trash3-fill'></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button className='btn btn-success mt-3'
                                onClick={handleSendFiles}>
                                <i className='bi bi-send-fill'></i>Enviar
                            </button>
                        </section>
                    ) : (
                        null
                    )}
                </section>
            </section>
        </>
    )
}

export default page