# Guia de Tratamento de Erros da API

Todas as respostas do Web Service SISBOV, independentemente da operação chamada, são baseadas na estrutura `RetornoWsSISBOV`. Compreender esta estrutura é a chave para um tratamento de erros robusto e eficaz.

## A Estrutura `RetornoWsSISBOV`

Todo objeto de retorno conterá, no mínimo, os seguintes campos:

-   `status` (int): O indicador mais importante. 
    -   `0`: A operação foi concluída com sucesso.
    -   Qualquer outro valor (geralmente `1` ou maior): A operação falhou.
-   `idTransacao` (long): Um ID único para a requisição, útil para rastreamento e suporte.
-   `listaErros` (ArrayOf_tns2_Erro): Uma lista que conterá um ou mais objetos de erro se `status` não for `0`.
-   `ambiente` (string): Informa se a transação ocorreu no ambiente de `PRODUCAO` ou `HOMOLOGACAO`.

## O Objeto `Erro`

Quando `status` é diferente de `0`, a `listaErros` será preenchida. Cada item na lista é um objeto `Erro` com a seguinte estrutura:

-   `codigoErro` (string): Um código de erro padronizado (ex: `ERRO-005`).
-   `menssagemErro` (string): Uma descrição legível do que deu errado.
-   `valorInformado` (ArrayOf_xsd_string): Uma lista dos valores que você enviou e que podem ter causado o erro. Extremamente útil para depuração.

## Fluxo de Tratamento de Erros em Código

O seu código cliente deve sempre seguir este fluxo básico após cada chamada à API:

```python
# Exemplo em pseudocódigo baseado no cliente Python

# 1. Chamar o serviço
resultado = client.service.algumaOperacao(usuario, senha, ...)

# 2. Verificar o status
if resultado.status == 0:
    # Processar a resposta de sucesso
    print("Operação bem-sucedida!")
    # Acessar os dados de retorno, ex: resultado.nomeAnimal
else:
    # Processar o erro
    print(f"A operação falhou com status: {resultado.status}")
    
    # 3. Iterar sobre a lista de erros
    if resultado.listaErros and resultado.listaErros.item:
        for erro in resultado.listaErros.item:
            print(f"  - Código: {erro.codigoErro}")
            print(f"    Mensagem: {erro.menssagemErro}")
            
            # 4. Verificar o valor que causou o erro
            if erro.valorInformado and erro.valorInformado.item:
                print(f"    Valor(es) informado(s): {', '.join(erro.valorInformado.item)}")
    else:
        print("  O servidor não retornou uma lista de erros detalhada.")

```

## Exemplos de Erros Comuns

-   **`ERRO-001: Usuário ou senha inválidos`**
    -   **Causa:** As credenciais de acesso estão incorretas.
    -   **Ação:** Verifique as variáveis `USUARIO` e `SENHA`.

-   **`ERRO-005: Animal com número SISBOV informado não encontrado`**
    -   **Causa:** O `numeroSisbov` enviado em uma consulta não existe na base.
    -   **Ação:** Verifique se o número está correto, sem erros de digitação.

-   **`ERRO-020: Produtor não vinculado à propriedade`**
    -   **Causa:** Tentativa de `movimentarAnimal` usando um produtor que não está associado à propriedade de origem informada.
    -   **Ação:** Garanta que a operação `vincularProdutorPropriedade` foi executada corretamente antes.

-   **`ERRO-110: Campo obrigatório não preenchido`**
    -   **Causa:** Um campo mandatório na requisição foi enviado como nulo ou vazio.
    -   **Ação:** A `menssagemErro` geralmente especifica qual campo está faltando. Revise sua chamada para garantir que todos os parâmetros necessários estão sendo enviados.

Adotar este padrão de verificação após cada chamada torna sua aplicação resiliente e muito mais fácil de depurar.
