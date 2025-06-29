const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'db.json');

const INITIAL_DB_STATE = {
  animais: [],
  propriedades: [],
  proprietarios: [],
  numeracoes: [],
  tabelas: {
    // Exemplo de dados iniciais para tabelas de domínio
    2: [ // idTabela 2 para Raças
      { codigo: '01', descricao: 'NELORE' },
      { codigo: '02', descricao: 'ANGUS' },
      { codigo: '03', descricao: 'BRAHMAN' },
      { codigo: '04', descricao: 'GUZERA' },
      { codigo: '05', descricao: 'GIR' },
    ],
    // Adicione outras tabelas de domínio aqui conforme necessário
  },
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DB_STATE, null, 2), 'utf8');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Banco de dados simulado resetado com sucesso!' }),
    };

  } catch (error) {
    console.error('Erro ao resetar db.json:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Erro interno ao resetar o banco de dados: ${error.message}` }),
    };
  }
};
