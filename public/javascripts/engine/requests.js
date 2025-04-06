let serverUrl = "http://localhost:3000/"

function getRequest(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', serverUrl + url, true)
        addAuth(xhr)
        
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
        xhr.open('POST', serverUrl + url, true)
        xhr.setRequestHeader('content-type', header || 'application/json')
        addAuth(xhr)
    
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
        xhr.open('DELETE', serverUrl + url, true)
        xhr.setRequestHeader('content-type', header || 'application/json')
        addAuth(xhr)
    
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

function addAuth(xhr) {
    let name = window.localStorage.getItem('name')
    let token = window.localStorage.getItem('t')
    xhr.setRequestHeader('x-user-name', encodeURIComponent(name))
    if (token) {
        xhr.setRequestHeader('x-auth-token', token)
    }
}