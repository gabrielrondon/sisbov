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
    return { animais: [], propriedades: [], proprietarios: [] }; // Adiciona proprietarios
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
    const { _cpf, _cnpj, ...rest } = JSON.parse(event.body);

    let xmlContent;
    let filePath;

    const db = readDb();
    const chave = _cpf || _cnpj;
    const tipoChave = _cpf ? 'CPF' : 'CNPJ';

    // Simula erro se CPF/CNPJ já existir
    const proprietarioExistente = db.proprietarios.find(p => (p._cpf === _cpf && _cpf) || (p._cnpj === _cnpj && _cnpj));

    if (proprietarioExistente) {
      filePath = path.join(process.cwd(), 'api-examples', 'incluirProprietario_response_error.xml');
      xmlContent = fs.readFileSync(filePath, 'utf8');
      xmlContent = xmlContent.replace('<item>11122233344</item>', `<item>${chave}</item>`);
    } else if (chave) {
      filePath = path.join(process.cwd(), 'api-examples', 'incluirProprietario_response_success.xml');
      xmlContent = fs.readFileSync(filePath, 'utf8');
      xmlContent = xmlContent.replace('<ns1:chave>11122233344</ns1:chave>', `<ns1:chave>${chave}</ns1:chave>`);
      xmlContent = xmlContent.replace('<ns1:tipoChave>CPF</ns1:tipoChave>', `<ns1:tipoChave>${tipoChave}</ns1:tipoChave>`);

      // Salvar o proprietário no DB simulado
      db.proprietarios.push({ _cpf, _cnpj, ...rest });
      writeDb(db);
    } else {
      // Caso nem CPF nem CNPJ sejam fornecidos
      filePath = path.join(process.cwd(), 'api-examples', 'incluirProprietario_response_error.xml');
      xmlContent = fs.readFileSync(filePath, 'utf8');
      xmlContent = xmlContent.replace('CPF/CNPJ já cadastrado para outro proprietário.', 'CPF ou CNPJ é obrigatório.');
      xmlContent = xmlContent.replace('<item>11122233344</item>', '');
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlContent,
    };

  } catch (error) {
    console.error('Erro na função incluirProprietario:', error);
    return {
      statusCode: 500,
      body: `<h1>Erro interno no servidor de simulação (incluirProprietario)</h1><p>${error.message}</p>`,
    };
  }
};
