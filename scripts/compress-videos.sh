#!/bin/bash
set -e
cd "$(dirname "$0")/.."
SRC="img"
OUT_V="assets/video"
OUT_P="assets/img/posters"
mkdir -p "$OUT_V" "$OUT_P"

# name|source_file|start_seconds|duration_seconds|poster_time_offset_from_start
JOBS=(
"corporal-criofrequencia-closeup|interativaestetica_1734361200_3524399953928168409_1451196557.mp4|0|12|1.5"
"fachada-clinica|interativaestetica_1744223278_3607127949355530155_1451196557.mp4|0|12|2"
"localizacao-entrada|interativaestetica_1744662043_3610801061734255326_1451196557.mp4|0|13|3"
"cabelo-transformacao|interativaestetica_1744905723_3612853304498380215_1451196557.mp4|0|12|1.5"
"depoimento-vania|interativaestetica_1745353870_3616612442714969496_1451196557.mp4|2|13|4"
"tecnologia-criofrequencia|interativaestetica_1745516889_3617980156023968884_1451196557.mp4|0|14|2"
"espaco-interno|interativaestetica_1745956806_3621670400582513119_1451196557.mp4|0|11.5|1.2"
"equipamento-novo|interativaestetica_1782476497_3928017037527617534_1451196557.mp4|0|12|2"
"funcional-equipe|interativaestetica_1782735872_3930195236855276325_1451196557.mp4|0|12|2"
"funcional-treino-equipamentos|interativaestetica_1783438417_3936087366946120889_1451196557.mp4|0|12|2"
"cabelo-balayage-detalhe|interativaestetica_1784828698_3947750850382059990_1451196557.mp4|0|4|0.5"
"entrada-treino-funcional|interativaestetica_1786470213_3961517792949636597_1451196557.mp4|0|12|2"
)

for job in "${JOBS[@]}"; do
  IFS='|' read -r name src start dur poster_off <<< "$job"
  in="$SRC/$src"
  out="$OUT_V/$name.mp4"
  poster="$OUT_P/$name.jpg"
  poster_webp="$OUT_P/$name.webp"
  echo "== $name =="
  ffmpeg -y -v error -ss "$start" -i "$in" -t "$dur" \
    -vf "scale='min(720,iw)':-2:flags=lanczos" \
    -c:v libx264 -profile:v main -level 4.0 -pix_fmt yuv420p \
    -b:v 600k -maxrate 700k -bufsize 1200k \
    -preset slow -movflags +faststart \
    -an "$out"
  poster_t=$(python3 -c "print($start + $poster_off)")
  ffmpeg -y -v error -ss "$poster_t" -i "$in" -frames:v 1 \
    -vf "scale='min(720,iw)':-2:flags=lanczos" "$poster"
  cwebp -quiet -q 78 "$poster" -o "$poster_webp"
  rm -f "$poster"
  ls -lh "$out" "$poster_webp"
done

echo "DONE"
du -sh "$OUT_V" "$OUT_P"
