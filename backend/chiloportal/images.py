#
# 管理画面でアップロードする画像（バッジの表示用画像など）の確認と保存先
#
# SVG はスクリプトを埋め込めるので、スクリプト・イベント属性・外部への参照を含むものは受け付けない。
# 配信する nginx でも、/media/ にはスクリプトを動かさない CSP を付ける（nginx.*.conf）。
#
import os
import re
import uuid

from defusedxml import ElementTree
from defusedxml.common import DefusedXmlException
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

MAX_IMAGE_BYTES = 2 * 1024 * 1024
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
ALLOWED_EXTENSIONS = {".svg", ".png"}

# 受け付けない SVG の要素（名前空間を外したもの）
FORBIDDEN_SVG_ELEMENTS = {"script", "foreignobject", "iframe", "embed", "object", "audio", "video", "handler", "listener"}
# 参照してよいのは、同じ文書の中（#id）と埋め込みの画像（data:image/png など。SVG の埋め込みは不可）だけ
ALLOWED_REFERENCE = re.compile(r"^(#|data:image/(png|jpeg|gif|webp);)", re.IGNORECASE)
EXTERNAL_URL_IN_STYLE = re.compile(r"url\(\s*['\"]?(?!#)", re.IGNORECASE)


def _local_name(name):
    return name.rsplit("}", 1)[-1].lower()


def check_svg(content):
    """SVG にスクリプトや外部への参照がないかを確かめる。問題があれば ValidationError。"""
    try:
        root = ElementTree.fromstring(content)
    except (ElementTree.ParseError, DefusedXmlException, ValueError):
        # 解析できないもの・DTD（実体の定義）を含むものは受け付けない
        raise ValidationError("SVG として読み込めませんでした。")
    if _local_name(root.tag) != "svg":
        raise ValidationError("SVG の画像ではありません。")
    for element in root.iter():
        tag = _local_name(element.tag)
        if tag in FORBIDDEN_SVG_ELEMENTS:
            raise ValidationError(f"SVG に使えない要素（{tag}）が含まれています。")
        for name, value in element.attrib.items():
            attr = _local_name(name)
            if attr.startswith("on"):
                raise ValidationError(f"SVG に使えない属性（{attr}）が含まれています。")
            if attr in ("href", "src") and not ALLOWED_REFERENCE.match(value.strip()):
                raise ValidationError("SVG の中で、外部のファイルやスクリプトを参照しています。")
            if attr == "style" and EXTERNAL_URL_IN_STYLE.search(value):
                raise ValidationError("SVG の中で、外部のファイルを参照しています。")
        if tag == "style" and element.text and (EXTERNAL_URL_IN_STYLE.search(element.text) or "@import" in element.text):
            raise ValidationError("SVG の中で、外部のファイルを参照しています。")


def validate_badge_image(file):
    """バッジの表示用画像として、SVG と PNG だけを受け付ける。"""
    extension = os.path.splitext(file.name)[1].lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise ValidationError("SVG か PNG の画像を選んでください。")
    if file.size > MAX_IMAGE_BYTES:
        raise ValidationError(f"画像のサイズは {MAX_IMAGE_BYTES // 1024 // 1024}MB までです。")
    position = file.tell() if hasattr(file, "tell") else 0
    file.seek(0)
    content = file.read()
    file.seek(position)
    if extension == ".png":
        if not content.startswith(PNG_SIGNATURE):
            raise ValidationError("PNG の画像ではありません。")
    else:
        check_svg(content)


@deconstructible
class RandomName:
    """アップロードした画像を、推測されにくい名前で保存する（差し替えたらブラウザのキャッシュも切り替わる）。"""

    def __init__(self, directory):
        self.directory = directory

    def __call__(self, instance, filename):
        extension = os.path.splitext(filename)[1].lower()
        return f"{self.directory}/{uuid.uuid4().hex}{extension}"
