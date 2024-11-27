import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cadastro.module.css";
import logo from "/src/components/medsealogo.png";
import api from "../../api/api";
import { AppContext } from "/src/provider/AppContext";

function Cadastro() {
  const { setUsuario } = useContext(AppContext); // Acessando setUsuario do AppContext
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    endereco: "",
    tipoUsuario: "",
  });
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();
  const validarCPF = (cpf) => {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, "");
    
    // Verifica se tem 11 dígitos e não é uma sequência repetida
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
    // Validação dos dígitos verificadores
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "cpf" || name === "telefone" ? value.replace(/[^\d]/g, "") : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valida CPF
    if (!validarCPF(formData.cpf)) {
      setMensagem("CPF inválido.");
      console.log("Erro: CPF inválido", formData.cpf);
      return;
    }

    console.log("Dados do formulário enviados para o backend:", formData);

    const endpoint = `/${formData.tipoUsuario.toLowerCase()}`;

    try {
      // Envia os dados para o backend
      const response = await api.post(endpoint, formData);
      console.log("Resposta do backend ao criar o usuário:", response.data);

      const newUser = { ...formData };
      setUsuario(newUser);
      localStorage.setItem("usuario", JSON.stringify(newUser));

      setMensagem("Cadastro realizado com sucesso!");
      navigate("/cadastro-perfil");
    } catch (error) {
      console.log("Erro na requisição ao backend:", error.response.data.message);

      // Valida o tipo de erro recebido
      if (error.response) {
        console.log("Detalhes do erro:", error.response.data);

        if (error.response.data.message.includes("email")) {
          setMensagem("E-mail já registrado.");
        } else if (error.response.data.message.includes("cpf")) {
          setMensagem("CPF já registrado.");
        } else {
          setMensagem("CPF ou E-mail já registrados.");
        }
      } else {
        console.log("Erro sem resposta do backend:", error.message);
        setMensagem("CPF ou E-mail já registrados.");
      }
    }
};
  return (
    <main className={styles.cadastroContainer}>
      <img className={styles.logo} src={logo} alt="logo" />
      <section className={styles.formContainer}>
        <h1>Cadastro</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.grupoInput}>
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.grupoInput}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.grupoInput}>
            <label htmlFor="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.grupoInput}>
            <label htmlFor="telefone">Telefone</label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.grupoInput}>
            <label htmlFor="endereco">Endereço</label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.grupoInput}>
            <label>Tipo de Usuário</label>
            <select
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Selecione o tipo de usuário
              </option>
              <option value="Visitante">Visitante</option>
              <option value="Paciente">Paciente</option>
              <option value="Familiar">Familiar</option>
            </select>
          </div>
          <button type="submit" className={styles.botaoCadastro}>
            Cadastrar
          </button>
          {mensagem && (
            <p className={mensagem.includes("sucesso") ? styles.mensagemSucesso : styles.mensagemErro}>
              {mensagem}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

export default Cadastro;
