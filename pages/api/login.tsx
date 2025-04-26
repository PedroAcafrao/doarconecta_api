import { NextApiRequest, NextApiResponse } from 'next';
import UsuarioModel from "../../models/Usuario";
import jwt from "jsonwebtoken";
import nookies from 'nookies'; // Importando nookies para manipulação de cookies

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, senha } = req.body;

    // Buscar usuário pelo e-mail
    let usuario = await UsuarioModel.buscarUsuarioPorEmail(email);

    if (!usuario) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }
    
    // Verificar a senha
    const isValidPassword = await UsuarioModel.verificarSenha(usuario, senha);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }
    
    // Gerar o token JWT com um segredo de ambiente
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || 'jsontoken', { expiresIn: '1h' });
    const a = jwt.decode(token);
    
    //alert("token :" + a );

    // Definir o cookie com nookies
    nookies.set({ res }, 'auth_token', token, {
      httpOnly: true,      // Impede o acesso ao cookie via JavaScript
      secure: process.env.NODE_ENV === 'production',  // Definir como secure em produção
      maxAge: 60 * 60,    // Tempo de expiração (1 hora)
      sameSite: 'Strict', // Restrição para o mesmo site (ajuda a prevenir CSRF)
      path: '/',          // Define o caminho onde o cookie será válido
    });

    nookies.set({ res },'doador',usuario.id, {
      path:'/'
    });

    const cookieValor = nookies.get({req}).doador;
    
    console.log ("doador: " + cookieValor);
    console.log("deu");

    // Resposta de sucesso com o token
    return res.status(200).json({ message: 'Login bem-sucedido' });
    
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
};

export default login;
