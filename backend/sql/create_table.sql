drop table if exists portal_category cascade;
drop table if exists issuer cascade;
drop table if exists wisdom_badges cascade;
drop table if exists knowledge_badges cascade;
drop table if exists course cascade;
drop table if exists consumer cascade;
drop table if exists target_occupations cascade;
drop table if exists category cascade;
drop table if exists target_carrier_stage cascade;
drop table if exists cell cascade;
drop table if exists categorised_badges cascade;
-- ----------------------------------------------------------------------------------------------------
create table portal_category (
	id		serial		not null,	-- カテゴリ ID
	name		varchar(128)	not null,	-- カテゴリ
	sort_key	int		not null,	-- 表示順
	primary key (id)
); -- 'ポータル独自カテゴリ'
create table issuer (
	id		serial		not null,	-- 発行者ID
	name		varchar(256)	null,		-- 発行者名
	url		text		null,		-- url
	email		text		null,		-- email
	primary key (id)
); -- '発行者
create table wisdom_badges (
	id		serial		not null,	-- バッジID
	portal_category_id	int	null		REFERENCES portal_category,	-- ポータル独自カテゴリのID
	badge_class_id	text		not null,	-- BadgeClass ID
	name		varchar(512)	not null,	-- バッジ名称
	description	text		null,		-- 説明
	narrative	text		null,		-- 基準
	image_id	text		null,		-- 画像 ID
	image_author	text		null,		-- 画像 author
	ob_version	text		null,		-- OBバージョン
	issuer_id	int		null		REFERENCES issuer,	-- 発行者のID
	url		text		null,		-- URL
	primary key (id)
); -- '能力バッジ'
create table knowledge_badges (
	id		serial		not null,	-- バッジID
	wisdom_badges_id	int	not null	REFERENCES wisdom_badges,	-- 能力バッジのID
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
	primary key (id)
); -- '知識バッジ'
create table course (
	id		serial		not null,	-- 研修内容 ID
	knowledge_badges_id	int	not null	REFERENCES knowledge_badges,	-- 知識バッジのID
	type		varchar(32)	not null,	-- 種類
	name		varchar(256)	not null,	-- 名称
	primary key (id)
); -- '研修内容'
-- ----------------------------------------------------------------------------------------------------
create table consumer (
	id		serial		not null,	-- コンシューマ ID
	name		varchar(256)	not null,	-- 名称
	url		text		null,		-- URL
	email		varchar(256)	null,		-- 連絡先メールアドレス
	primary key (id)
); -- 'コンシューマ'
create table target_occupations (
	id		serial		not null,	-- 受講対象ID
	consumer_id	int		not null	REFERENCES consumer,	-- コンシューマ ID
	name		varchar(256)	not null,	-- 名称
	description	text		not null,	-- 説明
	supplementary	text		not null,	-- 補足説明
	sort_key	int		not null,	-- 表示順
	primary key (id)
); -- '受講対象'
-- ----------------------------------------------------------------------------------------------------
create table category (
	id		serial		not null,	-- カテゴリ ID
	category1_name	varchar(128)	not null,	-- カテゴリ1
	category2_name	varchar(128)	not null,	-- カテゴリ2
	category3_name	varchar(128)	not null,	-- カテゴリ3
	sort_key	int		not null,	-- 表示順
	primary key (id)
); -- 'カテゴリ'
create table target_carrier_stage (
	id		serial		not null,	-- 受講レベルID
	name		varchar(256)	not null,	-- 名称
	sub_name	text		not null,	-- 自由記述欄
	description	text		not null,	-- 説明
	sort_key	int		not null,	-- 表示順
	primary key (id)
); -- '受講レベル'
-- ----------------------------------------------------------------------------------------------------
create table cell (
	id			serial	not null,	-- セルID
	target_occupations_id	int	not null	REFERENCES target_occupations,	-- 受講対象 ID
	category_id		int	not null	REFERENCES category,	-- カテゴリ ID
	carrier_stage_id	int	not null	REFERENCES target_carrier_stage,	-- 受講レベル ID
	description		text	not null,	-- 説明
	primary key (id)
); -- 'セル'
-- ----------------------------------------------------------------------------------------------------
create table categorised_badges (
	id		serial		not null,	-- カテゴライズID
	wisdom_badges_id	int	not null	REFERENCES wisdom_badges,	-- 能力バッジのID
	cell_id		int		not null	REFERENCES cell,	-- セル ID
	description	text		not null,	-- 説明
	primary key (id)
); -- 'カテゴライズドバッジ'
