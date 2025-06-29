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
    return { animais: [], propriedades: [], proprietarios: [] };
  }
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { idTabela } = JSON.parse(event.body);

    let xmlContent;
    let filePath;

    // Lógica de simulação para recuperarTabela
    // idTabela = 2 para raças (sucesso)
    // idTabela = 999 para erro
    if (idTabela == 2) {
      filePath = path.join(process.cwd(), 'api-examples', 'recuperarTabela_response_success.xml');
    } else {
      filePath = path.join(process.cwd(), 'api-examples', 'recuperarTabela_response_error.xml');
    }

    xmlContent = fs.readFileSync(filePath, 'utf8');

    // Se for erro, personaliza a mensagem de erro
    if (idTabela != 2) {
        xmlContent = xmlContent.replace('<item>999</item>', `<item>${idTabela}</item>`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlContent,
    };

  } catch (error) {
    console.error('Erro na função recuperarTabela:', error);
    return {
      statusCode: 500,
      body: `<h1>Erro interno no servidor de simulação (recuperarTabela)</h1><p>${error.message}</p>`,
    };
  }
};
