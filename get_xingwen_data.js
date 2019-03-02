var request = require("request");
var cheerio = require('cheerio');
const iconv = require('iconv-lite');
var mysql = require('mysql');
var fs = require('fs');
var pageNum = 0;
var dtNum = 0;
var arr = [];
var resour = 'http://www.mingxing.com';
var items = [
    {url: '/news/index?type=hdxz&p=', type: 'huodong', num: 1},//309
    {url: '/news/index?type=fwbg&p=', type: 'feiwen', num: 1},//360
    {url: '/news/index?type=tupian&p=', type: 'tupian', num: 1},//249
    {url: '/news/index?type=baoliaotai&p=', type: 'baoliaotai', num: 1},//91
    {url: '/news/index?type=zyxw&p=', type: 'zongyi', num: 1},//133
    {url: '/news/index?type=dsxw&p=', type: 'dianshi', num: 1},//397
    {url: '/news/index?type=dyxw&p=', type: 'dianying', num: 1},//108
    {url: '/news/index?type=yyxw&p=', type: 'yinyue', num: 1},//222
    {url: '/news/index?type=mxdt&p=', type: 'dongtai', num: 1},//727
]
var ip = [
    '14.192.76.22',
    '27.54.72.21',
    '27.224.0.14',
    '36.0.32.19',
    '36.37.40.21',
    '36.96.0.11',
    '39.0.0.24',
    '39.0.128.17',
    '40.0.255.24',
    '40.251.227.24',
    '42.0.8.21',
    '42.1.48.21',
    '42.1.56.22',
    '42.62.128.19',
    '42.80.0.15',
    '42.83.64.20',
    '42.96.96.21',
    '42.99.112.22',
    '42.99.120.21',
    '42.100.0.14',
    '42.157.128.20',
    '42.187.96.20',
    '42.194.64.18',
    '42.248.0.13',
    '43.224.212.22',
    '43.225.236.22',
    '43.226.32.19',
    '43.241.88.21',
    '43.242.64.22',
    '43.247.152.22',
    '45.116.208.24',
    '45.120.243.24'
];
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ashun666',
    database: 'qqzh',
    useConnectionPooling: true
});

function getAjax(url) {
    return new Promise((resolve, reject) => {
        var options = {
            method: 'GET',
            url: url,
            gzip: true,
            encoding: null,
            headers: {
                "X-Forwarded-For": ip[Math.floor(Math.random()*ip.length)] || '42.194.64.18',
                'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
                'referer': resour,
                'Cookie': "PHPSESSID=88f1qocpntbtjnp990pkqvo3a4; UM_distinctid=16846df58e71c8-0735f5020bd16-10326653-13c680-16846df58e8f22; CNZZDATA1273706240=1075868105-1547372666-http%253A%252F%252Fmvxoxo.com%252F%7C1547431260; CNZZDATA1275906764=206766016-1547375436-http%253A%252F%252Fmvxoxo.com%252F%7C1547430243"
            }
        };
        request(options, function (error, response, body) {
            try {
                if (error) throw error;
                var buf = iconv.decode(body, 'UTF-8');//获取内容进行转码
                $ = cheerio.load(buf);
                resolve();
            } catch (e) {
                console.log(options.url, 'eeeeeeeß')
                reject(e);
            }
        })
    });
}

function getList () {
    var urlC = resour + items[pageNum].url;
    if ((items[pageNum].num - dtNum) > 1) {
        urlC = urlC + (items[pageNum].num - dtNum) + '.html';
    }
    getAjax(urlC).then(function (){
        var li = $('.page_lnews ul li');
        var title = '';
        var url = '';
        var img = '';
        var txt = '';
        var time = '';
        dtNum++
        for (var i = 0; i < li.length; i++) {
            title = $('.fr a h3', li[i]).text();
            url = $('.fr a', li[i]).attr('href');
            img = $('.fl img', li[i]).attr('src');
            txt = $('.fr p', li[i]).text();
            time = $('.fr i', li[i]).text();
            arr.push({url:url, title: title, img: img, txt: txt, time: time, type: items[pageNum].type});
        }
        if ((items[pageNum].num - dtNum) > 0) {
            console.log('current page is========', dtNum);
            getList();
        } else {
            pageNum++
            if (pageNum === items.length) {
                if (arr.length) {
                    var nArr = JSON.parse(JSON.stringify(arr));
                    arr = [];
                    pageNum = 0;
                    dtNum = 0;
                    // console.log(nArr.length)
                    // return;
                    listArr(nArr);
                }
            } else {
                dtNum = 0;
                getList();
            }
        }
    }, function () {
        getList();
    });
}

