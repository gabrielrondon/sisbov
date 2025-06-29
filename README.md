# Repositório de Conhecimento do SISBOV

Este repositório é uma base de conhecimento abrangente sobre o SISBOV (Sistema de Identificação e Certificação de Origem Bovina e Bubalina) do Brasil. O objetivo é centralizar informações técnicas e de negócio, servindo como um guia para desenvolvedores, gestores e qualquer pessoa interessada em entender o funcionamento do sistema de rastreabilidade bovina brasileiro.

---

## 1. Visão Geral e Conceitos

Para começar, entenda os fundamentos do sistema.

*   **[Glossário de Termos e Siglas](./docs/glossary.md):** A referência essencial para entender a terminologia (ERAS, BND, GTA, etc.).
*   **[Legislação](./docs/legislation/in_51_2018.md):** Resumo da Instrução Normativa Nº 51, a base legal do SISBOV.
*   **[Componentes do Sistema](./docs/system-components/overview.md):** A arquitetura do SISBOV (BND, PGA, Certificadoras).
*   **[Sistema de Identificação](./docs/identification/overview.md):** Sobre o código de 15 dígitos e os tipos de identificadores.
*   **[Diagramas Visuais](./docs/diagrams/):**
    *   [Diagrama de Entidade e Relacionamento](./docs/diagrams/entity_relationship_diagram.md)
    *   [Diagrama de Sequência para Solicitação de Numeração](./docs/diagrams/sequence_diagram_number_request.md)

---

## 2. Guias Práticos e Fluxos de Trabalho

Estes guias descrevem processos de negócio do mundo real e como eles se traduzem em chamadas de API.

*   **[A Jornada do Animal no SISBOV](./docs/workflows/animal_journey.md):** O ciclo de vida completo de um animal, do nascimento ao abate.
*   **[Certificação de uma Propriedade (ERAS)](./docs/workflows/property_certification.md):** O passo a passo para uma fazenda se tornar certificada.

---

## 3. Guia para Desenvolvedores (API)

Recursos técnicos para a integração com o Web Service do SISBOV.

*   **[Documentação Completa da API](./docs/api/README.md):** O guia detalhado para cada grupo de operações da API (Entidades, Propriedades, Animais, etc.).
*   **[Guia de Tratamento de Erros](./docs/api/error_handling.md):** Como interpretar e lidar com as respostas de erro da API.
*   **Exemplos de Código:**
    *   **[Cliente SOAP em Python](./docs/code-examples/python_client.md):** Um script funcional para interagir com o web service.
    *   **[Exemplos de XML](./docs/code-examples/xml/):** Amostras de requisições e respostas SOAP para depuração.

---

## Fonte Primária

*   `WsSISBOV.xml`: O arquivo WSDL que define formalmente todos os serviços e tipos de dados. É a fonte da verdade para a implementação da API.
