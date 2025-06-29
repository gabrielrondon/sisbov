# Diagrama de Sequência: Solicitação de Numeração

Este diagrama ilustra a natureza assíncrona do processo de solicitação de novos números de identificação (brincos) no SISBOV. Ele mostra a interação entre o sistema cliente (da certificadora ou produtor) e o servidor do SISBOV.

## Código em Mermaid

```mermaid
sequenceDiagram
    participant Cliente as Sistema Cliente
    participant Servidor as Servidor SISBOV

    title Fluxo Assíncrono de Solicitação de Numeração

    Cliente->>Servidor: 1. Chama `solicitarNumeracao(usuario, senha, idProp, qtde)`
    activate Servidor
    Note right of Servidor: Servidor recebe o pedido, valida os<br/>parâmetros básicos e enfileira a<br/>solicitação para processamento interno.
    Servidor-->>Cliente: 2. Retorna `RetornoSolicitacaoNumeracao` com `status=0` e `numeroSolicitacao`
    deactivate Servidor

    Note over Cliente: Cliente armazena o `numeroSolicitacao`.<br/>O processo agora é assíncrono.<br/>O cliente precisa esperar e consultar novamente.

    loop Polling - O Cliente consulta o status periodicamente
        Cliente->>Servidor: 3. Chama `recuperarNumeracao(usuario, senha, numeroSolicitacao)`
        activate Servidor
        Note right of Servidor: Servidor verifica se a solicitação<br/>já foi processada e os números alocados.
        Servidor-->>Cliente: 4. Retorna `RetornoRecuperarNumeracao` com a lista de números (se pronto) ou status de pendente.
        deactivate Servidor
    end

    Note over Cliente: Uma vez que a resposta contém a lista<br/>de números, o fluxo está completo.<br/>O cliente pode usar os números para `incluirAnimal`.

```

## Descrição do Fluxo

1.  **Solicitação Inicial:** O `Cliente` inicia o processo chamando `solicitarNumeracao`. Ele não recebe a lista de números de volta imediatamente.
2.  **Resposta Imediata:** O `Servidor` responde rapidamente com um número de protocolo (`numeroSolicitacao`). Isso confirma que o pedido foi recebido e está na fila para ser processado, mas não que foi concluído.
3.  **Consulta (Polling):** O `Cliente` precisa, de tempos em tempos, chamar a operação `recuperarNumeracao`, usando o protocolo que recebeu. Esse processo é conhecido como *polling*.
4.  **Resposta Final:** O `Servidor` eventualmente processará a solicitação. Na próxima vez que o `Cliente` chamar `recuperarNumeracao`, a resposta virá preenchida com a lista de números SISBOV alocados e prontos para uso.

Este fluxo assíncrono é comum em sistemas que precisam realizar tarefas em segundo plano que podem levar mais tempo, como a alocação de recursos únicos (neste caso, os números de identificação).
