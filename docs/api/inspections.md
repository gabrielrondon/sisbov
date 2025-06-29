# Vistorias e Certificação

As vistorias são fundamentais para a certificação das propriedades e, consequentemente, para a habilitação dos animais para mercados que exigem rastreabilidade. O web service define um fluxo completo para o gerenciamento de vistorias.

### `iniciarVistoria`

Agenda uma nova vistoria para uma propriedade.

**Parâmetros:**

*   `usuario`, `senha` (string): Credenciais.
*   `idPropriedade` (long): ID da propriedade a ser vistoriada.
*   `dataAgendamento` (string): Data em que a vistoria está agendada (dd/MM/yyyy).
*   `cpfSupervisor` (string): CPF do supervisor que realizará a vistoria.

### `reagendarVistoria`

Altera a data de uma vistoria já agendada.

**Parâmetros:**

*   `idPropriedade` (long): ID da propriedade.
*   `dataReagendamento` (string): Nova data para a vistoria.
*   `cpfSupervisor` (string): CPF do supervisor.
*   `justificativa` (string): Motivo do reagendamento.

### `recuperarCheckListVistoria`

Obtém o checklist (formulário) que deve ser preenchido durante a vistoria. O retorno é uma estrutura complexa com os itens que precisam ser avaliados.

**Parâmetros:**

*   `idPropriedade` (long): ID da propriedade.
*   `dataAgendamento` (string): Data original do agendamento.

### `lancarVistoria`

Envia os resultados da vistoria para o sistema SISBOV. Esta operação recebe as respostas para cada item do checklist.

**Parâmetros:**

*   `idPropriedade` (long): ID da propriedade.
*   `dataVistoria` (string): Data em que a vistoria foi efetivamente realizada.
*   `cpfSupervisor` (string): CPF do supervisor.
*   `resposta` (CheckListItemRespostaDTO[]): Uma lista com as respostas do checklist.

### `emitirParecerVistoriaRT`

O Responsável Técnico (RT) da certificadora emite seu parecer sobre o resultado da vistoria.

**Parâmetros:**

*   `idPropriedade` (long): ID da propriedade.
*   `dataAgendamento` (string): Data do agendamento.
*   `parecer` (string): O parecer do RT (aprovado, não aprovado, etc.).
*   `cpfResponsavelTecnico` (string): CPF do RT.

### `finalizarVistoria`

Encerra o processo de vistoria no sistema.

**Parâmetros:**

*   `idPropriedade` (long): ID da propriedade.
*   `dataAgendamento` (string): Data do agendamento.
*   `cancelada` (boolean): Indica se a vistoria foi cancelada.
