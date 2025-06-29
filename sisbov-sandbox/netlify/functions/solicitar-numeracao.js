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
    return { animais: [], propriedades: [] }; // Retorna estrutura vazia em caso de erro
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
