-- 非表示フラグ追加用
alter table framework add column invisible boolean;
update framework set invisible = false;
alter table framework alter column invisible set not null;
