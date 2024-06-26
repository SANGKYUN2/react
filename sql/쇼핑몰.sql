create table users(
	uid varchar(20) not null primary key,
    upass varchar(200) not null,
    uname varchar(20) not null,
    address1 varchar(500),
    address2 varchar(500),
    phone varchar(20),
    photo varchar(200),
    regDate datetime default now()
);

insert into users(uid, upass, uname)
values('blue', 'pass', '이블루');
insert into users(uid, upass, uname)
values('red', 'pass', '김레드');
insert into users(uid, upass, uname)
values('green', 'pass', '최그린');

update users set phone='010-4242-7575', address1='서울특별시 영등포구 63로 50 (여의도동)', address2='63빌딩' where uid='green';

select * from users;

update users set photo=null where uid>'';

drop table books;
create table books(
	bid int auto_increment primary key,
    title varchar(500) not null,
    price int default 0,
    contents text,
    isbn varchar(100),
    publisher varchar(100),
    image varchar(200),
    author varchar(200),
    regDate datetime default now()
);

SET foreign_key_checks = 1;
drop table purchase;


desc books;

select * from books;

select *, date_format(regDate, '%Y-%m-%d') fmtdate, format(price, 0) fmtprice
from books
order by bid desc
limit 0,5;

alter table books add column updateDate datetime;

alter table books add column bigimage varchar(200);

desc books;

create table likes (
	uid varchar(20) not null,
    bid int not null,
    regDate datetime default now(),
    primary key(uid, bid),
    foreign key(uid) references users(uid),
    foreign key(bid) references books(bid)
);

desc likes;

select * from likes;

select *, date_format(regDate, '%Y-%m-%d') fmtdate, format(price, 0) fmtprice, 
(select count(*) from likes where books.bid=likes.bid) lcnt,
(select count(*) from likes where books.bid=likes.bid and uid='green') ucnt
from books
where bid=1;

create table review (
	rid int auto_increment primary key,
    bid int not null,
    uid varchar(20) not null,
    contents text not null,
    regdate datetime default now(),
    foreign key(bid) references books(bid),
	foreign key(uid) references users(uid)
);

desc review;

select * from review;

select * from users;

drop view view_review;
create view view_review as
select r.*, u.uname, u.photo, date_format(r.regDate, '%Y-%m-%d %T') fmtdate
from review r, users u
where r.uid = u.uid;

select * from view_review
where bid=41
order by rid desc
limit 0,3;

select *, date_format(regDate, '%Y-%m-%d') fmtdate, format(price, 0) fmtprice, 
(select count(*) from likes where books.bid=likes.bid) lcnt,
(select count(*) from likes where books.bid=likes.bid and uid='green') ucnt,
(select count(*) from review where books.bid=review.bid) rcnt
from books
order by bid desc
limit 0, 6;

drop table cart;
create table cart(
	uid varchar(20) not null,
    bid int not null,
    qnt int default 1,
    regDate datetime default now(),
    primary key(uid, bid),
    foreign key(uid) references users(uid),
    foreign key(bid) references books(bid)
);

desc cart;

drop view view_cart;
create view view_cart as
select c.*, b.title, b.image, b.price, format(b.price,0) fmtprice
from cart c, books b
where c.bid=b.bid;

select * from view_cart;

create table purchase( 
    pid char(13) not null primary key,
    uid varchar(20) not null,
    uname varchar(20) not null,
    phone varchar(20) not null,
    address1 varchar(500) not null,
    address2 varchar(500) not null,
    pdate datetime default now(),
    sum int default 0,
    status int default 0, /*0:결제대기,1:결제확인,2:배송준비,3:배송완료, 4.주문완료*/
    foreign key(uid) references users(uid)
);

desc purchase;

drop table purchase;

SET foreign_key_checks = 1;
drop table purchase;


/*주문상품 정보*/
create table orders(
	pid char(13) not null,
    bid int not null,
    price int default 0,
    qnt int default 0,
    primary key(pid, bid),
    foreign key(pid) references purchase(pid),
    foreign key(bid) references books(bid)
);

select *, 
date_format(pDate, '%Y-%m-%d %T') as fmtdate, 
format(sum, 0) fmtsum
from purchase 
where uid='green';

select o.*, b.title, b.image
from orders o, books b
where o.bid=b.bid and pid='a81ec016-58a7';


delete from purchase where pid > '';

select * from users;

insert into users(uid, upass, uname)
values('admin', 'pass', '관리자');

select *, 
date_format(pDate, '%Y-%m-%d %T') as fmtdate, 
format(sum, 0) fmtsum 
from purchase
where uname like '%사%'
order by pdate desc
limit 0, 5;

select * from view_cart;

select * from users where uid='red';

select *, date_format(regdate, '%Y-%m-%d %T') as fmtdate from users;

select *, date_format(regdate, '%Y년%m월%d일 %T') as fmtdate 
from users
where uid='mou';

desc users;
insert into users(uid, upass, uname)
values('hong','pass','홍수지');

update users
set uname='김마운틴', address1 ='백두산', address2='백두대간', phone='010-3456-7843'
where uid='mou';

delete from users
where uid='mou';

select count(*) as total from users;

create table bbs(
	bid int auto_increment primary key,
    title varchar(500) not null,
    contents text,
    uid varchar(20) not null,
    regDate datetime default now(),
    foreign key(uid) references users(uid)
);

