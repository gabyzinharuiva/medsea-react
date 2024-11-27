import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const storedUsuario = localStorage.getItem('usuario');
    return storedUsuario ? JSON.parse(storedUsuario) : { nome: '', bio: '', foto: '', tipoUsuario: '' };
  });

  useEffect(() => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }, [usuario]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("Arquivo selecionado:", file);
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result;
      setUsuario({
        ...usuario,
        foto: base64Image, 
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const [historicoMedico, setHistoricoMedico] = useState([]);
  const [depoimentos, setDepoimentos] = useState([]);
  const [comentarios, setComentarios] = useState([]);

  return (
    <AppContext.Provider value={{ usuario, setUsuario, historicoMedico, setHistoricoMedico, comentarios, setComentarios, depoimentos, setDepoimentos, handleFileChange }}>
      {children}
    </AppContext.Provider>
  );
};
