import * as bcrypt from 'bcrypt';

const saltRounds = 10;

const hashSenha = async (senha: string) => {
    const hash = await bcrypt.hash(senha, saltRounds);
    return hash;
}

const verificarSenha = async (senha: string, hash: string ) => {
    const isvalid = await bcrypt.compare(senha, hash);
    return isvalid;
}

export { hashSenha, verificarSenha};


