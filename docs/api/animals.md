# Animais

O coração do SISBOV é o rastreamento individual dos animais. Esta seção detalha as operações para gerenciar o ciclo de vida de um animal no sistema.

### `incluirAnimal`

Registra um novo animal nascido no Brasil.

**Parâmetros:**

*   `usuario`, `senha` (string): Credenciais.
*   `dataIdentificacao` (string): Data em que o animal foi identificado (dd/MM/yyyy).
*   `dataNascimento` (string): Data de nascimento do animal (dd/MM/yyyy).
*   `numeroProvisorio` (string): Numeração provisória, se aplicável.
*   `numeroDefinitivo` (string): Numeração definitiva (brinco).
*   `idPropriedadeNascimento` (long): ID da propriedade onde o animal nasceu.
*   `idPropriedadeLocalizacao` (long): ID da propriedade onde o animal se encontra.
*   `idPropriedadeResponsavel` (long): ID da propriedade do responsável pelo animal.
*   `numeroSisbov` (string): O número de identificação oficial do SISBOV.
*   `codigoRaca` (string): Código da raça do animal.
*   `tipoIdentificacao` (long): Código do tipo de identificação (brinco, etc.).
*   `sexo` (string): Sexo do animal (M/F).
*   `cnpjProdutor`, `cpfProdutor` (string): Identificação do produtor responsável.

### `incluirAnimalImportado`

Registra um animal que foi importado de outro país.

**Parâmetros:**

*   Similar a `incluirAnimal`, com a adição de:
*   `codPais` (string): Código do país de origem.
*   `registroAssociacao` (string): Número de registro na associação de raça.
*   `anoImportacao` (int): Ano em que o animal foi importado.
*   `dataEntradaPais` (string): Data de entrada no Brasil.

### `alterarAnimal` e `alterarAnimalImportado`

Permitem a correção e atualização dos dados de um animal já cadastrado, identificado pelo `numeroSisbov`.

### `consultarDadosAnimal` e `consultarDadosAnimalImportado`

Recuperam o histórico completo de um animal, incluindo dados de nascimento, identificação, raça, sexo e localização.

**Parâmetros:**

*   `usuario`, `senha` (string): Credenciais.
*   `numeroSisbov` (string): Número do animal a ser consultado.

### `informarMorteAnimal`

Registra o óbito de um animal.

**Parâmetros:**

*   `numeroSisbovAnimal` (string): ID do animal.
*   `dataMorte` (string): Data do óbito.
*   `codigoTipoMorte` (long): Código para o tipo de morte (ex: abate, doença).
*   `codigoCausaMorte` (long): Código para a causa específica da morte.

### `movimentarAnimal`

Esta é uma operação crucial para a rastreabilidade. Ela registra a transferência de um ou mais animais entre propriedades.

**Parâmetros Principais:**

*   `idPropriedadeOrigem` (long): ID da propriedade de onde os animais estão saindo.
*   `idPropriedadeDestino` (long): ID da propriedade para onde os animais estão indo.
*   `cpfProdutorOrigem`, `cnpjProdutorOrigem` (string): Produtor na origem.
*   `cpfProdutorDestino`, `cnpjProdutorDestino` (string): Produtor no destino.
*   `dataSaida`, `dataChegada` (string): Datas da movimentação.
*   `gtas` (GtaDTO[]): Lista de Guias de Trânsito Animal associadas.
*   `numerosSISBOV` (string[]): Lista com os números SISBOV de todos os animais sendo movimentados.

Existem variações desta operação para movimentações de/para aglomerações (como leilões) e para frigoríficos (`movimentarAnimalParaFrigorifico`).
