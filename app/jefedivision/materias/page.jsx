'use client'

import Navbar from '@/app/components/Navbar'
import React, { useEffect, useState } from 'react'
import { TablaMaterias, getClasificacionMaterias, getMaterias, insertMateria, validateData } from '@/app/js/jefedivision/materias'
import { user, validateToken, validateTokenAPI } from '@/app/js/auth/token'
import { getPlanActualEstudios } from '@/app/js/jefedivision/plan-estudios'
import { getPeriodo } from '@/app/js/jefedivision/periodo'

const materias = () => {

    const [usuario, setUsuario] = useState('')
    const [plan, setPlan] = useState('')
    const [periodo, setPeriodo] = useState('')
    const [competencia, setCompetencia] = useState([])
    const [formulario, setFormulario] = useState({
        materia: '',
        clave: '',
        ht: 0,
        hp: 0,
        semestre: 0,
        competencia: "0"
    })
    const [completed, setCompleted] = useState(false)
    const rowsPerPageOptions = [5, 10, 25]
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchText, setSearchText] = useState('')

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0)
    };

    const handleSearch = (event) => {
        setSearchText(event.target.value.toUpperCase())
        setPage(0)
    }

    const fetchData = async () => {
        setCompleted(false)
        await getMaterias()
        setCompleted(true)
    }

    useEffect(() => {
        const fetch = async() => {

            validateToken()
            validateTokenAPI()
            
            getClasificacionMaterias(setCompetencia)
            
            user(setUsuario)
            const { periodoActual } = await getPeriodo()
            const { planActual } = await getPlanActualEstudios()

            setPeriodo(periodoActual)
            setPlan(planActual)
   
            // getVariable("periodo", setPeriodo)
        }

        fetchData()
        fetch()
    }, [setCompetencia])

    const handleChange = (e) => {
        // console.log(e.target)
        const { name, value, type } = e.target
        // console.log(name, value, type)

        setFormulario((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) : value.trimStart().toUpperCase(),
        }))
    }

    const clean = () => {
        setFormulario({
            materia: '',
            clave: '',
            ht: 0,
            hp: 0,
            semestre: 0,
            competencia: "0"
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (validateData(formulario)) {
            insertMateria(formulario, plan, fetchData, clean)
        }
        // console.log(formulario)
        // console.log(e.target[0])
    }

    return (
        <>
            <Navbar home={"/jefedivision"} periodo={periodo ? periodo.year : ''} usuario={usuario} />

            <section className='container mt-5'>
                <form onSubmit={handleSubmit}>

                    <div className='d-flex justify-content-evenly mb-4'>
                        <div className="col-8">
                            <div className="input-group input-group-lg">
                                <span className="input-group-text" id="inputGroup-sizing-lg">Materia</span>
                                <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                                    name="materia" value={formulario.materia} onChange={handleChange} maxLength={150} required />
                            </div>
                        </div>
                        <div className="col-3">
                            <div>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text" id="inputGroup-sizing-lg">Clave</span>
                                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                                        name='clave' value={formulario.clave} onChange={handleChange} maxLength={12} required />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='d-flex justify-content-evenly mb-4'>
                        <div className="col-3">
                            <div className="input-group input-group-lg">
                                <span className="input-group-text" id="inputGroup-sizing-lg">Horas Teoricas:</span>
                                <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                                    name='ht' value={formulario.ht} onChange={handleChange} min={0} max={4} required />
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="input-group input-group-lg">
                                <span className="input-group-text" id="inputGroup-sizing-lg">Horas Practica:</span>
                                <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                                    name='hp' value={formulario.hp} onChange={handleChange} min={0} max={4} required />
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="input-group input-group-lg">
                                <span className="input-group-text" id="inputGroup-sizing-lg">Semestre:</span>
                                <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                                    name='semestre' value={formulario.semestre} onChange={handleChange} min={1} max={9} required />
                            </div>
                        </div>
                    </div>


                    <div className='d-flex justify-content-evenly'>
                        <div className='col-6'>
                            <select className='form-select form-select-lg' aria-label='.form-select-lg example'
                                name='competencia' value={formulario.competencia} onChange={handleChange} required>
                                <option key={0} value="0">-- Categoría --</option>
                                {competencia.map((compe) => (
                                    <option key={compe.id} value={compe.id}>{compe.descripcion}</option>
                                ))}
                            </select>
                        </div>

                        <button type='submit' className='btn btn-primary col-2'>
                            <i className='bi bi-plus-circle'></i> Agregar materia
                        </button>
                    </div>
                </form>

                <hr className='mt-5 mb-5' />

                {completed ? (
                    <TablaMaterias rowsPerPageOptions={rowsPerPageOptions} rowsPerPage={rowsPerPage} page={page} searchText={searchText} handleSearch={handleSearch} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} />
                    // <div></div>
                ) : (
                    <div></div>
                )}
            </section>
        </>
    )
}

export default materias