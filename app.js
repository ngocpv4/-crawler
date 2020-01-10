const express = require('express');
var path = require('path');
const app = express();
var request = require('request');
var cheerio = require('cheerio');
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "jade");
const fs = require('fs');
const port = 5000;

app.get('/', function (req, res) {
    // Set the headers
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    var searchWord = "ảnh+đẹp";
    var options = {
        url: `https://www.google.com/search?q=${searchWord}&rlz=1C1AVFC_enVN859VN859&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjKgLn0l_bmAhUkG6YKHbjTB8MQ_AUoAXoECA0QAw&biw=1920&bih=969`,
        method: 'GET',
        headers: headers,
        qs: { 'key1': 'xxx', 'key2': 'yyy' }
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const arr = [];
            // Print out the response body
            var $ = cheerio.load(body);
            var doc = $('body').html();
            $('table').eq(4).children('tbody').children('tr').each(function (index) {
                const data = $(this).find('a>img').attr('src');
                const obj = {
                    data: data
                };
                arr.push(JSON.stringify(obj));
            });
            fs.writeFile('data.txt', arr, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("success");
                }
            });
            res.render('index', { title: $('table').eq(4).children().html() });
        }
    });
});

app.listen(port, () => {
    console.log("running on port " + port);
});