/**
 * @fileOverview 代理服务器封装的一些工具方法
 * @author leon.chen
 * @version
 * Created on 2016/2/24.
 */


var extend = require('util')._extend;
//读取应用的自定义配置项
var proxyConfig = require('./proxy-config');
var request = require('request');
var fs = require('fs');


module.exports = {
    /**
     * 模拟客户端请求java api代理服务器时使用的参数（合并）
     * @returns {Object} 参数对象
     */
    getProxyRequestInfo: function(req) {
        var headers = extend({}, req.headers);
        delete headers['content-length'];

        //console.log("req.url="+req.url)
        //req.url=/creditSourceBaseUrl/creditSource/page
        var currentUrl=req.url;
        if(currentUrl.indexOf("/creditSource/")>-1){ //征信源
            console.log("creditSource");
            return {
                baseUrl: proxyConfig.creditSourceBaseUrl.scheme + proxyConfig.creditSourceBaseUrl.host + ':' + proxyConfig.creditSourceBaseUrl.port,
                uri: currentUrl,
                method: req.method,
                headers: headers,
                form: extend({}, req.body)
            };
        }
        else if(currentUrl.indexOf("/merchant/")>-1){ //商户
            console.log("merchant");
            return {
                baseUrl: proxyConfig.merchantBaseUrl.scheme + proxyConfig.merchantBaseUrl.host + ':' + proxyConfig.merchantBaseUrl.port,
                uri: currentUrl,
                method: req.method,
                headers: headers,
                form: extend({}, req.body)
            };
        }
        else if(currentUrl.indexOf("/permission/")>-1){ //权限
            console.log("permission");
            return {
                baseUrl: proxyConfig.permissionBaseUrl.scheme + proxyConfig.permissionBaseUrl.host + ':' + proxyConfig.permissionBaseUrl.port,
                uri: currentUrl,
                method: req.method,
                headers: headers,
                form: extend({}, req.body)
            };
        }
    },

    /**
     * 封装request请求javaApi服务器后的响应事件，对nodeJS服务器响应对象进行赋值，并且根据javaApi服务器部分响应信息进行判断处理
     * @param req nodeJS服务器请求头
     * @param res nodeJS服务器响应头
     * @param callback  将控制权交还nodeJS服务器的回调函数
     * @returns {Function}  封装的request请求javaApi服务器后的响应事件的回调函数
     */
    proxyResponseCallBack: function(req, res, callback) {


        return function(error, response, body) {
            var businessJson, businessErrorCode;
            //手动将响应头信息赋值于nodeJS服务器响应对象（主要为了传cookie）
            if(response.headers) {
                Object.keys(response.headers).forEach(function(key) {
                    res.append(key, response.headers[key]);
                });
            }
            res.set('Content-Type', 'text/html');//将返回值格式定为返回html，以便被node解析并render出去
            //请求javaApi服务器正常接收到返回值
            if (!error && response.statusCode == 200) {
                businessJson = JSON.parse(body);
                callback.call(null, businessJson, true);
            }
            //请求javaApi服务器返回错误
            else {
                if(error) {

                }

            }
        };
    },
    proxyAll(app,router){
        var that=this;
        router.post('*',function(req,res,nex){
            Object.keys(req.headers).forEach(function(key) {
                console.log("req.headers="+key+"="+JSON.stringify(req.headers[key]));
            });
            console.log("req.body="+JSON.stringify(req.body));

            //接收前台POST过来的base64
            var fileContent = req.body.fileContent;
            //过滤data:URL
            if(~fileContent.indexOf("data:audio/mp3;base64,")){
                var base64Data = fileContent.replace("data:audio/mp3;base64,", "");
                var dataBuffer = new Buffer(base64Data, 'base64');
                fs.writeFile("out.mp3", dataBuffer, function(err) {
                    if(err){
                        console.log(err);
                    }else{
                        console.log("保存成功！");
                    }
                });
            }
            res.send(req.body);
            // request(that.getProxyRequestInfo(req), that.proxyResponseCallBack(req, res, function(json, flag){
            //     console.log("json="+JSON.stringify(json));
            //     res.send(json);
            // }));
        });
        app.use(router);
    }
};
