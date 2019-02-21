var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pageModule = require('./page');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ashun666',
    database: 'qqzh'
});
function getMeituMenu() {
    var str = '<div class="menu-child">';
    for (var i = 0; i < meituMenus.length; i++) {
        str += '<a href="/meitu/'+ meituMenus[i].type +'.html">'+ meituMenus[i].name +'</a>';
    }
    return str + '</div>'
}
var meituMenus = [
    {url: '/t/nvshen/', type: 'nvshen', name: '女神', title: '女神_性感女神_宅男女神排行榜_超高清女神写真套图', keyword: '性感女神,宅男女神,女神图片,女神排行榜', desc: '阿顺美图整理的女神套图，都是宅男心目中的性感女神、所有图片都是超高清，并有排行榜单'},
    {url: '/t/jipin/', type: 'jipin', name: '极品', title: '极品美女图片_超高清极品美女写真套图', keyword: '极品美女,极品美女图,极品美女写真', desc: '阿顺美图整理的极品美女写真套图，全部超高清，有极品性感美女，极品清纯美女，极品诱惑美女，日本极品美女等'},
    {url: '/t/nenmo/', type: 'nenmo', name: '嫩模', title: '嫩模_嫩模图片_日本嫩模写真_超高清嫩模套图在线欣赏', keyword: '嫩模图片,嫩模写真,日本嫩模', desc: '在线欣赏阿顺美图整理的超高清嫩模写真套图;包括国产性感嫩模图片,日本嫩模写真套图,台湾美腿嫩模等'},
    {url: '/t/wangluohongren/', type: 'wangluohongren', name: '网络红人', title: '网络红人_网络红人美女_网络红人图片_网络红人排行榜', keyword: '网络红人图片,网络红人美女', desc: '阿顺美图整理的超高清网络红人美女图片'},
    {url: '/t/fengsuniang/', type: 'fengsuniang', name: '风俗娘', title: '风俗娘|韩国风俗媚娘全套图_超高清韩国风俗娘官网全集套图', keyword: '风俗娘,风俗媚娘,韩国风俗娘,韩国风俗媚娘,风俗娘官网图片', desc: '在线欣赏阿顺美图整理的韩国风俗娘官网的全集套图;全部都是无水印,原尺寸的高清大图'},
    {url: '/t/qizhi/', type: 'qizhi', name: '气质', title: '气质美女图片_气质美女生活照_超高清气质美女写真套图', keyword: '气质美女,气质美女生活照,气质美女图片', desc: '阿顺美图整理的气质美女写真套图，全部超高清；包括一些气质美女图片、生活照及一些性感的气质美女'},
    {url: '/t/youwu/', type: 'youwu', name: '尤物', title: '性感尤物_尤物美女图片|超高清极品尤物写真套图', keyword: '尤物,尤物美女,性感尤物,尤物写真', desc: '阿顺美图整理的尤物美女写真套图，所有图片全部超高清，快来领略香艳尤物的养眼美图吧'},
    {url: '/t/baoru/', type: 'baoru', name: '爆乳', title: '爆乳_爆乳美女诱惑_爆乳肥臀_爆乳妹子_超高清爆乳MM写真图片', keyword: '爆乳美女,爆乳诱惑,爆乳肥臀,爆乳妹子图片', desc: '阿顺美图整理的爆乳美女写真套图，海量超高清爆乳妹子、爆乳肥臀、丝袜诱惑等爆乳美女图片'},
    {url: '/t/xinggan/', type: 'xinggan', name: '性感', title: '性感美女_超性感美女图片_超高清性感美女写真套图', keyword: '性感,性感美女,高清性感美女图片,超高清性感美女图', desc: '阿顺美图精选的性感美女写真套图，全部超高清；而且是超性感哦'},
    {url: '/t/youhuo/', type: 'youhuo', name: '诱惑', title: '美女诱惑_性感美女诱惑图片_超高清诱惑美女写真套图', keyword: '诱惑图片,美女诱惑,诱惑美女写真,诱惑套图', desc: '阿顺美图精选整理的诱惑美女写真套图，室内诱惑，野外诱惑，场景诱惑，全部超高清！'},
    {url: '/t/meixiong/', type: 'meixiong', name: '美胸', title: '美胸_美胸美女图片_超高清美胸模特写真套图', keyword: '美胸美女,美胸图片,高清美胸图', desc: '阿顺美图整理超高清美胸美女模特的写真套图，有日本的美胸美女，也是中国的美胸美女和欧美的'},
    {url: '/t/shaofu/', type: 'shaofu', name: '少妇', title: '少妇_性感少妇图片_寂寞少妇_风骚少妇写真_超高清少妇图片大全', keyword: '少妇图片,性感少妇,寂寞少妇,风骚少妇', desc: '阿顺美图整理的极品少妇图片，全部超高清，都是套图。包括性感少妇、寂寞少妇、风骚少妇等少妇图片'},
    {url: '/t/changtui/', type: 'changtui', name: '长腿', title: '长腿美女图片_街拍长腿美女_长腿丝袜_超短裙长腿美女_超高清长腿美女写真套图', keyword: '长腿美女,长腿丝袜,街拍长腿美女,超短裙长腿美女', desc: '阿顺美图整理的长腿美女图片, 高跟鞋长腿美女,都是超高清的图片,有专业的长腿丝袜美女写真套图、也有街拍长腿美女；'},
    {url: '/t/mengmeizi/', type: 'mengmeizi', name: '萌妹子', title: '萌妹子_萌妹纸图片_超高清萌妹子写真套图', keyword: '萌妹子,天然萌妹子,萌妹纸图片,萌妹子写真', desc: '阿顺美图整理的萌妹子(萌妹纸)图片，都是超高清的大图！快来欣赏萌翻你的萌妹子吧'},
    {url: '/t/loli/', type: 'loli', name: '萝莉', title: '萝莉_萝莉控_日本萝莉_巨乳萝莉|超高清小萝莉写真套图', keyword: '小萝莉,日本萝莉,萝莉控,巨乳萝莉,萝莉写真套图', desc: '阿顺美图整理的萝莉美女写真套图，有日本萝莉、巨乳萝莉，清新萝莉妹子，萝莉控们有福了，全部都是超高清的图片'},
    {url: '/t/keai/', type: 'keai', name: '可爱', title: '可爱美女_清纯可爱美女图片_超高清日本性感可爱美女写真套图', keyword: '可爱美女图片,性感可爱美女,清纯可爱美女', desc: '阿顺美图整理的可爱美女写真套图，全部超高清，有日本性感的可爱美女写真，也有国产的清纯可爱美女图片'},
    {url: '/t/huwai/', type: 'huwai', name: '户外', title: '户外美女_户外美女图片_美女户外照片_超高清户外美女写真', keyword: '户外美女,户外美女摄影,美女户外照片,户外美女写真', desc: '阿顺美图精选的超高清户外美女写真图片,包括户外美女摄影、户外美女模特照片、户外清纯美女等图片'},
    {url: '/t/bijini/', type: 'bijini', name: '比基尼', title: '比基尼美女_性感比基尼美女图片_超高清日本比基尼美女|中国比基尼图片', keyword: '比基尼,中国比基尼美女,日本比基尼美女,性感比基尼', desc: '阿顺美图整理的比基尼美女图片，有日本比基尼美女，也有性感的中国比基尼图片；都是超高清的写真套图'},
    {url: '/t/qingchun/', type: 'qingchun', name: '清纯', title: '清纯美女图片_超高清清纯美女写真_清纯美女生活照', keyword: '清纯美女,清纯美女图,清纯美女写真,清纯美女生活照', desc: '阿顺美图精选的清纯美女写真套图，全部超高清，有清纯唯美类、有清新校园类，也有清新萝莉类'},
    {url: '/t/weimei/', type: 'weimei', name: '唯美', title: '唯美美女_清纯唯美美女图片_超高清唯美美女写真', keyword: '唯美美女图片,天然唯美,乡村唯美,清纯唯美美女,唯美美女写真', desc: '阿顺美图整理的唯美美女图片,天然唯美,乡村唯美,清纯唯美美女,唯美美女写真'},
    {url: '/t/qingxin/', type: 'qingxin', name: '清新', title: '清新美女_唯美清新美女图_超高清清新小美女图片', keyword: '清新美女,清新小美女图,清新美女图片', desc: '阿顺美图整理的清新美女图片都是超高清的套图，唯美贴近自然的清新小美女'}
];

