import re
import unicodedata
from pathlib import Path

ROOT = Path(r"c:\Users\bangs\Downloads\WebBanSachTrucTuyen")
TARGET_EXTS = {".ts", ".tsx", ".js", ".jsx"}
SKIP_DIRS = {"node_modules", ".git", ".next", "dist", "build"}


def remove_diacritics(value: str) -> str:
    value = value.replace("đ", "d").replace("Đ", "D")
    normalized = unicodedata.normalize("NFKD", value)
    return "".join(ch for ch in normalized if not unicodedata.combining(ch))


def clean_comment(raw: str) -> str:
    text = raw.strip()
    text = text.replace("\r", " ").replace("\n", " ")
    text = text.replace("\t", " ")
    text = remove_diacritics(text)
    text = text.replace("=", "")
    text = text.replace("—", " ").replace("–", " ").replace("→", " ")
    text = text.replace("/", " ").replace("\\", " ")
    text = text.replace("*", " ")
    text = text.replace("_", " ")
    text = text.replace("-", " ")
    text = re.sub(r"[{}()\[\]<>]+", " ", text)
    text = re.sub(r"[^A-Za-z0-9\s%.,:;!?/\-]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip(" ,:;.!?/-")
    return text


def process_text(source: str) -> str:
    result: list[str] = []
    i = 0
    n = len(source)

    while i < n:
        ch = source[i]

        if ch in {"'", '"', '`'}:
            quote = ch
            start = i
            i += 1
            escaped = False
            while i < n:
                curr = source[i]
                if escaped:
                    escaped = False
                elif curr == "\\":
                    escaped = True
                elif curr == quote:
                    i += 1
                    break
                i += 1
            result.append(source[start:i])
            continue

        if source.startswith("//", i):
            j = i + 2
            while j < n and source[j] != "\n":
                j += 1
            raw = source[i + 2 : j]
            cleaned = clean_comment(raw)
            if cleaned:
                result.append("// " + cleaned)
            else:
                result.append("//")
            if j < n:
                result.append("\n")
            i = j + 1 if j < n else j
            continue

        if source.startswith("/*", i):
            j = source.find("*/", i + 2)
            if j == -1:
                raw = source[i + 2 :]
                cleaned = clean_comment(raw)
                result.append("// " + cleaned if cleaned else "//")
                break
            raw = source[i + 2 : j]
            cleaned = clean_comment(raw)
            if cleaned:
                result.append("// " + cleaned)
            else:
                result.append("//")
            i = j + 2
            continue

        result.append(ch)
        i += 1

    return "".join(result)


def should_process(path: Path) -> bool:
    if path.suffix.lower() not in TARGET_EXTS:
        return False
    if any(part in SKIP_DIRS for part in path.parts):
        return False
    return True


changed = 0
for path in ROOT.rglob("*"):
    if not path.is_file() or not should_process(path):
        continue
    try:
        original = path.read_text(encoding="utf-8")
    except Exception:
        continue
    updated = process_text(original)
    if updated != original:
        path.write_text(updated, encoding="utf-8")
        changed += 1

print(f"Updated {changed} files")
