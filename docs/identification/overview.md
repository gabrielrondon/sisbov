# Sistema de Identificação

O pilar do SISBOV é a identificação única e individual de cada animal. Este sistema garante que um bovino ou bubalino possa ser rastreado ao longo de toda a sua vida.

## O Código de 15 Dígitos

O padrão de identificação do SISBOV é um código numérico de 15 dígitos. A estrutura exata deste código é definida pelo MAPA e garante que cada animal tenha um número único em todo o território nacional.

Embora a composição detalhada do código (quais dígitos representam o estado, o ano, etc.) seja uma regra de negócio interna do sistema do MAPA, o WSDL nos mostra que ele é tratado como uma `string` nas comunicações com o web service.

A geração e alocação desses números são de responsabilidade exclusiva do SISBOV, através da operação `solicitarNumeracao`.

## Tipos de Identificadores

O código de 15 dígitos é aplicado ao animal através de diferentes meios físicos:

*   **Brinco Auricular:** O método mais comum, consiste em um brinco plástico aplicado na orelha do animal, contendo a numeração impressa e, em alguns casos, um código de barras.
*   **Botton:** Similar ao brinco, mas geralmente com um formato diferente.
*   **Tatuagem:** A numeração pode ser tatuada na orelha do animal.
*   **Dispositivo Eletrônico (RFID):** Um chip de identificação por radiofrequência, geralmente encapsulado em um brinco ou um botton, que permite a leitura eletrônica do código. O web service possui a operação `vincularNroSisbovNroEletronico` especificamente para associar um código RFID a um número SISBOV.
