const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { numeroSisbov, dataNascimento } = JSON.parse(event.body);

    let xmlContent;
    let filePath;

    // Lógica de simulação para incluirAnimal
    // Retorna sucesso se numeroSisbov e dataNascimento forem válidos
    // Retorna erro se numeroSisbov estiver vazio ou dataNascimento for '30/02/2023'
    if (numeroSisbov && dataNascimento && dataNascimento !== '30/02/2023') {
      filePath = path.join(process.env.LAMBDA_TASK_ROOT, 'api-examples', 'incluirAnimal_response_success.xml');
    } else {
      filePath = path.join(process.env.LAMBDA_TASK_ROOT, 'api-examples', 'incluirAnimal_response_error.xml');
    }

    xmlContent = fs.readFileSync(filePath, 'utf8');

    // Se for erro, personaliza a mensagem de erro com o numeroSisbov e dataNascimento informados
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