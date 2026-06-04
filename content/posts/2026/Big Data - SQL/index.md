---
title: "Big Data - SQL"
description: "강원대학교 컴퓨터공학과 202601 DB Programming, SQL"
date: "2026-05-29"
keywords: "Big Data, SQL"
---

## Overview

**Database**
1. 하나의 Machine
2. Traditional DBMS (MySQL, PostgreSQL)
3. SQL

**Bit Data**
1. 2+ Machines
2. Big Data Systems (e.g. Spark)

> SQL 에 대해 빠르게 리뷰하고 넘어가는 페이지

## Company Database Schema

![Company database schema example](/img/bigdata/company-database-schema.webp)

**EMPLOYEE**
* **SSN**: 사번
* **SUPERSSM**: 사수의 사번

**DEPARTMENT**
* **MGRSSN**: 해당 부서의 매니저의 사번
* **MGRSTARTDATE**: 해당 매니저가 해당 부서를 관리하기 시작한 날짜

**DEPT_LOCATIONS** 같은 경우, 한 부서가 여러 Location 에 속할수 있다는 상황을 가정하므로, `PK = (DNUMBER, DLOCATION)`

**WORKS_ON** 은 어떤 직원이 어떤 프로젝트에서 몇시간 일했는지를 기록하는 Table 로, 사번만으론 구분하지 못하기에 `PK = (ESSN, PNO)`

**DEPENDENT** 은 가족의 구성, 한 사원이 여러명의 자식을 가질수 있으므로 `PK = (ESSN, DEPENDENT_NAME)`, 동시에 한 직원의 가족들은 서로 같은 이름을 쓰지 않는다는 가정이 들어가야함, 보험 관련된 테이블

> 화살표는 Foreign Key 와 Primary Key 를 연결한 구조

## SQL (Structured Query Language)
* RDBMS 를 관리하기 위한 domain-specific language 로 분류된다.
* Designed and implemented at IBM Research
* DDL 와 DML 을 포함

> `Relation = Table`, `Tuple = Row`, `Attribute = Column`

### Schema
Schema 에는 두가지 의미가 있다.
1. 테이블이 어떤 Column을 가지고, 데이터 타입은 무엇이며, 다른 테이블과 어떤 관계(Key)를 맺는지 정의한 구조나 설계도
2. **DBMS 안에서 테이블을 그룹화 하고 분류해 담아두는 컨테이너(폴더)**

> `DBMS -> Database -> Schema -> Table` 로 이어지는 형태, PostgreSQL, MS SQL Server, Snowflake 등에서 채택하는 가장 정석적인 구조

해당 Step 에선 SQL 관점에서 살펴볼것이니 2번 관점으로 진행

* Identified by a schema name
* Includes descriptors for each element in the schema, as well as authorization identifiers related to the user or account that owns the schema
* Schema elements: Tables, constraints, views, domains, authorizations, etc.

**Example code**: Creating a schema named COMPANY for user JSMITH

```sql
CREATE SCHEMA COMPANY AUTHORIZATION JSMITH;
```
* `AUTHORIZATION`: 해당 Schema 의 소유자를 지정하는 키워드, 그 결과로 `JSMITH` 라는 계정은
  1. `COMPANY` Schema 안에 새로운 Table 이나 View 를 마음대로 생성 가능
  2. 만들어진 Table 이나 View 를 수정하거나 삭제 가능
  3. 다른 유저에게 Table 의 권한을 나누어 줄 수도 있음


### Catalog
* Included in a special schema classed *INFORMATION_SCHEMA*
* Provides information about all schemas and their elements

> **Catalog** 는 DBMS 를 관리하기 위한 시스템 스키마 정도로 이해해도 무방, (강의가 아닌 내가 임의로 정의)

### Table Creation
* Used to create a new relation
* Specifies the relation's name
* Specified attribute names, domain(set of values), and `NOT NULL` constraints
* Specifies `key`, `entity integrity`, and `referential integrity constraints`

