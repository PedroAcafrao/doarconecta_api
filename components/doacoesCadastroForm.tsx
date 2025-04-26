import { useEffect } from "react";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import nookies from 'nookies'; // Importando nookies para manipulação de cookies

interface FormDataType {
    Descricao: string;
    Status: string;
    Categoria: string;
    Doador: string,
    Data_Cadastro: string;

};


//const FormularioItem = () => {
const FormularioItem: React.FC = () => {

    const initialFormState: FormDataType = {
        Descricao: "",
        Status: "",
        Doador: "",
        Categoria: "",
        Data_Cadastro: new Date().toISOString(),
    };

    //const [formData, setFormData] = useState<FormDataType>(initialFormState);
    const [erro, setErro] = useState<string>('');
    const [sucesso, setSucesso] = useState<boolean>(false);
    const [carregando, setCarregando] = useState<boolean>(false);
    const [cepInvalido, setCepInvalido] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        Descricao: "",
        Status: "",
        Doador: "",
        Categoria: "",
        Data_Cadastro: new Date().toISOString(),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Definir data e hora atual no formato correto
    useEffect(() => {
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 16); // Formato yyyy-MM-ddThh:mm
        setFormData((prevState) => ({
            ...prevState,
            Data_Cadastro: formattedDate,
        }));
    }, []);

    //   const handleSubmit = (e: React.FormEvent) => {
    //      e.preventDefault();
    // Aqui você pode enviar os dados do formulário para uma API ou outro local
    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        try {
            // Preparando os dados para envio conforme a estrutura do banco
            const dadosParaEnvio = {
                Descricao: formData.Descricao,
                Doador: 0,
                Status: formData.Status,
                Categoria: formData.Categoria,
                Data_Cadastro: formData.Data_Cadastro
            };

            const resposta = await fetch('/api/doacoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(dadosParaEnvio)
            });

            if (!resposta.ok) {
                // Tentar obter mensagem de erro do servidor
                try {
                    const errorData = await resposta.json();
                    throw new Error(errorData.message || 'Erro ao registrar usuário');
                } catch (jsonError) {
                    throw new Error(`Erro ao registrar usuário (${resposta.status})`);
                }
            };

            // Sucesso no registro
            setSucesso(true);
            setErro('');

            // Limpar formulário após sucesso
            setFormData(initialFormState);

            // Opcional: redirecionar para login após alguns segundos
            setTimeout(() => {
                window.location.href = '/'
            }, 500);

        } catch (error: any) {
            setErro(error.message || 'Ocorreu um erro ao processar seu registro');
            setSucesso(false);
            console.error('Erro no registro:', error);
        } finally {
            setCarregando(false);

        };
    }

    const [foto, setFoto] = useState<File | null>(null); // Para armazenar a foto selecionada
    const [fotoPreview, setFotoPreview] = useState<string | null>(null); // Para armazenar o preview da foto

    // Função para lidar com a seleção de arquivos
    const handleChangeFoto = (e:any) => {
      const file = e.target.files[0];
  
      if (file) {
        // Verifique se o arquivo é uma imagem
        const fileType = file.type.split("/")[0];
        if (fileType !== "image") {
          alert("Por favor, selecione um arquivo de imagem.");
          return;
        }
  
        // Armazene o arquivo e o preview da imagem
        setFoto(file);
  
        // Crie o preview da imagem
        const reader = new FileReader();
        reader.onloadend = () => {
          setFotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 px-6 py-8 text-center">
                    <h2 className="text-3xl font-extrabold text-white">
                        Cadastre sua doação
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 bg-white rounded-lg">
                    <fieldset className="border border-gray-200 rounded-md p-4">
                        <div className="mb-4">
                            <label htmlFor="Descricao" className="block text-lg font-semibold text-gray-700">Descrição:</label>
                            <input
                                margin-top="20px"
                                type="text"
                                id="Descricao"
                                name="Descricao"
                                value={formData.Descricao}
                                onChange={handleChange}
                                required
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="Status" className="block text-lg font-semibold text-gray-700">Status:</label>
                            <select
                                id="Status"
                                name="Status"
                                value={formData.Status}
                                onChange={handleChange}
                                required
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecione o status</option>
                                <option value="disponivel">Disponível</option>
                                <option value="indisponivel">Indisponível</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="Categoria" className="block text-lg font-semibold text-gray-700">Categoria:</label>
                            <select
                                id="Categoria"
                                name="Categoria"
                                value={formData.Categoria}
                                onChange={handleChange}
                                required
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecione a categoria</option>
                                <option value="eletronicos">Eletrônicos</option>
                                <option value="moveis">Móveis</option>
                                <option value="roupas">Roupas</option>
                                <option value="alimentos">Alimentos</option>
                                <option value="brinquedos">Brinquedos</option>
                                <option value="livros">Livros</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="Data_Cadastro"
                                className="block text-lg font-semibold text-gray-700">
                                Data de Cadastro:
                            </label>

                            <input
                                type="datetime-local"
                                id="Data_Cadastro"
                                name="Data_Cadastro"
                                value={formData.Data_Cadastro || ""} // Garantir que seja uma string válida, sem erro de formatação
                                onChange={handleChange}
                                aria-label="Data de Cadastro"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {/* Texto de ajuda explicando o campo */}
                            <p className="text-sm text-gray-500 mt-1">
                                Selecione a data e hora de cadastro.
                            </p>
                        </div>
                            <div className="mb-4">
      <label
        htmlFor="Foto"
        className="block text-lg font-semibold text-gray-700"
      >
        Fotos:
      </label>

      <div className="mt-2">
        <input
          type="file"
          id="Foto"
          name="Foto"
          onChange={handleChangeFoto}
          aria-label="Foto"
          className="hidden" // Oculta o input real
          accept="image/*" // Limita os arquivos para apenas imagens
        />
        <label
          htmlFor="Foto"
          className="w-full p-3 text-center text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600 transition"
        >
          Selecione uma foto
        </label>
      </div>

      {/* Texto de ajuda explicando o campo */}
      <p className="text-sm text-gray-500 mt-1">
        Selecione uma foto.
      </p>

      {/* Exibe a pré-visualização da imagem, se houver */}
      {fotoPreview && (
        <div className="mt-4">
          <img
            src={fotoPreview}
            alt="Pré-visualização da foto"
            className="w-32 h-32 object-cover rounded-md"
          />
        </div>
      )}
    </div>
                        <button
                            type="submit"
                            className="w-full p-3 mt-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Enviar
                        </button>
                    </fieldset>
                </form>
            </div>

        </div>

    );
};


export default FormularioItem;