function getHeaderMenu(type, host) {
    var headerMenu = [{name: '首页', url: host+'/', type: 'shouye'}, {name: '精品美图', url: host+'/meitu/nvshen/', type: 'meitu'}];
    var headerhtml = '<div class="logo lf"><h6><a href="'+host+'/">情趣综合平台</a></h6></div><div class="search rf"><input id="search-value" onkeyup="getKeyup()" type="text"><button onclick="goSearch()">搜索</button></div><div class="menu rf">';
    var headerStr = '<ul>';
    var scriptStr = '<script>function goSearch(){var searchValue = document.getElementById("search-value").value;if(searchValue){window.location.href="/meitu/search/"+searchValue.replace(/_/g,"&&")+"/";};};function getKeyup(e){var event=e||window.event;if(event.keyCode=="13"){goSearch();}}</script>';
    for(var a = 0; a < headerMenu.length; a++) {
        if (type === headerMenu[a].type) {
            headerStr += '<li class="active"><a href="'+ headerMenu[a].url +'" title="'+ headerMenu[a].name +'">'+ headerMenu[a].name +'</span><i></i></li>';
        } else {
            headerStr += '<li><a href="'+ headerMenu[a].url +'" title="'+ headerMenu[a].name +'">'+ headerMenu[a].name +'</a></li>';
        }
    }
    return headerhtml + headerStr+ '</ul></div>' + scriptStr;
}

