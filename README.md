# 腾讯云SSL证书组件

## 简介
腾讯云 SSL 证书（SSL Certificates）提供了安全套接层（SSL）证书的一站式服务，包括证书申请、管理及部署功能。

## 快速开始
&nbsp;

通过SCF组件，对一个云函数进行完整的创建，配置，部署和删除等操作。支持命令如下：

1. [安装](#1-安装)
2. [配置](#2-配置)
3. [部署](#3-部署)
4. [移除](#4-移除)

&nbsp;

### 1. 安装

通过npm安装serverless

```console
$ npm install -g serverless
```

### 2. 配置

本地创建 `serverless.yml` 文件，在其中进行如下配置

```console
$ touch serverless.yml
```

```yml
# serverless.yml
SSLTest:
  component: "@serverless/tencent-ssl"
  inputs:
    domain: any******s.cn
    dvAuthMethod: DNS
    email: serv*******exe.cn
    phone: 135******691
    validityPeriod: 12
    alias: 测试证书

```

### 3. 部署

如您的账号未[登陆](https://cloud.tencent.com/login)或[注册](https://cloud.tencent.com/register)腾讯云，您可以直接通过`微信`扫描命令行中的二维码进行授权登陆和注册。

通过`sls`命令进行部署，并可以添加`--debug`参数查看部署过程中的信息

```console
$ sls --debug

  DEBUG ─ Resolving the template's static variables.
  DEBUG ─ Collecting components from the template.
  DEBUG ─ Downloading any NPM components found in the template.
  DEBUG ─ Analyzing the template's components dependencies.
  DEBUG ─ Creating the template's components graph.
  DEBUG ─ Syncing template state.
  DEBUG ─ Executing the template's components graph.
  DEBUG ─ Applying Certificate ...
  DEBUG ─ Applyed Certificate ...

  SSLTest: 
    CertificateId:                    blnwqO0v
    Please add the resolution record: 
      Domain:      an********cn
      Host record: _dnsauth
      Record type: TXT
      Value:       20200316*********k6y8kmutd

  1s › SSLTest › done


```

### 4. 移除

```console
$ sls remove --debug

  DEBUG ─ Flushing template state and removing all components.
  DEBUG ─ Removing ...
  DEBUG ─ Removing CertificateId blfZE0B8

  3s › SSLTest › done


```

####  账号配置（可选）

当前默认支持CLI扫描二维码登录，如您希望配置持久的环境变量/秘钥信息，也可以本地创建 `.env` 文件

```console
$ touch .env # 腾讯云的配置信息
```

在 `.env` 文件中配置腾讯云的 SecretId 和 SecretKey 信息并保存。
```
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```

> - 如果没有腾讯云账号，请先 [注册新账号](https://cloud.tencent.com/register)。
> - 如果已有腾讯云账号，可以在 [API密钥管理](https://console.cloud.tencent.com/cam/capi) 中获取 SecretId 和 SecretKey。

### 还支持哪些组件？

可以在 [Serverless Components](https://github.com/serverless/components) repo 中查询更多组件的信息。
