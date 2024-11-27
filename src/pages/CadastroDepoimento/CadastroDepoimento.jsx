import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { AppContext } from '/src/provider/AppContext';
import styles from './CadastroDepoimento.module.css';
import logo from '/src/components/medsealogo.png';

function CadastroDepoimento() {
  const { usuario, depoimentos, setDepoimentos } = useContext(AppContext); 
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navegacao = useNavigate();

  // Função para enviar o depoimento
  const botaoEnviar = async (e) => {
    e.preventDefault();

    if (!titulo.trim() || !conteudo.trim()) {
      alert('Título e conteúdo são obrigatórios!');
      return;
    }

    try {
      console.log("Enviando depoimento:", { usuarioCpf : usuario.cpf, tituloDepoimento: titulo, conteudoDepoimento: conteudo });
      // Envia o novo depoimento para o backend
      const response = await api.post("/depoimentos", {
        usuarioCpf : usuario.cpf,
        tituloDepoimento: titulo,
        conteudoDepoimento: conteudo,
      });

      console.log("Resposta ao cadastrar depoimento:", response.data);
      
      // Atualiza o estado com o novo depoimento
      setDepoimentos([...depoimentos, response.data]);

      setTitulo('');
      setConteudo('');
      setMensagem('Depoimento cadastrado com sucesso!');
      setTimeout(() => setMensagem(''), 5000);
    } catch (error) {
      console.error("Erro ao cadastrar o depoimento:", error);
      alert("Não foi possível cadastrar o depoimento.");
    }
  };

  // Ação para detectar o pressionamento de tecla Enter
  const envioKeyPress = (e) => {
    if (e.key === 'Enter') {
      botaoEnviar(e);
    }
  };

  return (
    <section className={styles.cadastroContainer} onKeyPress={envioKeyPress} tabIndex={0}>
      <img src={logo} alt="logo" className={styles.logo} onClick={() => navegacao('/')}/>
      <h1 className={styles.titulo}>Cadastrar Depoimento</h1>
      
      <form className={styles.form} onSubmit={botaoEnviar}>
        <div>
          <label>Título</label>
          <input
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
        
        <div>
          <label>Conteúdo</label>
          <textarea
            required
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.botaoEnviar}>Cadastrar</button>
      </form>

      {mensagem && <p className={styles.mensagemDeSucesso}>{mensagem}</p>}

      <button onClick={() => navegacao('/depoimentos')} className={styles.botaoVoltar}>
        Voltar
      </button>
    </section>
  );
}

export default CadastroDepoimento;
