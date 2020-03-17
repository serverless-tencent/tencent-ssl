const util = require('util')
const { Component } = require('@serverless/core')
const tencentAuth = require('serverless-tencent-auth-tool')
const tencentcloud = require('tencentcloud-sdk-nodejs')
const ClientProfile = require('tencentcloud-sdk-nodejs/tencentcloud/common/profile/client_profile.js')
const HttpProfile = require('tencentcloud-sdk-nodejs/tencentcloud/common/profile/http_profile.js')
const sslClient = tencentcloud.ssl.v20191205.Client
const sslModels = tencentcloud.ssl.v20191205.Models

class TencentDomain extends Component {
  getSSLClient(credentials) {
    // create cam client

    const secret_id = credentials.SecretId
    const secret_key = credentials.SecretKey
    const token = credentials.token
    const cred = new tencentcloud.common.Credential(secret_id, secret_key, token)
    const httpProfile = new HttpProfile()
    httpProfile.reqTimeout = 30
    const clientProfile = new ClientProfile('HmacSHA256', httpProfile)
    return new sslClient(cred, 'ap-guangzhou', clientProfile)
  }

  async compareJson(source, target) {
    for (const key in source) {
      if (typeof source[key] == 'object') {
        if (await this.compareJson(source[key], target[key])) {
          delete target[key]
        }
      } else {
        if (String(source[key]) == String(target[key])) {
          delete target[key]
        }
      }
    }
    if (JSON.stringify(target) == '{}') {
      return true
    }
    return false
  }

  async default(inputs = {}) {
    // login
    const auth = new tencentAuth()
    this.context.credentials.tencent = await auth.doAuth(this.context.credentials.tencent, {
      client: 'tencent-ssl',
      remark: inputs.fromClientRemark,
      project: this.context.instance ? this.context.instance.id : undefined,
      action: 'default'
    })

    const ssl = this.getSSLClient(this.context.credentials.tencent)
    ssl.sdkVersion = 'ServerlessComponent'

    this.context.debug(`Applying Certificate ...`)
    let sslOutput = {}

    const CertificateId = this.state.CertificateId
    delete this.state.CertificateId
    const compareResult = await this.compareJson(
      JSON.parse(JSON.stringify(this.state)),
      JSON.parse(JSON.stringify(inputs))
    )

    if (!CertificateId || !compareResult) {
      const applyCertificateData = {
        DvAuthMethod: inputs.dvAuthMethod ? inputs.dvAuthMethod : 'DNS_AUTO',
        DomainName: inputs.domain,
        PackageType: '2',
        ContactEmail: inputs.email,
        ContactPhone: String(inputs.phone),
        ValidityPeriod: String(inputs.validityPeriod ? inputs.validityPeriod : '12')
      }

      if (inputs.csr && inputs.csr.encryptAlgo) {
        applyCertificateData.CsrEncryptAlgo = inputs.csr.encryptAlgo
      }
      if (inputs.csr && inputs.csr.encryptAlgo) {
        applyCertificateData.CsrKeyParameter = inputs.csr.keyParameter
      }
      if (inputs.csr && inputs.csr.encryptAlgo) {
        applyCertificateData.CsrKeyPassword = inputs.csr.keyPassword
      }

      const applyCertificateReq = new sslModels.ApplyCertificateRequest()
      applyCertificateReq.from_json_string(JSON.stringify(applyCertificateData))
      const handler = util.promisify(ssl.ApplyCertificate.bind(ssl))
      sslOutput = await handler(applyCertificateReq)
    } else {
      sslOutput = this.state
      sslOutput.CertificateId = CertificateId
    }
    this.context.debug(`Applyed Certificate ...`)

    const output = {
      CertificateId: sslOutput.CertificateId
    }

    if (inputs.dvAuthMethod == 'DNS') {
      const descCertificateData = {
        CertificateId: CertificateId
      }
      const descCertificateReq = new sslModels.DescribeCertificateRequest()
      descCertificateReq.from_json_string(JSON.stringify(descCertificateData))
      const handler = util.promisify(ssl.DescribeCertificate.bind(ssl))
      const descOutput = await handler(descCertificateReq)
      if (descOutput.StatusName == '审核中') {
        output['Please add the resolution record'] = {
          Domain: inputs.domain,
          'Host record': '_dnsauth',
          'Record type': 'TXT',
          Value: descOutput.DvAuthDetail.DvAuthValue
        }
      }
    }

    this.state = inputs
    this.state.CertificateId = sslOutput.CertificateId
    await this.save()

    return output
  }

  async remove(inputs = {}) {
    this.context.debug(`Removing ...`)
    // login
    const auth = new tencentAuth()
    this.context.credentials.tencent = await auth.doAuth(this.context.credentials.tencent, {
      client: 'tencent-ssl',
      remark: inputs.fromClientRemark,
      project: this.context.instance ? this.context.instance.id : undefined,
      action: 'default'
    })

    const ssl = this.getSSLClient(this.context.credentials.tencent)
    ssl.sdkVersion = 'ServerlessComponent'

    this.context.debug(`Removing CertificateId ${this.state.CertificateId}`)
    const deleteCertificateData = {
      CertificateId: this.state.CertificateId
    }
    const deleteCertificateReq = new sslModels.DeleteCertificateRequest()
    deleteCertificateReq.from_json_string(JSON.stringify(deleteCertificateData))
    const handler = util.promisify(ssl.DeleteCertificate.bind(ssl))
    await handler(deleteCertificateReq)

    this.state = {}
    await this.save()
    return {}
    this.context.debug(`Removed ...`)
  }
}

module.exports = TencentDomain
