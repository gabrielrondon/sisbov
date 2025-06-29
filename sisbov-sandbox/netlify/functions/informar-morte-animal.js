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
    const { numeroSisbovAnimal, dataMorte, codigoTipoMorte, codigoCausaMorte } = JSON.parse(event.body);

    let xmlContent;
    let filePath;

    const db = readDb();
    const animalExistente = db.animais.find(animal => animal.numeroSisbov === numeroSisbovAnimal);

    if (animalExistente) {
      filePath = path.join(process.cwd(), 'api-examples', 'informarMorteAnimal_response_success.xml');
      xmlContent = fs.readFileSync(filePath, 'utf8');
      
      // Atualiza o status do animal no DB simulado
      db.animais = db.animais.map(animal => {
        if (animal.numeroSisbov === numeroSisbovAnimal) {
          return { ...animal, status: 'MORTO', dataMorte, codigoTipoMorte, codigoCausaMorte };
        }
        return animal;
      });
      writeDb(db);

    } else {
      filePath = path.join(process.cwd(), 'api-examples', 'informarMorteAnimal_response_error.xml');
      xmlContent = fs.readFileSync(filePath, 'utf8');
      xmlContent = xmlContent.replace('<item>BR.0001.99999999999</item>', `<item>${numeroSisbovAnimal}</item>`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlContent,
    };

  } catch (error) {
    console.error('Erro na função informarMorteAnimal:', error);
    return {
      statusCode: 500,
      body: `<h1>Erro interno no servidor de simulação (informarMorteAnimal)</h1><p>${error.message}</p>`,
    };
  }
};
