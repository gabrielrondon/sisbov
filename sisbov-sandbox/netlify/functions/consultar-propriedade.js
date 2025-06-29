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
    const { idPropriedade } = JSON.parse(event.body);

    let xmlContent;
    let filePath;

    const db = readDb();
    const propriedadeFound = db.propriedades.find(prop => prop.idPropriedade == idPropriedade); // Usar == para comparar string com number

    if (propriedadeFound) {
      filePath = path.join(process.cwd(), 'api-examples', 'consultarPropriedade_response_success.xml');
      xmlContent = fs.readFileSync(filePath, 'utf8');
      
      // Popular o XML de sucesso com os dados da propriedade encontrada
      xmlContent = xmlContent.replace('<ns1:nirf>12345678901</ns1:nirf>', `<ns1:nirf>${propriedadeFound._nirf}</ns1:nirf>`);
      xmlContent = xmlContent.replace('<ns1:incra>123456789012</ns1:incra>', `<ns1:incra>${propriedadeFound._incra}</ns1:incra>`);
      xmlContent = xmlContent.replace('<ns1:nomePropriedade>Fazenda Exemplo</ns1:nomePropriedade>', `<ns1:nomePropriedade>${propriedadeFound._nomePropriedade}</ns1:nomePropriedade>`);
      xmlContent = xmlContent.replace('<ns1:area>1000</ns1:area>', `<ns1:area>${propriedadeFound._area}</ns1:area>`);
      xmlContent = xmlContent.replace('<ns1:logradouro>Rua das Flores, 10</ns1:logradouro>', `<ns1:logradouro>${propriedadeFound._logradouro}</ns1:logradouro>`);
      xmlContent = xmlContent.replace('<ns1:bairro>Centro</ns1:bairro>', `<ns1:bairro>${propriedadeFound._bairro}</ns1:bairro>`);
      xmlContent = xmlContent.replace('<ns1:cep>70000000</ns1:cep>', `<ns1:cep>${propriedadeFound._cep}</ns1:cep>`);
      xmlContent = xmlContent.replace('<ns1:codMunicipio>5300108</ns1:codMunicipio>', `<ns1:codMunicipio>${propriedadeFound._codMunicipio}</ns1:codMunicipio>`);

    } else {
      filePath = path.join(process.cwd(), 'api-examples', 'consultarPropriedade_response_error.xml');
      xmlContent = fs.readFileSync(filePath, 'utf8');
      xmlContent = xmlContent.replace('<item>99999</item>', `<item>${idPropriedade}</item>`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlContent,
    };

  } catch (error) {
    console.error('Erro na função consultarPropriedade:', error);
    return {
      statusCode: 500,
      body: `<h1>Erro interno no servidor de simulação (consultarPropriedade)</h1><p>${error.message}</p>`,
    };
  }
};
