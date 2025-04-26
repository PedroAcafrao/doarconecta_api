import { RowDataPacket } from "mysql2";
import db from "../db";
import bcrypt from 'bcryptjs'

class UsuarioModel {
  // Criar um novo usuário (criptografando a senha)
  async criarUsuario(usuario:any) {
    const hash = await bcrypt.hash(usuario.Senha, 10);  // Criptografa a senha
    usuario.Senha = hash;
    
    const user = await db.execute(
      `INSERT INTO tblUsuario 
        (TipoUsuario, NomeRazaoSocial, CPFCNPJ, Logradouro, NumeroLogradouro, Complemento, 
         Bairro, Localidade, UF, Cep, Email, Celular, Senha)
       VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuario.TipoUsuario,
        usuario.NomeRazaoSocial,
        usuario.CPFCNPJ,
        usuario.Logradouro,
        usuario.NumeroLogradouro,
        usuario.Complemento,
        usuario.Bairro,
        usuario.Localidade,
        usuario.UF,
        usuario.Cep,
        usuario.Email,
        usuario.Celular,
        usuario.Senha
      ]
    );
    if (Array.isArray(user) && user.length > 0) {
      // Forçando a declaração do tipo como RowDataPacket
      const usuario = user[0] as RowDataPacket;  // 'RowDataPacket' é o tipo correto do MySQL2
      return usuario;
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



/*const usuario = async (email: any, senha: any) => {

  const [rows] = await db.execute(
    `SELECT * FROM tblUsuario WHERE Email=? AND Senha=?`,
    [email, senha]
  );

  return rows;
};*/

/*const inserir = async (a: any) => {
  a.NomeRazaoSocial = a;

  console.log(a);

}*/

//*export default { usuario, inserir };
