const { default: axios } = require("axios");
const { default: Swal } = require("sweetalert2");
const { token } = require("./token");
const { default: apiConfig } = require("../config/apiConfig");

// const API="http://localhost:8080";
const API = apiConfig.apiUsuarios;

module.exports.login = (data) => {

    if (data.user.trim() === '' || data.password.trim() === '') {
        Swal.fire("Error!",
            "Ingrese credenciales validas!",
            "error")
        return
    }
    // console.log(data)


    axios.post(`${API}/auth/login`, {
        "usuario": data.user.trim(),
        "password": data.password.trim(),
        "rol" : "y"
    }).then(response => {
        // console.log("respuesta")
        // console.log(response)
        if(response.status === 200) {
            token(response.data.token)
        }

    }).catch((err) => {
        // console.log(err)
        if(err.response && err.response.status === 401){
            Swal.fire("Error!",
            `${err.response.data.mensaje}`,
            "error")
        }
        // console.log(err.response)
    })
}
