# Interativa Beleza & Saúde — Site institucional

Site institucional em HTML/CSS/JS puro (sem framework, sem build step em produção) para a **Interativa Beleza & Saúde**, clínica de estética avançada, pilates e treino funcional no Sion, Belo Horizonte.

9 páginas: Início, Sobre, Estética Facial, Estética Corporal, Pilates, Treino Funcional, Salão de Beleza, Depoimentos e Contato.

## Stack

- HTML5, CSS3 (custom properties, sem framework) e JavaScript vanilla.
- Vídeos verticais dos Reels do Instagram, comprimidos em H.264/MP4 e reproduzidos via um componente `LazyLoopVideo` reutilizável (autoplay mudo em loop, só carrega quando entra na viewport).
- Sem dependências de build para publicar — os arquivos `.html` na raiz já são o site pronto para qualquer hospedagem estática (GitHub Pages, Netlify, etc).

## Estrutura

```
assets/
  css/        tokens.css (paleta/tipografia), base.css, components.css, responsive.css
  js/         lazy-loop-video.js (componente reutilizável), site.js (nav, reveal, WhatsApp, formulário)
  video/      vídeos comprimidos (≈600kbps, sem áudio, 10-15s, +faststart)
  img/        fotos e posters otimizados em WebP
partials/     header, mobile-nav, footer e shell (usados pelo build.py)
pages/        conteúdo-fonte de cada página (com bloco de metadados no topo)
build.py      monta partials/ + pages/ e gera os .html finais na raiz
scripts/
  compress-videos.sh   pipeline ffmpeg usado para gerar assets/video + posters
  optimize-photos.py   conversão/otimização das fotos para assets/img/gallery
*.html        páginas finais geradas (não editar direto — editar em pages/ e rodar build.py)
```

## Como editar o conteúdo

1. Edite o arquivo correspondente em `pages/*.html` (ou os partials em `partials/`).
2. Rode `python3 build.py` para regenerar os `.html` da raiz.
3. Para pré-visualizar localmente: `node scripts/dev-server.js` e abra `http://localhost:8420`.

## Vídeos e imagens

Os arquivos originais (Reels e fotos exportados do Instagram, ~116MB) não ficam neste repositório — apenas as versões já comprimidas/otimizadas em `assets/`. Para reprocessar a partir dos originais, veja `scripts/compress-videos.sh` e `scripts/optimize-photos.py`.

## Deploy

Basta apontar o GitHub Pages (ou qualquer host estático) para a raiz do repositório — não há passo de build.
