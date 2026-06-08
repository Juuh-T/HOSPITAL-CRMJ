   
   function mostrarSenha() {
        let senha = document.getElementById("senha");
        let icone = document.getElementById("iconeOlho");

        if (senha.type === "password") {
            senha.type = "text";
            icone.classList.remove("bi-eye-slash");
            icone.classList.add("bi-eye");
        } else {
            senha.type = "password";
            icone.classList.remove("bi-eye");
            icone.classList.add("bi-eye-slash");
        }
    }

    // Funcao do login do max
    function js_fazerLogin() 
    {
        let usuario = document.getElementById("usuario").value
        let senha = document.getElementById("senha").value

        if ( senha === "" || usuario === "")
        {
            alert("Digite seu login.")
            return
        }
        
        if ( senha === "123" && usuario === "pedrao" ) //passou no teste
        {
            localStorage.setItem("usuarioPermitido", "sim")
            localStorage.setItem("usuarioAtual", usuario)

            window.location.href = "paciente.html"
        }
        else 
        {
            alert('login invalido')
        }
    }


    