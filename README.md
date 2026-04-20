# DigiDoc - OCR de Canhotos de Notas Fiscais

PWA mobile-first para digitalização de canhotos de notas fiscais com OCR dual (Gemini + Tesseract.js).

## Funcionalidades

- **Capturar/Salvar**: tire uma foto ou envie um arquivo do canhoto. O OCR extrai o número da nota automaticamente.
- **Pesquisar**: busque pelo número da nota para visualizar o canhoto armazenado.
- **OCR dual**: resultados do Gemini (quando configurado) e Tesseract.js são exibidos para seleção.
- **Edição manual**: o número pode ser ajustado antes de salvar.
- **Controle de duplicidade**: ao informar um número já existente, o sistema pede confirmação para substituir.
- **PWA offline**: funciona como app instalável com suporte offline via Tesseract.js e localStorage.

## Início rápido

```bash
npm install
npm run dev
```

## Configuração do Gemini (opcional)

Na tela de captura, cole sua chave da API do Google Gemini no banner superior. O OCR via IA será ativado automaticamente. Sem a chave, o app funciona normalmente apenas com Tesseract.js.

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy em produção (GitHub Pages)

O projeto está configurado para deploy automático no GitHub Pages via GitHub Actions.

1. Faça push para a branch `main`.
2. No GitHub, vá em `Settings > Pages` e selecione `GitHub Actions` como source.
3. Aguarde o workflow `Deploy to GitHub Pages`.
4. URL esperada: `https://raythan.github.io/digidoc/`

## Stack

- React 19 + TypeScript + Vite 8
- vite-plugin-pwa (Service Worker + manifest)
- tesseract.js (OCR local/offline)
- @google/generative-ai (Gemini OCR)
- react-router-dom (navegação)
- localStorage (persistência)
