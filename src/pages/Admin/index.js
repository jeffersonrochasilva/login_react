import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./admin.css";
import { auth, db } from "../../firebaseConection";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

function Admin() {
  const [tarefasInput, setTarefasInput] = useState("");
  const [tarefas, setTarefas] = useState([]);
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState({});

  useEffect(() => {
    async function loadingTarefas() {
      const userDatail = localStorage.getItem("@detailUser");
      setUser(JSON.parse(userDatail));

      if (userDatail) {
        const data = JSON.parse(userDatail);
        const tarefaRef = collection(db, "tarefas");
        const q = query(
          tarefaRef,
          orderBy("created", "desc"),
          where("userUid", "==", data?.uid)
        );

        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];

          snapshot.forEach((element) => {
            lista.push({
              id: element.id,
              tarefa: element.data().tarefa,
              userUid: element.data().userUid,
            });
          });
          setTarefas(lista);
        });
      }
    }
    loadingTarefas();
  }, []);

  async function handleRegister(e) {
    e.preventDefault();
    if (tarefasInput === "") {
      alert("Digite sua tarefa...");
      return;
    }

    if (edit?.id) {
      handleUpdateTarefa();
      return;
    }

    await addDoc(collection(db, "tarefas"), {
      tarefa: tarefasInput,
      created: new Date(),
      userUid: user?.uid,
    })
      .then(() => {
        console.log("tarefa cadastrada");
        setTarefasInput("");
      })
      .catch(() => {
        console.log("error");
      });
  }

  async function handleUpdateTarefa() {
    const docRef = doc(db, "tarefas", edit?.id);
    await updateDoc(docRef, {
      tarefa: tarefasInput,
    })
      .then(() => {
        setTarefasInput("");
        setEdit({});
        console.log("TAREFA ATUALIZADA");
      })
      .catch(() => {
        setTarefasInput("");
        setEdit({});
        console.log("ERRO AO ATUALIZAR");
      });
  }

  async function handleLogout() {
    await signOut(auth);
  }

  async function deleteTarefa(id) {
    const docRef = doc(db, "tarefas", id);
    await deleteDoc(docRef);
  }

  async function aditTarefa(item) {
    setTarefasInput(item.tarefa);
    setEdit(item);
  }

  return (
    <div className="admin-container">
      <h1>Minhas tarefas</h1>

      <form className="form" onSubmit={handleRegister}>
        <textarea
          placeholder="Digite sua tarefa..."
          value={tarefasInput}
          onChange={(e) => setTarefasInput(e.target.value)}
        />
        {Object.keys(edit).length > 0 ? (
          <button
            className="btn-register"
            style={{ backgroundColor: "#6add39" }}
            type="submit"
          >
            Editar tarefa
          </button>
        ) : (
          <button className="btn-register" type="submit">
            Registrar tarefa
          </button>
        )}
      </form>

      {tarefas.map((item) => {
        return (
          <article key={item.id} className="list">
            <p>{item.tarefa}</p>
            <div>
              <button onClick={() => aditTarefa(item)}>Editar</button>
              <button
                onClick={() => deleteTarefa(item.id)}
                className="btn-delete"
              >
                Comcluir
              </button>
            </div>
          </article>
        );
      })}

      <button onClick={handleLogout} className="btn-logout">
        Sair
      </button>
    </div>
  );
}

export default Admin;
