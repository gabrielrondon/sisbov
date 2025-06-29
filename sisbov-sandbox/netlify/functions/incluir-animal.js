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
    const { numeroSisbov, dataNascimento, ...rest } = JSON.parse(event.body);

    let xmlContent;
    let filePath;

    // Lógica de simulação para incluirAnimal
    if (numeroSisbov && dataNascimento && dataNascimento !== '30/02/2023') {
      filePath = path.join(process.cwd(), 'api-examples', 'incluirAnimal_response_success.xml');
      
      // Salvar o animal no DB simulado
      const db = readDb();
      db.animais.push({ numeroSisbov, dataNascimento, ...rest });
      writeDb(db);

    } else {
      filePath = path.join(process.cwd(), 'api-examples', 'incluirAnimal_response_error.xml');
    }

    xmlContent = fs.readFileSync(filePath, 'utf8');

    // Se for erro, personaliza a mensagem de erro
    if (!numeroSisbov || dataNascimento === '30/02/2023') {
        xmlContent = xmlContent.replace('<ns2:menssagemErro>Campo \'numeroSisbov\' é obrigatório e não foi preenchido.</ns2:menssagemErro>', 
                                      `<ns2:menssagemErro>Campo \'numeroSisbov\' é obrigatório e não foi preenchido. Valor informado: ${numeroSisbov}</ns2:menssagemErro>`);
        xmlContent = xmlContent.replace('<ns2:menssagemErro>Data de nascimento inválida.</ns2:menssagemErro>', 
                                      `<ns2:menssagemErro>Data de nascimento inválida. Valor informado: ${dataNascimento}</ns2:menssagemErro>`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlContent,
    };

  } catch (error) {
    console.error('Erro na função incluirAnimal:', error);
    return {
      statusCode: 500,
      body: `<h1>Erro interno no servidor de simulação (incluirAnimal)</h1><p>${error.message}</p>`,
    };
  }
};