# Identificadores (Brincos)

A solicitação e o gerenciamento dos números de identificação (brincos) são processos centrais para o funcionamento do SISBOV. O web service provê um conjunto de operações para lidar com este fluxo.

### `solicitarNumeracao`

Inicia o processo de solicitação de uma nova faixa de números de identificação para uma fábrica de brincos.

**Parâmetros:**

*   `usuario`, `senha` (string): Credenciais.
*   `cnpjFabrica` (string): CNPJ da empresa que fabrica os brincos.
*   `cpfProdutor`, `cnpjProdutor` (string): Identificação do produtor que receberá os brincos.
*   `idPropriedade` (long): ID da propriedade onde os brincos serão utilizados.
*   `qtdeSolicitada` (long): Quantidade de números desejada.
*   `tipoIdentificacao` (long): Código do tipo de identificador.

O retorno desta chamada inclui o `numeroSolicitacao`, que deve ser usado para acompanhar o pedido.

### `recuperarNumeracao`

Uma vez que a solicitação é processada, esta operação é usada para obter a lista de números que foram efetivamente alocados.

**Parâmetros:**

*   `usuario`, `senha` (string): Credenciais.
*   `numeroSolicitacao` (long): O ID retornado pela operação `solicitarNumeracao`.

### `consultaSolicitacaoNumeracao`

Verifica o status de um pedido de numeração.

**Parâmetros:**

*   `usuario`, `senha` (string): Credenciais.
*   `numeroSolicitacao` (long): ID da solicitação.

### `cancelarSolicitacaoNumeracao`

Permite o cancelamento de uma solicitação de numeração ou de números específicos dentro de uma solicitação já atendida.

**Parâmetros:**

*   `idSolicitacao` (long): ID da solicitação a ser cancelada.
*   `numerosSisbov` (string[]): Lista de números a serem cancelados (se o cancelamento for parcial).
*   `idMotivoCancelamento` (long): Código do motivo do cancelamento.

### `vincularNroSisbovNroEletronico`

Associa um número de brinco eletrônico (RFID) a um número SISBOV já existente, permitindo a dupla identificação.

**Parâmetros:**

*   `nroSisbov` (string): Número de manejo SISBOV.
*   `nroEletronico` (string): Número do identificador eletrônico.
