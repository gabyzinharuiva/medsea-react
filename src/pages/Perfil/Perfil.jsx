import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "/src/provider/AppContext";
import logo from "/src/components/medsealogo.png";
import defaultProfilePic from "/src/components/default-profile.png";
import styles from "./Perfil.module.css";

function Perfil() {
  const { usuario, setUsuario } = useContext(AppContext);
  const navigate = useNavigate();
  const [fotoUsuario, setFotoUsuario] = useState(defaultProfilePic);
  
  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("usuario"));
    if (userLocal) {
      setUsuario(userLocal);
      setFotoUsuario(userLocal.foto || defaultProfilePic);
    }
  }, [setUsuario]);
  

  return (
    <main className={styles.perfilContainer}>
      <img className={styles.logo} src={logo} alt="Logo" />
      <h1>Perfil</h1>
      <section className={styles.infoContainer}>
        <img
          src={fotoUsuario}
          alt="Foto do Usuário"
          className={styles.fotoUsuario}
        />
        <div className={styles.infoItemName}>
          <strong>{usuario?.nome || "Nome"}</strong>
        </div>
        <div className={styles.infoItem}>
          {usuario?.tipoUsuario || "Tipo de usuário"}
        </div>
        <div className={styles.infoItem}>
          {usuario?.bio || "Bio"}
        </div>
        <hr className={styles.hr} />
        <h2 className={styles.titulo}>Você deseja ir para:</h2>
        <div className={styles.botoesContainer}>
          <button
            onClick={() => navigate("/historico-medico")}
            className={styles.botao}
          >
            Histórico Médico
          </button>
          <button onClick={() => navigate("/depoimentos")} className={styles.botao}>
            Depoimentos
          </button>
          <button onClick={() => navigate("/mural-apoio")} className={styles.botao}>
            Mural de Apoio
          </button>
        </div>
      </section>
    </main>
  );
}

export default Perfil;
