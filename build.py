#!/usr/bin/env python3
"""Monta as páginas estáticas do site a partir de partials/ + pages/.
Uso: python3 build.py
Gera os arquivos .html finais na raiz do projeto (prontos para GitHub Pages,
sem necessidade de build no deploy)."""
import os
import re
import json

ROOT = os.path.dirname(os.path.abspath(__file__))
PARTIALS = os.path.join(ROOT, "partials")
PAGES = os.path.join(ROOT, "pages")

NAV_KEYS = ["index", "sobre", "servicos", "depoimentos", "contato"]
SERVICE_SLUGS = {"estetica-facial", "estetica-corporal", "pilates", "funcional", "salao-beleza"}


def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def parse_page(raw):
    m = re.match(r"<!--META\n(.*?)\n-->\n(.*)$", raw, re.S)
    if not m:
        raise ValueError("Página sem bloco <!--META ... -->")
    meta_block, content = m.groups()
    meta = {}
    for line in meta_block.splitlines():
        if not line.strip():
            continue
        key, _, val = line.partition(":")
        meta[key.strip()] = val.strip()
    return meta, content


def build_header(active_key):
    header = read(os.path.join(PARTIALS, "header.html"))
    for key in NAV_KEYS:
        placeholder = "{{ACTIVE_%s}}" % key.upper()
        header = header.replace(placeholder, "is-active" if key == active_key else "")
    return header


def main():
    footer = read(os.path.join(PARTIALS, "footer.html"))
    mobile_nav = read(os.path.join(PARTIALS, "mobile-nav.html"))
    shell = read(os.path.join(PARTIALS, "shell.html"))

    page_files = sorted(f for f in os.listdir(PAGES) if f.endswith(".html"))
    built = []
    for fname in page_files:
        raw = read(os.path.join(PAGES, fname))
        meta, content = parse_page(raw)
        slug = meta["slug"]
        active = meta.get("active", "")
        if active in SERVICE_SLUGS:
            active_key = "servicos"
        elif active == "index":
            active_key = "index"
        else:
            active_key = active

        header_html = build_header(active_key)
        schema = meta.get("schema_file", "")
        schema_json = "{}"
        if schema:
            schema_json = read(os.path.join(PAGES, schema)).strip()

        out = shell
        out = out.replace("{{TITLE}}", meta.get("title", "Interativa Beleza & Saúde"))
        out = out.replace("{{DESCRIPTION}}", meta.get("description", ""))
        out = out.replace("{{SLUG}}", slug)
        out = out.replace("{{SCHEMA}}", schema_json)
        out = out.replace("{{HEADER}}", header_html)
        out = out.replace("{{MOBILE_NAV}}", mobile_nav)
        out = out.replace("{{CONTENT}}", content)
        out = out.replace("{{FOOTER}}", footer)

        out_path = os.path.join(ROOT, slug)
        write(out_path, out)
        built.append(slug)
        print("built:", slug)

    print("\nOK —", len(built), "páginas geradas.")


if __name__ == "__main__":
    main()
