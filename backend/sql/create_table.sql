drop table if exists zxc;
drop table if exists badges;
create table badges (
	id		serial		not null,	-- バッジID
	badge_class_id	int		not null,	-- BadgeClass ID
	badge_name	varchar(128)	not null,	-- バッジ名称
	description	varchar(512)	null,		-- 説明
	image_id	varchar(256)	null,		-- 画像 ID
	image_author	varchar(256)	null,		-- 画像 author
	ob_version	varchar(256)	null,		-- OBバージョン
	issuer_name	varchar(128)	null,		-- 発行者
	badge_type	char(9)		not null,	-- バッジ種別(wisdom or knowledge)
	badge_url	varchar(256)	null,		-- URL
	primary key (id)
); -- 'バッジ'
drop table if exists badge_relation;
create table badge_relation (
	id			serial		not null,	-- Relation ID
	wisdom_badge_id		int		not null	REFERENCES badges,	-- Wisdom Badge ID
	knowledge_badge_id	int		not null	REFERENCES badges,	-- Knowlwdge Badge ID
	primary key (id)
); -- '関連バッジ'
drop table if exists course_detail;
create table course_detail (
	id		serial		not null,	-- 研修内容 ID
	badge_id	int		not null	REFERENCES badges,	-- Badge ID
	course_type	varchar(32)	not null,	-- 種類
	course_name	varchar(256)	not null,	-- 名称
	primary key (id)
); -- '研修内容'
drop table if exists consumer;
create table consumer (
	id		serial		not null,	-- コンシューマ ID
	consumer_name	varchar(256)	not null,	-- 名称
	consumer_url	varchar(256)	null,		-- URL
	consumer_email	varchar(256)	null,		-- 連絡先メールアドレス
	primary key (id)
); -- 'コンシューマ'
drop table if exists category;
create table category (
	id		serial		not null,	-- カテゴリID
	consumer_id	int		not null	REFERENCES consumer,	-- コンシューマ ID
	category_name1	varchar(128)	not null,	-- カテゴリ1
	category_name2	varchar(128)	not null,	-- カテゴリ2
	category_name3	varchar(128)	not null,	-- カテゴリ3
	primary key (id)
); -- 'カテゴリ'
drop table if exists course;
create table course (
	id		serial		not null,	-- 受講対象ID
	consumer_id	int		not null	REFERENCES consumer,	-- コンシューマ ID
	course_name	varchar(256)	not null,	-- 名称
	description	varchar(512)	not null,	-- 説明
	primary key (id)
); -- '受講対象'
drop table if exists course_level;
create table course_level (
	id		serial		not null,	-- 受講レベルID
	consumer_id	int		not null	REFERENCES consumer,	-- コンシューマ ID
	course_name	varchar(256)	not null,	-- 名称
	description	varchar(512)	not null,	-- 説明
	primary key (id)
); -- '受講レベル'
drop table if exists categorized_badge;
create table categorized_badge (
	id		serial		not null,	-- カテゴライズID
	consumer_id	int		not null	REFERENCES consumer,		-- コンシューマ ID
	category_id	int		not null	REFERENCES category,		-- Category ID
	badge_id	int		not null	REFERENCES badges,		-- Badge ID
	course_id	int		not null	REFERENCES course,		-- 受講対象 ID
	course_level_id	int		not null	REFERENCES course_level,	-- 受講レベル ID
	description	varchar(512)	not null,	-- 説明
	primary key (id)
); -- 'カテゴライズドバッジ'
