import React, { useState, ChangeEvent, FormEvent } from 'react';

// Definindo interface para tipagem dos dados do formulário
interface FormDataType {
  tipoUsuario: number;
  nomeRazaoSocial: string;
  cpfCnpj: string;
  logradouro: string;
  numeroLogradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  cep: string;
  email: string;
  celular: string;
  senha: string;
  confirmacaoSenha: string;
}

// Interface para a resposta da API ViaCEP
interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

const RegistroUsuario: React.FC = () => {
  // Estado inicial do formulário
  const initialFormState: FormDataType = {
    tipoUsuario: 1,
    nomeRazaoSocial: '',
    cpfCnpj: '',
    logradouro: '',
    numeroLogradouro: '',
    complemento: '',
    bairro: '',
    localidade: '',
    uf: '',
    cep: '',
    email: '',
    celular: '',
    senha: '',
    confirmacaoSenha: ''
  };

  const [formData, setFormData] = useState<FormDataType>(initialFormState);
  const [erro, setErro] = useState<string>('');
  const [sucesso, setSucesso] = useState<boolean>(false);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [cepInvalido, setCepInvalido] = useState<boolean>(false);

  // Handler para mudanças nos campos do formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    // Reset do erro de CEP quando o usuário digita no campo
    if (name === 'cep' && cepInvalido) {
      setCepInvalido(false);
    }
    
    // Reset de erro geral quando o usuário digita em qualquer campo
    if (erro) {
      setErro('');
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para formatar CPF/CNPJ automaticamente
  const formatCpfCnpj = (value: string): string => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');

    // Verifica se é CPF ou CNPJ baseado no comprimento
    if (numericValue.length <= 11) {
      // Formato CPF: 000.000.000-00
      return numericValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Formato CNPJ: 00.000.000/0000-00
      return numericValue
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
  };

  // Handler específico para CPF/CNPJ para formatar durante digitação
  const handleCpfCnpjChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    // Mantenha apenas números para processamento
    const numbersOnly = value.replace(/\D/g, '');
    
    // Limite para CPF (11) ou CNPJ (14)
    if (numbersOnly.length <= 14) {
      const formattedValue = formatCpfCnpj(numbersOnly);
      setFormData((prev) => ({ ...prev, cpfCnpj: formattedValue }));
    }
  };

  // Handler específico para CEP para formatar durante digitação
  const handleCepChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    // Mantenha apenas números
    const numbersOnly = value.replace(/\D/g, '');
    
    // Limite a 8 dígitos
    if (numbersOnly.length <= 8) {
      // Formato CEP: 00000-000
      const formattedValue = numbersOnly.replace(/^(\d{5})(\d)/, '$1-$2');
      setFormData((prev) => ({ ...prev, cep: formattedValue }));
      
      // Reset do erro de CEP quando o usuário digita no campo
      if (cepInvalido) {
        setCepInvalido(false);
      }
    }
  };

  // Função para buscar CEP
  const buscarCep = async (): Promise<void> => {
    // Remove caracteres não numéricos para a busca
    const cepNumerico = formData.cep.replace(/\D/g, '');
    
    if (cepNumerico.length !== 8) {
      setErro('CEP deve conter 8 dígitos');
      setCepInvalido(true);
      return;
    }

    try {
      setCarregando(true);
      const resposta = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
      
      // Verifica se a resposta foi bem-sucedida
      if (!resposta.ok) {
        throw new Error(`Erro na requisição: ${resposta.status}`);
      }
      
      const dados: ViaCepResponse = await resposta.json();

      if (dados.erro) {
        setErro('CEP não encontrado');
        setCepInvalido(true);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        logradouro: dados.logradouro || prev.logradouro,
        bairro: dados.bairro || prev.bairro,
        localidade: dados.localidade || prev.localidade,
        uf: dados.uf || prev.uf,
        complemento: dados.complemento || prev.complemento
      }));
      
      setErro('');
      setCepInvalido(false);
    } catch (error) {
      setErro('Erro ao buscar CEP. Verifique sua conexão e tente novamente.');
      console.error('Erro na busca de CEP:', error);
    } finally {
      setCarregando(false);
    }
  };

  // Validação do formulário
  const validarFormulario = (): boolean => {
    // Validação de força de senha
    if (formData.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    if (formData.senha !== formData.confirmacaoSenha) {
      setErro('As senhas não coincidem');
      return false;
    }
    
    // Verificar campos obrigatórios
    const camposObrigatorios = [
      'nomeRazaoSocial', 'cpfCnpj', 'logradouro', 'numeroLogradouro', 
      'bairro', 'localidade', 'uf', 'cep', 'email', 'senha'
    ];
    
    for (const campo of camposObrigatorios) {
      if (!formData[campo as keyof FormDataType]) {
        setErro(`O campo ${campo} é obrigatório`);
        return false;
      }
    }
    
    // Validação de CPF/CNPJ
    const cpfCnpjNumerico = formData.cpfCnpj.replace(/\D/g, '');
    if (formData.tipoUsuario === 1 && cpfCnpjNumerico.length !== 11) {
      setErro('CPF inválido. Deve conter 11 dígitos');
      return false;
    }
    
    if (formData.tipoUsuario === 2 && cpfCnpjNumerico.length !== 14) {
      setErro('CNPJ inválido. Deve conter 14 dígitos');
      return false;
    }
    
    // Validação de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(formData.email)) {
      setErro('Email inválido');
      return false;
    }
    
    // Validação de número
    if (isNaN(Number(formData.numeroLogradouro))) {
      setErro('O campo Número deve conter apenas valores numéricos');
      return false;
    }
    
    return true;
  };

  // Handler de envio do formulário
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    setCarregando(true);
    
    try {
      // Preparando os dados para envio conforme a estrutura do banco
      const dadosParaEnvio = {
        TipoUsuario: parseInt(formData.tipoUsuario.toString()),
        NomeRazaoSocial: formData.nomeRazaoSocial,
        CPFCNPJ: formData.cpfCnpj.replace(/\D/g, ''), // Remove formatação
        Logradouro: formData.logradouro,
        NumeroLogradouro: parseInt(formData.numeroLogradouro),
        Complemento: formData.complemento,
        Bairro: formData.bairro,
        Localidade: formData.localidade,
        UF: formData.uf,
        Cep: formData.cep.replace(/\D/g, ''), // Remove formatação
        Email: formData.email,
        Celular: formData.celular,
        Senha: formData.senha
      };
      
      const resposta = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:'include',
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
      }
      
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
    }
  };

  // Lista de estados brasileiros
  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", 
    "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", 
    "SP", "SE", "TO"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Criar sua conta
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            Insira seus dados para se registrar em nossa plataforma
          </p>
        </div>
        
        <div className="p-6 sm:p-8">
          {sucesso && (
            <div className="mb-6 rounded-md bg-green-50 p-4 animate-pulse">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Registro realizado com sucesso! Redirecionando para o login...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress indicator */}
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 w-1/2"></div>
              </div>
              <p className="text-xs text-gray-500 text-right">Preencha todos os campos obrigatórios (*)</p>
            </div>
            
            {/* Tipo de usuário selector with icon */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Usuário*
              </label>
              <div className="flex space-x-4">
                <div 
                  className={`flex-1 flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.tipoUsuario === 1 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, tipoUsuario: 1 }))}
                >
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="mt-2 block text-sm font-medium">
                      Pessoa Física
                    </span>
                  </div>
                </div>
                
                <div 
                  className={`flex-1 flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.tipoUsuario === 2 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, tipoUsuario: 2 }))}
                >
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="mt-2 block text-sm font-medium">
                      Pessoa Jurídica
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fieldset para agrupar dados pessoais */}
            <fieldset className="border border-gray-200 rounded-md p-4">
              <legend className="text-sm font-medium text-gray-700 px-2">
                Dados {formData.tipoUsuario === 1 ? 'Pessoais' : 'da Empresa'}
              </legend>
              
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="nomeRazaoSocial" className="block text-sm font-medium text-gray-700">
                    {formData.tipoUsuario === 1 ? "Nome Completo*" : "Razão Social*"}
                  </label>
                  <input
                    type="text"
                    name="nomeRazaoSocial"
                    id="nomeRazaoSocial"
                    value={formData.nomeRazaoSocial}
                    onChange={handleChange}
                    required
                    placeholder={formData.tipoUsuario === 1 ? "Ex: João da Silva" : "Ex: Empresa LTDA"}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="cpfCnpj" className="block text-sm font-medium text-gray-700">
                    {formData.tipoUsuario === 1 ? "CPF*" : "CNPJ*"}
                  </label>
                  <input
                    type="text"
                    name="cpfCnpj"
                    id="cpfCnpj"
                    value={formData.cpfCnpj}
                    onChange={handleCpfCnpjChange}
                    required
                    placeholder={formData.tipoUsuario === 1 ? "000.000.000-00" : "00.000.000/0000-00"}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="seu@email.com"
                  className="mt-1 block w-[50%] rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="celular" className="block text-sm font-medium text-gray-700">
                  Celular*
                </label>
                <input
                  type="text"
                  name="celular"
                  id="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  required
                  placeholder="Celular"
                  className="mt-1 block w-[50%] rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </fieldset>
            
            {/* Fieldset para agrupar endereço */}
            <fieldset className="border border-gray-200 rounded-md p-4">
              <legend className="text-sm font-medium text-gray-700 px-2">
                Endereço
              </legend>
              
              <div className="mb-4">
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                  CEP*
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="cep"
                    id="cep"
                    value={formData.cep}
                    onChange={handleCepChange}
                    required
                    placeholder="00000-000"
                    className={`block w-full flex-1 rounded-none rounded-l-md ${
                      cepInvalido ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={buscarCep}
                    disabled={carregando || cepInvalido}
                    className={`inline-flex items-center rounded-r-md border border-l-0 px-4 py-2 text-sm font-medium ${
                      carregando 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {carregando ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Buscando...
                      </>
                    ) : (
                      'Buscar'
                    )}
                  </button>
                </div>
                {cepInvalido && (
                  <p className="mt-1 text-sm text-red-600">CEP inválido ou não encontrado</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700">
                    Logradouro*
                  </label>
                  <input
                    type="text"
                    name="logradouro"
                    id="logradouro"
                    value={formData.logradouro}
                    onChange={handleChange}
                    required
                    placeholder="Rua, Avenida, etc."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="numeroLogradouro" className="block text-sm font-medium text-gray-700">
                    Número*
                  </label>
                  <input
                    type="text"
                    name="numeroLogradouro"
                    id="numeroLogradouro"
                    value={formData.numeroLogradouro}
                    onChange={handleChange}
                    required
                    placeholder="Nº"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">
                  Complemento
                </label>
                <input
                  type="text"
                  name="complemento"
                  id="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  placeholder="Apto, Bloco, etc."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="mt-4">
                <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
                  Bairro*
                </label>
                <input
                  type="text"
                  name="bairro"
                  id="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                  placeholder="Seu bairro"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="mt-4 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="localidade" className="block text-sm font-medium text-gray-700">
                    Cidade*
                  </label>
                  <input
                    type="text"
                    name="localidade"
                    id="localidade"
                    value={formData.localidade}
                    onChange={handleChange}
                    required
                    placeholder="Sua cidade"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="uf" className="block text-sm font-medium text-gray-700">
                    Estado*
                  </label>
                  <select
                    name="uf"
                    id="uf"
                    value={formData.uf}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Selecione o estado</option>
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>
            
            {/* Fieldset para agrupar senha */}
            <fieldset className="border border-gray-200 rounded-md p-4">
              <legend className="text-sm font-medium text-gray-700 px-2">
                Senha de acesso
              </legend>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                    Senha*
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="password"
                      name="senha"
                      id="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      required
                      placeholder="Mínimo 6 caracteres"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmacaoSenha" className="block text-sm font-medium text-gray-700">
                    Confirmar Senha*
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="password"
                      name="confirmacaoSenha"
                      id="confirmacaoSenha"
                      value={formData.confirmacaoSenha}
                      onChange={handleChange}
                      required
                      placeholder="Confirme sua senha"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {formData.senha === formData.confirmacaoSenha ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )
                    }
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Use uma senha forte com letras, números e caracteres especiais
                  </p>
                </div>
              </div>
            </fieldset>
            
            {/* Exibição de erro */}
            {erro && (
              <div className="rounded-md bg-red-50 p-4 animate-bounce">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Atenção</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{erro}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Termos e condições */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  Li e aceito os{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    termos e condições
                  </a>
                  {' '}e a{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    política de privacidade
                  </a>*
                </label>
              </div>
            </div>
            
            {/* Botão de envio */}
            <div>
              <button
                type="submit"
                disabled={carregando}
                className={`group relative flex w-full justify-center rounded-md border border-transparent py-3 px-4 text-sm font-medium text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  carregando 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  {carregando ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-blue-300 group-hover:text-blue-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                {carregando ? 'Processando...' : 'Criar conta'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Entrar agora
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroUsuario;