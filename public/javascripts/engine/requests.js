function getRequest(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onload = function () {
            var status = xhr.status
            if (status == 200) {
                resolve(xhr.response)
            } else {
                reject(status)
            }
        }
        xhr.send()
    })
}

function postRequest(url, params, header) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest()
        xhr.open('POST', url, true)
        xhr.setRequestHeader('content-type', header || 'application/json')

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE && (xhr.status >= 200 && xhr.status <= 226)) {
                resolve(xhr.response)
            } else if (xhr.status >= 300) {
                reject(xhr.status)
            }
        }

        xhr.send(params)
    })
} 

function deleteRequest(url, params, header) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest()
        xhr.open('DELETE', url, true)
        xhr.setRequestHeader('content-type', header || 'application/json')

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE && (xhr.status >= 200 && xhr.status <= 226)) {
                resolve(xhr.response)
            } else if (xhr.status >= 300) {
                reject(xhr.status)
            }
        }

        xhr.send(params)
    })
}