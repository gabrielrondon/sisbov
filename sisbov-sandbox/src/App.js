import React, { useState } from 'react';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap'; // Importar componentes do react-bootstrap

const operations = {
  consultarDadosAnimal: {
    name: 'Consultar Dados do Animal',
    description: 'Busca os dados de um animal específico pelo seu número SISBOV.',
    params: [
      {
        name: 'numeroSisbov',
        description: 'O número de identificação SISBOV do animal (15 dígitos).',
        placeholder: 'Ex: 123456789012345 (sucesso) ou 999999999999999 (erro)',
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
      { name: '_nirf', description: 'Número do Imóvel na Receita Federal.', placeholder: 'Ex: 12345678901 (sucesso) ou 123 (erro)' },
      { name: '_incra', description: 'Código INCRA da propriedade.', placeholder: 'Ex: 123456789012' },
      { name: '_tipoPropriedade', description: 'Tipo da propriedade (código numérico).', placeholder: 'Ex: 1' },
      { name: '_nomePropriedade', description: 'Nome da fazenda.', placeholder: 'Ex: Fazenda Modelo' },
      { name: '_area', description: 'Área total da propriedade em hectares.', placeholder: 'Ex: 1000' },
      { name: '_logradouro', description: 'Endereço da propriedade.', placeholder: 'Ex: Rua Principal, 123' },
      { name: '_bairro', description: 'Bairro da propriedade.', placeholder: 'Ex: Centro' },
      { name: '_cep', description: 'CEP da propriedade.', placeholder: 'Ex: 70000000' },
      { name: '_codMunicipio', description: 'Código do município (IBGE).', placeholder: 'Ex: 5300108' },
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
      { name: 'dataValidade', description: 'Data de validade da GTA (dd/MM/yyyy).', placeholder: 'Ex: 30/06/2025' },
      { name: 'dataEmissao', description: 'Data de emissão da GTA (dd/MM/yyyy).', placeholder: 'Ex: 29/06/2025' },
      { name: 'dataSaida', description: 'Data de saída dos animais da origem (dd/MM/yyyy).', placeholder: 'Ex: 29/06/2025' },
      { name: 'dataChegada', description: 'Data de chegada dos animais ao destino (dd/MM/yyyy).', placeholder: 'Ex: 29/06/2025' },
      { name: 'idPropriedadeOrigem', description: 'ID da propriedade de origem. Use 123 para sucesso, 99999 para erro.', placeholder: 'Ex: 123 (sucesso) ou 99999 (erro)' },
      { name: 'cpfProdutorOrigem', description: 'CPF do produtor de origem.', placeholder: 'Ex: 11122233344' },
      { name: 'cnpjProdutorOrigem', description: 'CNPJ do produtor de origem.', placeholder: 'Ex: 11222333000144' },
      { name: 'idPropriedadeDestino', description: 'ID da propriedade de destino.', placeholder: 'Ex: 456' },
      { name: 'cpfProdutorDestino', description: 'CPF do produtor de destino.', placeholder: 'Ex: 55566677788' },
      { name: 'cnpjProdutorDestino', description: 'CNPJ do produtor de destino.', placeholder: 'Ex: 55666777000188' },
      { name: 'numerosSISBOV', description: 'Lista de números SISBOV dos animais, separados por vírgula.', placeholder: 'Ex: BR.0001.00000000001,BR.0001.00000000002' },
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
      { name: 'cnpjFabrica', description: 'CNPJ da fábrica de brincos.', placeholder: 'Ex: 00111222000133' },
      { name: 'cpfProdutor', description: 'CPF do produtor que receberá os brincos.', placeholder: 'Ex: 11122233344' },
      { name: 'cnpjProdutor', description: 'CNPJ do produtor que receberá os brincos.', placeholder: 'Ex: 11222333000144' },
      { name: 'idPropriedade', description: 'ID da propriedade onde os brincos serão utilizados.', placeholder: 'Ex: 123' },
      { name: 'qtdeSolicitada', description: 'Quantidade de números desejada (entre 1 e 100 para sucesso).', placeholder: 'Ex: 10 (sucesso) ou 0 (erro)' },
      { name: 'tipoIdentificacao', description: 'Código do tipo de identificação (Ex: 1 para brinco).', placeholder: 'Ex: 1' },
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
      { name: 'dataIdentificacao', description: 'Data em que o animal foi identificado (dd/MM/yyyy).', placeholder: 'Ex: 01/01/2023' },
      { name: 'dataNascimento', description: 'Data de nascimento do animal (dd/MM/yyyy). Use 30/02/2023 para erro.', placeholder: 'Ex: 15/12/2022 (sucesso) ou 30/02/2023 (erro)' },
      { name: 'numeroProvisorio', description: 'Numeração provisória, se aplicável.', placeholder: 'Ex: PROV123' },
      { name: 'numeroDefinitivo', description: 'Numeração definitiva (brinco).', placeholder: 'Ex: DEF456' },
      { name: 'idPropriedadeNascimento', description: 'ID da propriedade onde o animal nasceu.', placeholder: 'Ex: 123' },
      { name: 'idPropriedadeLocalizacao', description: 'ID da propriedade onde o animal se encontra.', placeholder: 'Ex: 123' },
      { name: 'idPropriedadeResponsavel', description: 'ID da propriedade do responsável pelo animal.', placeholder: 'Ex: 123' },
      { name: 'numeroSisbov', description: 'O número de identificação oficial do SISBOV.', placeholder: 'Ex: BR.0001.00000000001' },
      { name: 'codigoRaca', description: 'Código da raça do animal.', placeholder: 'Ex: NELORE' },
      { name: 'tipoIdentificacao', description: 'Código do tipo de identificação (Ex: 1 para brinco).', placeholder: 'Ex: 1' },
      { name: 'sexo', description: 'Sexo do animal (M/F).', placeholder: 'Ex: M' },
      { name: 'cnpjProdutor', description: 'CNPJ do produtor responsável.', placeholder: 'Ex: 11222333000144' },
      { name: 'cpfProdutor', description: 'CPF do produtor responsável.', placeholder: 'Ex: 11122233344' },
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
  // Adicione outras operações aqui no futuro
};

function App() {
  const [selectedOperation, setSelectedOperation] = useState(Object.keys(operations)[0]);
  const [params, setParams] = useState({ numeroSisbov: '' });
  const [requestXml, setRequestXml] = useState('');
  const [responseXml, setResponseXml] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseXml('Carregando...');
    generateRequestXml(); // Atualiza o estado requestXml

    const currentOperationDetails = operations[selectedOperation]; // Renomeado para evitar conflito/confusão

    try {
      const response = await fetch(currentOperationDetails.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.text();
      setResponseXml(data);

    } catch (error) {
      console.error('Erro ao chamar a função Netlify:', error);
      setResponseXml(`// Erro na comunicação com a API de simulação.\n// Verifique o console do navegador para mais detalhes.\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const currentOperation = operations[selectedOperation};

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
                       <input
                        type="text"
                        name={param.name}
                        className="form-control"
                        value={params[param.name] || ''}
                        onChange={handleParamChange}
                        placeholder={param.placeholder}
                      />
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
            <div className="col-12">
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
