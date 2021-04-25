#!/usr/bin/env bash
##############################安装npm##############################
#node_modules路径
nodePath="/jd/scripts/node_modules"
echo -e "检测npm是否存在"
#判断panel文件夹是否存在，若不存在，复制/jd目录内
if [[ ! -d "$nodePath" ]]; then
 echo "npm不存在."
 npm install || npm install --registry=https://registry.npm.taobao.org
 echo "npm已安装完成"
else
 echo -e "npm存在...\n"
fi

##############################创建auth##############################
echo -e "开始检测auth.json文件是否存在"
authPath="/jd/config/auth.json"
if [[ ! -f "$authPath" ]]; then
  echo "auth.json文件不存在"
    cd /jd/config
  touch auth.json
  wget -q --no-check-certificate https://ghproxy.com/https://raw.githubusercontent.com/gys619/gys/main/auth.json -O auth.json.new
  mv -f auth.json.new auth.json
  echo "auth.json文件写入成功"
  echo -e "auth.json文件创建成功\n"
else
 echo -e "auth.json存在...\n"
fi
##############################安装面板 首先要把panel复制到config文件夹下##############################
#panel路径
echo -e "开始安装面板 "
PanelPath="/jd/panel"
#判断panel文件夹是否存在，若不存在，复制/jd目录内
if [[ ! -d "$PanelPath" ]]; then
 echo "控制面板已和谐，重新拷贝面板目录..."
 cp -r /jd/config/panel /jd/
 echo -e "启动控制面板挂载程序..."
 pm2 stop /jd/panel/server.js
 pm2 start /jd/panel/server.js
else
 echo -e "控制面板还存在...\n"
fi
##############################安装panel的npm##############################
#node_modules路径
pPath="/jd/panel/node_modules"
echo -e "开始安装panel的npm"
#判断panel文件夹是否存在，若不存在，复制/jd目录内
if [[ ! -d "$pPath" ]]; then
 echo "npm不存在."
 cd /jd/panel
 npm install || npm install --registry=https://registry.npm.taobao.org
 echo "npm已经装完"
 echo -e "启动控制面板挂载程序...\n"
 pm2 stop /jd/panel/ecosystem.config.js
 pm2 start /jd/panel/ecosystem.config.js
else
 echo -e "npm存在...\n"
fi

############################## 恢复HomePage ##############################
##panelDir=${ShellDir}/panel/public
echo -e "开始恢复HomePage"
cd /jd/panel/public
wget -q --no-check-certificate https://ghproxy.com/https://raw.githubusercontent.com/gys619/gys/master/home.html -O home.html.new
if [ $? -eq 0 ]; then
  mv -f home.html.new home.html
  echo -e "恢复 HomePage 成功!!!\n"
else
  rm -rf home.html.new
  echo -e "恢复 HomePage 失败...\n"
fi
echo -e "开始检测jpanel文件是都存在"
autoPath="/jd/jpanel.sh"
if [[ ! -f "$autoPath" ]]; then
  echo "jpael.sh文件不存在"
    cd /jd
  touch jpanel.sh
  wget -q --no-check-certificate https://ghproxy.com/https://raw.githubusercontent.com/gys619/gys/master/jpanel.sh -O jpanel.sh.new
  mv -f jpanel.sh.new jpanel.sh
  echo "jpanel.sh文件写入成功"
  echo -e "jpanel.sh文件创建成功\n"
  cd /jd
  bash jpanel.sh
else
 echo -e "jpanel.sh存在...\n"
fi
echo -e "检测面板是否运行"
PROC_NAME=server.js
ProcNumber=`ps -ef |grep -w $PROC_NAME|grep -v grep|wc -l`
if [ $ProcNumber -le 0 ];then
   echo -e "面板进程没运行\n"
   cd /jd
   bash jpanel.sh
else
   echo -e "面板进程运行中\n"
fi
echo -e "终端是否运行"
PROC_NAME1=ttyd
ProcNumber=`ps -ef |grep -w $PROC_NAME1|grep -v grep|wc -l`
if [ $ProcNumber -le 0 ];then
   echo -e "终端进程没运行\n"
   cd /jd
   bash jpanel.sh
else
   echo -e "终端进程运行中\n"
fi
exit 0
