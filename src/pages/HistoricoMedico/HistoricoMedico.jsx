import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "/src/provider/AppContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import styles from "./HistoricoMedico.module.css";
import Layout from "../Layout/Layout";

function HistoricoMedico() {
  const { usuario, historicoMedico, setHistoricoMedico } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [tipo, setTipo] = useState("");
  const [profissional, setProfissional] = useState("");
  const [data, setData] = useState("");
  const [showHistorico, setShowHistorico] = useState(false); // Estado para controlar a visibilidade
  const navigate = useNavigate();

  // Verifica o tipo de usuário ao carregar o componente
  useEffect(() => {
    if (usuario?.tipoUsuario.toLowerCase() !== "paciente") {
      alert("Apenas pacientes podem acessar o histórico médico.");
      navigate("/perfil"); // Redireciona para a página de perfil
    }
  }, [usuario, navigate]);
  // Formatar a data no formato dd/mm/aaaa
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Busca histórico médico ao carregar a página
  useEffect(() => {
    const fetchHistoricoMedico = async () => {
      try {
        const response = await api.get(`/historico-medico/${usuario.cpf}`);
        console.log("Resposta da API:", response.data);
        setHistoricoMedico(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar histórico médico:", error);
        alert("Ocorreu um erro ao carregar o histórico médico. Tente novamente.");
      }
    };

    fetchHistoricoMedico();
  }, [usuario, setHistoricoMedico]);

  const handleUpload = async (e) => {
    e.preventDefault();
  
    if (file && tipo && profissional && data) {
      try {
        const formData = new FormData();
        formData.append("file", file); // Arquivo enviado
        formData.append("tipo", tipo); // Tipo
        formData.append("profissional", profissional); // Profissional
        formData.append("data", data); // Data
  
        // Envio para o backend
        const response = await api.post(`/historico-medico/${usuario.cpf}`, formData);
  
        // Atualiza o histórico médico
        setHistoricoMedico([...historicoMedico, response.data]);
        alert("Histórico médico adicionado com sucesso!");
      } catch (error) {
        console.error("Erro ao enviar histórico médico:", error);
        alert("Erro ao enviar o histórico médico. Verifique os dados e tente novamente.");
      }
  
      // Limpa os campos
      setFile(null);
      setTipo("");
      setProfissional("");
      setData("");
    } else {
      alert("Preencha todos os campos antes de enviar.");
    }
  };
  
  

  return (
    <Layout titulo="Histórico Médico">
      <form onSubmit={handleUpload} className={styles.formContainer}>
        <div className={styles.grupoInput}>
          <label htmlFor="file" className={styles.label}>Arquivo:</label>
          <input id="file" type="file" onChange={(e) => setFile(e.target.files[0])} required />
        </div>
        <div className={styles.grupoInput}>
          <label htmlFor="tipo" className={styles.label}>Tipo:</label>
          <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} required>
            <option value="">Selecione o tipo</option>
            <option value="Laudo">Laudo Médico</option>
            <option value="Atestado">Atestado</option>
            <option value="Receita">Receita</option>
          </select>
        </div>
        <div className={styles.grupoInput}>
          <label htmlFor="profissional" className={styles.label}>Profissional:</label>
          <input
            id="profissional"
            type="text"
            placeholder="Profissional"
            value={profissional}
            onChange={(e) => setProfissional(e.target.value)}
            required
          />
        </div>
        <div className={styles.grupoInput}>
          <label htmlFor="data" className={styles.label}>Data:</label>
          <input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.botao}>Adicionar</button>
      </form>

      <button
        onClick={() => setShowHistorico((prev) => !prev)}
        className={styles.botaoHistorico}
      >
        {showHistorico ? "Esconder históricos médicos anteriores" : "Ver históricos médicos anteriores"}
      </button>

      {showHistorico && (
        <div className={styles.listaHistorico}>
          <h3>Histórico Médico:</h3>
          {historicoMedico.map((item, index) => (
            <div key={index} className={styles.historicoItem}>
              <p><strong>Tipo:</strong> {item.tipo}</p>
              <p><strong>Profissional:</strong> {item.profissional}</p>
              <p><strong>Data:</strong> {formatDate(item.data)}</p>
            </div>
          ))}
        </div>
      )}

      <div className={styles.botaoVoltarContainer}>
        <button onClick={() => navigate("/perfil")} className={styles.botaoVoltar}>
          Voltar
        </button>
      </div>
    </Layout>
  );
}

export default HistoricoMedico;
