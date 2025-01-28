# BackendDesafio

O projeto aborda o backend de um blog, que implementa funcionalidades para adição, remoção e visualização de postagens.

## Tecnologias

Este projeto foi desenvolvido utilizando Node.js, Express.js e Prisma, utilizando também autenticação com token JWT. 

## Instalando o Projeto

1. Clonar o repositório:

    ```bash
    git clone https://github.com/SamsSouza22/BackendDesafio.git
    cd BackendDesafio
    ```
    

2. Instalar dependencias:
    ```bash
    npm install
    ```

3. Configurar variáveis de ambiente:

    Crie um aqruivo .env na pasta raiz do diretorio e adicione as seguintes variáveis:

    .env
    ```
    DATABASE_URL="your_database_url"
    JWT_SECRET="your_jwt_secret"
    PORT=9999
    ```
    

4. Rode as migrações do prisma para configurar os schemas da database: 
    ```bash
    npx prisma migrate dev
    ```
    

5. Inicie o servidor:

    ```
    npm start
    ```

    O servidor irá funcionar na url http://localhost:9999.

## Estrutura do projeto

```
BackendDesafio/
    .env
    .gitignore
    logs/
        access.log
    package.json
    prisma/
        migrations/
            20250109133319_user_and_posts_tables/
            20250114161713_add_created_at_and_updated_at_to_post/
            migration_lock.toml
        schema.prisma
    README.md
    src/
        controllers/
            post-controller.mjs
            user-controller.mjs
        index.mjs
        middlewares/
            auth-middleware.mjs
        routes/
            post-routes.mjs
            router.mjs
            user-routes.mjs
        secrets.mjs
        utils/
            prismaClient.mjs
            schemas.mjs
```

- src/
  - controllers/: Contém os controllers para lidar com as requestes.
  - middlewares/: Contém o middleware de autenticação.
  - routes/: Contém as definições das rotas.
  - utils/: Contém arquivos de utilidades e configurações do Prisma Client.
  - index.mjs: O ponto de entrada da aplicação.
  - secrets.mjs: Contém o setup das variáveis de ambiente.

## API Endpoints

### Public Routes

- POST /register: Registra um novo usuário.
- POST /login: Realiza o log in do usuário.

### Private Routes

- GET /posts: Retorna uma lista de posts.
- POST /posts: Cria um novo post.
- PUT /posts/:id: Atualiza um post.
- DELETE /posts/:id: Deleta um post.

## Logging

Logs de acesso são mantidos no arquivo logs/access.log.

## License

This project is licensed under the ISC License.