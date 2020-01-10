const express = require('express');
var path = require('path');
const app = express();
var request = require('request');
var cheerio = require('cheerio');
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "jade");
const fs = require('fs');
const axios = require('axios');
const http = require('http');
const port = 5000;

function getDate() {
    let date = new Date();
    return date.getFullYear().toString() + date.getMonth() + date.getDay() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
}

app.get('/', function (req, res) {
    // Set the headers
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    var searchWord = "điện thoại";
    var options = {
        url: `https://www.google.com/search?q=${searchWord}&rlz=1C1AVFC_enVN859VN859&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjKgLn0l_bmAhUkG6YKHbjTB8MQ_AUoAXoECA0QAw&biw=1920&bih=969`,
        method: 'GET',
        headers: headers,
        qs: { 'key1': 'xxx', 'key2': 'yyy' }
    }

    // var download = async function (uri, filename, callback) {
    //     await request.head(uri, async function (err, res, body) {
    //         // console.log('content-type:', res.headers['content-type']);
    //         // console.log('content-length:', res.headers['content-length']);
    //         console.log('before');
    //         await request(uri).pipe(fs.createWriteStream('./images/' + filename)).on('close', callback);
    //         console.log('after');
    //     });
    // };

    // download('http://t1.gstatic.com/images?q=tbn:ANd9GcRr08WxiZL3y57TiQARnZN2vR9C_kpovipnVvygOfzNg2-0Nk3LnDX5ruiZ', 'google.png', function () {
    //     console.log('done');
    // });

    var download = function (url, dest, cb) {
        var file = fs.createWriteStream('./images/' + dest);
        var request = http.get(url, async function (response) {
            await response.pipe(file);
            file.on('finish', function () {
                file.close();
                cb();
            });
        });
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const arr = [];
            // Print out the response body
            var $ = cheerio.load(body);
            var doc = $('body').html();
            var i = 1;
            var j = 1;
            $('table').eq(4).children('tbody').children('tr').children('td').each(function (index) {
                const data = $(this).find('a>img').attr('src');
                const obj = {
                    data: data
                };
                arr.push(JSON.stringify(obj));
                //await download(data, `${getDate()}.jpg`, function () { console.log('done: ', j++) });
                download(data, `${getDate()}.jpg`, function () { console.log('done: ', j++) });
            });
            fs.writeFile('data.txt', arr, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("success");
                }
            });
            res.render('index', { title: doc });
        }
    });
});

app.listen(port, () => {
    console.log("running on port " + port);
});