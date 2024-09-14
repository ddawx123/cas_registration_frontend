export class RequestTool {
    /**
     * Send Post Request
     * @param url
     * @param param
     * @returns {Promise}
     */
    static post(url, param = {}) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify(param),
                "method": "POST",
                "mode": "cors"
            }).then((response) => {
                resolve(response.text());
            }).catch((error) => {
                reject(error);
            });
        })
    }
}