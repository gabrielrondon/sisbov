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
    return { animais: [], propriedades: [], proprietarios: [], numeracoes: [], tabelas: {} };
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
    const { idTabela } = JSON.parse(event.body);

    let xmlContent;
    let filePath;

    const db = readDb();
    const tabelaData = db.tabelas[idTabela];

    // Lógica de simulação para recuperarTabela
    // idTabela = 2 para raças (sucesso)
    // idTabela = 999 para erro
    if (tabelaData) {
      filePath = path.join(process.cwd(), 'api-examples', 'recuperarTabela_response_success.xml');
      xmlContent = fs.readFileSync(filePath, 'utf8');
      
      let registrosXmlItems = '';
      tabelaData.forEach(item => {
        registrosXmlItems += `
          <item xmlns:ns2="http://model.sisbov.mapa.gov.br">
            <ns2:codigo>${item.codigo}</ns2:codigo>
            <ns2:descricao>${item.descricao}</ns2:descricao>
          </item>`;
      });
      xmlContent = xmlContent.replace('<ns1:registros>', `<ns1:registros>${registrosXmlItems}`);

    } else if (idTabela == 2) {
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
