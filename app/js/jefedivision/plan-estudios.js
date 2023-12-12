const { Container, Grid, Paper } = require("@mui/material");
const { default: apiConfig } = require("../config/apiConfig");
const { getMateriasByPlanEstudios } = require("./materias");
const { default: Swal } = require("sweetalert2");

// const API = "http://localhost:8081"
const API = apiConfig.apiMaterias
const token = localStorage.getItem("token");

let materias = []

module.exports.getPlanEstudios = async (setPlanEstudios) => {
    try {
        const result = await fetch(`${API}/planestudios`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                const response = await result.json()
                setPlanEstudios(response)
            }
        }
    } catch (err) {
        console.error(err)
    }
}

module.exports.getPlanActualEstudios = async () => {
    try {
        const result = await fetch(`${API}/planestudios`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            const data = await result.json()
            const planActual = data[0].clave
            // console.log(planActual)
            return { planActual }
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.getMateriasPlanEstudio = async (clave) => {
    materias = []
    const { data } = await getMateriasByPlanEstudios(clave)
    materias = data
    console.log(materias)
}

module.exports.Reticula = () => {
    return (
        <Grid container spacing={2} className="mt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(semestre => (
                <Grid item key={semestre} xs={12} sm={6} md={4} lg={2}>
                    <div className="mb-4">
                        <h2 className="text-center">{semestre}</h2>
                    </div>
                    {materias.filter(materia => materia.semestre === semestre.toString())
                        .map(mat => (
                            <Paper
                                className="d-flex flex-column justify-content-center align-items-center"
                                key={mat.clave_materia}
                                elevation={3}
                                style={{
                                    backgroundColor: mat.clasificacionCACEI.color,
                                    padding: '10px',
                                    marginBottom: '10px',
                                    width: '100%',
                                    height: '140px',
                                    border: '1px solid',
                                }}>
                                <h6 className="text-center">{mat.nombre_materia}</h6>
                                <h6>{mat.ht} {mat.hp} {mat.cr}</h6>
                                <h6>{mat.clave_materia}</h6>
                            </Paper>
                        ))}
                </Grid>
            ))}
        </Grid>
    )
}

module.exports.askPlanEstudios = async (plan) => {
    const result = await Swal.fire({
        icon: 'question',
        title: 'El Plan de Estudios sigue siendo el mismo?',
        confirmButtonText: "Sí",
        confirmButtonColor: '#2979FF',
        showDenyButton: true,
        denyButtonText: "Cambiar",
        denyButtonColor: '#41c300',
        showCancelButton: true,
    })
    if (result.isConfirmed) {
        // console.log(result.value)
        // console.log(plan)
        return plan
    } else if (result.isDenied) {
        // console.log(result.value)
        const { value: newPlan } = await Swal.fire({
            title: 'Ingrese el nuevo plan de estudios',
            input: 'text',
            inputPlaceholder: 'ISIC-2010-102',
            showCancelButton: true,
            confirmButtonText: 'Ok',
            inputAutoTrim: true,
            inputAttributes: {
                maxLength: "15",
            },
            preConfirm: (inputValue) => {
                return inputValue.toUpperCase()
            }
        })
        if (newPlan) {
            // console.log(newPlan)
            return newPlan
        } else {
            await Swal.fire({
                icon: 'info',
                title: 'Plan No valido',
            })
        }
    }
    return false
}

module.exports.deletePlanEstudio = async (plan) => {
    try {
        const result = await fetch(`${API}/planestudios/${plan}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                console.log('OK')
            }
        }
    } catch (err) {
        console.error(err)
    }
}

module.exports.createPlanEstudio = async (plan) => {
    // console.log(plan)
    const obj = {
        clave: plan,
        status: 'y'
    }
    // console.log(obj)
    try {
        const result = await fetch(`${API}/planestudios`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        })
        if (result.ok) {
            if (result.status === 201) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Plan de estudios creado!'
                })
            } else {
                const mensaje = await result.json()
                Swal.fire({
                    icon: 'info',
                    title: mensaje.mensaje
                })
                return false
            }
        }
    } catch (e) {
        console.error(e)
    }
    return true
}