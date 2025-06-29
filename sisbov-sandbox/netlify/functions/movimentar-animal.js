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
    const { idPropriedadeOrigem, idPropriedadeDestino, numerosSISBOV } = JSON.parse(event.body);

    let xmlContent;
    let filePath;

    // Lógica de simulação para movimentarAnimal
    if (idPropriedadeOrigem === '123' && numerosSISBOV && numerosSISBOV.length > 0) {
      filePath = path.join(process.cwd(), 'api-examples', 'movimentarAnimal_response_success.xml');
      
      // Atualizar a localização dos animais no DB simulado
      const db = readDb();
      const numerosArray = numerosSISBOV.split(',').map(n => n.trim());
      
      db.animais = db.animais.map(animal => {
        if (numerosArray.includes(animal.numeroSisbov)) {
          return { ...animal, idPropriedadeLocalizacao: idPropriedadeDestino };
        }
        return animal;
      });
      writeDb(db);

    } else {
      filePath = path.join(process.cwd(), 'api-examples', 'movimentarAnimal_response_error.xml');
    }

    xmlContent = fs.readFileSync(filePath, 'utf8');

    // Se for erro, personaliza a mensagem de erro
    if (idPropriedadeOrigem !== '123' || !numerosSISBOV || numerosSISBOV.length === 0) {
        if (idPropriedadeOrigem !== '123') {
            xmlContent = xmlContent.replace('<item>99999</item>', `<item>${idPropriedadeOrigem}</item>`);
        }
        if (!numerosSISBOV || numerosSISBOV.length === 0) {
            xmlContent = xmlContent.replace('<ns2:menssagemErro>Pelo menos um número SISBOV é obrigatório.</ns2:menssagemErro>', 
                                          `<ns2:menssagemErro>Pelo menos um número SISBOV é obrigatório. Números informados: ${numerosSISBOV}</ns2:menssagemErro>`);
        }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlContent,
    };

  } catch (error) {
    console.error('Erro na função movimentarAnimal:', error);
    return {
      statusCode: 500,
      body: `<h1>Erro interno no servidor de simulação (movimentarAnimal)</h1><p>${error.message}</p>`,
    };
  }
};
