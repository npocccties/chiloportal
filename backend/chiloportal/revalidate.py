#
# ポータルのページの作り直し（オンデマンド再生成）
#
# 機関ページ（/issuers/番号）は、フロントエンドが前もって作っておくページなので、
# バッジや機関を保存したら、フロントエンドに作り直すよう指示する。
# 1回の保存（トランザクション）で変わった機関をまとめて、保存が確定してから1回だけ送る。
#
# REVALIDATE_URL（例：フロントエンドの /api/revalidate）と REVALIDATE_SECRET が設定されていなければ、何もしない。
# 指示が届かなくても、フロントエンドは一定の間隔でページを作り直す（REVALIDATE_INTERVAL_SECONDS）。
#
import json
import logging
import os
import threading
import urllib.request

from django.db import transaction

logger = logging.getLogger(__name__)

TIMEOUT_SECONDS = 10

def _settings():
    return os.environ.get("REVALIDATE_URL", ""), os.environ.get("REVALIDATE_SECRET", "")


def send(issuer_ids):
    """フロントエンドに作り直しを指示する。失敗してもログに残すだけで、保存は止めない。"""
    url, secret = _settings()
    if not url or not secret or not issuer_ids:
        return
    body = json.dumps({"issuer_ids": sorted(issuer_ids)}).encode()
    request = urllib.request.Request(
        url,
        data=body,
        method="POST",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {secret}"},
    )
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            result = json.loads(response.read() or b"{}")
        failed = result.get("failed") or []
        if failed:
            logger.warning(f"Revalidate failed for some pages: {failed}")
        else:
            logger.info(f"Revalidated issuers: {sorted(issuer_ids)}")
    except Exception as e:
        logger.error(f"Revalidate request failed: issuer_ids: {sorted(issuer_ids)} ... {e}")


class _Pending:
    """保存が確定したときに呼ばれ、それまでに予約された機関をまとめて送る。

    確定待ちの処理（on_commit）そのものに機関を持たせるので、保存が取り消されたら予約も一緒に消える。
    """

    def __init__(self):
        self.issuer_ids = set()

    def __call__(self):
        # 画面の応答を待たせないよう、別のスレッドで送る。
        # 取り込みのコマンドなどは送り終わるまで終了を待つ（daemon=False。送信は TIMEOUT_SECONDS で打ち切る）
        threading.Thread(target=send, args=(set(self.issuer_ids),), daemon=False).start()


def request(*issuer_ids):
    """指定した機関のページの作り直しを予約する。保存が確定したときに、まとめて送る。"""
    url, secret = _settings()
    if not url or not secret:
        return
    ids = {issuer_id for issuer_id in issuer_ids if issuer_id}
    if not ids:
        return
    connection = transaction.get_connection()
    if connection.in_atomic_block:
        # 同じトランザクションで予約済みなら、そこに足す
        for _savepoint_ids, func, _robust in connection.run_on_commit:
            if isinstance(func, _Pending):
                func.issuer_ids.update(ids)
                return
    pending = _Pending()
    pending.issuer_ids.update(ids)
    transaction.on_commit(pending)
