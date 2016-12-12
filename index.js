// スマホから加速度を取得するイベントハンドラの追加
window.addEventListener('devicemotion', devicemotionHandler);
window.addEventListener('deviceorientation', deviceOrientationHandler);

var url = window.document.location.host.replace(/:.*/, '');
var wsport = 3333;  // WebSocketのポート

const debug = false;
var host = debug?'localhost':'';

// WebSocketの設定
var wsosc = {};
wsosc.ws = new WebSocket('ws://' + host + ':' + wsport);
wsosc.status = false;
wsosc.ws.onopen = function(){wsosc.status = true;};
wsosc.ws.onclose = function(){wsosc.status = false;};
wsosc.send = function(path,type,data){
    var jsonobj = {"osc":"WsoscSend","path":path,"type":type,"data":data};
    var json = JSON.stringify(jsonobj);

    // 送信可になったら
    if(wsosc.status){ wsosc.ws.send(json); }
};

// JQuery
var toggle = 0;
$(function() {
  // ボタンが押されたらsend
    $('#btn1').on('click', function() {
        wsosc.send('/osc/button1','i',[toggle]);
        if(!toggle){ toggle = true; $("#btn1").val("stop"); }
        else{ toggle = false; $("#btn1").val("start"); }
        $('#icebox')[0].load();
    });
});

// 加速度を取得するイベントハンドラ
function devicemotionHandler(e){
    if(!toggle) return; 
    var acx = e.acceleration.x;
    var acy = e.acceleration.y;
    var acz = e.acceleration.z;
    var data = [acx,acy,acz];

    wsosc.send('/osc/accel', 'S', data);
    $("#accel_x").text("accel_x : " + acx);
    $("#accel_y").text("accel_y : " + acy);
    $("#accel_z").text("accel_z : " + acz);

    if(toggle){
        if(acy > 10){
            $('#icebox')[0].currentTime = 0;
            $('#icebox')[0].play();
        }
    }
}

function deviceOrientationHandler(e){
    if(!toggle) return;
    var gx = e.beta;
    var gy = e.gamma;
    var gz = e.alpha;
    var data = [gx,gy,gz];
    
    wsosc.send('/osc/gyro', 'S', data);
    $("#gyro_x").text("gyro_x : " + gx);
    $("#gyro_y").text("gyro_y : " + gy);
    $("#gyro_z").text("gyro_z : " + gz);
}