export default async function handler(req:any, res:any) {
    // Lógica da API aqui
    const dados = [
      { id: 1, nome: 'Exemplo 1' },
      { id: 2, nome: 'Exemplo 2' },
    ];
  
    // Retorna os dados em formato JSON
    return res.status(200).json(dados);
  }