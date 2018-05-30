/**
 * @fileOverview  代理服务器配置
 * @author leon.chen
 * @version
 * Created on 2016/2/24.
 */


module.exports = {
    creditSourceBaseUrl:{
        scheme: 'http://',      //协议
        //host: '192.168.33.142', //java api 芳勇
        //192.168.0.187:8089
        host: '192.168.33.143', //java api 芳勇
        // host: '192.168.33.143', //java api 芳勇
        port: '8089'     //java api 服务器端口
    },
    merchantBaseUrl:{
        scheme: 'http://',      //协议
        host: '192.168.33.143', //java api 候振
        port: '8085'     //java api 服务器端口
    },
    permissionBaseUrl:{//权限
        scheme: 'http://',      //协议
        host: '192.168.33.143', //java api 候振
        port: '8088'     //java api 服务器端口
    }
};
