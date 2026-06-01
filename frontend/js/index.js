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