import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '/src/provider/AppContext';
import logo from '/src/components/medsealogo.png';
import defaultProfilePic from '/src/components/default-profile.png';
import api from '../../api/api';
import styles from './CadastroPerfil.module.css';

function CadastroPerfil() {
  const { usuario, setUsuario, handleFileChange } = useContext(AppContext);
  const [nome, setNome] = useState(usuario?.nome || "");
  const [bio, setBio] = useState(usuario?.bio || "");
  const [foto, setFoto] = useState(usuario?.foto || "");
  const [cpf, setCpf] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("usuario"));
    if (userLocal?.cpf) setCpf(userLocal.cpf);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
     // Define o endpoint com base no tipo de usuário
     const endpoint = `/${usuario.tipoUsuario.toLowerCase()}`;
    const updatedUser = { ...usuario, nome, bio, foto, cpf };

     try {
      await api.put(`${endpoint}/${cpf}`, updatedUser);
      setUsuario(updatedUser);
      localStorage.setItem("usuario", JSON.stringify(updatedUser));

      setMensagem("Perfil atualizado com sucesso!");
      navigate("/perfil");
    } catch (error) {
      setMensagem("Erro ao atualizar o perfil.");
      console.error(error.response.data.message);
    }
  };

  const handleFotoChange = (e) => {
    handleFileChange(e);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result); // Converte a foto para base64
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <main className={styles.perfilContainer}>
      <img className={styles.logo} src={logo} alt="logo" />
      <h1 className={styles.titulo}>Cadastro de Perfil</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.grupoInput}>
          <label htmlFor="nome">Nome de Usuário</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className={styles.grupoInput}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        </div>
        <div className={styles.grupoInput}>
          <label htmlFor="foto">Foto de Usuário</label>
          <input
            type="file"
            id="foto"
            onChange={handleFotoChange}
            accept="image/*"
          />
          <img
            src={foto || defaultProfilePic}
            alt="Pré-visualização da Foto"
            className={styles.previewFoto}
          />
        </div>
        <button type="submit" className={styles.botao}>
          Cadastrar
        </button>
      </form>
    </main>
  );
}

export default CadastroPerfil;
