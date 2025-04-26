import { NextApiRequest, NextApiResponse } from 'next';
import UsuarioModel from "../../models/Usuario";
import jwt from 'jsonwebtoken';
import nookies from 'nookies';

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      // Recebe os dados do corpo da requisição
      const usuarioData = req.body;
      console.log('Registrando usuário: ', JSON.stringify(usuarioData));

      // Cria o usuário no banco de dados
      let usuario = await UsuarioModel.criarUsuario(usuarioData);
     
      
     
      // Gerar o token JWT
      const token = jwt.sign({ id: usuario?.id }, process.env.JWT_SECRET || 'jsontoken', { expiresIn: '1h' });

      // Definir o cookie com nookies
      nookies.set({ res }, 'auth_token', token, {
        httpOnly: true,      // Impede o acesso ao cookie via JavaScript
        secure: process.env.NODE_ENV === 'production',  // Definir como secure em produção
        maxAge: 60 * 60,    // Tempo de expiração (1 hora)
        sameSite: 'Strict', // Restrição para o mesmo site (ajuda a prevenir CSRF)
        path: '/',          // Define o caminho onde o cookie será válido
      });

      // Retornar uma resposta de sucesso
      return res.status(200).json({ message: 'Registro bem-sucedido' });
    } catch (error) {
      console.error('Erro ao registrar o usuário:', error);
      return res.status(400).json({ message: 'Erro ao registrar o usuário' });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
};

export default register;
