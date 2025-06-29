# Exemplo de Cliente SOAP em Python com Zeep

Esta seção fornece um exemplo prático de como interagir com o Web Service do SISBOV utilizando a biblioteca Python `zeep`. A `zeep` é uma biblioteca moderna e eficiente para clientes SOAP (o protocolo usado pelo `WsSISBOV.xml`).

## Instalação

Primeiro, você precisa instalar a biblioteca:

```bash
pip install zeep
```

## Código de Exemplo

O script abaixo demonstra como inicializar o cliente, carregar o WSDL local e chamar uma das operações mais comuns: `consultarDadosAnimal`.

```python
import zeep

# --- Configuração ---
# Caminho para o arquivo WSDL local. Usar o arquivo local evita
# a necessidade de baixá-lo da internet a cada execução.
WSDL_FILE = 'path/to/your/WsSISBOV.xml'

# Suas credenciais de acesso fornecidas pelo MAPA
USUARIO = 'seu_usuario_aqui'
SENHA = 'sua_senha_aqui'

# --- Inicialização do Cliente ---

# Cria um cliente Zeep a partir do arquivo WSDL.
# A diretiva strict=False é frequentemente útil para WSDLs mais antigos ou complexos.
client = zeep.Client(wsdl=WSDL_FILE, strict=False)

# --- Exemplo 1: Consultando os Dados de um Animal ---

def consultar_animal(numero_sisbov):
    """Busca os dados de um animal específico no SISBOV."""
    print(f"\n--- Consultando dados para o animal: {numero_sisbov} ---")
    try:
        # Chama a operação 'consultarDadosAnimal' do web service
        # Passando os parâmetros definidos no WSDL.
        resultado = client.service.consultarDadosAnimal(
            usuario=USUARIO,
            senha=SENHA,
            numeroSisbov=numero_sisbov
        )

        # O objeto 'resultado' é um tipo complexo gerado pela Zeep
        # com base na estrutura de retorno do WSDL (RetornoConsultarDadosAnimal).

        # Verificando o status da transação
        if resultado.status == 0:  # 0 geralmente significa sucesso
            print("Consulta realizada com sucesso!")
            print(f"  ID da Transação: {resultado.idTransacao}")
            print(f"  Status: {resultado.status}")
            print(f"  Nome do Animal: {resultado.nome if hasattr(resultado, 'nome') else 'N/A'}")
            print(f"  Sexo: {resultado.sexo}")
            print(f"  Raça: {resultado.raca}")
            print(f"  Data de Nascimento: {resultado.dataNascimento}")
            print(f"  Data de Identificação: {resultado.dataIdentificacao}")
            print(f"  Número Definitivo: {resultado.numeroDefinitivo}")
        else:
            print(f"Erro ao consultar animal. Status: {resultado.status}")
            # Imprime a lista de erros, se houver
            if resultado.listaErros:
                for erro in resultado.listaErros.item:
                    print(f"  - Código: {erro.codigoErro}")
                    print(f"    Mensagem: {erro.menssagemErro}")

    except Exception as e:
        print(f"Ocorreu uma exceção ao chamar o serviço: {e}")

# --- Exemplo 2: Recuperando uma Tabela de Domínio (Raças) ---

def recuperar_tabela_racas():
    """Recupera a tabela de códigos de raças do sistema."""
    print("\n--- Recuperando tabela de raças (ID 2) ---")
    ID_TABELA_RACAS = 2
    try:
        resultado = client.service.recuperarTabela(
            usuario=USUARIO,
            senha=SENHA,
            idTabela=ID_TABELA_RACAS
        )

        if resultado.status == 0 and resultado.registros:
            print("Tabela de raças recuperada com sucesso!")
            for raca in resultado.registros.item:
                print(f"  - Código: {raca.codigo}, Descrição: {raca.descricao}")
        else:
            print(f"Erro ao recuperar tabela. Status: {resultado.status}")
            if resultado.listaErros:
                for erro in resultado.listaErros.item:
                    print(f"  - Código: {erro.codigoErro}, Mensagem: {erro.menssagemErro}")

    except Exception as e:
        print(f"Ocorreu uma exceção ao chamar o serviço: {e}")


# --- Execução ---
if __name__ == "__main__":
    # Substitua pelo número de um animal que você queira consultar
    numero_de_exemplo = '123456789012345'
    consultar_animal(numero_de_exemplo)

    # Recupera e exibe a lista de raças
    recuperar_tabela_racas()

```

## Como Usar

1.  Salve o código acima como um arquivo Python (ex: `cliente_sisbov.py`).
2.  Coloque o arquivo `WsSISBOV.xml` no mesmo diretório ou atualize a variável `WSDL_FILE` com o caminho correto.
3.  Substitua `'seu_usuario_aqui'` and `'sua_senha_aqui'` com suas credenciais reais.
4.  Execute o script a partir do seu terminal: `python cliente_sisbov.py`.

Este exemplo serve como um ponto de partida robusto. Para chamar outras operações, basta inspecionar as operações disponíveis (`print(client.service)`) e seus parâmetros (`print(client.wsdl.dump())`) e criar novas funções seguindo o padrão acima.

```