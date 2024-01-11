'use client'

import { user, validateToken, validateTokenAPI } from '@/app/js/auth/token';
import Navbar from '../../components/Navbar'
import React, { useEffect, useState } from 'react'
import { Reticula, getMateriasPlanEstudio, getPlanEstudios } from '@/app/js/jefedivision/plan-estudios';
import { getPeriodo } from '@/app/js/jefedivision/periodo';

const Page = () => {

  const [usuario, setUsuario] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [planestudios, setPlanEstudios] = useState([])
  const [bandera, setBandera] = useState(false)

  const fetchNavbar = async () => {
    user(setUsuario)
    const { periodoActual } = await getPeriodo()
    setPeriodo(periodoActual ? periodoActual.year : '')
  }

  const fetchData = async () => await getPlanEstudios(setPlanEstudios)

  useEffect(() => {
    validateToken()
    validateTokenAPI()

    fetchNavbar()
    fetchData()
  }, [])

  const handleChangePeriodo = async (e) => {
    setBandera(false)
    if (e.target.value === '0') return

    await getMateriasPlanEstudio(e.target.value)
    setBandera(true)
  }

  return (
    <>
      <Navbar home="/jefedivision" periodo={periodo} usuario={usuario} />

      {/* <section className='container mt-5'>

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
      </section> */}

      {/* <hr className='mt-5' /> */}

      <section className='container'>
        <section className='mt-3 d-flex flex-column'>
          <div className='col-4'>
            <select className='form-select form-select-lg' aria-label=".form-select-lg example"
              name='plan-estudios' id='plan-estudios'
              onChange={handleChangePeriodo}>
              <option key={0} value={0}>--Seleccione Plan de Estudios--</option>
              {planestudios.map(plan => (
                <option key={plan.clave} value={plan.clave}>{plan.clave}</option>
              ))}
            </select>
          </div>
        </section>

        {bandera ? (
          <Reticula />
        ) : null}
      </section>
    </>
  )
}

export default Page