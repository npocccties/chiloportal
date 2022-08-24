/*
drop table if exists badges cascade;
drop table if exists categorized_badge cascade;
drop table if exists badge_relation cascade;
drop table if exists training cascade;
drop table if exists consumer cascade;
drop table if exists category cascade;
drop table if exists course cascade;
drop table if exists course_level cascade;
*/
create table badges (
	id		serial		not null,	-- バッジID
	badge_class_id	text		not null,	-- BadgeClass ID
	name		varchar(512)	not null,	-- バッジ名称
	description	text		null,		-- 説明
	narrative	text		null,		-- 基準
	image_id	text		null,		-- 画像 ID
	image_author	text		null,		-- 画像 author
	ob_version	text		null,		-- OBバージョン
	issuer_name	varchar(256)	null,		-- 発行者
	issuer_url	text		null,		-- issuer url
	issuer_email	text		null,		-- issuer email
	issuer_id	text		null,		-- issuer id
	type		char(9)		not null,	-- バッジ種別(wisdom or knowledge)
	url		text		null,		-- URL
	primary key (id)
); -- 'バッジ'
create table badge_relation (
	id			serial		not null,	-- Relation ID
	wisdom_badge_id		int		not null	REFERENCES badges,	-- Wisdom Badge ID
	knowledge_badge_id	int		not null	REFERENCES badges,	-- Knowlwdge Badge ID
	primary key (id)
); -- '関連バッジ'
create table training (
	id		serial		not null,	-- 研修内容 ID
	badge_id	int		not null	REFERENCES badges,	-- Badge ID
	type		varchar(32)	not null,	-- 種類
	name		varchar(256)	not null,	-- 名称
	primary key (id)
); -- '研修内容'
create table consumer (
	id		serial		not null,	-- コンシューマ ID
	name		varchar(256)	not null,	-- 名称
	url		text		null,		-- URL
	email		varchar(256)	null,		-- 連絡先メールアドレス
	primary key (id)
); -- 'コンシューマ'
create table category (
	id		serial		not null,	-- カテゴリID
	consumer_id	int		not null	REFERENCES consumer,	-- コンシューマ ID
	category1_name	varchar(128)	not null,	-- カテゴリ1
	category2_name	varchar(128)	not null,	-- カテゴリ2
	category3_name	varchar(128)	not null,	-- カテゴリ3
	primary key (id)
); -- 'カテゴリ'
create table course (
	id		serial		not null,	-- 受講対象ID
	consumer_id	int		not null	REFERENCES consumer,	-- コンシューマ ID
	name		varchar(256)	not null,	-- 名称
	description	text		not null,	-- 説明
	primary key (id)
); -- '受講対象'
create table course_level (
	id		serial		not null,	-- 受講レベルID
	consumer_id	int		not null	REFERENCES consumer,	-- コンシューマ ID
	name		varchar(256)	not null,	-- 名称
	description	text		not null,	-- 説明
	primary key (id)
); -- '受講レベル'
create table categorized_badge (
	id		serial		not null,	-- カテゴライズID
	consumer_id	int		not null	REFERENCES consumer,		-- コンシューマ ID
	category_id	int		not null	REFERENCES category,		-- Category ID
	badge_id	int		not null	REFERENCES badges,		-- Badge ID
	course_id	int		not null	REFERENCES course,		-- 受講対象 ID
	course_level_id	int		not null	REFERENCES course_level,	-- 受講レベル ID
	description	text		not null,	-- 説明
	primary key (id)
); -- 'カテゴライズドバッジ'
