import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "/src/provider/AppContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import styles from "./MuralApoio.module.css";
import logo from "/src/components/medsealogo.png";
import lupa from "/src/components/lupa.png";
import defaultProfilePic from "/src/components/default-profile.png";
import lapis from "/src/components/icon-lapis.png";
import lixeira from "/src/components/icon-lixeira.png";

function MuralApoio() {
  const { usuario, comentarios, setComentarios } = useContext(AppContext);
  const [novoComentario, setNovoComentario] = useState("");
  const [busca, setBusca] = useState("");
  const [comentariosFiltrados, setComentariosFiltrados] = useState([]);
  const [editando, setEditando] = useState(null);
  const [conteudoEditado, setConteudoEditado] = useState("");
  const fotoAutor = usuario.foto;
  const navegacao = useNavigate();

  // Buscar comentários ao carregar
  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await api.get("/comentarios");
        setComentarios(response.data);
        setComentariosFiltrados(response.data);
        console.log("Comentários carregados com sucesso:", response.data);
      } catch (error) {
        console.error("Erro ao carregar os comentários:", error);
        console.log("Detalhes do erro:", error.response?.data || error.message);
        alert("Não foi possível carregar os comentários.");
      }
    };

    fetchComentarios();
  }, []);

  // Filtrar comentários pela busca
  useEffect(() => {
    const filtrados = comentarios.filter((comentario) =>
      comentario.autor?.toLowerCase().includes(busca.toLowerCase())
    );
    setComentariosFiltrados(filtrados);
  }, [busca, comentarios]);

  // Submissão de novo comentário
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    if (!novoComentario.trim()) {
      alert("Por favor, escreva um comentário.");
      return;
    }
  
    try {
      const comentarioData = {
        autor: usuario.nome,
        conteudo: novoComentario,
      };
  
      console.log("Dados antes do envio:", comentarioData);
  
      const response = await api.post("/comentarios", comentarioData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Comentário enviado com sucesso:", response.data);
  
      const novoComentarios = [...comentarios, response.data];
      setComentarios(novoComentarios);
      setComentariosFiltrados(novoComentarios);
      setNovoComentario("");
      alert("Comentário enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar o comentário:", error.message);
      console.log("Detalhes do erro:", error.response?.data || error.data.message);
      alert("Não foi possível enviar o comentário.");
    }
  };
  

  // Salvar edição do comentário
  const handleEditComment = async (id) => {
    try {
      const response = await api.put(`/comentarios/${id}`, {
        conteudo: conteudoEditado,
      });

      console.log("Comentário atualizado com sucesso:", response.data);

      const atualizado = comentarios.map((comentario) =>
        comentario.id === id
          ? { ...comentario, conteudo: response.data.conteudo }
          : comentario
      );

      setComentarios(atualizado);
      setComentariosFiltrados(atualizado);
      setEditando(null);
      alert("Comentário atualizado!");
    } catch (error) {
      console.error("Erro ao atualizar o comentário:", error);
      console.log("Detalhes do erro:", error.response?.data || error.message);
      alert("Não foi possível atualizar o comentário.");
    }
  };

  // Deletar comentário
  const handleDeleteComment = async (id) => {
    try {
      await api.delete(`/comentarios/${id}`);
      console.log(`Comentário com ID ${id} excluído com sucesso.`);

      const atualizado = comentarios.filter(
        (comentario) => comentario.id !== id
      );
      setComentarios(atualizado);
      setComentariosFiltrados(atualizado);
      alert("Comentário excluído!");
    } catch (error) {
      console.error("Erro ao excluir o comentário:", error);
      console.log("Detalhes do erro:", error.response?.data || error.message);
      alert("Não foi possível excluir o comentário.");
    }
  };

  // Iniciar edição
  const iniciarEdicao = (id, conteudo) => {
    setEditando(id);
    setConteudoEditado(conteudo);
  };

  return (
    <main className={styles.muralContainer}>
      <img className={styles.logo} src={logo} alt="logo" />
      <h1 className={styles.titulo}>Mural de Apoio</h1>

      <div className={styles.formContainer}>
        <h2 className={styles.tituloComentarios}>Comentários</h2>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar Usuário"
            className={styles.searchInput}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <img src={lupa} className={styles.searchIcon} alt="Buscar" />
        </div>

        <section className={styles.comentarios}>
          {comentariosFiltrados.map((comentario) => (
            <article key={comentario.id} className={styles.comentario}>
              <img
                src={fotoAutor || defaultProfilePic}
                alt="Foto do usuário"
                className={styles.fotoComentario}
              />
              <div>
                <strong>{comentario.autor || "Usuário Desconhecido"}</strong>
                {editando === comentario.id ? (
                  <textarea
                    className={styles.textareaEdit}
                    value={conteudoEditado}
                    onChange={(e) => setConteudoEditado(e.target.value)}
                  />
                ) : (
                  <p>{comentario.conteudo || "Sem conteúdo"}</p>
                )}
              </div>
              {comentario.autor === usuario.nome && (
                <div className={styles.icones}>
                  {editando === comentario.id ? (
                    <button
                      className={styles.botaoSalvar}
                      onClick={() => handleEditComment(comentario.id)}
                    >
                      Salvar
                    </button>
                  ) : (
                    <>
                      <img
                        src={lapis}
                        alt="Editar"
                        className={styles.icone}
                        onClick={() =>
                          iniciarEdicao(comentario.id, comentario.conteudo)
                        }
                      />
                      <img
                        src={lixeira}
                        alt="Excluir"
                        className={styles.icone}
                        onClick={() => handleDeleteComment(comentario.id)}
                      />
                    </>
                  )}
                </div>
              )}
            </article>
          ))}
        </section>
      </div>

      <form onSubmit={handleCommentSubmit} className={styles.formContainer}>
        <h2 className={styles.tituloComentarios}>Faça seu comentário!</h2>
        <textarea
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          placeholder="Escreva seu comentário de apoio"
          className={styles.textarea}
        />

        <button type="submit" className={styles.botao}>
          Postar
        </button>
      </form>

      <button
        onClick={() => navegacao("/perfil")}
        className={styles.botaoVoltar}
      >
        Voltar
      </button>
    </main>
  );
}

export default MuralApoio;
