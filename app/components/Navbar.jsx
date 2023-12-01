import React from 'react'

const Navbar = ({ home, periodo, usuario }) => {

    return (
        <>
            <nav className="navbar navbar-dark " style={{ "backgroundColor": "#6AA84F" }}>
                <div className="container-fluid d-flex align-items-center justify-context-between">
                    <a className="navbar-brand" href={home} >
                        <i className=' bi bi-house-fill fs-1 text-black'></i>
                    </a>
                    <div className="flex-grow-1 col-sm-8 text-center">
                        <h4>
                            Ingenieria en Sistemas Computacionales - Periodo {periodo}
                        </h4>
                    </div>
                    <h5 className='d-flex align-items-center justify-content-arround '>
                        {usuario} 
                        <i className='bi bi-person-circle fs-1 ps-2'></i>
                        </h5>
                </div>
            </nav>
        </>
    )
}

export default Navbar