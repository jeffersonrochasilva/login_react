import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebaseConection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPasswor] = useState("");

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    if (email !== "" && password !== "") {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate("/admin", { replace: true });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      alert("Preencha todos os campos");
    }
  }

  return (
    <div className="home-container">
      <h1>Cadastre-se</h1>
      <span>Vamos criar sua conta!</span>

      <form className="form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="*******"
          value={password}
          onChange={(e) => setPasswor(e.target.value)}
        />

        <button type="submit">Cadastrar</button>
      </form>

      <Link className="button-link" to="/">
        Já possue uma conta? Faça o login.
      </Link>
    </div>
  );
}

export default Register;
