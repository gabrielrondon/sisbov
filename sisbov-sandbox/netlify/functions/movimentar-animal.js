const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { idPropriedadeOrigem, numerosSISBOV } = JSON.parse(event.body);

    let xmlContent;
    let filePath;

    // Lógica de simulação para movimentarAnimal
    // Retorna sucesso se idPropriedadeOrigem for '123' e houver numerosSISBOV
    // Retorna erro caso contrário
    if (idPropriedadeOrigem === '123' && numerosSISBOV && numerosSISBOV.length > 0) {
      filePath = path.join(process.env.LAMBDA_TASK_ROOT, 'api-examples', 'movimentarAnimal_response_success.xml');
    } else {
      filePath = path.join(process.env.LAMBDA_TASK_ROOT, 'api-examples', 'movimentarAnimal_response_error.xml');
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
