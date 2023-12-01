const { default: axios } = require("axios");
const { jwtDecode } = require("jwt-decode");
const { default: apiConfig } = require("../config/apiConfig");

// const API = "http://localhost:8081"
const API = apiConfig.apiMaterias
const token = localStorage.hasOwnProperty("token") ? localStorage.getItem("token") : "none";
const config = {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}

module.exports.token = (token) => {
    // var token = response.data.token

    // console.log(token)
    localStorage.setItem("token", token)
    var decodedToken = jwtDecode(token)
    // console.log(decodedToken)
    if (decodedToken.role[0].authority === "ROLE_ADMINISTRADOR") {
        // console.log("Administrador")
        window.location = "/jefedivision"
    } else {
        window.location = "/docente"
    }
    // localStorage.setItem("token", response.data.token)
}

module.exports.user = (setUser) => {
    var decodedToken = jwtDecode(localStorage.getItem("token"))
    setUser(decodedToken.sub)
}

module.exports.validateToken = () => {
    if (token.includes("none")) {
        window.location = "/"
    }
}

module.exports.validateTokenAPI = async() => {
    await axios.get(`${API}/periodo/validate-token`, config).then(result => {
        // console.log(result)
    }).catch(err => {
        if (err.response.status === 401) {
            localStorage.removeItem("token")
            window.location = "/"
            // console.log(err.response)
            // console.log('ass')
        }
    });
}