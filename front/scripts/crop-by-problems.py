#!/usr/bin/env python3
"""
교재 페이지 이미지를 문항별(2x2)로 잘라 저장.
사용: python scripts/crop-by-problems.py <이미지경로>
출력: 같은 폴더에 140.png, 141.png, 142.png, 143.png
"""
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow 필요: pip install Pillow")
    sys.exit(1)


def main():
    if len(sys.argv) < 2:
        print("사용: python crop-by-problems.py <이미지경로>")
        sys.exit(1)
    path = Path(sys.argv[1])
    if not path.exists():
        print(f"파일 없음: {path}")
        sys.exit(1)

    img = Image.open(path).convert("RGB")
    w, h = img.size
    hw, hh = w // 2, h // 2

    crops = [
        (0, 0, hw, hh, "140"),
        (0, hh, hw, h, "141"),
        (hw, 0, w, hh, "142"),
        (hw, hh, w, h, "143"),
    ]
    out_dir = path.parent
    for x0, y0, x1, y1, name in crops:
        crop = img.crop((x0, y0, x1, y1))
        out_path = out_dir / f"{name}.png"
        crop.save(out_path)
        print(f"저장: {out_path}")


if __name__ == "__main__":
    main()
