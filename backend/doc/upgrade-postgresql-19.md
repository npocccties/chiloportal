# PostgreSQL 13 → 19 の移行手順

Django 5.2 は PostgreSQL 14 以上が必要なので、このリポジトリの「Django 5.2・Python 3.13 への更新」と同時に行います。
PostgreSQL はメジャー版が変わるとデータファイルに互換性がないので、ダンプを取って新しいボリュームに流し込みます。

- 13 のデータ（本番は `db_data` ボリューム、開発・検証環境は `backend/postgresql/data`）は消さずに残し、切り戻しに使います。
- 19 のデータは、本番は `db_data_pg19` ボリューム、開発・検証環境は `backend/postgresql/pg19` に置きます。
- 本番の前に、検証環境で同じ手順を通してください。

## 1. 事前の準備

1. 利用者に停止の時間を告知する（目安 30 分）。
1. 移行前のコードで、DB のバックアップを取る。`/var/chiloportal.dump` と、圧縮した控え（`DUMP_BACKUP_DIR`）ができる。
   ```
   cd backend
   ./server_db_backup.sh
   ```
1. ダンプを移行用に別名で控えておく。
   ```
   sudo cp /var/chiloportal.dump /var/chiloportal-pg13.dump
   ```

## 2. 停止とコードの更新

1. バックエンドを止める（`server_stop.sh` もバックアップを取ってから止める）。
   ```
   ./server_stop.sh
   ```
1. コードを更新し、使う compose ファイルを置き換える。
   ```
   git pull
   sudo cp docker-compose.production.yml docker-compose.yml   # 検証環境は docker-compose.dev-server.yml
   ```

## 3. PostgreSQL 19 にデータを流し込む

DB だけを先に起動してから流し込みます。アプリを先に起動すると、空の DB にマイグレーションで表が作られ、流し込みとぶつかります。

1. DB だけを起動する（新しいボリュームなので、空の DB ができる）。
   ```
   docker compose pull db
   docker compose up -d db
   docker compose exec -T db sh -c 'until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do sleep 1; done; postgres --version'
   ```
   `postgres (PostgreSQL) 19.x` と出ることを確認する。
1. ダンプを流し込む。
   ```
   docker compose exec -T db sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --exit-on-error' < /var/chiloportal-pg13.dump
   ```
1. 件数を確認する（移行前の DB で同じ SQL を実行した結果と比べる）。
   ```
   docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "select (select count(*) from wisdom_badges) wisdom, (select count(*) from knowledge_badges) knowledge, (select count(*) from issuer) issuer, (select count(*) from portal_category) category, (select count(*) from goal) goal;"'
   ```

## 4. 起動

1. バックエンドを起動する。イメージを作り直し、`migrate --fake-initial` で次の処理が行われる。
   - `chiloportal.0001_initial` は、表がすでにあるので「適用済み」として記録だけする（FAKED）。
   - ライブラリの新しいマイグレーション（axes など）を適用する。
   ```
   ./server_start.sh
   ```
1. マイグレーションの状態を確認する。すべて `[X]` になっていればよい。
   ```
   docker compose exec -T app python manage.py showmigrations
   ```
1. ポータルの表示（トップ、バッジ一覧・詳細、機関ページ、検索）と、ポートフォリオからの API の呼び出しを確認する。

## 5. 切り戻し

13 のデータはそのまま残っているので、コードを戻して起動し直します。

```
./server_stop.sh
git checkout <移行前のコミット>
sudo cp docker-compose.production.yml docker-compose.yml
./server_start.sh
```

## 6. 後片付け

しばらく運用して問題がなければ、13 のデータを消す（本番は `docker volume rm <プロジェクト名>_db_data`、開発・検証環境は `backend/postgresql/data`）。消す前に、`/var/chiloportal-pg13.dump` を別の場所に保管しておく。
