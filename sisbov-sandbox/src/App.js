import React, { useState } from 'react';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap'; // Importar componentes do react-bootstrap

const operations = {
  consultarDadosAnimal: {
    name: 'Consultar Dados do Animal',
    description: 'Busca os dados de um animal específico pelo seu número SISBOV.',
    params: [
      {
        name: 'numeroSisbov',
        description: 'O número de identificação SISBOV do animal (15 dígitos). Use 123456789012345 para sucesso ou qualquer outro valor para erro.',
        placeholder: 'Ex: 123456789012345',
        type: 'text',
      },
    ],
    exampleData: {
      numeroSisbov: '123456789012345', // Exemplo de sucesso
    },
    endpoint: '/.netlify/functions/consultar-animal',
  },
  incluirPropriedade: {
    name: 'Incluir Propriedade',
    description: 'Cadastra uma nova propriedade rural no sistema SISBOV. Use NIRF 123 para simular um erro.',
    params: [
      { name: '_nirf', description: 'Número do Imóvel na Receita Federal.', placeholder: 'Ex: 12345678901 (sucesso) ou 123 (erro)', type: 'text' },
      { name: '_incra', description: 'Código INCRA da propriedade.', placeholder: 'Ex: 123456789012', type: 'text' },
      { name: '_tipoPropriedade', description: 'Tipo da propriedade (código numérico).', placeholder: 'Ex: 1', type: 'number' },
      { name: '_nomePropriedade', description: 'Nome da fazenda.', placeholder: 'Ex: Fazenda Modelo', type: 'text' },
      { name: '_area', description: 'Área total da propriedade em hectares.', placeholder: 'Ex: 1000', type: 'number' },
      { name: '_logradouro', description: 'Endereço da propriedade.', placeholder: 'Ex: Rua Principal, 123', type: 'text' },
      { name: '_bairro', description: 'Bairro da propriedade.', placeholder: 'Ex: Centro', type: 'text' },
      { name: '_cep', description: 'CEP da propriedade.', placeholder: 'Ex: 70000000', type: 'text' },
      { name: '_codMunicipio', description: 'Código do município (IBGE).', placeholder: 'Ex: 5300108', type: 'text' },
    ],
    exampleData: {
      _nirf: '12345678901',
      _incra: '123456789012',
      _tipoPropriedade: '1',
      _nomePropriedade: 'Fazenda Exemplo',
      _area: '1000',
      _logradouro: 'Rua das Flores, 10',
      _bairro: 'Jardim',
      _cep: '70000000',
      _codMunicipio: '5300108',
    },
    endpoint: '/.netlify/functions/incluir-propriedade',
  },
  movimentarAnimal: {
    name: 'Movimentar Animal',
    description: 'Registra a movimentação de animais entre propriedades. Use idPropriedadeOrigem 99999 para simular um erro.',
    params: [
      { name: 'dataValidade', description: 'Data de validade da GTA (dd/MM/yyyy).', placeholder: 'Ex: 30/06/2025', type: 'date' },
      { name: 'dataEmissao', description: 'Data de emissão da GTA (dd/MM/yyyy).', placeholder: 'Ex: 29/06/2025', type: 'date' },
      { name: 'dataSaida', description: 'Data de saída dos animais da origem (dd/MM/yyyy).', placeholder: 'Ex: 29/06/2025', type: 'date' },
      { name: 'dataChegada', description: 'Data de chegada dos animais ao destino (dd/MM/yyyy).', placeholder: 'Ex: 29/06/2025', type: 'date' },
      { name: 'idPropriedadeOrigem', description: 'ID da propriedade de origem. Use 123 para sucesso, 99999 para erro.', placeholder: 'Ex: 123 (sucesso) ou 99999 (erro)', type: 'number' },
      { name: 'cpfProdutorOrigem', description: 'CPF do produtor de origem.', placeholder: 'Ex: 11122233344', type: 'text' },
      { name: 'cnpjProdutorOrigem', description: 'CNPJ do produtor de origem.', placeholder: 'Ex: 11222333000144', type: 'text' },
      { name: 'idPropriedadeDestino', description: 'ID da propriedade de destino.', placeholder: 'Ex: 456', type: 'number' },
      { name: 'cpfProdutorDestino', description: 'CPF do produtor de destino.', placeholder: 'Ex: 55566677788', type: 'text' },
      { name: 'cnpjProdutorDestino', description: 'CNPJ do produtor de destino.', placeholder: 'Ex: 55666777000188', type: 'text' },
      { name: 'numerosSISBOV', description: 'Lista de números SISBOV dos animais, separados por vírgula.', placeholder: 'Ex: BR.0001.00000000001,BR.0001.00000000002', type: 'text' },
    ],
    exampleData: {
      dataValidade: '30/06/2025',
      dataEmissao: '29/06/2025',
      dataSaida: '29/06/2025',
      dataChegada: '29/06/2025',
      idPropriedadeOrigem: '123',
      cpfProdutorOrigem: '11122233344',
      cnpjProdutorOrigem: '11222333000144',
      idPropriedadeDestino: '456',
      cpfProdutorDestino: '55566677788',
      cnpjProdutorDestino: '55666777000188',
      numerosSISBOV: 'BR.0001.00000000001,BR.0001.00000000002',
    },
    endpoint: '/.netlify/functions/movimentar-animal',
  },
  solicitarNumeracao: {
    name: 'Solicitar Numeração',
    description: 'Solicita um lote de números de identificação (brincos) ao SISBOV. Use qtdeSolicitada fora do range 1-100 para simular um erro.',
    params: [
      { name: 'cnpjFabrica', description: 'CNPJ da fábrica de brincos.', placeholder: 'Ex: 00111222000133', type: 'text' },
      { name: 'cpfProdutor', description: 'CPF do produtor que receberá os brincos.', placeholder: 'Ex: 11122233344', type: 'text' },
      { name: 'cnpjProdutor', description: 'CNPJ do produtor que receberá os brincos.', placeholder: 'Ex: 11222333000144', type: 'text' },
      { name: 'idPropriedade', description: 'ID da propriedade onde os brincos serão utilizados.', placeholder: 'Ex: 123', type: 'number' },
      { name: 'qtdeSolicitada', description: 'Quantidade de números desejada (entre 1 e 100 para sucesso).', placeholder: 'Ex: 10 (sucesso) ou 0 (erro)', type: 'number' },
      { name: 'tipoIdentificacao', description: 'Código do tipo de identificação (Ex: 1 para brinco).', placeholder: 'Ex: 1', type: 'number' },
    ],
    exampleData: {
      cnpjFabrica: '00111222000133',
      cpfProdutor: '11122233344',
      cnpjProdutor: '11222333000144',
      idPropriedade: '123',
      qtdeSolicitada: '10',
      tipoIdentificacao: '1',
    },
    endpoint: '/.netlify/functions/solicitar-numeracao',
  },
  incluirAnimal: {
    name: 'Incluir Animal',
    description: 'Registra um novo animal nascido no Brasil. Use dataNascimento 30/02/2023 para simular um erro.',
    params: [
      { name: 'dataIdentificacao', description: 'Data em que o animal foi identificado (dd/MM/yyyy).', placeholder: 'Ex: 01/01/2023', type: 'date' },
      { name: 'dataNascimento', description: 'Data de nascimento do animal (dd/MM/yyyy). Use 30/02/2023 para erro.', placeholder: 'Ex: 15/12/2022 (sucesso) ou 30/02/2023 (erro)', type: 'date' },
      { name: 'numeroProvisorio', description: 'Numeração provisória, se aplicável.', placeholder: 'Ex: PROV123', type: 'text' },
      { name: 'numeroDefinitivo', description: 'Numeração definitiva (brinco).', placeholder: 'Ex: DEF456', type: 'text' },
      { name: 'idPropriedadeNascimento', description: 'ID da propriedade onde o animal nasceu.', placeholder: 'Ex: 123', type: 'number' },
      { name: 'idPropriedadeLocalizacao', description: 'ID da propriedade onde o animal se encontra.', placeholder: 'Ex: 123', type: 'number' },
      { name: 'idPropriedadeResponsavel', description: 'ID da propriedade do responsável pelo animal.', placeholder: 'Ex: 123', type: 'number' },
      { name: 'numeroSisbov', description: 'O número de identificação oficial do SISBOV.', placeholder: 'Ex: BR.0001.00000000001', type: 'text' },
      { name: 'codigoRaca', description: 'Código da raça do animal.', placeholder: 'Ex: NELORE', type: 'text' },
      { name: 'tipoIdentificacao', description: 'Código do tipo de identificação (Ex: 1 para brinco).', placeholder: 'Ex: 1', type: 'number' },
      { name: 'sexo', description: 'Sexo do animal (M/F).', placeholder: 'Ex: M', type: 'select', options: ['M', 'F'] },
      { name: 'cnpjProdutor', description: 'CNPJ do produtor responsável.', placeholder: 'Ex: 11222333000144', type: 'text' },
      { name: 'cpfProdutor', description: 'CPF do produtor responsável.', placeholder: 'Ex: 11122233344', type: 'text' },
    ],
    exampleData: {
      dataIdentificacao: '01/01/2023',
      dataNascimento: '15/12/2022',
      numeroProvisorio: 'PROV123',
      numeroDefinitivo: 'DEF456',
      idPropriedadeNascimento: '123',
      idPropriedadeLocalizacao: '123',
      idPropriedadeResponsavel: '123',
      numeroSisbov: 'BR.0001.00000000001',
      codigoRaca: 'NELORE',
      tipoIdentificacao: '1',
      sexo: 'M',
      cnpjProdutor: '11222333000144',
      cpfProdutor: '11122233344',
    },
    endpoint: '/.netlify/functions/incluir-animal',
  },
  informarMorteAnimal: {
    name: 'Informar Morte de Animal',
    description: 'Registra o óbito de um animal no sistema SISBOV. Use numeroSisbovAnimal inexistente para simular erro.',
    params: [
      { name: 'numeroSisbovAnimal', description: 'Número SISBOV do animal que morreu.', placeholder: 'Ex: BR.0001.00000000001 (sucesso) ou BR.0001.99999999999 (erro)', type: 'text' },
      { name: 'dataMorte', description: 'Data do óbito (dd/MM/yyyy).', placeholder: 'Ex: 28/06/2025', type: 'date' },
      { name: 'codigoTipoMorte', description: 'Código do tipo de morte (Ex: 1 para Abate, 2 para Doença).', placeholder: 'Ex: 1', type: 'number' },
      { name: 'codigoCausaMorte', description: 'Código da causa específica da morte.', placeholder: 'Ex: 101', type: 'number' },
    ],
    exampleData: {
      numeroSisbovAnimal: 'BR.0001.00000000001',
      dataMorte: '28/06/2025',
      codigoTipoMorte: '1',
      codigoCausaMorte: '101',
    },
    endpoint: '/.netlify/functions/informar-morte-animal',
  },
  consultarPropriedade: {
    name: 'Consultar Propriedade',
    description: 'Busca os dados de uma propriedade específica pelo seu ID. Use ID 99999 para simular erro.',
    params: [
      { name: 'idPropriedade', description: 'ID da propriedade a ser consultada.', placeholder: 'Ex: 1001 (sucesso) ou 99999 (erro)', type: 'number' },
    ],
    exampleData: {
      idPropriedade: '1001',
    },
    endpoint: '/.netlify/functions/consultar-propriedade',
  },
  recuperarTabela: {
    name: 'Recuperar Tabela de Domínio',
    description: 'Recupera os registros de uma tabela de domínio do SISBOV (ex: raças, tipos de morte). Use idTabela 2 para raças, 999 para erro.',
    params: [
      { name: 'idTabela', description: 'ID da tabela a ser recuperada (Ex: 2 para Raças, 999 para erro).', placeholder: 'Ex: 2 (sucesso) ou 999 (erro)', type: 'number' },
    ],
    exampleData: {
      idTabela: '2',
    },
    endpoint: '/.netlify/functions/recuperar-tabela',
  },
  incluirProprietario: {
    name: 'Incluir Proprietário',
    description: 'Cadastra um novo proprietário (Pessoa Física ou Jurídica) no sistema SISBOV. Use CPF/CNPJ já existente para simular erro.',
    params: [
      { name: '_razaoSocial', description: 'Razão Social (para PJ).', placeholder: 'Ex: Empresa Teste Ltda.', type: 'text' },
      { name: '_cnpj', description: 'CNPJ (para PJ). Use 11222333000144 para sucesso, 99999999999999 para erro.', placeholder: 'Ex: 11222333000144', type: 'text' },
      { name: '_nome', description: 'Nome completo (para PF).', placeholder: 'Ex: João da Silva', type: 'text' },
      { name: '_telefone', description: 'Telefone de contato.', placeholder: 'Ex: 61988887777', type: 'text' },
      { name: '_email', description: 'Endereço de e-mail.', placeholder: 'Ex: joao.silva@example.com', type: 'text' },
      { name: '_cpf', description: 'CPF (para PF). Use 11122233344 para sucesso, 99999999999 para erro.', placeholder: 'Ex: 11122233344', type: 'text' },
      { name: '_sexo', description: 'Sexo (M/F).', placeholder: 'Ex: M', type: 'select', options: ['M', 'F'] },
      { name: '_logradouro', description: 'Logradouro do endereço.', placeholder: 'Ex: Rua Exemplo, 123', type: 'text' },
      { name: '_bairro', description: 'Bairro do endereço.', placeholder: 'Ex: Centro', type: 'text' },
      { name: '_cep', description: 'CEP do endereço.', placeholder: 'Ex: 70000000', type: 'text' },
      { name: '_codMunicipio', description: 'Código do município (IBGE).', placeholder: 'Ex: 5300108', type: 'text' },
    ],
    exampleData: {
      _razaoSocial: '',
      _cnpj: '',
      _nome: 'João da Silva',
      _telefone: '61988887777',
      _email: 'joao.silva@example.com',
      _cpf: '11122233344',
      _sexo: 'M',
      _logradouro: 'Rua Exemplo, 123',
      _bairro: 'Centro',
      _cep: '70000000',
      _codMunicipio: '5300108',
    },
    endpoint: '/.netlify/functions/incluir-proprietario',
  },
  const [selectedOperation, setSelectedOperation] = useState(Object.keys(operations)[0]);
  const [params, setParams] = useState({ numeroSisbov: '' });
  const [requestXml, setRequestXml] = useState('');
  const [responseXml, setResponseXml] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null); // null, 'success', 'error'
  const [responseFeedbackMessage, setResponseFeedbackMessage] = useState('');
  const [codeSnippet, setCodeSnippet] = useState(''); // Novo estado para o snippet de código

  const handleOperationChange = (e) => {
    const operationKey = e.target.value;
    setSelectedOperation(operationKey);
    // Reseta os parâmetros ao mudar de operação
    const newParams = {};
    operations[operationKey].params.forEach(p => {
      newParams[p] = '';
    });
    setParams(newParams);
    setRequestXml('');
    setResponseXml('');
  };

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setParams(prevParams => ({ ...prevParams, [name]: value }));
  };

  const handleFillExample = () => {
    const currentOperationDetails = operations[selectedOperation];
    if (currentOperationDetails.exampleData) {
      setParams(currentOperationDetails.exampleData);
    }
  };

  const generateRequestXml = () => {
    const paramXml = Object.entries(params)
      .map(([key, value]) => `<ns0:${key}>${value || ''}</ns0:${key}>`)
      .join('\n      ');

    const xml = `<!-- Requisição gerada pela interface -->\n<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  <soap:Body>\n    <ns0:${selectedOperation} xmlns:ns0="http://servicosWeb.sisbov.mapa.gov.br">\n      <ns0:usuario>usuario_simulado</ns0:usuario>\n      <ns0:senha>senha_simulada</ns0:senha>\n      ${paramXml}\n    </ns0:${selectedOperation}>\n  </soap:Body>\n</soap:Envelope>`;
    setRequestXml(xml);
    return xml;
  };

  // Nova função para gerar o snippet de código
  const generateCodeSnippet = () => {
    const currentOperationDetails = operations[selectedOperation];
    const endpoint = currentOperationDetails.endpoint;
    const paramsJson = JSON.stringify(params, null, 2);

    const snippet = `// Exemplo de requisição usando Fetch API (JavaScript)\nconst endpoint = '${endpoint}';\nconst params = ${paramsJson};\n\nfetch(endpoint, {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n  },\n  body: JSON.stringify(params),\n})\n.then(response => response.text())\n.then(data => {\n  console.log('Resposta do Mock Server:', data);\n  // Aqui você pode parsear o XML 'data' para extrair informações\n})\n.catch(error => {\n  console.error('Erro na requisição:', error);\n});`;
    setCodeSnippet(snippet);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseXml('Carregando...');
    generateRequestXml(); // Atualiza o estado requestXml
    generateCodeSnippet(); // Gera o snippet de código

    const currentOperationDetails = operations[selectedOperation]; // Renomeado para evitar conflito/confusão

    try {
      const response = await fetch(currentOperationDetails.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.text();
      setResponseXml(data);

      // Parsear o XML para extrair o status e mensagens de erro
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");

      const statusNode = xmlDoc.querySelector('status');
      const status = statusNode ? parseInt(statusNode.textContent, 10) : -1; // -1 para indicar que não encontrou

      if (status === 0) {
        setResponseStatus('success');
        setResponseFeedbackMessage('Operação realizada com sucesso!');
      } else {
        setResponseStatus('error');
        let errorMessage = 'Erro na operação. Detalhes:\n';
        const errorItems = xmlDoc.querySelectorAll('listaErros item');
        if (errorItems.length > 0) {
          errorItems.forEach(item => {
            const codigoErro = item.querySelector('codigoErro')?.textContent || 'N/A';
            const mensagemErro = item.querySelector('menssagemErro')?.textContent || 'N/A';
            const valorInformado = item.querySelector('valorInformado item') ? ` (Valor: ${item.querySelector('valorInformado item').textContent})` : '';
            errorMessage += `- Código: ${codigoErro}, Mensagem: ${mensagemErro}${valorInformado}\n`;
          });
        } else {
          errorMessage += 'Nenhum detalhe de erro específico encontrado no XML.';
        }
        setResponseFeedbackMessage(errorMessage);
      }

    } catch (error) {
      console.error('Erro ao chamar a função Netlify:', error);
      setResponseStatus('error');
      setResponseFeedbackMessage(`Erro na comunicação com a API de simulação. Verifique o console do navegador para mais detalhes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const currentOperation = operations[selectedOperation];

  return (
    <div className="container mt-4">
      <header className="text-center mb-4">
        <h1><i className="bi bi-box-seam"></i> Sandbox Interativo SISBOV</h1>
        <p className="lead">Simule chamadas à API do SISBOV de forma visual e didática.</p>
      </header>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">Configuração da Chamada</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="operationSelect" className="form-label">1. Escolha a Operação</label>
                  <select id="operationSelect" className="form-select" value={selectedOperation} onChange={handleOperationChange}>
                    {Object.entries(operations).map(([key, op]) => (
                      <option key={key} value={key}>{op.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                   <p className="form-text">{currentOperation.description}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label">2. Preencha os Parâmetros</label>
                  {currentOperation.params.map(param => (
                    <div className="input-group mb-2" key={param.name}>
                       <span className="input-group-text" style={{minWidth: '120px'}}>{param.name}</span>
                       {param.type === 'select' ? (
                         <select
                           name={param.name}
                           className="form-select"
                           value={params[param.name] || ''}
                           onChange={handleParamChange}
                         >
                           <option value="">Selecione...</option>
                           {param.options.map(option => (
                             <option key={option} value={option}>{option}</option>
                           ))}
                         </select>
                       ) : (
                         <input
                           type={param.type || 'text'}
                           name={param.name}
                           className="form-control"
                           value={params[param.name] || ''}
                           onChange={handleParamChange}
                           placeholder={param.placeholder}
                         />
                       )}
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={(
                          <Popover id={`popover-${param.name}`}>
                            <Popover.Header as="h3">{param.name}</Popover.Header>
                            <Popover.Body>
                              {param.description}
                            </Popover.Body>
                          </Popover>
                        )}
                      >
                        <Button variant="outline-secondary" className="btn-sm">
                          <i className="bi bi-info-circle"></i>
                        </Button>
                      </OverlayTrigger>
                    </div>
                  ))}
                </div>

                {currentOperation.exampleData && (
                  <div className="mb-3 d-grid">
                    <Button variant="outline-info" onClick={handleFillExample}>
                      Preencher com Dados de Exemplo
                    </Button>
                  </div>
                )}

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Executando...' : '3. Executar Simulação'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="row">
            <div className="col-12 mb-3">
              <label htmlFor="request-xml" className="form-label">Requisição XML Gerada</label>
              <textarea
                id="request-xml"
                className="form-control"
                rows="10"
                readOnly
                value={requestXml}
                placeholder="A requisição SOAP/XML aparecerá aqui após o preenchimento dos parâmetros."
              />
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="code-snippet" className="form-label">Snippet de Código (JavaScript)</label>
              <textarea
                id="code-snippet"
                className="form-control"
                rows="10"
                readOnly
                value={codeSnippet}
                placeholder="O snippet de código para esta requisição aparecerá aqui."
              />
            </div>
            <div className="col-12">
              {responseFeedbackMessage && (
                <div className={`alert ${responseStatus === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                  {responseFeedbackMessage}
                </div>
              )}
              <label htmlFor="response-xml" className="form-label">Resposta XML do Mock Server</label>
              <textarea
                id="response-xml"
                className="form-control"
                rows="15"
                readOnly
                value={responseXml}
                placeholder="A resposta do servidor simulado aparecerá aqui após a execução."
              />
            </div>
          </div>
        </div>
      </div>
       <footer className="text-center mt-5 text-muted">
        <p>Este é um ambiente de simulação. Nenhuma chamada real é feita ao servidor do MAPA.</p>
      </footer>
    </div>
  );
}

export default App;
