-- 非表示フラグ追加用
alter table stage add column invisible boolean;
update stage set invisible = false;
alter table stage alter column invisible set not null;
