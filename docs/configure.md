# Configure document

## Complete configuration

```yml
# serverless.yml
SSLTest:
  component: "@serverless/tencent-ssl"
  inputs:
    domain: any******.cn
    dvAuthMethod: DNS
    email: ser******.cn
    phone: 13******91
    validityPeriod: 12
    csr:
      encryptAlgo: RSA
      keyParameter: 2048
      keyPassword: 123
    alias: 测试证书

```

## Configuration description

Main param description

| Param                                           | Required/Optional | Default | Description                                                                                              |
| ----------------------------------------------- | :---------------: | :-----: | :------------------------------------------------------------------------------------------------------- |
| domain                                       |     Optional      |         | 域名。         |
| dvAuthMethod                                          |     Required      |    DNS_AUTO   |        验证方式（'DNS_AUTO'， 'DNS'， 'FILE'）：DNS_AUTO = 自动DNS验证。               |
| email                                       |     Optional      |         | 邮箱。            |
| phone                                     |     Optional      |         | 手机。       |
| validityPeriod                                     |     Optional      |     12    | 有效期，默认12。   |
| alias                                     |     Optional      |         | 备注名称。 |
| [csr](#csr-param-description)       |     Optional      |         |      加密相关。                                                                                                 |

### csr param description

| Param          | Required/Optional | Default | Description                                                                                         |
| -------------- | :---------------: | :-----: | :-------------------------------------------------------------------------------------------------- |
| encryptAlgo          |     Optional      |         | 加密算法，仅支持RSA。                        |
| keyParameter       |     Optional      |         | 密钥对参数，仅支持2048。 |
| keyParameter           |     Optional      |         | csr的加密密码。  |


### 接口参考地址： 

[免费证书申请](https://cloud.tencent.com/document/api/400/41678)
[删除证书](https://cloud.tencent.com/document/api/400/41675)
