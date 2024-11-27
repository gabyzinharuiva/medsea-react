// Layout.jsx
import React from 'react';
import logo from '/src/components/medsealogo.png';
import styles from './Layout.module.css';

function Layout({ titulo, children }) {
  return (
    <main className={styles.container}>
      <img className={styles.logo} src={logo} alt="logo" />
      <h1 className={styles.titulo}>{titulo}</h1>
      <section className={styles.conteudo}>
        {children}
      </section>
    </main>
  );
}

export default Layout;
