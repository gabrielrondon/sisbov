const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { _nomePropriedade, _nirf } = JSON.parse(event.body);

    let xmlContent;
    let filePath;

    // Lógica de simulação para incluirPropriedade
    // Retorna sucesso se _nomePropriedade e _nirf forem preenchidos e _nirf não for '123'
    if (_nomePropriedade && _nirf && _nirf !== '123') {
      filePath = path.join(process.cwd(), 'api-examples', 'incluirPropriedade_response_success.xml');
    } else {
      filePath = path.join(process.cwd(), 'api-examples', 'incluirPropriedade_response_error.xml');
    }

    xmlContent = fs.readFileSync(filePath, 'utf8');

    // Se for erro, personaliza a mensagem de erro
    if (!_nomePropriedade || _nirf === '123') {
        if (!_nomePropriedade) {
            xmlContent = xmlContent.replace('<ns2:menssagemErro>Campo \'nomePropriedade\' é obrigatório.</ns2:menssagemErro>', 
                                          `<ns2:menssagemErro>Campo \'nomePropriedade\' é obrigatório. Valor informado: ${_nomePropriedade}</ns2:menssagemErro>`);
        }
        if (_nirf === '123') {
            xmlContent = xmlContent.replace('<ns2:menssagemErro>NIRF inválido.</ns2:menssagemErro>', 
                                          `<ns2:menssagemErro>NIRF inválido. Valor informado: ${_nirf}</ns2:menssagemErro>`);
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
    console.error('Erro na função incluirPropriedade:', error);
    return {
      statusCode: 500,
      body: `<h1>Erro interno no servidor de simulação (incluirPropriedade)</h1><p>${error.message}</p>`,
    };
  }
};