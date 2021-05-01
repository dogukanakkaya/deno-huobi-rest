import { hmac } from '../deps.ts'

export default class Rest
{
    private readonly accessKey: string
    private readonly secretKey: string

    private params: object

    private method: string = ''
    private endpoint: string = ''
    private host: string = 'api.huobi.pro'

    constructor({accessKey, secretKey}: {accessKey: string, secretKey: string}) {
        this.accessKey = accessKey
        this.secretKey = secretKey

        this.params = {
            AccessKeyId: accessKey,
            SignatureMethod: "HmacSHA256",
            SignatureVersion: "2",
            Timestamp: new Date().toISOString().slice(0, 19)
        }
    }

    /**
     * Create and return the signature
     * @private
     */
    private getSignature (): string {
        const presignedTextQuery = new URLSearchParams(this.params as any).toString()

        const presignedText = `${this.method}\n${this.host}\n${this.endpoint}\n${presignedTextQuery}`

        const signature: string = hmac("sha256", this.secretKey, presignedText, "utf8", "base64") as string

        return encodeURIComponent(signature)
    }

    /**
     * Return the url combined with params and signature
     * @private
     */
    private getUrl (): string {
        const queryParams = new URLSearchParams(this.params as any).toString()
        const signature = this.getSignature()

        return `https://${this.host}${this.endpoint}?${queryParams}&Signature=${signature}`
    }

    /**
     * Huobi User ID
     */
    async uid () {
        this.method = 'GET';
        this.endpoint = '/v2/user/uid'

        const response = await fetch(this.getUrl())
        return await response.json()
    }

    async accounts () {
        this.method = 'GET';
        this.endpoint = '/v1/account/accounts'

        const response = await fetch(this.getUrl())
        return await response.json()
    }

    async accountBalance (accountId: number) {
        this.method = 'GET';
        this.endpoint = `/v1/account/accounts/${accountId}/balance`

        const response = await fetch(this.getUrl())
        return await response.json()
    }

    async accountHistory (params = {}) {
        this.method = 'GET';
        this.endpoint = '/v1/account/history'
        this.params = {
            ...this.params,
            ...params
        }

        const response = await fetch(this.getUrl())
        return await response.json()
    }

    async orders (params = {}) {
        this.method = 'GET';
        this.endpoint = '/v1/order/orders'
        this.params = {
            ...this.params,
            ...params
        }

        const response = await fetch(this.getUrl())
        return await response.json()
    }

    async orderHistory (params = {}) {
        this.method = 'GET';
        this.endpoint = '/v1/order/history'
        this.params = {
            ...this.params,
            ...params
        }

        const response = await fetch(this.getUrl())
        return await response.json()
    }

    async orderMatchResults (params = {}) {
        this.method = 'GET';
        this.endpoint = '/v1/order/matchresults'
        this.params = {
            ...this.params,
            ...params
        }

        const response = await fetch(this.getUrl())
        return await response.json()
    }

    async openOrders (params = {}) {
        this.method = 'GET';
        this.endpoint = '/v1/order/openOrders'
        this.params = {
            ...this.params,
            ...params
        }

        const response = await fetch(this.getUrl())
        return await response.json()
    }
}

export type Account = {
    id: number
    type: string
    subtype: string
    state: string
}