// 首页
router.get('/', function (req, res) {
    var items = {
        youwu: {name: '尤物系列', type: 'youwu', list:[]},
        jipin:{name: '极品系列', type: 'jipin', list:[]},
        nenmo:{name: '嫩模系列', type: 'nenmo', list:[]}
    };
    var sql = 'select a.* from (select t1.*,t2.type from meitu_list t1 inner join meitu_list_rela t2 on t1.id = t2.list_id where t2.type = "youwu" order by t1.id desc limit 4) a union all select b.* from (select t1.*,t2.type from meitu_list t1 inner join meitu_list_rela t2 on t1.id = t2.list_id where t2.type = "jipin" order by t1.id desc limit 4) b union all select c.* from (select t1.*,t2.type from meitu_list t1 inner join meitu_list_rela t2 on t1.id = t2.list_id where t2.type = "nenmo" order by t1.id desc limit 4) c';
    //select t1.* from meitu_list t1 inner join meitu_list_rela t2 on t1.id = t2.list_id where t2.type = 'youwu';
    pool.getConnection(function (err, conn) {
        if (err) console.log("POOL /==> " + err);
        conn.query(sql, function (err, result) {
            for(var i = 0; i < result.length; i++) {
                items[result[i].type].list.push(result[i]);
            }
            var host = 'http://'+req.headers['host'];
            var listObj = {
                listData: items,
                pageTitle: '情趣综合平台',
                pageKeyword: '美女图片,美女写真,妹子,美女,mm,美女,qqzhpt,qqzhpt.com',
                pageDescrition: '情趣综合平台是一家专门收集整理全网超高清的美女写真网站,分享各类美女图片、丝袜美腿、性感MM、清纯妹子等极品美女写真;全部超高清无杂乱水印！',
                headerHtml: getHeaderMenu('shouye', host),
                host: host,
                meituMenus: meituMenus,
                type: ''
            }
            res.render('meitu', listObj);
            pool.releaseConnection(conn);
        });
    });
});

// 列表页
router.get('/meitu/:type', function (req, res) {
    meituList(req, res, req.params.type, 1);
});
router.get('/meitu/:type/page/:page', function (req, res) {
    var filter = meituMenus.filter(function (item) {
        return item.type === req.params.type;
    })[0];
    if (filter && req.params.page == '1') {
        res.writeHead(301, {'Location': 'http://'+req.headers['host']+'/meitu/'+filter.type+'/'});
        res.end();
    } else {
        meituList(req, res, req.params.type, req.params.page);
    }
});
function meituList(req, res, type, page){
    var limit = Number(page);
    var limitBefore = ((limit - 1) * 20);
    var filter = meituMenus.filter(function (item) {
        return item.type === type;
    })[0];
    if (!filter || !limit) {
        get404(req, res);
        return;
    } else {
        var sql = 'SELECT t1.*,t2.type FROM meitu_list t1 inner join meitu_list_rela t2 on t1.id = t2.list_id where t2.type = "' + type +'" order by t1.id desc limit ' + (limitBefore + ',' + 20);
        var count = 'SELECT COUNT(1) FROM meitu_list t1 inner join meitu_list_rela t2 on t1.id = t2.list_id where t2.type = "' + type +'"';
        pool.getConnection(function (err, conn) {
            if (err) console.log("POOL /==> " + err);
            conn.query(sql, function (err, result) {
                conn.query(count, function (errC, total) {
                    var host = 'http://'+req.headers['host'];
                    var listObj = {
                        listData: result || [],
                        headerHtml: getHeaderMenu('meitu', host),
                        meituMenus: meituMenus,
                        type: type,
                        page: pageModule(Number(total[0]['COUNT(1)']) || 0, limit, host+'/meitu/'+type),
                        pageTitle: filter.title + '_情趣综合平台' + (limit>1? '_第'+ limit +'页' : ''),
                        pageKeyword: filter.keyword,
                        pageDescrition: filter.desc,
                        host: host
                    }
                    res.render('meitu_list', listObj);
                    conn.release();
                });
            });
        });
    }
}

