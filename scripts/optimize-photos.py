import os
from PIL import Image

SRC = "img"
OUT = "assets/img/gallery"
os.makedirs(OUT, exist_ok=True)

# source_filename -> output_slug
MAP = {
    "interativaestetica_1733756400_3519326538421594313_1451196557.jpg": "facial-microagulhamento",
    "interativaestetica_1734102000_3517943490685764502_1451196557.jpg": "equipe-manicure-fernanda",
    "interativaestetica_1734706800_3527298857581551685_1451196557.jpg": "unha-gel-vermelho",
    "interativaestetica_1734879600_3528748552036153697_1451196557.jpg": "massagem-relaxante",
    "interativaestetica_1735423200_3533308646153310340_1451196557.jpg": "spa-hidratacao-maos",
    "interativaestetica_1735570800_3533275457246504820_1451196557.jpg": "facial-botox-area",
    "interativaestetica_1735570800_3533275457246632308_1451196557.jpg": "facial-botox-aplicacao",
    "interativaestetica_1748467088_3642728415049324918_1451196557.jpg": "unha-azul-glitter-1",
    "interativaestetica_1748467088_3642728415074601492_1451196557.jpg": "unha-azul-glitter-2",
    "interativaestetica_1788631064_3979645090859231649_1451196557.jpg": "make-modelo",
    "interativaestetica_1789227347_3984648337679670785_1451196557.jpg": "facial-limpeza-pele",
    "interativaestetica_1735729200_3535875417577308073_1451196557.jpg": "equipe-debora-oliveira",
}

MAX_W = 1100

for src, slug in MAP.items():
    path = os.path.join(SRC, src)
    im = Image.open(path).convert("RGB")
    if im.width > MAX_W:
        h = int(im.height * MAX_W / im.width)
        im = im.resize((MAX_W, h), Image.LANCZOS)
    out_path = os.path.join(OUT, slug + ".webp")
    im.save(out_path, "WEBP", quality=82, method=6)
    print(slug, im.size, os.path.getsize(out_path))

# logo
logo = Image.open(os.path.join(SRC, "logo.png")).convert("RGBA")
logo.save("assets/img/logo.png")
# trimmed square version for favicon-ish use, keep as is but also make a smaller webp
logo_rgb_bg = Image.new("RGBA", logo.size, (255,255,255,0))
print("logo", logo.size)
