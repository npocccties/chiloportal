drop table if exists portal_category cascade;
drop table if exists issuer cascade;
drop table if exists wisdom_badges cascade;
drop table if exists knowledge_badges cascade;
drop table if exists criteria cascade;
drop table if exists categorised_badges cascade;
drop table if exists consumer cascade;
drop table if exists framework cascade;
drop table if exists field cascade;
drop table if exists stage cascade;
drop table if exists goal cascade;
-- ----------------------------------------------------------------------------------------------------
create table portal_category (
	id		serial		not null,	-- ポータルカテゴリID
	name		varchar(128)	not null,	-- ポータルカテゴリ名
	description	text		null,		-- 説明
	image_url_path	text		null,		-- 画像のURLパス
	sort_key	int		not null,	-- 表示順
	primary key (id)
); -- 'ポータル独自カテゴリ'
create table issuer (
	id		serial		not null,	-- 発行者ID
	name		varchar(256)	null,		-- 発行者名
	url		text		null,		-- URL
	email		text		null,		-- email
	primary key (id)
); -- '発行者
create table wisdom_badges (
	id		serial		not null,	-- バッジID
	portal_category_id	int	null		REFERENCES portal_category,	-- ポータルカテゴリID
	badge_class_id	text		not null,	-- BadgeClass ID
	name		varchar(512)	not null,	-- バッジ名称
	description	text		null,		-- 説明
	tags		text		null,		-- 自由キーワード
	image_id	text		null,		-- 画像 ID
	image_author	text		null,		-- 画像 author
	version		text		null,		-- OBバージョン
	issuer_id	int		null		REFERENCES issuer,	-- 発行者のID
	alignments_targetname	text	not null,		-- targetName
	alignments_targeturl	text	not null,		-- targetUrl
	primary key (id)
); -- 'バッジ'
create table knowledge_badges (
	id		serial		not null,	-- バッジID
	wisdom_badges_id	int	not null	REFERENCES wisdom_badges,	-- バッジのID
	badge_class_id	text		not null,	-- BadgeClass ID
	name		varchar(512)	not null,	-- バッジ名称
	description	text		null,		-- 説明
	tags		text		null,		-- 自由キーワード
	criteria_narrative	text	null,		-- 基準
	image_id	text		null,		-- 画像 ID
	image_author	text		null,		-- 画像 author
	version		text		null,		-- OBバージョン
	issuer_id	int		null		REFERENCES issuer,	-- 発行者のID
	primary key (id)
); -- 'スタンプ'
create table criteria (
	id		serial		not null,	-- 研修内容ID
	knowledge_badges_id	int	not null	REFERENCES knowledge_badges,	-- スタンプのID
	type		varchar(32)	not null,	-- 種類
	name		varchar(256)	not null,	-- 名称
	sort_key	int		not null,	-- 表示順
	primary key (id)
); -- '研修内容'
-- ----------------------------------------------------------------------------------------------------
create table consumer (
	id		serial		not null,	-- コンシューマID
	name		varchar(256)	not null,	-- 名称
	url		text		null,		-- URL
	email		varchar(256)	null,		-- 連絡先メールアドレス
	primary key (id)
); -- 'コンシューマ'
-- ----------------------------------------------------------------------------------------------------
create table framework (
	id		serial		not null,	-- 教員育成指標ID
	consumer_id	int		not null	REFERENCES consumer,	-- コンシューマID
	name		varchar(256)	not null,	-- 名称
	description	text		null,	-- 説明
	supplementary	text		null,	-- 補足説明
	url		text		not null,	-- PDFのURL
	sort_key	int		not null,	-- 表示順
	primary key (id)
); -- '教員育成指標'
-- ----------------------------------------------------------------------------------------------------
create table stage (
	id		serial		not null,	-- 成長段階ID
	name		varchar(256)	not null,	-- 名称
	sub_name	text		null,	-- 自由記述欄
	description	text		null,	-- 説明
	password text null,	-- パスワード
	sort_key	int		not null,	-- 表示順
	primary key (id)
); -- '成長段階'
create table field (
	id		serial		not null,	-- 指標項目ID
	field1_name	varchar(128)	not null,	-- 指標項目1
	field2_name	varchar(128)	not null,	-- 指標項目2
	field3_name	varchar(128)	not null,	-- 指標項目3
	sort_key	int		not null,	-- 表示順
	primary key (id)
); -- '指標項目'
-- ----------------------------------------------------------------------------------------------------
create table goal (
	id			serial	not null,	-- 目標ID
	framework_id		int	not null	REFERENCES framework,	-- 教員育成指標ID
	stage_id		int	not null	REFERENCES stage,	-- 成長段階ID
	field_id		int	not null	REFERENCES field,	-- 指標項目ID
	description		text	not null,	-- 説明
	primary key (id)
); -- '指標項目の成長段階毎の目標'
-- ----------------------------------------------------------------------------------------------------
create table categorised_badges (
	id			serial	not null,	-- カテゴライズID
	wisdom_badges_id	int	not null	REFERENCES wisdom_badges,	-- バッジのID
	goal_id			int	not null	REFERENCES goal,	-- 目標ID
	description		text	null,	-- 説明
	primary key (id)
); -- 'カテゴライズドバッジ'
