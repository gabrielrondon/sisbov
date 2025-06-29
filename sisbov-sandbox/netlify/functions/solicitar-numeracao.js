const fs = require('fs');
const path = require('path');

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
      filePath = path.join(process.env.LAMBDA_TASK_ROOT, 'api-examples', 'solicitarNumeracao_response_success.xml');
    } else {
      filePath = path.join(process.env.LAMBDA_TASK_ROOT, 'api-examples', 'solicitarNumeracao_response_error.xml');
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
