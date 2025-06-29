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

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { numeroSisbov } = JSON.parse(event.body);

    let xmlContent;
    let filePath;

    const db = readDb();
    const animalFound = db.animais.find(animal => animal.numeroSisbov === numeroSisbov);

    if (animalFound) {
      filePath = path.join(process.cwd(), 'api-examples', 'consultarDadosAnimal_response_success.xml');
      xmlContent = fs.readFileSync(filePath, 'utf8');
      // Opcional: Popular o XML de sucesso com os dados do animalFound
      // Por simplicidade, vamos apenas retornar o XML de sucesso genérico por enquanto.
      // Para popular, seria necessário um parser XML mais robusto ou templates.
      xmlContent = xmlContent.replace('<ns1:numero>123456789012345</ns1:numero>', `<ns1:numero>${animalFound.numeroSisbov}</ns1:numero>`);
      xmlContent = xmlContent.replace('<ns1:dataNascimento>15/12/2022</ns1:dataNascimento>', `<ns1:dataNascimento>${animalFound.dataNascimento}</ns1:dataNascimento>`);
      xmlContent = xmlContent.replace('<ns1:sexo>M</ns1:sexo>', `<ns1:sexo>${animalFound.sexo}</ns1:sexo>`);
      xmlContent = xmlContent.replace('<ns1:raca>NELORE</ns1:raca>', `<ns1:raca>${animalFound.codigoRaca}</ns1:raca>`);
      xmlContent = xmlContent.replace('<ns1:dataIdentificacao>01/01/2023</ns1:dataIdentificacao>', `<ns1:dataIdentificacao>${animalFound.dataIdentificacao}</ns1:dataIdentificacao>`);

    } else {
      filePath = path.join(process.cwd(), 'api-examples', 'consultarDadosAnimal_response_error.xml');
      xmlContent = fs.readFileSync(filePath, 'utf8');
      // Substitui o valor de exemplo no XML de erro pelo valor que o usuário digitou
      xmlContent = xmlContent.replace('<item>999999999999999</item>', `<item>${numeroSisbov}</item>`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlContent,
    };

  } catch (error) {
    console.error('Erro na função consultarAnimal:', error);
    return {
      statusCode: 500,
      body: `<h1>Erro interno no servidor de simulação (consultarAnimal)</h1><p>${error.message}</p>`,
    };
  }
};
