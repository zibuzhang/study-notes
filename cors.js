let http = require('http');

let host, port = 80;
(() => {
    let url = process.argv[2];
    if (!url) {
        return;
    }

    let params = url.split(':');
    host = params[0];
    if (params.length === 2) {
        port = params[1];
    }
})()


http.createServer((request, response) => {
    let content = '';

    delete request.headers.host;
    let opt = {
        host,
        port,
        path: request.url,
        method: request.method,
        headers: request.headers
    };

    // if (request.method === 'POST') {
    request.on('data', (data) => {
        console.log('提交的参数：' + decodeURIComponent(data));

        req.write(data);
    });
    // }

    request.on('end', () => {
        console.log('发送请求：' + opt.host + opt.path);
        req.end();
    })

    let req = http.request(opt, (res) => {
        res
            .on('data', (body) => {
                // console.log('返回的内容：' + decodeURIComponent(body))
                content += body;
            })
            .on("end", () => {
                // 去掉set-cookie中的httponly，以便js能够读取cookie
                let cookies = res.headers['set-cookie'];
                if (cookies) {
                    if (cookies instanceof Array) {
                        cookies.forEach((cookie, index) => {
                            cookies[index] = cookie.replace('; HttpOnly', '');
                        });
                    } else {
                        res.headers['set-cookie'] = res.headers['set-cookie'].replace('; HttpOnly', '')
                    }
                }
                res.headers['Access-Control-Allow-Origin'] = request.headers['origin'];
                res.headers['Access-Control-Allow-Credentials'] = true;
                res.headers['Access-Control-Allow-Headers'] = 'Content-Type';
                response.writeHead(200, res.headers);
                response.write(content);
                response.end();
            });
    }).on('error', (e) => {
        response.writeHead(e.status, e.headers);
        response.write(e.message);
        response.end();
    });

}).listen(8079, '127.0.0.1'); //监听端口8079
console.log("Server runing at port: " + 8079 + ".");
