'use client'

import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { user, validateToken, validateTokenAPI } from '../js/auth/token'
import { filterMaterias, getAllMaterias, getDocente, getMateriasDocente, getPeriodoAct, getPlanActual, getTipoEvidencias } from '../js/docentes/docentes'
import Link from 'next/link'

const page = () => {
    const [usuario, setUsuario] = useState('')
    const [periodo, setPeriodo] = useState('')
    const [materias, setMaterias] = useState({})
    const [evidencias, setEvidencias] = useState([])
    const [materiaActiva, setMateriaActiva] = useState(false)
    
    const fetchNavbar = async () => {
        user(setUsuario)
        const { periodoActual } = await getPeriodoAct()
        setPeriodo(periodoActual ? periodoActual : '')
    }

    const fetchData = async () => {
        await getPlanActual()
        await getAllMaterias()
        await getDocente()
        await getMateriasDocente(periodo)
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

    return (
        <>
            <Navbar home={"/docente"} periodo={periodo.year} usuario={usuario} />
            <section className='container mt-4'>
                {Object.keys(materias).length > 0 ? (
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
                                                            <Link href={{
                                                                pathname: `/docente/evidencia`,
                                                                query: { name: evidencia.descripcion, mat: materiaActiva.clave },
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
                ) : (
                    <h4 className='text-center'>No hay materias asignadas</h4>
                )}
            </section>
        </>
    )
}

export default page