import { RowDataPacket } from "mysql2";
import db from "../db";
import bcrypt from 'bcryptjs'

class UsuarioModel {
  // Criar uma nova doação)
  async criarDoacao(doacao:any) {

    console.log("doacao " + doacao.Descricao, doacao.status, doacao.categoria, doacao.doador, doacao.Data_Cadastro);
    
    const insereDoacao = await db.execute(
      `INSERT INTO tbldoacao (Descricao, Status, Doador, Categoria, Data_Cadastro)
       
         VALUES 
        (?, ?, ?, ?, ?)`,
      [
        doacao.Descricao,
        doacao.Status,
        doacao.Doador,
        doacao.Categoria,
        doacao.Data_Cadastro
        
      ]
    );
    if (Array.isArray(insereDoacao) && insereDoacao.length > 0) {
      // Fodoacaorçando a declaração do tipo como RowDataPacket
      const doacao = insereDoacao[0] as RowDataPacket;  // 'RowDataPacket' é o tipo correto do MySQL2
      return doacao;
    }
  }

  // Verificar a senha do usuário
  async verificarSenha(usuario:any, senha:any) {
    const isValid = await bcrypt.compare(senha, usuario.Senha);  // Compara a senha
    return isValid;
  }

  // Buscar o usuário pelo e-mail
  async buscarUsuarioPorEmail(email: string) {
    const [rows] = await db.execute(
      `SELECT * FROM tblUsuario WHERE Email = ?`,
      [email]
    );
  
    // Verifique se rows é um array e tem pelo menos 1 item (usuário encontrado)
    if (Array.isArray(rows) && rows.length > 0) {
      // Forçando a declaração do tipo como RowDataPacket
      const usuario = rows[0] as RowDataPacket;  // 'RowDataPacket' é o tipo correto do MySQL2
      return usuario;
    }
  
    return null;  // Se não encontrar o usuário
  }
  
}

export default new UsuarioModel(); // Exporta uma instância única

