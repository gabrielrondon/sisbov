# Entidades

O Web Service do SISBOV permite o gerenciamento de três tipos principais de entidades: Proprietários, Produtores e Supervisores. Cada uma possui operações específicas para inclusão e alteração de dados.

## Proprietário

Representa o dono legal de uma ou mais propriedades rurais.

### `incluirProprietario`

Adiciona um novo proprietário à base de dados. Esta operação é utilizada para cadastrar tanto pessoas físicas quanto jurídicas.

**Parâmetros:**

*   `usuario` (string): Usuário de acesso ao serviço.
*   `senha` (string): Senha de acesso.
*   `_razaoSocial` (string): Razão social (para pessoa jurídica).
*   `_cnpj` (string): CNPJ (para pessoa jurídica).
*   `_nome` (string): Nome completo (para pessoa física).
*   `_telefone` (string): Número de telefone.
*   `_email` (string): Endereço de e-mail.
*   `_cpf` (string): CPF (para pessoa física).
*   `_sexo` (string): Sexo (M/F).
*   `_logradouro` (string): Endereço.
*   `_bairro` (string): Bairro.
*   `_cep` (string): CEP.
*   `_codMunicipio` (string): Código do município.

### `alterarProprietario`

Modifica os dados de um proprietário já cadastrado. Os parâmetros são os mesmos da operação de inclusão, mas o CPF ou CNPJ é utilizado para identificar o registro a ser alterado.

---

## Produtor

Refere-se à pessoa ou empresa responsável pela criação e manejo dos animais na propriedade.

### `incluirProdutor`

Cadastra um novo produtor no sistema.

**Parâmetros:**

*   Todos os parâmetros de `incluirProprietario`.
*   `_telefoneResidencial` (string): Telefone residencial.
*   `_faxResidencial` (string): Fax residencial.
*   `_nrTelefoneContato` (string): Telefone de contato.
*   `_nrFaxContato` (string): Fax de contato.

### `alterarProdutor`

Atualiza as informações de um produtor existente, identificado pelo seu CPF or CNPJ.

---

## Supervisor

É o profissional técnico responsável pelas vistorias e acompanhamento do rebanho na propriedade.

### `incluirSupervisor`

Adiciona um novo supervisor.

**Parâmetros:**

*   `usuario` (string): Usuário de acesso.
*   `senha` (string): Senha de acesso.
*   `_nome` (string): Nome completo.
*   `_telefone` (string): Telefone.
*   `_email` (string): E-mail.
*   `_cpf` (string): CPF.
*   `_rg` (string): RG.
*   `_dataNascimento` (string): Data de nascimento (formato `dd/MM/yyyy`).
*   `_dataExpedicao` (string): Data de expedição do RG.
*   `_OrgaoExpedidor` (string): Órgão expedidor do RG.
*   `_ufExpedidor` (string): UF do órgão expedidor.
*   `_sexo` (string): Sexo (M/F).
*   `_logradouro`, `_bairro`, `_cep`, `_codMunicipio`: Informações de endereço.

### `alterarSupervisor`

Modifica os dados de um supervisor cadastrado, utilizando o CPF como chave de identificação.
