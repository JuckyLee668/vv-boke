# EMQX

[Directory listing for EMQX: / | EMQ](https://www.emqx.com/zh/downloads/broker)

windows下进入bin目录

```
./emqx start
```

[EMQX Dashboard localhost:10803](http://127.0.0.1:18083)
初始 -u admin -P public
# AT指令的使用
## AT指令连接EMQX

`AT`                                                                   #测试AT功能

`AT+CWMODE=1`                                                  #设置模组进入STA模式

`AT+CWJAP="ssid","password"`                      #连接wifi

`AT+MQTTUSERCFG=0,1,"1234","admin","public",0,0,""`  #设置MQTT连接所需要的的参数，包括用户ID（不为空）、账号（admin）以及密码（public）

`AT+MQTTCONN=0,"127.0.0.1",1883,0`

`AT+MQTTPUB=0,"ESP8266/online","1",0,0`                         #发布一条topic为ESP8266/online，message为1的数据，QOS设置为0

`AT+MQTTSUB=0,"ESP8266/EMQX",0`                                       #订阅一条topic为ESP8266/EMQX，QOS为0的数据


## AT 指令连接TCP/UDP

`AT+CIPSTART="TCP/UDP","本地IP",8080`                      #连接TCP服务器

`AT+SAVETRANSLINK=1,"本地IP",8080,"TCP/UDP"`        #设置开机进入TCP透传模式，将配置参数写入flash中

`AT+CIPMODE=1`                                                              #设置设备进入透传模式

`AT+CIPSEND`                                                                 #在透传模式下传输数据，串口输入的数据均会发送到服务器中，之后可发送任意数据到服务器



# mqtt客户端安装（tspi）

[使用 Paho Python 连接到部署 | EMQX Platform 文档](https://docs.emqx.com/zh/cloud/latest/connect_to_deployments/python_sdk.html#%E5%89%8D%E7%BD%AE%E5%87%86%E5%A4%87)
[简介 - MQTTX 文档](https://mqttx.app/zh/docs)
## 使用源码安装
```bash
git clone https://github.com/eclipse/paho.mqtt.python 
cd paho.mqtt.python 
python3 setup.py install
```
## 使用python安装
```bash
pip3 install paho-mqtt
```

```python
# python3.8

import random

from paho.mqtt import client as mqtt_client



broker = '192.168.31.33'
port = 1883
topic = "hello"
# generate client ID with pub prefix randomly
client_id = f'python-mqtt-{random.randint(0, 100)}'
username = 'admin'
password = 'public'


def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION1,client_id)
    # 此处CallbackAPIVersion.VERSION1 避免因paho.mqtt升级而不可用
    # client.tls_set(ca_certs='./server-ca.crt')
    client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def subscribe(client: mqtt_client):
    def on_message(client, userdata, msg):
        print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")
        if msg.payload.decode() == "1":
            command = f"echo {shlex.quote('heartbeat')} > /sys/class/leds/rgb-led-b/trigger"
            subprocess.run(["sh", "-c", command])

    client.subscribe(topic)
    client.on_message = on_message


def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()


if __name__ == '__main__':
    run()
```


