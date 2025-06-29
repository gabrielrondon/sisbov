# Tipos de Dados (Data Types)

O Web Service SISBOV utiliza uma série de tipos de dados complexos para estruturar as informações trocadas nas requisições e respostas. Compreender essas estruturas é essencial para a correta integração com o serviço.

O arquivo `WsSISBOV.xml` contém a definição completa de todos os tipos de dados (Data Types) no formato XSD (XML Schema Definition), dentro da seção `<wsdl:types>`.

## Principais Estruturas

Abaixo estão algumas das estruturas de dados mais importantes e recorrentes:

### `RetornoWsSISBOV`

Esta é a estrutura base para quase todas as respostas do web service. Ela informa o status da operação.

*   `status` (int): Um código indicando o resultado da transação (ex: 0 para sucesso, outros valores para erros).
*   `idTransacao` (long): Um identificador único para a requisição processada.
*   `listaErros` (ArrayOf_tns2_Erro): Uma lista de erros, caso a operação tenha falhado. Cada erro contém:
    *   `codigoErro` (string): O código do erro.
    *   `menssagemErro` (string): A descrição do erro.
*   `ambiente` (string): Indica o ambiente do sistema (ex: "PRODUCAO" ou "HOMOLOGACAO").

### `RegistroTabelaDominio`

Usado em respostas de consulta a tabelas de domínio do sistema (como tipos de morte, raças, etc.).

*   `codigo` (string): O código do item.
*   `descricao` (string): A descrição legível do item.

### `GtaDTO`

Representa uma Guia de Trânsito Animal (GTA), documento obrigatório para a movimentação de animais.

*   `numeroGTA` (string): O número da guia.
*   `numeroSerie` (string): O número de série do formulário da guia.
*   `uf` (string): A UF de emissão da guia.
*   `qtdeAnimais` (long): A quantidade de animais cobertos pela guia.

### `CheckListItemRespostaDTO`

Utilizado para enviar as respostas do checklist durante o lançamento de uma vistoria.

*   `idItem` (long): O ID do item do checklist que está sendo respondido.
*   `resposta` (string): A resposta fornecida para o item.
*   `observacao` (string): Observações adicionais, se houver.

## Consulta de Tipos

Para uma referência completa e detalhada de todos os campos, parâmetros e tipos de retorno, é **imprescindível** consultar diretamente o arquivo `WsSISBOV.xml`. Ele é a fonte primária e definitiva da verdade sobre a estrutura do web service.

As definições de tipos estão organizadas por *namespaces*, como:

*   `http://servicosWeb.sisbov.mapa.gov.br`: Define as operações principais (elementos de requisição e resposta).
*   `http://model.sisbov.mapa.gov.br`: Define os objetos de negócio (DTOs) como `GtaDTO`, `Erro`, etc.
*   `http://retorno.servicosWeb.sisbov.mapa.gov.br`: Define as estruturas de retorno, como `RetornoWsSISBOV` e suas extensões.
