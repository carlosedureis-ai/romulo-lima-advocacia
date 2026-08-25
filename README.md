# Rômulo Lima Advocacia

Landing page de página única para o advogado Rômulo Lima, com atuação em Santarém/PA e região. O projeto destaca o Direito Previdenciário e direciona o visitante para o WhatsApp, com Instagram como canal secundário.

![Prévia da landing page](docs/preview-desktop.png)

## Tecnologias

- React 19
- Vite 8
- Motion
- Phosphor Icons
- Manrope e Newsreader

## Executar no Windows

1. Baixe ou clone o repositório.
2. Clique duas vezes em `abrir-app.bat`.
3. Aguarde o navegador abrir em `http://127.0.0.1:5173/`.

Não abra `index.html` diretamente. React e Vite precisam de um servidor local para processar os módulos, estilos e recursos do site.

## Executar pelo terminal

Requisitos: Node.js 20 ou superior e pnpm.

```powershell
pnpm install
pnpm dev
```

Para gerar a versão de produção:

```powershell
pnpm build
pnpm preview
```

## Estrutura

```text
public/images/   Fotografias, texturas e máscaras orgânicas
src/App.jsx      Estrutura e comportamento da página
src/content.js  Conteúdo e dados editáveis
src/main.jsx     Entrada da aplicação
src/styles.css   Identidade visual, responsividade e animações
docs/            Prévia visual para o GitHub
```

## Contatos configurados

- WhatsApp: `(93) 99125-4049`
- Instagram: `@advromulolima`

A mensagem do WhatsApp é preenchida automaticamente. Os dados podem ser atualizados em `src/content.js`.

## Dados profissionais pendentes

O número da OAB/PA, a formação, a pós-graduação e o tempo de atuação permanecem marcados como dados a serem fornecidos. Nenhuma credencial foi inventada.

## Publicação

O site é publicado automaticamente no GitHub Pages após cada push para a branch `main`:

https://carlosedureis-ai.github.io/romulo-lima-advocacia/

O workflow em `.github/workflows/deploy.yml` instala as dependências, gera `dist/` e publica somente os arquivos compilados.

## Licença e uso de imagem

Este projeto não possui uma licença de reutilização aberta. A fotografia, o nome e a identidade profissional de Rômulo Lima devem ser usados somente com autorização do titular.
