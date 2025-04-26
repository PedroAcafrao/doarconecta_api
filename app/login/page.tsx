'use client'
import React from 'react';
import LoginForm from '../../components/LoginForm';

const Login = () => {
  const handleSubmit = async (email: string, senha: string) => {
    try {
      // Lógica de autenticação aqui
      const resposta = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:"include",
        body: JSON.stringify({ email, senha }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        alert(dados.message);
      } else {
        // Redirecionar para a página principal
        window.location.href = '/';
      }
    } catch (erro) {
      alert('Erro ao autenticar');
    }
  };

  return (
    <div>
      
      <LoginForm onSubmit={handleSubmit} />
    </div>
  );
};

export default Login;
