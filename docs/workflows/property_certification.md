# Fluxo de Trabalho 2: Certificação de uma Propriedade (ERAS)

Para que os animais de uma propriedade possam ser rastreados pelo SISBOV e aceitos em mercados que exigem certificação, a própria propriedade precisa passar por um processo de qualificação. O objetivo é tornar-se um **ERAS (Estabelecimento Rural Aprovado no SISBOV)**.

Este guia detalha as etapas desse processo e como elas são gerenciadas via web service.

---

## Etapa 1: Cadastro Inicial da Propriedade e dos Responsáveis

Antes de qualquer coisa, a propriedade e as pessoas associadas a ela precisam existir no sistema.

**Contexto de Negócio:** Um produtor decide aderir ao SISBOV para poder vender seus animais para exportação. Ele contrata uma Certificadora credenciada para iniciar o processo.

**Fluxo na API:**

1.  **Cadastrar o Produtor/Proprietário:** Se o produtor ou o proprietário da terra ainda não estiverem no sistema, a certificadora realiza o cadastro.

    *   **Operações:** `incluirProdutor`, `incluirProprietario`.
    *   **Parâmetros Chave:** CPF/CNPJ, nome/razão social, endereço, etc.

2.  **Cadastrar a Propriedade:** A fazenda em si é cadastrada.

    *   **Operação:** `incluirPropriedade`
    *   **Parâmetros Chave:** `_nomePropriedade`, `_nirf`, `_incra`, coordenadas geográficas, área, etc.
    *   **Resultado:** A operação retorna o `idPropriedade`, um número que identificará unicamente esta fazenda em todas as futuras operações.

3.  **Vincular Responsáveis à Propriedade:** O sistema precisa saber quem é o responsável por aquela terra.

    *   **Operação:** `vincularProdutorPropriedade`
    *   **Parâmetros Chave:** `cpfProdutor` ou `cnpjProdutor`, `idPropriedade`.

**Resultado da Etapa:** A propriedade e seus responsáveis agora existem na Base Nacional de Dados. No entanto, a propriedade ainda é considerada "não qualificada".

---

## Etapa 2: O Processo de Vistoria

A vistoria é o coração do processo de certificação. Um supervisor técnico irá à fazenda para verificar se ela cumpre todos os requisitos da legislação.

**Contexto de Negócio:** A certificadora agenda uma visita à propriedade para realizar a auditoria.

**Fluxo na API:**

1.  **Agendar a Vistoria:** A data da visita é registrada no sistema.

    *   **Operação:** `iniciarVistoria`
    *   **Parâmetros Chave:** `idPropriedade`, `dataAgendamento`, `cpfSupervisor`.

2.  **Obter o Checklist:** Antes ou durante a visita, o supervisor (ou o sistema da certificadora) obtém o formulário de itens que precisam ser verificados. A estrutura do checklist é dinâmica e definida pelo MAPA.

    *   **Operação:** `recuperarCheckListVistoria`
    *   **Parâmetros Chave:** `idPropriedade`, `dataAgendamento`.
    *   **Resultado:** Uma estrutura complexa (`RetornoCheckListVistoria`) contendo os grupos, divisões e itens do checklist a serem preenchidos.

3.  **Lançar os Resultados:** Após a conclusão da auditoria em campo, a certificadora submete os resultados ao SISBOV.

    *   **Operação:** `lancarVistoria`
    *   **Parâmetros Chave:** `idPropriedade`, `dataVistoria`, `cpfSupervisor`, e o mais importante, `resposta` (uma lista de `CheckListItemRespostaDTO` com o resultado de cada item avaliado).

**Resultado da Etapa:** Os resultados da auditoria estão no sistema, mas ainda precisam de um parecer final.

---

## Etapa 3: Parecer Técnico e Finalização

Com base nos resultados da vistoria, um Responsável Técnico (RT) da certificadora dará seu parecer final, e o processo é formalmente encerrado.

**Contexto de Negócio:** O Responsável Técnico da certificadora analisa o relatório de vistoria e emite sua decisão.

**Fluxo na API:**

1.  **Emitir o Parecer:** O RT formaliza sua conclusão no sistema.

    *   **Operação:** `emitirParecerVistoriaRT`
    *   **Parâmetros Chave:** `idPropriedade`, `dataAgendamento`, `parecer` (uma string descrevendo o parecer, ex: "Conforme", "Não Conforme"), `cpfResponsavelTecnico`.

2.  **Finalizar o Processo de Vistoria:** A certificadora encerra o ciclo da vistoria no sistema.

    *   **Operação:** `finalizarVistoria`
    *   **Parâmetros Chave:** `idPropriedade`, `dataAgendamento`, `cancelada` (boolean, `false` se a vistoria foi concluída com sucesso).

**Resultado Final:** Se o parecer for favorável, a propriedade tem seu status atualizado na BND e torna-se oficialmente um **ERAS**. A partir deste momento, os animais nela identificados e manejados conforme as regras são considerados certificados e elegíveis para exportação aos mercados com exigências de rastreabilidade.
