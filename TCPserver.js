var net = require('net');

var HOST = '127.0.0.1';
var PORT = 9011;
var server = net.createServer();
server.listen(PORT, HOST);

server.on('connection', function(sock) {

    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);

    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // 回发监测数据
		for (let i = 0;i <=data.length;i++ )
		{
			if (data[i] == 58 ){
				let msg = data.slice(i, i+11);
				var deflectionvalue1 = 14.111;
				var deflectionvalue2 = 345.111;
				var strainvalue1 = 1234.111;
				var strainvalue2 = 2345.111;
				var sensortype = (msg.slice(5,7)).toString();
				
				if (sensortype === '02')
				{
					deflectionvalue1 += Math.random() - 0.5;
					var msgContext1 =  new Buffer ((deflectionvalue1.toString()), 'ascii');
					var msgContext2 =  new Buffer ((deflectionvalue2.toString()), 'ascii');
				}
				else if (sensortype === '04')
				{
					strainvalue1 += Math.random() - 0.5;
					var msgContext1 =  new Buffer ((strainvalue1.toString()), 'ascii');
					var msgContext2 =  new Buffer ((strainvalue1.toString()), 'ascii');
				}
				
				var msgHeader =  msg.slice(0,9);
				var msgEnd = new Buffer ([0x45,0x44,0x0d,0x0a]);
				var list =  [msgHeader,msgContext1,msgContext2,msgEnd ];
				var msgset = Buffer.concat(list);
				sock.write(msgset);
			}
		}

    });

    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });
	
   sock.on('error',function(){  
     console.log("error");  
   }); 

});

console.log('Server listening on ' + HOST +':'+ PORT);