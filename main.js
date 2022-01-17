var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

function templateHTML(title, list, body){
    return `<!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
    </body>
    </html>
    `;
}

function templateLIST(filelist){
    var list = '<ul>';
    filelist.forEach(elem => {
        list = list+'<li><a href="/?id='+elem+'">'+elem+'</a></li>';
    });
    list = list+'</ul>';
    return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;
    
    if(pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir('./data/', (err, filelist)=>{
                var title = "Home"
                var description = "Hello Node.js";
                var list = templateLIST(filelist);
                var template =templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
                response.writeHead(200);
                response.end(template);
            })
        } else {
            fs.readdir('./data/', (err, filelist)=>{
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, data){
                    var description = data;
                    var list = templateLIST(filelist);
                    var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
                    response.writeHead(200);
                    response.end(template);
                })
            })
        }
    } else if(pathname === '/create') {
        fs.readdir('./data/', (err, filelist)=>{
            var title = "WEB - create"
            var list = templateLIST(filelist);
            var template =templateHTML(title, list, `
                <form action="http://localhost:3000/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit"></p></form>
            `);
            response.writeHead(200);
            response.end(template);
        })
    } else if(pathname === '/create_process') {
        var body = '';
        request.on('data', function(data){
            body = body + data;
            if(body.length > 1e6) request.connection.destroy();
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
        });
        response.writeHead(200);
        response.end('success!');
    } else {
        response.writeHead(404);
        response.end('Not found');
    };

});
app.listen(3000);