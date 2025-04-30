drop table if exists wallets cascade;
drop table if exists badge_vcs cascade;
drop table if exists badge_consumers cascade;
drop table if exists submissions cascade;
drop table if exists lms_list cascade;
-- ----------------------------------------------------------------------------------------------------

-- ウォレット
create table wallets (
    wallet_id serial not null,       -- ウォレットID
    orthros_id text not null,        -- オルトロスID
    created_at timestamp not null,   -- 作成日時
    primary key (wallet_id)
);

create unique index on wallets (
    orthros_id
);

-- バッジVCテーブル
create table badge_vcs (
    badge_vc_id serial not null,                -- バッジVC ID
    wallet_id integer not null,                 -- ウォレットID
    lms_id integer not null,                    -- バッジ取得LMSの選択ID
    lms_name varchar(256)not  null,             -- バッジ取得LMSの選択表示名
    badge_uniquehash text not null,             -- バッジユニークハッシュ
    badge_name varchar(256) not null,           -- バッジ名
    badge_earner_email varchar(256) not null,   -- バッジ獲得者EMail
    badge_class_id text not null,               -- バッジクラスID
    badge_issuer_name varchar(256) not null,    -- バッジ発行者名
    badge_issuedon timestamp not null,          -- バッジ発行日時
    badge_expires timestamp,                    -- バッジ有効期限
    vc_data_header text not null,               -- VCデータヘッダ
    vc_data_payload text not null,              -- VCデータペイロード
    vc_data_signature text not null,            -- VCデータ署名
    created_at timestamp not null,              -- 作成日時
    primary key (badge_vc_id),
    foreign key (wallet_id) references wallets (wallet_id)
);

create index on badge_vcs (
    wallet_id
);

-- 提出先
create table badge_consumers (
    consumer_id serial not null,                -- バッジ提出先ID
    consumer_name varchar(256) not null,        -- バッジ提出先名
    cabinet_url text not null,                  -- キャビネットURL
    primary key (consumer_id)
);

-- 提出履歴
create table submissions (
    badge_vc_id integer not null,               -- バッジVC ID
    wallet_id integer not null,                 -- ウォレットID
    submited_at timestamp not null,             -- 提出日時
    submission_email varchar(256) not null,     -- 提出EMAILアドレス
    consumer_id integer not null,               -- バッジ提出先ID
    consumer_name varchar(256) not null,        -- バッジ提出先名
    primary key (badge_vc_id, submited_at),
    foreign key (badge_vc_id) references badge_vcs (badge_vc_id)
);

create index on submissions (
    wallet_id
);

-- LMSリスト
create table lms_list (
    lms_id serial not null,                     -- バッジ取得LMSの選択ID
    lms_name varchar(256) not null,             -- バッジ取得LMSの選択表示名
    lms_url text not null,                      -- バッジ取得LMSサイトURL
    sso_enabled boolean not null,               -- SSO可否
    lms_access_token text not null,             -- バッジ取得LMSアクセストークン
    lms_service text not null,                  -- バッジ取得LMSサービス名
    primary key (lms_id)
);
