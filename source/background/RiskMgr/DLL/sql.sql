﻿CREATE TABLE `User`
(
ID VARCHAR(32) NOT NULL PRIMARY KEY,
Name VARCHAR(20) NULL,
Creator VARCHAR(32) NULL,
CreateTime DATETIME NULL,
`Password` VARCHAR(50) NULL,
`Enabled` BIT NULL,
LastUpdateTime DATETIME NULL,
LastUpdator VARCHAR(32) NULL
);

CREATE TABLE UserInfo
(
ID VARCHAR(32) NOT NULL PRIMARY KEY,
QQ VARCHAR(20) NULL,
Mobile VARCHAR(20) NULL,
WX VARCHAR(30) NULL,
`Address` NVARCHAR(100) NULL,
`Identity` VARCHAR(20) NULL,
CnName NVARCHAR(20) NULL,
Remark NVARCHAR(200) NULL
);

CREATE TABLE Menu
(
ID VARCHAR(32) NOT NULL PRIMARY KEY,
Name VARCHAR(20) NULL,
Creator VARCHAR(32) NULL,
CreateTime DATETIME NULL,
`Page` VARCHAR(50) NULL,
ParentID VARCHAR(32) NULL,
`Enabled` BIT NULL,
Remark NVARCHAR(500) NULL,
LastUpdateTime DATETIME NULL,
LastUpdator VARCHAR(32) NULL,
ImagePath VARCHAR(50) NULL
);

CREATE TABLE `Role`
(
ID VARCHAR(32) NOT NULL PRIMARY KEY,
Name VARCHAR(20) NULL,
Creator VARCHAR(32) NULL,
CreateTime DATETIME NULL,
Remark NVARCHAR(500) NULL,
LastUpdateTime DATETIME NULL,
LastUpdator VARCHAR(32) NULL
);

CREATE TABLE `Post`
(
ID VARCHAR(32) NOT NULL PRIMARY KEY,
Name VARCHAR(20) NULL,
Creator VARCHAR(32) NULL,
CreateTime DATETIME NULL,
Remark NVARCHAR(500) NULL,
LastUpdateTime DATETIME NULL,
LastUpdator VARCHAR(32) NULL
);

CREATE TABLE User_Role
(
ID VARCHAR(32) NOT NULL PRIMARY KEY,
UserID VARCHAR(32) NULL,
RoleID VARCHAR(32) NULL
);

CREATE TABLE User_Post
(
ID VARCHAR(32) NOT NULL PRIMARY KEY,
UserID VARCHAR(32) NULL,
PostID VARCHAR(32) NULL
);

CREATE TABLE Menu_Role
(
ID VARCHAR(32) NOT NULL PRIMARY KEY,
MenuID VARCHAR(32) NULL,
RoleID VARCHAR(32) NULL
);


CREATE TABLE Module
(
ID VARCHAR(32) NOT NULL PRIMARY KEY,
Name VARCHAR(20) NULL,
Creator VARCHAR(32) NULL,
CreateTime DATETIME NULL,
Remark NVARCHAR(500) NULL,
LastUpdateTime DATETIME NULL,
LastUpdator VARCHAR(32) NULL
);


CREATE TABLE `Action`
(
ID VARCHAR(32) NOT NULL PRIMARY KEY,
Name VARCHAR(20) NULL,
Creator VARCHAR(32) NULL,
CreateTime DATETIME NULL,
Remark NVARCHAR(500) NULL,
LastUpdateTime DATETIME NULL,
LastUpdator VARCHAR(32) NULL
);

CREATE TABLE Role_Module_Action
(
ID VARCHAR(32) NOT NULL PRIMARY KEY,
RoleID VARCHAR(32) NULL,
ModuleID VARCHAR(32) NULL,
ActionID VARCHAR(32) NULL
);

CREATE TABLE LogonHistory
(
ID VARCHAR(32) NOT NULL PRIMARY KEY,
UserID VARCHAR(32) NULL,
Token VARCHAR(32) NULL,
LogonTime DATETIME NULL,
IP VARCHAR(15) NULL,
ActiveTime DATETIME NULL
);

CREATE TABLE Customer
(
ID VARCHAR(32) NOT NULL PRIMARY KEY,
Name NVARCHAR(20) NULL,
Creator VARCHAR(32) NULL,
CreateTime DATETIME NULL,
LastUpdator VARCHAR(32) NULL,
LastUpdateTime DATETIME NULL,
Gender BIT NULL,
Marrage INT NULL,
CardType INT NULL,
IdentityCode VARCHAR(30) NULL,
Phone VARCHAR(20) NULL,
OrignalName NVARCHAR(20) NULL,
OrignalIdentityCode VARCHAR(20) NULL,
BankType INT NULL,
BankCode VARCHAR(20) NULL,
`Address` NVARCHAR(50) NULL,
WorkUnit NVARCHAR(50) NULL,
Remark NVARCHAR(200) NULL,
Enabled BIT NULL
);

CREATE TABLE Asset
(
ID VARCHAR(32) NOT NULL PRIMARY KEY,
Name NVARCHAR(30) NULL,
Creator VARCHAR(32) NULL,
CreateTime DATETIME NULL,
LastUpdator VARCHAR(32) NULL,
LastUpdateTime DATETIME NULL,
Remark NVARCHAR(200) NULL,
`Type` INT NULL,
`Usage` INT NULL,
Position NVARCHAR(50) NULL,
Address NVARCHAR(50) NULL,
`Code` VARCHAR(20) NULL,
Area DECIMAL(8, 2) NULL,
RegPrice DECIMAL(10, 2) NULL,
OwnerID VARCHAR(32) NULL,
BuyerID VARCHAR(32) NULL,
IssueType INT NULL,
IsTraded BIT NULL,
Enabled BIT NULL,
ChangeOwnerPrice DECIMAL(10,2) NULL
);

