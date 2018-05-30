/**
 * @fileOverview  应用入口
 * @author chenxvhua
 * @version
 * Created on 2016/2/24.
 */

//引入模块区域start
var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//引入模块区域end

//初始化值区 start
var localIp="";
var os = require('os');
var interfaces = os.networkInterfaces();
for (item in interfaces) {
    for (att in interfaces[item]) {
        var address = interfaces[item][att];
        if(address.family==="IPv4" && !address.internal){
            localIp=address.address;
        }
    }
}
var appConfig = {//启动端口
    serverPort: '3000',
    localIp:localIp
};
var app = express();
var proxyUtil = require('./common/proxy-util');
//初始化值区 end

app.use(bodyParser.json({limit: '50mb'})); //这里是有前提的,客户端请求接口时必须指名请求头类型 Content-Type=application/json;charset=utf-8，bodyParser 发现这样类型的请求头后,会自动将 body 里的 json 格式数据正确解析,否则 req.body.data 为 undefined
app.use(bodyParser.urlencoded({ extended: false,limit: '50mb' }));
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
proxyUtil.proxyAll(app,router);//设置代理

//启动监听
var server = app.listen(appConfig.serverPort,appConfig.localIp, function() {
    console.log(server.address().address+":"+server.address().port);
});
module.exports = app;



