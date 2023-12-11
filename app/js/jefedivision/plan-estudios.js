const { Container, Grid, Paper } = require("@mui/material");
const { default: apiConfig } = require("../config/apiConfig");
const { getMateriasByPlanEstudios } = require("./materias");

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
}

module.exports.getMateriasPlanEstudio = async (clave) => {
    materias = []
    const { data } = await getMateriasByPlanEstudios(clave)
    materias = data
    console.log(materias)
}

// module.exports.getClasificacion = async () => {
//     competencias = []
//     const { competencia } = await getClasificacion()
//     competencias = competencia
//     console.log(competencias)
// }

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