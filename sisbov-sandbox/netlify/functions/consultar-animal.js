const fs = require('fs');
const path = require('path');

// Handler principal da Netlify Function
exports.handler = async (event, context) => {
  // Só aceitamos requisições POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { numeroSisbov } = JSON.parse(event.body);

    let xmlContent;
    let filePath;

    // Lógica de simulação: se o número for o de "sucesso", retorna a resposta de sucesso.
    // Caso contrário, retorna a resposta de erro.
    if (numeroSisbov === '123456789012345') {
      filePath = path.join(process.env.LAMBDA_TASK_ROOT, 'api-examples', 'consultarDadosAnimal_response_success.xml');
    } else {
      filePath = path.join(process.env.LAMBDA_TASK_ROOT, 'api-examples', 'consultarDadosAnimal_response_error.xml');
    }

    xmlContent = fs.readFileSync(filePath, 'utf8');

    // Substitui os valores de exemplo no XML de erro pelo valor que o usuário digitou
    if (numeroSisbov !== '123456789012345') {
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
    console.error('Erro na função:', error);
    return {
      statusCode: 500,
      body: `<h1>Erro interno no servidor de simulação</h1><p>${error.message}</p>`,
    };
  }
};
