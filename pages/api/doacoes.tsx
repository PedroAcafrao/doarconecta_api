import { NextApiRequest, NextApiResponse } from 'next';
import UsuarioModel from "../../models/doacoes";
import jwt from 'jsonwebtoken';
import nookies from 'nookies';

const register = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            // Recebe os dados do corpo da requisição
            const doacaoData = req.body;
            const cookieValor = nookies.get({req}).doador;
            doacaoData.Doador = cookieValor;
            console.log('Cadastrando Doações: ', JSON.stringify(doacaoData));

            // Cria o usuário no banco de dados
            let usuario = await UsuarioModel.criarDoacao(doacaoData);


            // Retornar uma resposta de sucesso
            return res.status(200).json({ message: 'Cadastro doação bem-sucedido' });
        } catch (error) {
            console.error('Erro ao Cadastrar doação:', error);
            return res.status(400).json({ message: 'Erro no cadastro da doação' });
        }
    } else {
        return res.status(405).json({ message: 'Método não permitido' });
    }
};

export default register;








