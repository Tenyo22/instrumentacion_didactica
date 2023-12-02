const { default: Swal } = require("sweetalert2");
const { token } = require("./token");
const { default: apiConfig } = require("../config/apiConfig");

// const API="http://localhost:8080";
const API = apiConfig.apiUsuarios;

module.exports.login = async (data) => {

    if (data.user.trim() === '' || data.password.trim() === '') {
        await Swal.fire("Error!",
            "Ingrese credenciales validas!",
            "error")
        return
    }
    // console.log(data)

    const request = {
        "usuario": data.user.trim(),
        "password": data.password.trim(),
        "rol": "y"
    }

    try {
        const result = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        })

        const res = await result.json()
        if (result.ok) {
            if (result.status === 200) {
                // console.log(token)
                token(res.token)
            }
        } else {
            await Swal.fire({
                icon: "error",
                title: res.mensaje,
            })
        }
    } catch (e) {
        console.error(e)
    }
}
