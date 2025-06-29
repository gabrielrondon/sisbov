# Propriedades

As propriedades rurais, ou fazendas, são os locais onde os animais são criados e gerenciados. O web service oferece funcionalidades para cadastrar, consultar, alterar e vincular/desvincular proprietários e produtores a essas propriedades.

### `incluirPropriedade`

Cadastra uma nova propriedade no sistema SISBOV.

**Parâmetros:**

*   `usuario`, `senha` (string): Credenciais de acesso.
*   `_nirf` (string): NIRF da propriedade.
*   `_incra` (string): Código INCRA.
*   `_tipoPropriedade` (long): Código do tipo de propriedade.
*   `_nomePropriedade` (string): Nome da fazenda.
*   `_acessoFazenda` (string): Descrição do acesso à fazenda.
*   `_distanciaSedeMunicipio` (int): Distância em km da sede do município.
*   Coordenadas Geográficas:
    *   `_orientacaoLatitude`, `_grauLatitude`, `_minutoLatitude`, `_segundoLatitude`
    *   `_orientacaoLongitude`, `_grauLongitude`, `_minutoLongitude`, `_segundoLongitude`
*   `_area` (long): Área total da propriedade.
*   Endereço da Propriedade: `_logradouro`, `_bairro`, `_cep`, `_codMunicipio`.
*   Endereço de Correspondência: `_enderecoCorrespondenciaLogradouro`, `_enderecoCorrespondenciaBairro`, `_enderecoCorrespondenciaCep`, `_enderecoCorrespondenciaCodMunicipio`.
*   Contatos: `_telefoneResidencial`, `_faxResidencial`, `_nrTelefoneContato`, `_nrFaxContato`.

### `alterarPropriedade`

Atualiza os dados de uma propriedade existente. Requer o `idPropriedade` para identificar o registro a ser alterado, além dos mesmos parâmetros da inclusão.

### `consultarPropriedade`

Busca e retorna os dados de uma propriedade específica.

**Parâmetros:**

*   `usuario`, `senha` (string): Credenciais.
*   `idPropriedade` (long): ID da propriedade a ser consultada.

### Vinculação e Desvinculação

Estas operações gerenciam a relação entre as pessoas (proprietários e produtores) e as propriedades.

*   **`vincularProprietarioPropriedade`**: Associa um proprietário a uma propriedade.
    *   **Parâmetros:** `cpfProprietario` ou `cnpjProprietario`, `idPropriedade`, `situacaoFundiaria`.
*   **`desvincularPropriedadeProprietario`**: Remove o vínculo entre um proprietário e uma propriedade.
    *   **Parâmetros:** `cpfProprietario` ou `cnpjProprietario`, `idPropriedade`.
*   **`vincularProdutorPropriedade`**: Associa um produtor a uma propriedade.
    *   **Parâmetros:** `cpfProdutor` ou `cnpjProdutor`, `idPropriedade`, `IEProdutor`, `ufIE`, `tipoProdutor`.
*   **`desvincularProdutorPropriedade`**: Remove o vínculo entre um produtor e uma propriedade.
    *   **Parâmetros:** `cpfProdutor` ou `cnpjProdutor`, `idPropriedade`.