//  搜索页
router.get('/meitu/search/:value', function (req, res) {
    getMeituSearch(req, res, req.params.value, '1');
})
router.get('/meitu/search/:value/page/:page', function (req, res) {
    getMeituSearch(req, res, req.params.value, req.params.page);
})
function getMeituSearch (req, res, searchCont, page) {
    var limit = Number(page) || 1;
    var limitBefore = ((limit - 1) * 20);
    var value = searchCont.replace(/&&/g, '_');
    var sql = 'SELECT * FROM meitu_list where title like "' +'%'+ value +'%'+ '" order by id desc limit ' + (limitBefore + ',' + 20);
    var count = 'SELECT COUNT(1) FROM meitu_list where title like "' +'%'+ value +'%'+ '"';
    pool.getConnection(function (err, conn) {
        if (err) console.log("POOL /==> " + err);
        conn.query(sql, function (err, result) {
            conn.query(count, function (errC, total) {
                var resultTotal = Number(total[0]['COUNT(1)']) || 0;
                var host = 'http://'+req.headers['host'];
                var listObj = {
                    listData: result || [],
                    headerHtml: getHeaderMenu('meitu', host),
                    meituMenus: meituMenus,
                    type: 'tag',
                    searchCont: value,
                    searchTotal: resultTotal,
                    page: resultTotal ? pageModule(resultTotal, limit, host+'/meitu/search/'+searchCont) : '',
                    pageTitle: value+'_美图搜索_情趣综合平台'+(limit>1? '_第'+ limit +'页' : ''),
                    pageKeyword: '美图搜索,美女图片,美女写真,妹子,美女,mm,美女,qqzh8,qqzh8.com',
                    pageDescrition: '情趣综合平台美图搜索全网超高清的美女写真网站,分享各类美女图片、丝袜美腿、性感MM、清纯妹子等极品美女写真;全部超高清无杂乱水印！',
                    host: host
                }
                res.render('meitu_search', listObj);
                conn.release();
            });
        });
    });
}

// 详情页
router.get('/meitu/:type/:id', function (req, res) {
    getMeituDetail(req, res, req.params.type, req.params.id, 1);
})
router.get('/meitu/:type/:id/:page', function (req, res) {
    getMeituDetail(req, res, req.params.type, req.params.id, Number(req.params.page));
})
function getMeituDetail(req, res, type, id, page){
    var sql = 'SELECT * FROM meitu_detail where id = "' + id +'"';
    var filter = meituMenus.filter(function (item) {
        return item.type === type;
    })[0];
    if (type === 'tag') {
        filter = {name: '搜索详情页', type: ''}
    }
    if (!filter || !page) {
        get404(req, res);
        return;
    } else {
        pool.getConnection(function (err, conn) {
            if (err) console.log("POOL /==> " + err);
            conn.query(sql, function (err, result) {
                var obj = result[0] || {};
                var host = 'http://'+req.headers['host'];
                var imgs = [];
                var lens = 0;
                var pageCont = '';
                var url = '';
                if (obj.imgs) {
                    imgs = obj.imgs.split(',');
                    lens = imgs.length / 5;
                    for(var i = 1; i <= lens; i++){
                        url = host + '/meitu/' + type + '/' + id + '/' + i;
                        if (i === 1)  url = host + '/meitu/' + type + '/' + id;
                        pageCont += '<a class="'+ (i === page ? 'active' : '') +'" href="'+ url +'">'+ i +'</a>'
                    }
                }
                var listObj = {
                    headerHtml: getHeaderMenu('meitu', host),
                    meituMenus: meituMenus,
                    pageTitle: obj.title || '数据丢失',
                    title: '_情趣综合平台',
                    position: filter,
                    type: type,
                    page: pageCont,
                    imgs: imgs.slice(page*5-5, page*5),
                    totalImgs: imgs,
                    host: host
                }
                var reNum = Math.floor(Math.random()*(1 - 10000) + 10000);//10000
                var recommondSql = 'SELECT t1.*,t2.type FROM meitu_list t1 inner join meitu_list_rela t2 on t1.id = t2.list_id order by t1.id desc limit ' + (reNum + ',' + 8);
                conn.query(recommondSql, function (err, recommondResult) {
                    console.log(reNum, '====', '记得改随机数')
                    listObj.recomond = recommondResult;
                    res.render('meitu_detail', listObj);
                    conn.release();
                })
                
            });
        });
    }
}

// 404页
router.get('*', get404);
function get404(req, res) {
    var listObj = {
        pageTitle: '404页面_情趣综合平台',
        pageKeyword: '美女图片,美女写真,妹子,美女,mm,美女,qqzh8,qqzh8.com',
        pageDescrition: '情趣综合平台是一家专门收集整理全网超高清的美女写真网站,分享各类美女图片、丝袜美腿、性感MM、清纯妹子等极品美女写真;全部超高清无杂乱水印！',
        host: 'http://'+req.headers['host']
    }
    res.status(404);
    res.render('404', listObj);
}

module.exports = router;