```sql
CREATE TABLE EMPLOYEE (
  FNAME     VARCHAR(15)      NOT NULL,
  MINIT     CHAR,
  LNAME     VARCHAR(15)      NOT NULL,
  SSN       CHAR(9)          NOT NULL,
  BDATE     DATE,
  ADDRESS   VARCHAR(30),
  SEX       CHAR,
  SALARY    DECIMAL(10, 2),
  SUPERSSN  CHAR(9),
  DNO       INT              NOT NULL,
  PRIMARY KEY (SSN),
  FOREIGN KEY (SUPERSSN) REFERENCES EMPLOYEE(SSN),
  FOREIGN KEY (DNO) REFERENCES DEPARTMENT(DNUMBER)
);
```
* `VARCHAR(N)`: 가변길이 문자열, N자 이하
* `CHAR` or `CHAR(N)`: 문자 하나 or 고정된 문자열 N자
* `DECIMAL(P, S)`: P은 소수점을 포함한 전체 자릿수, S은 소수점 이하의 자릿수
  * `DECIMAL(5, 2)` 일시 최대 저장 가능한 숫자는 `999.99`

> * **Entity Integrity**: 각 Tuple 을 고유하게 식별하기 위한 규칙, `PRIMARY KEY`
> * **Referential Integrity**: 다른 Table의 데이터를 참조할 때, 반드시 존재 하는 데이터만 참조해야 하는 규칙, `FOREIGN KEY`

> `FOREIGN KEY (DNO) REFERENCES DEPARTMENT(DNUMBER)`: This constraint is added after the `DEPARTMENT` table is created.

> `FOREIGN KEY (SUPERSSN) REFERENCES EMPLOYEE(SSN)`: This constraint is added after tuples are inserted into `EMPLOYEE`

> 만약 특정 Schema 내부에 Table 를 생성하고 싶다면 `SCHEMA_NAME.EMPLOYEE` 로 만들면 됨, 생략하면, 현재 접속한 유저의 Default Schema 에 자동으로 만들어짐 (DBMS 엔진마다 다름)


```sql
CREATE TABLE DEPARTMENT (
  DNAME         VARCHAR(15)  NOT NULL,
  DNUMBER       INT          NOT NULL,
  MGRSSN        CHAR(9)      NOT NULL,
  MGRSTARTDATE  DATE,
  PRIMARY KEY (DNUMBER),
  UNIQUE (DNAME),
  FOREIGN KEY (MGRSSN) REFERENCES EMPLOYEE (SSN)
);
```

> `UNIQUE (DNAME)`: 부서명 중목 혀용 X


```sql
CREATE TABLE DEPT_LOCATIONS (
  DNUMBER    INT          NOT NULL,
  DLOCATION  VARCHAR(15)  NOT NULL,
  PRIMARY KEY (DNUMBER, DLOCATION),
  FOREIGN KEY (DNUMBER) REFERENCES DEPARTMENT (DNUMBER)
);
```

```sql
CREATE TABLE PROJECT (
  PNAME      VARCHAR(15)   NOT NULL,
  PNUMBER    INT           NOT NULL,
  PLOCATION  VARCHAR(15),
  DNUM       INT           NOT NULL,
  PRIMARY KEY (PNUMBER),
  UNIQUE (PNAME),
  FOREIGN KEY (DNUM) REFERENCES DEPARTMENT (DNUMBER)
);
```

```sql
CREATE TABLE WORKS_ON (
  ESSN   CHAR(9)        NOT NULL,
  PNO    INT            NOT NULL,
  HOURS  DECIMAL(3, 1)  NOT NULL,
  PRIMARY KEY (ESSN, PNO),
  FOREIGN KEY (ESSN) REFERENCES EMPLOYEE (SSN),
  FOREIGN KEY (PNO) REFERENCES PROJECT (PNUMBER)
);
```

```sql
CREATE TABLE DEPENDENT (
  ESSN            CHAR(9)      NOT NULL,
  DEPENDENT_NAME  VARCHAR(15)  NOT NULL,
  SEX             CHAR,
  BDATE           DATE,
  RELATIONSHIP    VARCHAR(8),
  PRIMARY KEY (ESSN, DEPENDENT_NAME),
  FOREIGN KEY (ESSN) REFERENCES EMPLOYEE (SSN)
);
```

> 한 가족 내에선, 동일한 이름을 사용하지 않는다는 전제조건이 있음

강의에서 다룬건 아니지만 `DEPARTMENT` 와 `EMPLOYEE` 가 **순환참조** 되는 문제가 발생하므로, 임시로 `NULL` 허용, Deferred Constraints, Association/Bridge Table 등등 추가적인 Skill 이 필요

## Attribute Data Types
1. Integer
2. Real Numbers
3. Fixed-Length strings
4. Variable-Length Strings
5. Bit Strings
6. Boolean
7. Date and Time
8. Timestamp

### Integer
General Purpose Languages 처럼 SQL 도