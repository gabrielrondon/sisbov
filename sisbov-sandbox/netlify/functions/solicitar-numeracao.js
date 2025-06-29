const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'db.json');

// Função auxiliar para ler o DB
const readDb = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler db.json:', error);
    return { animais: [], propriedades: [], proprietarios: [], numeracoes: [] }; // Retorna estrutura vazia em caso de erro
  }
};

// Função auxiliar para escrever no DB
const writeDb = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Erro ao escrever db.json:', error);
  }
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { qtdeSolicitada } = JSON.parse(event.body);

    let xmlContent;
    let filePath;

    // Lógica de simulação para solicitarNumeracao
    // Retorna sucesso se qtdeSolicitada for entre 1 e 100
    // Retorna erro caso contrário
    if (qtdeSolicitada >= 1 && qtdeSolicitada <= 100) {
      filePath = path.join(process.cwd(), 'api-examples', 'solicitarNumeracao_response_success.xml');
      
      const db = readDb();
      const lastSolicitacaoId = db.numeracoes.length > 0 ? Math.max(...db.numeracoes.map(n => n.numeroSolicitacao)) : 10000;
      const newSolicitacaoId = lastSolicitacaoId + 1;

      let lastSisbovNum = 0;
      if (db.numeracoes.length > 0) {
        const allGeneratedNumbers = db.numeracoes.flatMap(n => n.numeros);
        if (allGeneratedNumbers.length > 0) {
          const lastNumStr = allGeneratedNumbers[allGeneratedNumbers.length - 1].numero;
          lastSisbovNum = parseInt(lastNumStr.split('.')[2], 10);
        }
      }

      const generatedNumbers = [];
      let numeracaoXmlItems = '';
      for (let i = 0; i < qtdeSolicitada; i++) {
        const sisbovNum = `BR.0001.${String(lastSisbovNum + 1 + i).padStart(11, '0')}`;
        generatedNumbers.push({ numero: sisbovNum, statusUtilizacao: 'DISPONIVEL' });
        numeracaoXmlItems += `
          <item xmlns:ns2="http://model.sisbov.mapa.gov.br">
            <ns2:numero>${sisbovNum}</ns2:numero>
            <ns2:statusUtilizacao>DISPONIVEL</ns2:statusUtilizacao>
          </item>`;
      }

      db.numeracoes.push({
        numeroSolicitacao: newSolicitacaoId,
        qtdeSolicitada: qtdeSolicitada,
        numeros: generatedNumbers,
        status: 'CONCLUIDA',
        dataSolicitacao: new Date().toISOString().split('T')[0],
      });
      writeDb(db);

      xmlContent = fs.readFileSync(filePath, 'utf8');
      xmlContent = xmlContent.replace('<ns1:numeracao>', `<ns1:numeracao>${numeracaoXmlItems}`);
      xmlContent = xmlContent.replace('<ns1:numeroSolicitacao>12345</ns1:numeroSolicitacao>', `<ns1:numeroSolicitacao>${newSolicitacaoId}</ns1:numeroSolicitacao>`);

    } else {
      filePath = path.join(process.cwd(), 'api-examples', 'solicitarNumeracao_response_error.xml');
    }

    xmlContent = fs.readFileSync(filePath, 'utf8');

    // Se for erro, personaliza a mensagem de erro com a qtdeSolicitada informada
    if (!(qtdeSolicitada >= 1 && qtdeSolicitada <= 100)) {
        xmlContent = xmlContent.replace('<item>0</item>', `<item>${qtdeSolicitada}</item>`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlContent,
    };

  } catch (error) {
    console.error('Erro na função solicitarNumeracao:', error);
    return {
      statusCode: 500,
      body: `<h1>Erro interno no servidor de simulação (solicitarNumeracao)</h1><p>${error.message}</p>`,
    };
  }
};
