import VConsole from 'vconsole';
const vCon = new VConsole({
    log: {
        maxLogNumber: 50,
        showTimestamps: true
    },
    network: {
        maxNetworkNumber: 67
    },
    theme: 'dark',
    onReady: () => {
        console.log('VConsole ready.');
        window.con.hideSwitch();
    }
});
let customized_plug = new VConsole.VConsolePlugin('d_front_plug', '业务调试组件');
customized_plug.on('renderTab', (callback) => {
    let html = '<div>' +
        '<h3>自定义插件注册成功</h3>' +
        '<p>此页面暂无内容</p>' +
        '</div>';
    callback(html);
});
customized_plug.on('addTool', function(callback) {
    callback([{
        name: '重载当前页',
        onClick: function(event) {
            console.log(event.isTrusted);
            if (window.confirm('确认通过控制台直接刷新当前页面吗？未保存的数据将丢失。')) {
                window.location.reload();
            }
        }
    }, {
        name: '激活VCon常驻',
        onClick: function(event) {
            console.log('激活VCon常驻成功', event.isTrusted);
            alert('VConsole 在本次会话中将保持常驻状态');
            window.con.showSwitch();
        }
    }]);
});

vCon.addPlugin(customized_plug);
export default vCon;