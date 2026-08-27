# ⛏️ CraftPlanner - Calculador & Checklist de Blocos (Minecraft)

> **Projeto Integrador:** Programação para Dispositivos Móveis – Persistência de Dados  
> **Instituição:** SENAI - Escola Ítalo Bologna

---

## 📌 Sobre o Projeto

O **CraftPlanner** é um aplicativo mobile desenvolvido para ajudar jogadores de Minecraft a organizarem os materiais de suas construções de forma rápida e prática.

O usuário navega por estilos arquitetônicos (como *Moderno*, *Medieval*, *Redstone*), escolhe a casa ou estrutura que deseja construir e visualiza a lista detalhada de blocos necessários. À medida que o jogador insere a quantidade de blocos que já possui, o app calcula automaticamente quantos blocos ainda faltam para concluir a obra.

O projeto inclui um **CRUD completo**, permitindo que o usuário crie suas próprias listas de construções, edite valores, visualize seu progresso e exclua projetos finalizados.

---

## 🛠️ Tecnologias e Ferramentas Utilizadas

- **Framework Mobile:** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
- **Linguagem:** JavaScript
- **Navegação:** React Navigation (Stack)
- **Interface & Componentes:** `FlatList`, `TextInput`, `Image`, `TouchableOpacity`, `Modal`
- **Persistência de Dados Local:** `expo-sqlite` (Banco de Dados Relacional)
- **Dupla:** Felipe Paiva e Giovana Fonseca

---

## 🚀 Funcionalidades Principais

- 🏷️ **Navegação por Estilos:** Seleção visual de categorias de construção.
- 🏰 **Galeria de Projetos:** Exibição de casas e construções em cada estilo via `FlatList`
- 📦 **Calculadora de Inventário:**
  - Foto do bloco e quantidade total necessária.
  - Campo interativo para digitar a quantidade já coletada.
  - **Cálculo em tempo real:** `Quantidade Faltante = Necessária - Possuída`.
- ✏️ **Gerenciamento CRUD:**
  - **Create (Criar):** Adicionar novas casas e blocos
  - **Read (Listar):** Exibir categorias, modelos e checklist de blocos
  - **Update (Atualizar):** Atualizar o saldo de blocos coletados
  - **Delete (Excluir):** Deletar projetos ou blocos

---

## 🧠 Justificativa Técnica da Persistência de Dados

A escolha do **SQLite** (`expo-sqlite`) deve-se à estrutura relacional inerente ao projeto:
1. **Uma Categoria** possui **Várias Construções**.
2. **Uma Construção** possui **Vários Blocos de Construção**.

O banco de dados relacional facilita consultas otimizadas, updates rápidos na contagem de blocos e remoção em cascata (deletar uma casa remove automaticamente sua lista de materiais)[cite: 1].

---