class APIUtils {
    constructor(APIContext, loginPayload) {
        this.APIContext = APIContext
        this.loginPayload = loginPayload
    }



    async getToken() {
        const loginResponse = await this.APIContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', { data: this.loginPayload })
        const loginResponseJson = await loginResponse.json()
       const token = await loginResponseJson.token
        console.log("Token: ", token)
        return token
    }

    async createOrder(orderPayload) {
        let response = {};
        response.token = await this.getToken();
        const orderResponse = await this.APIContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
            data: orderPayload, headers: {
                'Authorization': await this.getToken(),
                'Content-Type': 'application/json'
            }
        })
        const orderResponseJson = await orderResponse.json()
        console.log(orderResponseJson)
        const orderId = orderResponseJson.orders[0];
        response.orderId = orderId;
        return response
    }
}
module.exports = { APIUtils };