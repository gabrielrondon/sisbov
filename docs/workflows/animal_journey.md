# Fluxo de Trabalho 1: A Jornada do Animal no SISBOV

Este guia descreve o ciclo de vida completo de um animal dentro do sistema SISBOV, desde o seu nascimento até o destino final. Cada etapa representa um evento de negócio que é registrado através de uma ou mais chamadas ao web service.

O objetivo é fornecer uma visão cronológica e prática de como as operações da API são utilizadas para construir a rastreabilidade de um animal.

---

## Etapa 1: Nascimento e Identificação

O primeiro evento na vida de um animal é o seu nascimento e a sua identificação oficial no rebanho da propriedade.

**Contexto de Negócio:** Um bezerro nasce em uma fazenda certificada. O produtor precisa solicitar um novo brinco de identificação e registrar o animal no sistema.

**Fluxo na API:**

1.  **Solicitar Numeração:** O produtor (ou a certificadora em seu nome) não pode simplesmente inventar um número. Ele precisa solicitar um lote de números válidos ao SISBOV. A quantidade solicitada deve ser suficiente para o número de animais que se espera identificar.

    *   **Operação:** `solicitarNumeracao`
    *   **Parâmetros Chave:** `idPropriedade`, `qtdeSolicitada`, `tipoIdentificacao`.
    *   **Resultado:** A API retorna um `numeroSolicitacao`. Este é um protocolo, não a lista de números ainda.

2.  **Recuperar Numeração:** A solicitação é processada de forma assíncrona pelo MAPA. Após um tempo, o sistema cliente deve consultar o resultado da solicitação para obter os números que foram efetivamente alocados.

    *   **Operação:** `recuperarNumeracao`
    *   **Parâmetros Chave:** `numeroSolicitacao` (obtido na etapa anterior).
    *   **Resultado:** A API retorna uma lista de `NumeroSimplificado`, contendo os números SISBOV que agora podem ser utilizados.

3.  **Registrar o Animal:** Com um número oficial em mãos, o produtor pode finalmente cadastrar o animal.

    *   **Operação:** `incluirAnimal`
    *   **Parâmetros Chave:**
        *   `numeroSisbov`: O número obtido na etapa anterior.
        *   `dataNascimento`: Data de nascimento do animal.
        *   `idPropriedadeNascimento`: Onde o animal nasceu.
        *   `idPropriedadeLocalizacao`: Onde o animal se encontra atualmente (neste caso, a mesma do nascimento).
        *   `codigoRaca`, `sexo`, etc.

**Resultado da Etapa:** O animal agora existe oficialmente na Base Nacional de Dados (BND), com sua identificação, dados de nascimento e localização inicial devidamente registrados.

---

## Etapa 2: Movimentação entre Propriedades

Os animais frequentemente são movidos entre diferentes fazendas (por exemplo, de uma fazenda de cria para uma de engorda).

**Contexto de Negócio:** Um lote de animais é vendido de uma propriedade (Origem) para outra (Destino). Essa transferência precisa ser registrada para manter a rastreabilidade.

**Fluxo na API:**

1.  **Registrar a Movimentação:** A transferência é registrada em uma única chamada, que contém todas as informações relevantes.

    *   **Operação:** `movimentarAnimal`
    *   **Parâmetros Chave:**
        *   `idPropriedadeOrigem`: ID da fazenda de onde os animais estão saindo.
        *   `idPropriedadeDestino`: ID da fazenda para onde os animais estão indo.
        *   `cpfProdutorOrigem` / `cnpjProdutorOrigem`: Identificação do produtor na origem.
        *   `cpfProdutorDestino` / `cnpjProdutorDestino`: Identificação do produtor no destino.
        *   `dataSaida`, `dataChegada`: Datas da movimentação.
        *   `gtas`: Uma lista contendo os dados da Guia de Trânsito Animal (GTA), que é o documento fiscal e sanitário obrigatório para o transporte.
        *   `numerosSISBOV`: Uma lista com os números de todos os animais que estão sendo movidos neste lote.

**Resultado da Etapa:** O histórico de cada animal na BND é atualizado, mostrando que ele mudou de localização e, possivelmente, de produtor responsável. A cadeia de custódia permanece intacta.

---

## Etapa 3: Movimentação para Eventos (Aglomeração)

O fluxo é ligeiramente diferente quando os animais são enviados para locais de aglomeração, como leilões ou feiras.

**Contexto de Negócio:** Um produtor envia alguns de seus melhores animais para serem vendidos em um leilão.

**Fluxo na API:**

1.  **Movimentar para Aglomeração:** A API possui uma operação específica para este cenário.

    *   **Operação:** `movimentarAnimalPropAglomeracao`
    *   **Parâmetros Chave:** Similar à movimentação normal, mas em vez de uma `idPropriedadeDestino`, utiliza-se `idAglomeracaoDestino`.

2.  **Movimentar da Aglomeração:** Após o leilão, o animal é comprado por um novo produtor. Uma nova movimentação é registrada, desta vez da aglomeração para a nova propriedade do animal.

    *   **Operação:** `movimentarAnimalAglomeracaoProp`
    *   **Parâmetros Chave:** Utiliza `idAglomeracaoOrigem` e `idPropriedadeDestino`.

**Resultado da Etapa:** O sistema rastreia a passagem do animal pelo evento, registrando sua entrada e saída, e quem foi o comprador, mantendo a continuidade do histórico.

---

## Etapa 4: Destino Final - Abate

A jornada de um animal destinado à produção de carne termina no frigorífico.

**Contexto de Negócio:** O produtor envia um lote de animais terminados para o abate em um frigorífico habilitado.

**Fluxo na API:**

1.  **Movimentar para Frigorífico:** Uma operação específica é usada para registrar este envio final.

    *   **Operação:** `movimentarAnimalParaFrigorifico`
    *   **Parâmetros Chave:**
        *   `idPropriedadeOrigem`: A fazenda de onde os animais saíram.
        *   `cnpjFrigorifico`: O CNPJ do estabelecimento de abate.
        *   `numerosSISBOV`: A lista dos animais enviados.

2.  **Consultar Animais Abatidos (Opcional):** O frigorífico, após o abate, pode usar o sistema para consultar os animais que foram processados em uma determinada data.

    *   **Operação:** `consultarAnimaisAbatidos`
    *   **Parâmetros Chave:** `cnpjFrigorifico`, `data`.

**Resultado da Etapa:** O ciclo de vida do animal no SISBOV é concluído. Seu status é atualizado para "abatido", e o sistema tem o registro completo de toda a sua jornada, desde o nascimento até o processamento final. Essa informação é o que garante a rastreabilidade do produto final na prateleira.
