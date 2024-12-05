# MovieDB

## Descrição

O **MovieDB** é um projeto desenvolvido com o objetivo de explorar a API do **TheMovieDB** e configurar a comunicação entre o front-end e o back-end em um único projeto. O **back-end** é responsável por configurar o servidor, fazer a comunicação com a API do TheMovieDB e fornecer os dados ao **front-end**, que então exibe as informações de filmes de forma estruturada.

Este projeto foi desenvolvido utilizando **Typescript**, **React**, **NextJS** no front-end e **Typescript**, **ExpressJS**, **Prisma ORM** no back-end, com um banco de dados relacional para armazenamento de informações de usuários e filmes favoritos.

## Funcionalidades Implementadas

### Requisitos Obrigatórios

- **Cadastro de Usuário:** O usuário pode criar uma conta.
- **Login de Usuário:** O usuário pode fazer login para acessar a plataforma.
- **Página Principal:** Exibição de todos os filmes obtidos da API do TheMovieDB.
- **Busca por Filme:** Funcionalidade de buscar filmes por nome.
- **Favoritar Filmes:** O usuário pode favoritar um filme.
- **Visualizar Favoritos:** O usuário pode ver os filmes que favoritou.
- **Excluir Favoritos:** O usuário pode remover filmes da sua lista de favoritos.

### Requisitos Opcionais

- **Filtrar Filmes:** Possibilidade de filtrar filmes por gênero ou por popularidade.
- **Detalhes do Filme:** O usuário pode acessar detalhes adicionais de um filme na página específica do filme.

### Responsividade

A interface foi projetada para ser completamente **responsiva**, garantindo uma boa experiência de usuário em dispositivos móveis, tablets e desktops.

## Tecnologias Utilizadas

- **Front-end:** 
  - **Typescript**
  - **React**
  - **NextJS**
- **Back-end:**
  - **Typescript**
  - **ExpressJS**
  - **Prisma ORM**
  - **Banco de Dados Relacional**
- **API:**
  - **TheMovieDB API** para buscar filmes e exibir informações relacionadas.
  - **API Key:** [TheMovieDB API Key](https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1)

## URL de Imagens

Para obter as imagens dos posters dos filmes, utilize a seguinte URL de base:

https://image.tmdb.org/t/p/w500

