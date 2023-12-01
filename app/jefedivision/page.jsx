'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { getPeriodo } from '../js/jefedivision/periodo';
import { user, validateToken, validateTokenAPI } from '../js/auth/token';
import Link from 'next/link';
import { getPlanActualEstudios } from '../js/jefedivision/plan-estudios';

const HomeJF = () => {

  const [periodo, setPeriodo] = useState("");
  // const [periodos, setPeriodos] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [plan, setPlan] = useState("");
  const [active, setActive] = useState(false);

  const fetchNavbar = async () => {
    const { periodoActual } = await getPeriodo()
    setPeriodo(periodoActual)

    user(setUsuario)
  }

  const fetchData = async () => {
    validateToken()
    await validateTokenAPI()

    const { planActual } = await getPlanActualEstudios()
    setPlan(planActual)

    if (planActual) {
      setActive(true)
    }

    // variables("periodo", periodoActual)
    // variables("plan", planActual)
  }
  useEffect(() => {
    fetchNavbar()
    fetchData()

  }, [setPeriodo, setUsuario])

  // const handlePeriodo = (e) => {
  //   setPeriodo(e.target.value)
  //   variables("periodo", e.target.value)
  // }

  return (
    <>
      <Navbar home="/jefedivision" periodo={periodo ? periodo.year : ''} usuario={usuario} />

      <section className='col-md-12 p-5 d-flex flex-md-row flex-column align-items-center justify-content-evenly'>
        <h3>Plan de Estudios Actual: {plan}</h3>
        {/* <select name="" id="" className='fs-4' onChange={handlePeriodo}>
          {periodos.map((p, index) => {
            return (<option key={index} value={p.year}>{p.year}</option>)
          })}
        </select> */}
        <button className='btn text-dark fs-4'>Crear Nuevo Periodo <i className='bi bi-plus-circle-fill fs-4'></i></button>
      </section>


      <section className='container-fluid mt-2'>
          <section className='mt-3 row row-cols-1 row-cols-md-3 g-4 justify-content-around align-items-center'>
            <Link href={"/jefedivision/plan-de-estudios"}
              className='col-md-3 fs-3 btn text-secondary mb-3 mx-2'>
              <i className='bi bi-tencent-qq'></i>Plan de Estudios
            </Link>
            <Link href={"/jefedivision/marco-referencia"}
              className='col-md-3 fs-3 btn text-secondary mb-3 mx-2'>
              <i className='bi bi-card-list'></i>Marco Referencial
            </Link>
            <Link href={"/jefedivision/cacei"}
              className='col-md-3 fs-3 btn btn-outline-info text-primary mb-3 mx-2'>
              <i className='bi bi-file-earmark-pdf-fill'></i>Comp/Clasificac
            </Link>
            <Link href={"jefedivision/docentes"}
              className='col-md-3 fs-3 btn btn-outline-info text-primary mb-3 mx-2'>
              <i className='bi bi-pc-display'></i>Docentes
            </Link>
            <Link href={"/jefedivision/evidencias"}
              className='col-md-3 fs-3 btn btn-outline-info text-primary mb-3 mx-2'>
              <i className='bi bi-file-earmark-richtext-fill'></i>Evidencias
            </Link>
            <Link href={active ? "/jefedivision/materias" : ""}
              className='col-md-3 fs-3 btn btn-outline-info text-primary mb-3 mx-2'>
              <i className='bi bi-journal'></i>Materias
            </Link>
            <Link href={"/jefedivision/especialidad"}
              className='col-md-3 fs-3 btn btn-outline-info text-primary mb-3 mx-2'>
              <i className='bi bi-tencent-qq'></i>Especialidad
            </Link>
            <Link href={"/jefedivision/usuarios"}
              className='col-md-3 fs-3 btn btn-outline-info text-primary mb-3 mx-2'>
              <i className='bi bi-person-fill'></i>Usuarios
            </Link>
            <Link href={"/jefedivision"}
              className='col-md-3 fs-3 btn text-secondary mb-3 mx-2'>
              <i className='bi bi-person-wheelchair'></i>Avance
            </Link>
        </section>
      </section>

    </>
  )
}

export default HomeJF