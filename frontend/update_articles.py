
import json

slug_map = {
    "podarki-na-8-marta-sotrudnicam": 1,
    "originalnye-podarki-na-8-marta": 2,
    "korporativnye-podarki-na-8-marta-v-tashkente": 3,
    "chto-podarit-mame-na-8-marta": 4,
    "chto-podarit-kollege-na-8-marta": 5,
    "chto-podarit-rukovoditelyu-na-8-marta": 6,
    "chto-podarit-devushke-na-8-marta": 7,
    "chto-podarit-na-8-marta-devushke-mame-kollege": 8,
    "nedorogie-podarki-na-8-marta": 9,
    "gravirovka-v-tashkente-na-8-marta": 10
}

with open("src/data/blogPosts.js", "r") as f:
    content = f.read()

for slug, num in slug_map.items():
    # RU version
    with open(f"/tmp/march8-article-{num}-ru.html", "r") as f_ru:
        article_html_ru = f_ru.read()
    
    # UZ version
    with open(f"/tmp/march8-article-{num}-uz.html", "r") as f_uz:
        article_html_uz = f_uz.read()

    # Escape for JS string
    escaped_html_ru = json.dumps(article_html_ru)[1:-1]
    escaped_html_uz = json.dumps(article_html_uz)[1:-1]

    # Find the RU article section
    ru_slug_marker = f"slug: \'{slug}\'"
    ru_section_start = content.find(ru_slug_marker)
    
    # Find the placeholder and replace it
    placeholder = '"body": "<p>Placeholder for the article body. This will be filled with the full content.</p>"'
    start_replace_ru = content.find(placeholder, ru_section_start)
    if start_replace_ru != -1:
        end_replace_ru = start_replace_ru + len(placeholder)
        content = content[:start_replace_ru] + f'"contentHtml": "{escaped_html_ru}"' + content[end_replace_ru:]

    # Find the UZ article section (it comes after the RU section)
    uz_slug_marker = f"slug: \'{slug}-uz\'"
    uz_section_start = content.find(uz_slug_marker, ru_section_start)
    
    # Find the placeholder and replace it
    start_replace_uz = content.find(placeholder, uz_section_start)
    if start_replace_uz != -1:
        end_replace_uz = start_replace_uz + len(placeholder)
        content = content[:start_replace_uz] + f'"contentHtml": "{escaped_html_uz}"' + content[end_replace_uz:]

with open("src/data/blogPosts.js", "w") as f:
    f.write(content)

print("Successfully updated blogPosts.js with full article content.")
