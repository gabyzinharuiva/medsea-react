import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AppContext } from "/src/provider/AppContext";
import styles from "./Depoimentos.module.css";
import logo from "/src/components/medsealogo.png";
import lapis from "/src/components/icon-lapis.png";
import lixeira from "/src/components/icon-lixeira.png";

function Depoimentos() {
  const { usuario, depoimentos, setDepoimentos } = useContext(AppContext);
  const [depoimentosFiltrados, setDepoimentosFiltrados] = useState([]);
  const [editando, setEditando] = useState(null);
  const [conteudoEditado, setConteudoEditado] = useState("");
  const navegacao = useNavigate();
  // Carregar depoimentos ao iniciar
  useEffect(() => {
    const fetchDepoimentos = async () => {
      try {
        const response = await api.get("/depoimentos");
        console.log("Resposta da API ao carregar depoimentos:", response.data);
        
        setDepoimentos(response.data);
        setDepoimentosFiltrados(response.data);
      } catch (error) {
        console.error("Erro ao carregar os depoimentos:", error);
        alert("Não foi possível carregar os depoimentos.");
      }
    };

    fetchDepoimentos();
  }, [setDepoimentos]);

  // Iniciar edição de um depoimento
  const iniciarEdicao = (cpf, conteudoAtual) => {
    console.log("Iniciando edição para depoimento com cpf:", cpf);
    setEditando(cpf);
    setConteudoEditado(conteudoAtual);
  };

  // Salvar edição de depoimento
  const handleEditDepoimento = async (cpf) => {
    console.log("Salvando edição para depoimento com cpf:", cpf);
    try {
        const response = await api.put(`/depoimentos/${cpf}`, {
            tituloDepoimento: "Novo título", // Substitua conforme necessário
            conteudoDepoimento: conteudoEditado,
        });

        console.log("Resposta da API ao editar depoimento:", response.data);

        const atualizado = depoimentos.map((depoimento) =>
            depoimento.usuarioCpf === cpf
                ? { ...depoimento, conteudoDepoimento: response.data.conteudoDepoimento }
                : depoimento
        );

        setDepoimentos(atualizado);
        setDepoimentosFiltrados(atualizado);
        setEditando(null);
        alert("Depoimento atualizado!");
    } catch (error) {
        console.error("Erro ao atualizar o depoimento:", error);
        alert("Não foi possível atualizar o depoimento.");
    }
};
  // Deletar depoimento
  const handleDeleteDepoimento = async (cpf) => {
    console.log("Deletando depoimento com cpf:", cpf);
    try {
        await api.delete(`/depoimentos/${cpf}`);
        const atualizado = depoimentos.filter((depoimento) => depoimento.usuarioCpf !== cpf);

        console.log("Depoimentos após a exclusão:", atualizado);
        setDepoimentos(atualizado);
        setDepoimentosFiltrados(atualizado);
        alert("Depoimento excluído!");
    } catch (error) {
        console.error("Erro ao excluir o depoimento:", error);
        alert("Não foi possível excluir o depoimento.");
    }
};

  console.log("Depoimentos filtrados para exibição:", depoimentosFiltrados);

  return (
    <main className={styles.depoimentosContainer}>
      <img
        src={logo}
        alt="logo"
        className={styles.logo}
        onClick={() => navegacao("/")}
      />
      <h1 className={styles.titulo}>Depoimentos</h1>

      <section className={styles.conteudoDepoimentos}>
        {Array.isArray(depoimentosFiltrados) &&
        depoimentosFiltrados.length > 0 ? (
          depoimentosFiltrados.map((depoimento) => (
            <article key={depoimento.usuarioCpf} className={styles.depoimento}>
              <h2 className={styles.tituloDepoimentos}>
                {depoimento.tituloDepoimento}
              </h2>
              <hr className={styles.separador} />
              {editando === depoimento.usuarioCpf ? (
                <textarea
                  className={styles.textareaEdit}
                  value={conteudoEditado}
                  onChange={(e) => setConteudoEditado(e.target.value)}
                />
              ) : (
                <p>{depoimento.conteudoDepoimento}</p>
              )}

              {depoimento.usuarioCpf === usuario.cpf && (
                <div className={styles.icones}>
                  {editando === depoimento.usuarioCpf ? (
                    <button
                      className={styles.botaoSalvar}
                      onClick={() => handleEditDepoimento(depoimento.usuarioCpf)}
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
                          iniciarEdicao(depoimento.usuarioCpf, depoimento.conteudoDepoimento)
                        }
                      />
                      <img
                        src={lixeira}
                        alt="Excluir"
                        className={styles.icone}
                        onClick={() => handleDeleteDepoimento(usuario.cpf)}
                      />
                    </>
                  )}
                </div>
              )}
            </article>
          ))
        ) : (
          <p>Nenhum depoimento encontrado.</p>
        )}
      </section>

      <section className={styles.containerBotao}>
        <button
          className={styles.botaoAdicionar}
          onClick={() => navegacao("/cadastro-depoimento")}
        >
          Adicionar Depoimento
        </button>
        <button
          onClick={() => navegacao("/perfil")}
          className={styles.botaoVoltar}
        >
          Voltar
        </button>
      </section>
    </main>
  );
}

export default Depoimentos;
