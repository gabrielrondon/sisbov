import React, { useState } from 'react';

// Um objeto para definir as operações que vamos suportar
const operations = {
  consultarDadosAnimal: {
    name: 'Consultar Dados do Animal',
    description: 'Busca os dados de um animal específico pelo seu número SISBOV.',
    params: ['numeroSisbov'],
    endpoint: '/.netlify/functions/consultar-animal'
  },
  incluirPropriedade: {
    name: 'Incluir Propriedade',
    description: 'Cadastra uma nova propriedade rural no sistema SISBOV.',
    params: ['_nirf', '_incra', '_tipoPropriedade', '_nomePropriedade', '_area', '_logradouro', '_bairro', '_cep', '_codMunicipio'],
    endpoint: '/.netlify/functions/incluir-propriedade'
  },
  movimentarAnimal: {
    name: 'Movimentar Animal',
    description: 'Registra a movimentação de animais entre propriedades.',
    params: ['dataValidade', 'dataEmissao', 'dataSaida', 'dataChegada', 'idPropriedadeOrigem', 'cpfProdutorOrigem', 'cnpjProdutorOrigem', 'idPropriedadeDestino', 'cpfProdutorDestino', 'cnpjProdutorDestino', 'numerosSISBOV'], // Simplificado para o mock
    endpoint: '/.netlify/functions/movimentar-animal'
  },
  solicitarNumeracao: {
    name: 'Solicitar Numeração',
    description: 'Solicita um lote de números de identificação (brincos) ao SISBOV.',
    params: ['cnpjFabrica', 'cpfProdutor', 'cnpjProdutor', 'idPropriedade', 'qtdeSolicitada', 'tipoIdentificacao'],
    endpoint: '/.netlify/functions/solicitar-numeracao'
  },
  incluirAnimal: {
    name: 'Incluir Animal',
    description: 'Registra um novo animal no sistema SISBOV.',
    params: ['dataIdentificacao', 'dataNascimento', 'numeroProvisorio', 'numeroDefinitivo', 'idPropriedadeNascimento', 'idPropriedadeLocalizacao', 'idPropriedadeResponsavel', 'numeroSisbov', 'codigoRaca', 'tipoIdentificacao', 'sexo', 'cnpjProdutor', 'cpfProdutor'],
    endpoint: '/.netlify/functions/incluir-animal'
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

  const generateRequestXml = () => {
    const operation = operations[selectedOperation];
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
                    <div className="input-group mb-2" key={param}>
                       <span className="input-group-text" style={{minWidth: '120px'}}>{param}</span>
                       <input
                        type="text"
                        name={param}
                        className="form-control"
                        value={params[param] || ''}
                        onChange={handleParamChange}
                        placeholder={`Valor para ${param}`}
                      />
                    </div>
                  ))}
                </div>

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