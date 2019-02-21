var request = require("request");
var cheerio = require('cheerio');
const iconv = require('iconv-lite');
var mysql = require('mysql');
var pageNum = 0;
var dtNum = 0;
var arr = [];
var resour = 'https://www.meitulu.com';
var items = [
    {url: '/t/nvshen/', type: 'nvshen', num: 1},//35
    {url: '/t/jipin/', type: 'jipin', num: 1},//30
    {url: '/t/nenmo/', type: 'nenmo', num: 1},//60
    {url: '/t/wangluohongren/', type: 'wangluohongren', num: 1},//10
    {url: '/t/fengsuniang/', type: 'fengsuniang', num: 1},
    {url: '/t/qizhi/', type: 'qizhi', num: 1},//21
    {url: '/t/youwu/', type: 'youwu', num: 1},//34
    {url: '/t/baoru/', type: 'baoru', num: 1},//20
    {url: '/t/xinggan/', type: 'xinggan', num: 1},//67
    {url: '/t/youhuo/', type: 'youhuo', num: 1},//48
    {url: '/t/meixiong/', type: 'meixiong', num: 1},//35
    {url: '/t/shaofu/', type: 'shaofu', num: 1},//20
    {url: '/t/changtui/', type: 'changtui', num: 1},//32
    {url: '/t/mengmeizi/', type: 'mengmeizi', num: 1},//28
    {url: '/t/loli/', type: 'loli', num: 1},//11
    {url: '/t/keai/', type: 'keai', num: 1},//21
    {url: '/t/huwai/', type: 'huwai', num: 1},//22
    {url: '/t/bijini/', type: 'bijini', num: 1},//9
    {url: '/t/qingchun/', type: 'qingchun', num: 1},//23
    {url: '/t/weimei/', type: 'weimei', num: 1},//11
    {url: '/t/qingxin/', type: 'qingxin', num: 1}//24
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
        var li = $('.boxs ul.img li');
        var title = '';
        var url = '';
        var img = '';
        var imgLeng = '';
        var jigou = '';
        var mutie = '';
        dtNum++
        for (var i = 0; i < li.length; i++) {
            title = $('.p_title a', li[i]).text();
            url = $('.p_title a', li[i]).attr('href');
            img = $('a img', li[i]).attr('src');
            imgLeng = $('p', li[i]).eq(0).text();
            jigou = $('p', li[i]).eq(1).text();
            mutie = $('p', li[i]).eq(2).text();
            arr.push({url:url, title: title, img: img, imgLeng: imgLeng, jigou: jigou, mutie: mutie, type: items[pageNum].type});
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
        var sql = 'select * from meitu_list where url ="' + list[dtNum].url +'"';
        var infoReal = "INSERT INTO meitu_list_rela(list_id,type) VALUES (?,?)";
        pool.getConnection(function (err, conn) {
            if (err) console.log("detail ==> " + err);
            conn.query(sql, function (err2, rows, fields) {
                if (err2) {
                    console.log('[chear ERROR2] - ', err2.message);
                    conn.release();
                    listArr(list);
                } else {
                    if (rows.length) {
                        var sqlReal = 'select * from meitu_list_rela where list_id ="' + rows[0].id +'" and type ="' + list[dtNum].type +'"';
                        conn.query(sqlReal, function (err3, rowsReal, fields) {
                            if (err3) {
                                console.log('[chear ERROR3] - ', err3.message);
                                conn.release();
                                listArr(list);
                            } else {
                                if(!rowsReal.length) {
                                    conn.query(infoReal, [rows[0].id, list[dtNum].type], function (err, rows, fields) {});
                                }
                                dtNum++;
                                conn.release();
                                listArr(list);
                            }
                        });
                    } else {
                        var imgs = [];
                        var id = new Date().getTime()+dtNum;
                        var sql2 = 'select * from meitu_detail where url ="' + list[dtNum].url +'"';
                        var sqlL = "INSERT INTO meitu_list(id, url,title,img,imglen,jigou,mutie) VALUES (?,?,?,?,?,?,?)";
                        var infoL = [id, list[dtNum].url, list[dtNum].title, list[dtNum].img, list[dtNum].imgLeng, list[dtNum].jigou, list[dtNum].mutie];
                        function getDetail(dUrl) {
                            getAjax(dUrl).then(function () {
                                var jianjie = $('.c_l').html();
                                var imgC = $('.content .content_img');
                                var nextPage = $('#pages span').next();
                                var nextC = $(nextPage).text();
                                for(var j =  0; j < imgC.length; j++) {
                                    imgs.push($(imgC[j]).attr('src'));
                                }
                                if (Number(nextC)) {
                                    var pUrl = $(nextPage).attr('href');
                                    getDetail(resour+pUrl);
                                } else {
                                    var sqlD = "INSERT INTO meitu_detail(id,url,title,imgs,jianjie) VALUES (?,?,?,?,?)";
                                    var infoD = [id, list[dtNum].url, list[dtNum].title, imgs.join(','), jianjie];
                                    conn.query(sqlL, infoL, function (err, rows, fields) {});
                                    conn.query(infoReal, [id, list[dtNum].type], function (err, rows, fields) {});
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
                                }
                            }, function () {
                                getDetail(dUrl);
                            });
                        }
                        // todo 记得建立索引
                        // 判断是否存在这条详情
                        getDetail(list[dtNum].url);
                        // conn.query(sql2, function (err, rows2, fields) {
                        //     if (rows2 && rows2.length) {
                        //         dtNum++;
                        //         conn.query(sqlL, infoL, function (err, rows, fields) {});
                        //         conn.release();
                        //         listArr(list);
                        //     } else {
                        //         getDetail(list[dtNum].url);
                        //     }   
                        // });
                    }
                }
            });
        });
    }
}

getList();
function deleteNot() {
    var sql = 'SELECT list.* FROM list LEFT JOIN defDetail ON list.createTime = defDetail.createTime WHERE defDetail.createTime is null';
    var delSql = 'DELETE list FROM list LEFT JOIN defDetail ON list.createTime = defDetail.createTime WHERE defDetail.createTime is null';
    pool.getConnection(function (err, conn) {
        if (err) console.log("POOL ==> " + err);
        conn.query(sql, function (err, rows, fields) {
            if (err) console.log('[chear ERROR] - ', err.message);
            console.log(rows.length, '=======');
            conn.release();
            // getAjax('/user/login/dologin.html', 'POST').then(function () {
            //     listArr(rows);
            // });
        })
    });
}
var num = 0;
function allData() {
    var sql = 'select * from meitu_list';
    var updateSql = 'update meitu_detail set id = "';
    pool.getConnection(function (err, conn) {
        if (err) console.log("POOL ==> " + err);
        conn.query(sql, function (err, rows, fields) {
            if (err) console.log('[chear ERROR] - ', err.message);
            console.log(rows.length, '=======');
            for(var i =0; i < rows.length; i++) {
                conn.query(updateSql+rows[i].id+'" where url = "' + rows[i].url +'"', function (err, rows, fields) {
                    if (err) console.log('[chear ERROR] - ', err.message);
                    console.log(num++)
                })
            }
            conn.release();
        })
    });
}
// allData()
// getList();