function listArr (list) {
    if (dtNum === list.length) {
        console.log('end--', dtNum, 'current-time--', new Date().getTime());
        var date = new Date();
        var timeS = new Date(date.getFullYear() +'-' + (date.getMonth()+1) + '-' + date.getDate() + ' 23:00:00').getTime();
        setTimeout(function () {
            getList();
        }, timeS - date.getTime() + (6*60*60*1000)); // 8小时后重新调  
    } else {      
        var sql = 'select * from xingwen_list where url ="' + list[dtNum].url +'"';
        pool.getConnection(function (err, conn) {
            if (err) console.log("detail ==> " + err);
            conn.query(sql, function (err2, rows, fields) {
                if (err2) {
                    console.log('[chear ERROR2] - ', err2.message);
                    conn.release();
                    listArr(list);
                } else {
                    if (rows.length) {
                        dtNum++;
                        conn.release();
                        listArr(list);
                    } else {
                        getAjax(resour+list[dtNum].url).then(function () {
                            var id = new Date().getTime()+dtNum;
                            var sqlL = "INSERT INTO xingwen_list(id, url,title,img,txt,type,time) VALUES (?,?,?,?,?,?,?)";
                            var infoL = [id, list[dtNum].url, list[dtNum].title, list[dtNum].img, list[dtNum].txt, list[dtNum].type, list[dtNum].time];
                        
                            var detailTitle = $('.news_detail .detail_t h1').text();
                            var detailTxt = [];
                            var childs = $('.news_detail .detail').children();
                            for(var i = 0; i < childs.length; i++, detailTitle){
                                // console.log($('img', childs[i]).eq(0).attr('src'), '============');
                                var src = $('img', childs[i]).eq(0).attr('src');
                                if (src) {
                                    detailTxt.push('<img src="'+ src +'">');
                                } else{
                                    detailTxt.push($(childs[i]).text());
                                }
                            }
                            var sqlD = "INSERT INTO xingwen_detail(id,title,txt,time) VALUES (?,?,?,?)";
                            var infoD = [id, (detailTitle||list[dtNum].title), JSON.stringify(detailTxt), list[dtNum].time];
                            conn.query(sqlL, infoL, function (err, rows, fields) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            conn.query(sqlD, infoD, function (err, rows, fields) {
                                if (err) {
                                    console.log('[SELECT ERROR] - ', err.message);
                                }else{
                                    console.log('add number'+dtNum+'data success');
                                }
                            });
                            setTimeout(function () {
                                conn.release();
                                dtNum++;
                                listArr(list);
                            }, 1000);
                        }, function () {
                            listArr(list);
                        });
                    }
                }
            });
        });
    }
}

getList();

// 图片下载
// function getImg(id, src) {
//     var src = "http://img.mingxing.com/mingxing//20190214/1129fd339434b746df94a778341fc6d2.jpg";
//     var writeStream = fs.createWriteStream(id+'.jpg');
//     var options = {
//         method: 'GET',
//         url: src,
//         gzip: true,
//         encoding: null,
//         headers: {
//             "X-Forwarded-For": ip[Math.floor(Math.random()*ip.length)] || '42.194.64.18',
//             'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
//             'referer': 'http://www.mingxing.com',
//             'Cookie': "PHPSESSID=88f1qocpntbtjnp990pkqvo3a4; UM_distinctid=16846df58e71c8-0735f5020bd16-10326653-13c680-16846df58e8f22; CNZZDATA1273706240=1075868105-1547372666-http%253A%252F%252Fmvxoxo.com%252F%7C1547431260; CNZZDATA1275906764=206766016-1547375436-http%253A%252F%252Fmvxoxo.com%252F%7C1547430243"
//         }
//     };
//     var readStream = request(options);
//     readStream.pipe(writeStream);
//     readStream.on('end', function() {
//         console.log('文件下载成功');
//     });
//     readStream.on('error', function() {
//         console.log("错误信息:" + err);
//     })
//     writeStream.on("finish", function() {
//         console.log("文件写入成功");
//         writeStream.end();
//     });
// }
