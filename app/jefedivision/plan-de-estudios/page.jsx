'use client'

import { validateToken, validateTokenAPI } from '@/app/js/auth/token';
import Navbar from '../../components/Navbar'
import React, { useEffect, useState } from 'react'
import { getPlanEstudios } from '@/app/js/jefedivision/plan-estudios';

const page = () => {

  const [planestudios, setPlanEstudios] = useState([
    // { "plan_estudios": "2020" },
    // { "plan_estudios": "2020" },
    // { "plan_estudios": "2020" },
    // { "plan_estudios": "2020" },
    // { "plan_estudios": "2020" },
    // { "plan_estudios": "2020" },
    // { "plan_estudios": "2020" },
    // { "plan_estudios": "2020" }
  ])

  const fetchData = async () => await getPlanEstudios(setPlanEstudios)

  useEffect(() => {
    validateToken()
    validateTokenAPI()
    // getPeriodo(setPeriodos, setPeriodo)
    // user(setUsuario)
    // getPlanEstudios(setPlanEstudios)
    fetchData()
  }, [])

  return (
    <>
      <Navbar home="/jefedivision" periodo={"periodo"} usuario={"usuario"} />

      <section className='container mt-5'>

        <form className='row justify-content-between'>
          <div className='col-8'>
            <div className="input-group">
              <span className="input-group-text" id="inputGroup-sizing-default">Plan de Estudios:</span>
              <input type="text" className="form-control" placeholder='ISIC-2010-224' aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
            </div>
          </div>

          <button type='submit' className='btn btn-info col-3'>
            <i className='bi bi-plus-circle-fill'></i> Agregar
          </button>
        </form>
      </section>

      <hr className='mt-5' />

      <section className='container'>
        <section className='mt-5 d-flex flex-column'>
          <div className='col-4'>
            <select className='form-select form-select-lg' aria-label=".form-select-lg example"
              name='plan-estudios' id='plan-estudios'>
              <option key={0} value={0}>--Seleccione Plan de Estudios--</option>
              {planestudios.map((plan, index) => (
                <option key={index} value={plan.clave}>{plan.clave}</option>
              ))}
            </select>
          </div>

        </section>

      </section>
    </>
  )
}

export default page