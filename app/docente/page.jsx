'use client'

import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { user, validateToken, validateTokenAPI } from '../js/auth/token'
import { getPeriodo } from '../js/jefedivision/periodo'
import { filterMaterias, getAllMaterias, getDocente, getMateriasDocente, getTipoEvidencias } from '../js/docentes/docentes'
import Link from 'next/link'

const page = () => {
    const [usuario, setUsuario] = useState('')
    const [periodo, setPeriodo] = useState('')
    const [materias, setMaterias] = useState([])
    const [evidencias, setEvidencias] = useState([])
    const [materiaActiva, setMateriaActiva] = useState(false)
    const inputRef = useRef(null)

    const fetchNavbar = async () => {
        user(setUsuario)
        const { periodoActual } = await getPeriodo()
        setPeriodo(periodoActual ? periodoActual.year : '')
    }

    const fetchData = async () => {
        await getAllMaterias()
        await getDocente()
        await getMateriasDocente()
        const { materiasSemestre } = filterMaterias()
        setMaterias(materiasSemestre)
        const { tipoEvidencias } = await getTipoEvidencias()
        setEvidencias(tipoEvidencias)
    }

    useEffect(() => {
        validateToken()
        validateTokenAPI()

        fetchNavbar()
        fetchData()
    }, [])


    const handleClickMateria = (materia) => {
        setMateriaActiva(prev => (prev === materia ? null : materia))
        // console.log(evidencias)
    }

    const handleClickEvidencia = (evidencia) => {
        inputRef.current.click()
        console.log(evidencia)
        console.log(materiaActiva)
        const name = usuario + '_' + evidencia.descripcion
        console.log(name)
    }

    const handleFileChange = event => {
        const file = event.target.files && event.target.files[0]
        if (!file) {
            return
        }
        console.log('File is', file)

        event.target.value = null
        console.log(event.target.value)

        console.log(file)
        console.log(file.name)
    }

    return (
        <>
            <Navbar home={"/docente"} periodo={periodo} usuario={usuario} />
            <section className='container mt-4'>
                <section className='row'>
                    {Object.entries(materias).map(([semestre, materiasSemestre]) => (
                        <section key={semestre}
                            className='col-md-6 mb-4'>
                            <h3>{`Materias impartidas en ${semestre} semestre`}</h3>
                            <div key={semestre} className='list-group pe-5 mb-4'>
                                {materiasSemestre.map(materia => (
                                    <div key={materia.clave}>
                                        <button key={materia.clave} className={`list-group-item list-group-item-action ${materia === materiaActiva ? 'active' : ''}`}
                                            onClick={() => handleClickMateria(materia)}>
                                            {materia.nombreMateria}
                                        </button>
                                        <div className='list-group'>
                                            {materiaActiva === materia && (
                                                evidencias.map(evidencia => (
                                                    <div key={evidencia.id}>
                                                        <input type="file"
                                                            style={{ display: 'none' }}
                                                            ref={inputRef}
                                                            accept='application/pdf'
                                                            onChange={handleFileChange} />
                                                        {/* <button key={evidencia.id}
                                                            className='list-group-item list-group-item-action text-start ps-5'
                                                            onClick={() => handleClickEvidencia(evidencia)}
                                                            >
                                                            {evidencia.descripcion}
                                                        </button> */}
                                                        <Link href={{
                                                            pathname: `/docente/evidencia`,
                                                            query: { name: evidencia.descripcion },
                                                        }}
                                                            className='list-group-item list-group-item-action text-start ps-5'
                                                        >
                                                            {evidencia.descripcion}
                                                        </Link>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </section>
            </section>
        </>
    )
}

export default page