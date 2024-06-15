# Central de arquivos

Um sistema de upload de arquivos utlizando S3 da AWS.

## 🚀 Sobre

Um sistema de upload de arquivos

O sistema foi feito integrado com S3 da AWS

Existe duas entidades, onde somente os usuários podem fazer upload de um arquivo

Cada usuário tem o limite de 200MB para upload.

Os formatos de arquivos aceitos são: Imagem => png, jpeg e jpg e Vídeo => mp3, mov e mkv

O usuário pode listar, deletar e baixar seus arquivos enviados

As rotas tem limite de requisição por endereço de ip, utilizei o redis para fazer o rate-limit


## Rotas da Aplicação

### Clientes
    [POST] - /clients - Cria um novo cliente

        Request:
            body {
                name: string;
                email: string;
                password: string
            }

        Response:
            200,

            400 {
                message: User already exists
            },

            400 {
                message: Invalid email
            }

    [GET] - /clients - Listar todos os usuários registrados

        Response:
            200 {
                "user": [
                    {
                        id: string;
                        name: string;
                        email: string;
                        password: string;
                        availableUploadSpace: number;
                    }
                ]
            },

            500 {
                message: {
                    Error
                }
            }

    [POST] - /clients/login - Gera um token que permite o acesso das rotas que estão fechados

        Request:
            body {
                email: string,
                password: string
            }

        Response:
            200 {
                token: string;
            },

            400 {
                message: Password or email is incorrect
            },

            400 {
                message: Invalid email
            }

### Upload
    [POST] - /upload - Upload de um arquivo selecionado (Rota protegida pro Bearer Token)

        Request:

            file: {
                type: {
                    Imagem: {
                        JPEG,
                        JPG,
                        PNG
                    },
                    Vídeo: {
                        MP4,
                        MOV,
                        MKV
                    }
                }
            }

        Response:

            200 {
                spaceLimiteRemaining: number;
                linkDownload: string;
            }

            400 {
                message: Invalid Token
            }

            400 {
                message: Insufficient space limit
            }

    [GET] - /upload - Returna o usuário e todos o arquivos upados por ele (Rota protegida pro Bearer Token)

        Response:

            200 {

                id: string;
                name: string;
                email: string;
                availableUploadSpace: number;
                files: string;
            }

            400 {
                message: Token is not valid
            }

    [POST] - /upload/{nomeDoArquivo} - Gerar um link de download do arquivo upado que tem validade de 60 segundos o nome do arquivo deve ser passado como parâmetro

        Respopnse:
            200 {
                linkDonwload: string;
            },

            400 {
                message: File not found
            }


    [DELETE] - /upload/{nomeDoArquivo} - Deleta o arquivo que já está upado passando o nome dele como parâmetro

        Response:

            200,

            400 {
                message: Token is not valid
            },

            400 {
                message: File not found
            }

## 🛠️ Construído com

* [TypeScript(JavaScript)] - A linguagem usada
* [Express] - O framework web usado
* [Typeorm] - O ORM utilizado
* [JWT] - Usado para a autenticação das rotas
* [Bcryptjs] - Usado para o hasheamento das senhas e garantir a segurança dos dados da aplicação
* [MySQL] - Como banco de dados
* [AWS S3] - Para o deploy dos arquivos
* [REDIS] - Para definir um limite de requisições nas rotas


## ✒️ Autores

* **Herik Santos**

<!-- ## 📄 Licença

Este projeto está sob a licença (MIT LICENSE) - veja o arquivo [LICENSE.md] (https://github.com/HerikSantos/back-end-barbearia/blob/main/LICENSE) para detalhes. -->