desc bbs;
drop table bbs;
insert into bbs(title, uid)
values('Spring의 이유와 목적 그리고 필요성에 대한 이야기', 'red');
insert into bbs(title, uid)
values('Spring이란 무엇인가?', 'red');
insert into bbs(title, uid)
values('Spring은 어떻게 탄생했을까?', 'black');
insert into bbs(title, uid)
values('Spring은 어떤 기능을 제공할까?', 'red');
insert into bbs(title, uid)
values('Spring에서 DI나 AOP와 같은 핵심 요소는 무엇이 있을까?', 'blue');
insert into bbs(title, uid)
values('Spring은 어떻게 동작하는 걸까?', 'green');
insert into bbs(title, uid)
values('Spring(스프링)을 한 줄로 정의한다면?', 'blue');

insert into bbs(title, uid)
select title, uid from bbs;

select count(*) from bbs;

drop view view_bbs;
create view view_bbs as
select b.*, u.uname, u.photo
from bbs b, users u
where b.uid=u.uid;

drop view view_bbs;
select *, date_format(regDate, '%Y년%m월%d일 %T') as fmtdate
from view_bbs
where uname like '%%'
order by bid desc
limit 0,5;

update bbs
set contents='내용입니다.'
where bid>0;

alter table bbs
add column viewcnt int default 0;

desc view_bbs;

select bid, viewcnt from bbs where bid=252; 

drop table replay;
create table reply(
	rid int auto_increment primary key,
    bid int not null,
    uid varchar(20) not null,
    regDate datetime default now(),
    contents text,
    foreign key(bid) references bbs(bid),
    foreign key(uid) references users(uid)
);

desc reply;

select * from reply;

insert into reply (bid, uid, contents)
select bid, uid, contents from reply;

select count(*) from reply;


drop view view_reply;

create view view_reply as
select r.*, u.uname, u.photo, 
date_format(r.regdate, '%Y년%m월%d일 %T') as fmtdate,
date_format(r.updatedate, '%Y년%m월%d일 %T') as fmtupdate
from reply r, users u
where r.uid=u.uid;

select * from view_reply
order by rid desc
limit 0,5;

alter table reply
add column updateDate datetime;

select * from bbs;

alter table bbs
add column replycnt int default 0;

desc bbs;

update bbs
set replycnt = (select count(*) from reply where bbs.bid=reply.bid)
where bid > 0;

alter table reply
add column rating int default 0;

desc reply;
desc view_reply;

update reply
set rating=3
where bid > 0;

select rid, rating from reply;

update users
set photo = null
where uid > '';

select * from users;

select * from users where uid='red';

update users
set photo = '/upload/photo/magic.jpg'
where uid='qwer';

delete from users  
where uid='red';

SET foreign_key_checks = 1;

desc users;
create table messages(
	mid int auto_increment primary key,
    sender varchar(20) not null,
    receiver varchar(20) not null,
    message text,
    sendDate datetime default now(),
    readDate datetime,
    foreign key (sender) references users(uid),
    foreign key (receiver) references users(uid)
);

desc messages;

alter table users
add column point int default 0;

desc users;

select * from messages;
select uid, point from users
where uid="sky";

/* 보낸 메세지 */
select m.*, u.uname, u.photo
from messages m, users u
where m.receiver=u.uid and mid=1;

/* 받은 메세지 */
select m.*, u.uname, u.photo
from messages m, users u
where m.sender=u.uid and mid=1;

/* 보낸 메세지 목록 */
select m.*, u.uname
from messages m, users u
where sender='sky' and u.uid=m.receiver
order by mid desc;

/* 받은 메세지 목록 */
select m.*, u.uname
from messages m, users u
where receiver='qwer' and u.uid=m.sender
order by mid desc;

select * from users;

desc messages;

alter table messages
add column sendDelete int default 0;

alter table messages
add column receiveDelete int default 0;

select * from messages
where (sender='sky' and sendDelete=1)
or (receiver='sky' and receiveDelete=1);

create table account(
	ano char(4) primary key not null,
    uid varchar(20),
    openDate datetime default now(),
    balance double default 0,
    foreign key (uid) references users(uid)
);

desc account;
drop table account;
drop table trade;
create table trade(
	tid int auto_increment primary key,
	ano char(4) not null,
    tno char(4),
    amount double,
    tradeDate datetime default now(),
    type int default 1, /* 1:입급 -1:출금 */
    foreign key (ano) references account(ano),
    foreign key (tno) references account(ano)
);

desc trade;
/*통장개설*/
insert into account(ano, uid)
values('A001', 'sky');
insert into account(ano, uid)
values('B001', 'blue');
insert into account(ano, uid)
values('C001', 'black');

/* 내통장에 입금 */
insert into trade(ano, amount)
values('A001', 2000);
update account set balance=balance + 2000 where ano='A001';

/* 내통장에서 출금 */
insert into trade(ano, amount, type)
values('A001', 500, -1);
update account set balance=balance - 500 where ano='A001';

/* A001 -> B001 700원 이체 - 계좌이체 */
insert into trade(ano, tno, amount, type)
value('A001', 'B001', 700, -1);
update account set balance=balance - 700 where ano='A001';

insert into trade(ano, tno, amount, type)
value('B001', 'A001', 700, 1);
update account set balance=balance + 700 where ano='B001';

select * from account;
select * from trade;

select *,format(balance, 0) fmtbalance from account;

select *,format(amount, 0) fmtAmount, uid
from trade join account
on trade.tno=account.ano
where trade.ano='A001';

