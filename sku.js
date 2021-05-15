/*
领京豆额外奖励&抢京豆
脚本自带助力码，介意者可将 29行 helpAuthor 变量设置为 false
活动入口：京东APP首页-领京豆
更新地址：https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bean_home.js
已支持IOS双京东账号, Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, 小火箭，JSBox, Node.js
============Quantumultx===============
[task_local]
#领京豆额外奖励
10 7 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bean_home.js, tag=领京豆额外奖励, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jd_bean_home.png, enabled=true

================Loon==============
[Script]
cron "10 7 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bean_home.js, tag=领京豆额外奖励

===============Surge=================
领京豆额外奖励 = type=cron,cronexp="10 7 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bean_home.js

============小火箭=========
领京豆额外奖励 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bean_home.js, cronexpr="10 7 * * *", timeout=3600, enable=true
 */
const $ = new Env('领京豆额外奖励');
let skks=[
"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000014989%22%2C%20%22activityId%22%3A%20%2210356213%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000014989%22%7D&uuid=576a381852eb41f793d42b851ee3338e&client=apple&clientVersion=9.4.0&st=1620995586000&sv=120&sign=102a556c46190514c143c8f44baf9039",
"https://api.m.jd.com/client.action?functionId=getJingBeanBalanceDetail&clientVersion=10.0.0&build=88366&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=10&screen=2175*1080&partner=jingdong&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidA95ac81217fs5ES4wF5VKR+qParHk2UIbPREuMZAq74uDDbSBRATipI+0NgM2uPyUj3E46KcxWVpA1H0fhHzJXmjnHTjLQQ9Xh0uuylzYERlNNEdK&sdkVersion=29&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJ8pqDs6Awc962CDQ%2FBa3BkoQQWuL6nMZ%2BvrV5Dj7vTiIWe3Q9HPWM8pCPq2%2FrzvY9P1nbE2MVtLGHxbIonFt5Igq%2FzTI%2B4UdJOeWIb3XCQLpiDaknn9p8mAaEFd6%2Byiy9zcTrwk5CbgKgZN588hkdH2ZNKWdFGRzSdJIvxVGE0cvaKXHblFwvLQ%3D%3D&uemps=0-0&st=1620998449362&sign=c3413a5408ee89f0b66fa9c9bab74087&sv=102",
"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%22867956%22%2C%20%22activityId%22%3A%20%2210341774%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210030772%22%7D&uuid=068b64bbadd641859907c7a4e71f01ac&client=apple&clientVersion=9.4.0&st=1620994578000&sv=102&sign=05b99bd22d63eec97a615b20efc6aeaf",
"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%22867956%22%2C%20%22activityId%22%3A%20%2210341774%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210030772%22%7D&uuid=068b64bbadd641859907c7a4e71f01ac&client=apple&clientVersion=9.4.0&st=1620994578000&sv=102&sign=05b99bd22d63eec97a615b20efc6aeaf",
"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2248331%22%2C%20%22activityId%22%3A%20%2210340254%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2251720%22%7D&uuid=7e60918b12ac4997a9d7588e1d21dac0&client=apple&clientVersion=9.4.0&st=1620994573000&sv=120&sign=c05ae8da51768f730501b44d8e275968",
"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2248331%22%2C%20%22activityId%22%3A%20%2210340254%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2251720%22%7D&uuid=7e60918b12ac4997a9d7588e1d21dac0&client=apple&clientVersion=9.4.0&st=1620994573000&sv=120&sign=c05ae8da51768f730501b44d8e275968",
"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000100693%22%2C%20%22activityId%22%3A%20%2210362992%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000100693%22%7D&uuid=ef920ee2bd6d44dcb1ba9d17f7f0570d&client=apple&clientVersion=9.4.0&st=1620994537000&sv=111&sign=664f54c5addef099db0ccf9542feaa6d",
"https://api.m.jd.com/client.action?functionId=switchQuery&clientVersion=10.0.0&build=88366&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=10&screen=2175*1080&partner=jingdong&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidA95ac81217fs5ES4wF5VKR+qParHk2UIbPREuMZAq74uDDbSBRATipI+0NgM2uPyUj3E46KcxWVpA1H0fhHzJXmjnHTjLQQ9Xh0uuylzYERlNNEdK&sdkVersion=29&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJ8pqDs6Awc962CDQ%2FBa3BkoQQWuL6nMZ%2BvrV5Dj7vTiIWe3Q9HPWM8pCPq2%2FrzvY9P1nbE2MVtLGHxbIonFt5Igq%2FzTI%2B4UdJOeWIb3XCQLpiDaknn9p8mAaEFd6%2Byiy9zcTrwk5CbgKgZN588hkdH2ZNKWdFGRzSdJIvxVGE0cvaKXHblFwvLQ%3D%3D&uemps=0-0&st=1620998449215&sign=60602bcc872f452771d5dafcccbf6519&sv=120",
"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%22868802%22%2C%20%22activityId%22%3A%20%2210318214%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210031749%22%7D&uuid=a87600214dab405680096c9e18f5ee09&client=apple&clientVersion=9.4.0&st=1620994523000&sv=120&sign=ebb79c8550ab0e794e3621f47bee04bb",
"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000101581%22%2C%20%22activityId%22%3A%20%2210362920%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000101581%22%7D&uuid=706b29936d644d33985e805b504f43fe&client=apple&clientVersion=9.4.0&st=1620994493000&sv=102&sign=51da044543d46029275fe683764aed01",
"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210253874%22%2C%20%22activityId%22%3A%20%2210353431%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210400708%22%7D&uuid=f15a882f0bca4b259d14db52998556e6&client=apple&clientVersion=9.4.0&st=1620994420000&sv=111&sign=f8a29fb6c1dffec732f69ce64dca167f",
"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%22630377%22%2C%20%22activityId%22%3A%20%2210356740%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%22634761%22%7D&uuid=621c229d5cb04828957dd2986d96a9d4&client=apple&clientVersion=9.4.0&st=1620994360000&sv=102&sign=5dc80c08a24d398b05b8bee8008623cf",
"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000106848%22%2C%20%22activityId%22%3A%20%2210350304%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000106848%22%7D&uuid=badaa285745c4348817cbad05f276630&client=apple&clientVersion=9.4.0&st=1620994292000&sv=111&sign=194fc9ec9136403e5e026b309af52cee",
"https://api.m.jd.com/client.action?functionId=serverConfig&clientVersion=10.0.0&build=88366&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=10&screen=2175*1080&partner=jingdong&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidA95ac81217fs5ES4wF5VKR+qParHk2UIbPREuMZAq74uDDbSBRATipI+0NgM2uPyUj3E46KcxWVpA1H0fhHzJXmjnHTjLQQ9Xh0uuylzYERlNNEdK&sdkVersion=29&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJ8pqDs6Awc962CDQ%2FBa3BkoQQWuL6nMZ%2BvrV5Dj7vTiIWe3Q9HPWM8pCPq2%2FrzvY9P1nbE2MVtLGHxbIonFt5Igq%2FzTI%2B4UdJOeWIb3XCQLpiDaknn9p8mAaEFd6%2Byiy9zcTrwk5CbgKgZN588hkdH2ZNKWdFGRzSdJIvxVGE0cvaKXHblFwvLQ%3D%3D&uemps=0-0&st=1620998449215&sign=2f3a62eb90209ea7903f4e9f9fb578a5&sv=110",
"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000111944%22%2C%20%22activityId%22%3A%20%2210343579%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000111944%22%7D&uuid=4fb3d4b99dbd475b8edc4dbeba3f955a&client=apple&clientVersion=9.4.0&st=1620994206000&sv=111&sign=8a30d001003cb7901140faf5184d3dd9",
"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000112468%22%2C%20%22activityId%22%3A%20%2210337329%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000112468%22%7D&uuid=c72e755149784ef5a2e30989585c45de&client=apple&clientVersion=9.4.0&st=1620994198000&sv=111&sign=caf9bf608840f133a26816d151552471",
"https://api.m.jd.com/?d_brand=Redmi&screen=1080*2175&clientVersion=10.0.0&uuid=f9968ae3-e8e7-41d8-9701-d35c572924be&eu=2393039353533623&fv=7383235613364343&d_model=Redmi+K30&functionId=uvReport&pin=jd_68997b52ea865&osVersion=10&partner=jingdong&t=1620998449187&build=88366&appid=yingyan&client=android&sdkVersion=29&sign=edb57ab3d82ef9b0a6f4c9383c82d14f2b0a0900039a0ae123d4ebe244c3ece6",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%22845636%22%2C%20%22activityId%22%3A%20%2210348368%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210010606%22%7D&uuid=2248b3116f8a4f33ba080b09fe1f82fe&client=apple&clientVersion=9.4.0&st=1620995460000&sv=111&sign=817ec792f4ab6b43a43a0c8c6ab9b827",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000073662%22%2C%20%22activityId%22%3A%20%2210346560%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000073662%22%7D&uuid=14696bc303bf4eedbb1100cb75f1662c&client=apple&clientVersion=9.4.0&st=1620995456000&sv=102&sign=f9c2a87b96c689ee92bde3aef0de9919",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%22845879%22%2C%20%22activityId%22%3A%20%2210349524%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210009342%22%7D&uuid=a118b993cf9c482ab8ea5ccb31888f89&client=apple&clientVersion=9.4.0&st=1620995450000&sv=111&sign=22a65823e2bea160ff09b5d8bb200abe",
"https://api.m.jd.com/client.action?functionId=getJingBeanBalanceDetail&clientVersion=10.0.0&build=88366&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=10&screen=2175*1080&partner=jingdong&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidA95ac81217fs5ES4wF5VKR+qParHk2UIbPREuMZAq74uDDbSBRATipI+0NgM2uPyUj3E46KcxWVpA1H0fhHzJXmjnHTjLQQ9Xh0uuylzYERlNNEdK&sdkVersion=29&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJ8pqDs6Awc962CDQ%2FBa3BkoQQWuL6nMZ%2BvrV5Dj7vTiIWe3Q9HPWM8pCPq2%2FrzvY9P1nbE2MVtLGHxbIonFt5Igq%2FzTI%2B4UdJOeWIb3XCQLpiDaknn9p8mAaEFd6%2Byiy9zcTrwk5CbgKgZN588hkdH2ZNKWdFGRzSdJIvxVGE0cvaKXHblFwvLQ%3D%3D&uemps=0-0&st=1620998453451&sign=9bdaa84fb320672abdd8c11d22531fd6&sv=121",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000074301%22%2C%20%22activityId%22%3A%20%2210318403%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000074301%22%7D&uuid=873af90c961f4fd0a1028bbb257ed72b&client=apple&clientVersion=9.4.0&st=1620995437000&sv=120&sign=efa4e54fcad17d1aa229ee0d2c338593",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210085333%22%2C%20%22activityId%22%3A%20%2210348730%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210221955%22%7D&uuid=16dc7ae0632a49438cf49c468d312510&client=apple&clientVersion=9.4.0&st=1620995434000&sv=120&sign=34097d9beee66baf67d5c17f972388d6",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2238563%22%2C%20%22activityId%22%3A%20%2210315406%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2240984%22%7D&uuid=35b4f02ee07a4b25b2b3e87823efad0a&client=apple&clientVersion=9.4.0&st=1620995397000&sv=111&sign=14ba4b54d220d35c02c894aca25d87e1",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000076521%22%2C%20%22activityId%22%3A%20%2210364408%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000076521%22%7D&uuid=b2ded98340324f899deb1a3cbe3c954c&client=apple&clientVersion=9.4.0&st=1620995380000&sv=102&sign=867443c40fcd967428016acfd8394129",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000077584%22%2C%20%22activityId%22%3A%20%2210364005%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000077584%22%7D&uuid=356a99ccb26d4ced85f0514d218e68e1&client=apple&clientVersion=9.4.0&st=1620995344000&sv=120&sign=7e36faf6c2a47dc87cdf30d8fedf199c",
"https://api.m.jd.com/client.action?functionId=getJingBeanBalanceDetail&clientVersion=10.0.0&build=88366&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=10&screen=2175*1080&partner=jingdong&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidA95ac81217fs5ES4wF5VKR+qParHk2UIbPREuMZAq74uDDbSBRATipI+0NgM2uPyUj3E46KcxWVpA1H0fhHzJXmjnHTjLQQ9Xh0uuylzYERlNNEdK&sdkVersion=29&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJ8pqDs6Awc962CDQ%2FBa3BkoQQWuL6nMZ%2BvrV5Dj7vTiIWe3Q9HPWM8pCPq2%2FrzvY9P1nbE2MVtLGHxbIonFt5Igq%2FzTI%2B4UdJOeWIb3XCQLpiDaknn9p8mAaEFd6%2Byiy9zcTrwk5CbgKgZN588hkdH2ZNKWdFGRzSdJIvxVGE0cvaKXHblFwvLQ%3D%3D&uemps=0-0&st=1620998452502&sign=62caf4f8efb2530c0f2ad6c6facbe1e6&sv=101",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210087381%22%2C%20%22activityId%22%3A%20%2210319954%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210212498%22%7D&uuid=e7a09efef10b4618910341198b71a545&client=apple&clientVersion=9.4.0&st=1620995320000&sv=102&sign=1cf4754a844925439a17a0dd93211c00",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000079422%22%2C%20%22activityId%22%3A%20%2210346237%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000079422%22%7D&uuid=234080fd5ada40c68bd6c949be6a89b4&client=apple&clientVersion=9.4.0&st=1620995286000&sv=120&sign=8b96719341625ab0d8152b0d64811d61",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210087982%22%2C%20%22activityId%22%3A%20%2210332863%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210224646%22%7D&uuid=e961dbf540904da8ac475c4630d0822b&client=apple&clientVersion=9.4.0&st=1620995282000&sv=102&sign=47c12de9124668bf98486b6c30606dd0",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210234245%22%2C%20%22activityId%22%3A%20%2210349387%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210378777%22%7D&uuid=3bf3850d937f45a28864644715b6208c&client=apple&clientVersion=9.4.0&st=1620995271000&sv=120&sign=f14044f54e961a05bad291df1edf493a",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000080863%22%2C%20%22activityId%22%3A%20%2210344385%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000080863%22%7D&uuid=70e994f1c5174a7f84c517ae0c1fef96&client=apple&clientVersion=9.4.0&st=1620995242000&sv=111&sign=7f6711d06a69191230ef88cfe60ce19d",
"https://api.m.jd.com/client.action?functionId=switchConfig&clientVersion=10.0.0&build=88366&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=10&screen=2175*1080&partner=jingdong&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidA95ac81217fs5ES4wF5VKR+qParHk2UIbPREuMZAq74uDDbSBRATipI+0NgM2uPyUj3E46KcxWVpA1H0fhHzJXmjnHTjLQQ9Xh0uuylzYERlNNEdK&sdkVersion=29&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJ8pqDs6Awc962CDQ%2FBa3BkoQQWuL6nMZ%2BvrV5Dj7vTiIWe3Q9HPWM8pCPq2%2FrzvY9P1nbE2MVtLGHxbIonFt5Igq%2FzTI%2B4UdJOeWIb3XCQLpiDaknn9p8mAaEFd6%2Byiy9zcTrwk5CbgKgZN588hkdH2ZNKWdFGRzSdJIvxVGE0cvaKXHblFwvLQ%3D%3D&uemps=0-0&st=1620998451387&sign=a584af96eaf5d0651b72800c3893b289&sv=121",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210088959%22%2C%20%22activityId%22%3A%20%2210360178%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210220484%22%7D&uuid=8f1d366dce29494fa48f7753f5ff8f79&client=apple&clientVersion=9.4.0&st=1620995229000&sv=120&sign=ab2201d212c6e779a246ce26f4c72aab",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000081929%22%2C%20%22activityId%22%3A%20%2210345013%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000081929%22%7D&uuid=97af33c005a54369adcbf582012ee7f0&client=apple&clientVersion=9.4.0&st=1620995214000&sv=102&sign=65c8fd5f4495d265e65701610bf5008c",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000083262%22%2C%20%22activityId%22%3A%20%2210359029%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000083262%22%7D&uuid=5c89c77b6ba6486eb55f8a075995cb27&client=apple&clientVersion=9.4.0&st=1620995171000&sv=111&sign=2109bf4f735b1b49808c68d4bb965391",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000084052%22%2C%20%22activityId%22%3A%20%2210359334%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000084052%22%7D&uuid=c1ff3b45da5f49e6b5eb2e96d742d540&client=apple&clientVersion=9.4.0&st=1620995141000&sv=102&sign=607c6dfe9d83feb9548e90ff57e79eb5",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210090836%22%2C%20%22activityId%22%3A%20%2210349625%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210227338%22%7D&uuid=b4dbdbffa7d14cedaff10cbea6ae0194&client=apple&clientVersion=9.4.0&st=1620995117000&sv=102&sign=c10638bf10865dd75b74beb67f20898b",
"https://api.m.jd.com/client.action?functionId=newUserInfo&clientVersion=10.0.0&build=88366&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=10&screen=2175*1080&partner=jingdong&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidA95ac81217fs5ES4wF5VKR+qParHk2UIbPREuMZAq74uDDbSBRATipI+0NgM2uPyUj3E46KcxWVpA1H0fhHzJXmjnHTjLQQ9Xh0uuylzYERlNNEdK&sdkVersion=29&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJ8pqDs6Awc962CDQ%2FBa3BkoQQWuL6nMZ%2BvrV5Dj7vTiIWe3Q9HPWM8pCPq2%2FrzvY9P1nbE2MVtLGHxbIonFt5Igq%2FzTI%2B4UdJOeWIb3XCQLpiDaknn9p8mAaEFd6%2Byiy9zcTrwk5CbgKgZN588hkdH2ZNKWdFGRzSdJIvxVGE0cvaKXHblFwvLQ%3D%3D&uemps=0-0&st=1620998451389&sign=8d0bf4a16bcbfdd6e34384fcf002f05a&sv=102",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000086608%22%2C%20%22activityId%22%3A%20%2210351716%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000086608%22%7D&uuid=12f45af3dbca494a9559c6a157ab7d63&client=apple&clientVersion=9.4.0&st=1620995054000&sv=102&sign=cf50c617e9a5a48f34adb1c0bd52071e",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%22762678%22%2C%20%22activityId%22%3A%20%2210286688%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%22767131%22%7D&uuid=6e05c7feeccc4f9f878471ee995c4f4e&client=apple&clientVersion=9.4.0&st=1620995046000&sv=111&sign=c6864b49ab40705e2fffce2edfc74d5d",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210239423%22%2C%20%22activityId%22%3A%20%2210350065%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210385435%22%7D&uuid=28116a5aa7b54170927b56d42763aab0&client=apple&clientVersion=9.4.0&st=1620995043000&sv=102&sign=3779880f5623999565ccb72967b7c18d",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%22177256%22%2C%20%22activityId%22%3A%20%2210363183%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%22184046%22%7D&uuid=4fd10f9130ce4537a435e2dea47f3437&client=apple&clientVersion=9.4.0&st=1620995027000&sv=102&sign=5406eb5558f9b9e949eeae96ba05b3f2",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210239822%22%2C%20%22activityId%22%3A%20%2210345605%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210384639%22%7D&uuid=adba3306a9b948c6831b8b8110794fda&client=apple&clientVersion=9.4.0&st=1620995020000&sv=120&sign=ce8e652f79702a919871064bf6685f2f",
"https://api.m.jd.com/client.action?functionId=kvConfig&clientVersion=10.0.0&build=88366&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=10&screen=2175*1080&partner=jingdong&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidA95ac81217fs5ES4wF5VKR+qParHk2UIbPREuMZAq74uDDbSBRATipI+0NgM2uPyUj3E46KcxWVpA1H0fhHzJXmjnHTjLQQ9Xh0uuylzYERlNNEdK&sdkVersion=29&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJ8pqDs6Awc962CDQ%2FBa3BkoQQWuL6nMZ%2BvrV5Dj7vTiIWe3Q9HPWM8pCPq2%2FrzvY9P1nbE2MVtLGHxbIonFt5Igq%2FzTI%2B4UdJOeWIb3XCQLpiDaknn9p8mAaEFd6%2Byiy9zcTrwk5CbgKgZN588hkdH2ZNKWdFGRzSdJIvxVGE0cvaKXHblFwvLQ%3D%3D&uemps=0-0&st=1620998450528&sign=854d5db0844c242cc02ea02c6306b641&sv=120",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000088545%22%2C%20%22activityId%22%3A%20%2210320777%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000088545%22%7D&uuid=ae29fe8c744a4be59207a398abc20902&client=apple&clientVersion=9.4.0&st=1620994997000&sv=102&sign=e96c55a59b4f29ec02c9fb05e355d3ac",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%22109705%22%2C%20%22activityId%22%3A%20%2210347521%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%22112395%22%7D&uuid=911499757ebe4ce9b302770bc3865e8e&client=apple&clientVersion=9.4.0&st=1620994992000&sv=120&sign=b401bb6fcbe5dbccd03a2f6684aadc86",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%22109705%22%2C%20%22activityId%22%3A%20%2210347521%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%22112395%22%7D&uuid=911499757ebe4ce9b302770bc3865e8e&client=apple&clientVersion=9.4.0&st=1620994992000&sv=120&sign=b401bb6fcbe5dbccd03a2f6684aadc86",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210240302%22%2C%20%22activityId%22%3A%20%2210345596%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210388350%22%7D&uuid=2d59a369af6d4f85bdfaeba8b87617a9&client=apple&clientVersion=9.4.0&st=1620994990000&sv=120&sign=02ac3678165005516b7ac499f16e2f6b",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000090734%22%2C%20%22activityId%22%3A%20%2210339283%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000090734%22%7D&uuid=3345119c78c54b5c803f17cf28d778f7&client=apple&clientVersion=9.4.0&st=1620994911000&sv=111&sign=d8e2bf022bea9a6ade9c837f9854ff93",
"https://api.m.jd.com/client.action?functionId=getReactNativeVersion&clientVersion=10.0.0&build=88366&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=10&screen=2175*1080&partner=jingdong&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidA95ac81217fs5ES4wF5VKR+qParHk2UIbPREuMZAq74uDDbSBRATipI+0NgM2uPyUj3E46KcxWVpA1H0fhHzJXmjnHTjLQQ9Xh0uuylzYERlNNEdK&sdkVersion=29&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJ8pqDs6Awc962CDQ%2FBa3BkoQQWuL6nMZ%2BvrV5Dj7vTiIWe3Q9HPWM8pCPq2%2FrzvY9P1nbE2MVtLGHxbIonFt5Igq%2FzTI%2B4UdJOeWIb3XCQLpiDaknn9p8mAaEFd6%2Byiy9zcTrwk5CbgKgZN588hkdH2ZNKWdFGRzSdJIvxVGE0cvaKXHblFwvLQ%3D%3D&uemps=0-0&st=1620998450961&sign=f1ecd986eb24e04740cbafb2303bad1e&sv=101",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000090903%22%2C%20%22activityId%22%3A%20%2210361751%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000090903%22%7D&uuid=2781441ededf41b5a046fa7cc858ae0e&client=apple&clientVersion=9.4.0&st=1620994903000&sv=102&sign=409c44bc878fa85cc0e09f086f0df434",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000091230%22%2C%20%22activityId%22%3A%20%2210358627%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000091230%22%7D&uuid=7ee5b78a62b045d994af87ba51c76221&client=apple&clientVersion=9.4.0&st=1620994891000&sv=102&sign=0e3873bf2c3dd116dd508b8e5296335b",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000091843%22%2C%20%22activityId%22%3A%20%2210364030%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000091843%22%7D&uuid=f85124cb59ab440b92923f741b127c36&client=apple&clientVersion=9.4.0&st=1620994867000&sv=120&sign=611a13ac0049ac00c9522ea2cf293f64",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000091843%22%2C%20%22activityId%22%3A%20%2210364030%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000091843%22%7D&uuid=f85124cb59ab440b92923f741b127c36&client=apple&clientVersion=9.4.0&st=1620994867000&sv=120&sign=611a13ac0049ac00c9522ea2cf293f64",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210243725%22%2C%20%22activityId%22%3A%20%2210348489%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210384422%22%7D&uuid=79079c97a9f14a7d9f7ad928a84bfeb0&client=apple&clientVersion=9.4.0&st=1620994857000&sv=102&sign=7e39267259ba3501b36fcb52802cc6d5",
"https://api.m.jd.com/client.action?functionId=kvConfig&clientVersion=10.0.0&build=88366&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=10&screen=2175*1080&partner=jingdong&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidA95ac81217fs5ES4wF5VKR+qParHk2UIbPREuMZAq74uDDbSBRATipI+0NgM2uPyUj3E46KcxWVpA1H0fhHzJXmjnHTjLQQ9Xh0uuylzYERlNNEdK&sdkVersion=29&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJ8pqDs6Awc962CDQ%2FBa3BkoQQWuL6nMZ%2BvrV5Dj7vTiIWe3Q9HPWM8pCPq2%2FrzvY9P1nbE2MVtLGHxbIonFt5Igq%2FzTI%2B4UdJOeWIb3XCQLpiDaknn9p8mAaEFd6%2Byiy9zcTrwk5CbgKgZN588hkdH2ZNKWdFGRzSdJIvxVGE0cvaKXHblFwvLQ%3D%3D&uemps=0-0&st=1620998450529&sign=d5b7b82f0b174d64c66bbe4b764a1d67&sv=121",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210097259%22%2C%20%22activityId%22%3A%20%2210362360%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210235189%22%7D&uuid=f201963df60c48c49a42d6b0b8308936&client=apple&clientVersion=9.4.0&st=1620994813000&sv=102&sign=f242cdde6fdb460b5f4ff49b5cc72c1a",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000093065%22%2C%20%22activityId%22%3A%20%2210364123%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000093065%22%7D&uuid=a661ff9bd63549008cbdb0e9aeb8f1db&client=apple&clientVersion=9.4.0&st=1620994804000&sv=102&sign=b6a0208f909a3e693e41aa6d4994e431",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000093650%22%2C%20%22activityId%22%3A%20%2210322695%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000093650%22%7D&uuid=eaf7f581d92f4b9d8667d2365c755742&client=apple&clientVersion=9.4.0&st=1620994777000&sv=102&sign=8922015bc26e789dfc8af65c744a1c2d",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000093948%22%2C%20%22activityId%22%3A%20%2210358247%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000093948%22%7D&uuid=4b108610128c454da5c1d8ba176f6c70&client=apple&clientVersion=9.4.0&st=1620994760000&sv=120&sign=29cbd1a90e2d4f0aa431b307b95a6a0e",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000094033%22%2C%20%22activityId%22%3A%20%2210358968%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000094033%22%7D&uuid=6b17a8e57f9e4ae7a1cd0ee2bb2e1bd1&client=apple&clientVersion=9.4.0&st=1620994752000&sv=102&sign=831e6e579556df367e53f8f3df6252c8",
"https://api.m.jd.com/client.action?functionId=kvConfig&clientVersion=10.0.0&build=88366&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=10&screen=2175*1080&partner=jingdong&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidA95ac81217fs5ES4wF5VKR+qParHk2UIbPREuMZAq74uDDbSBRATipI+0NgM2uPyUj3E46KcxWVpA1H0fhHzJXmjnHTjLQQ9Xh0uuylzYERlNNEdK&sdkVersion=29&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJ8pqDs6Awc962CDQ%2FBa3BkoQQWuL6nMZ%2BvrV5Dj7vTiIWe3Q9HPWM8pCPq2%2FrzvY9P1nbE2MVtLGHxbIonFt5Igq%2FzTI%2B4UdJOeWIb3XCQLpiDaknn9p8mAaEFd6%2Byiy9zcTrwk5CbgKgZN588hkdH2ZNKWdFGRzSdJIvxVGE0cvaKXHblFwvLQ%3D%3D&uemps=0-0&st=1620998450539&sign=512e29b233fa329390545e36ebe46f91&sv=121",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210247849%22%2C%20%22activityId%22%3A%20%2210322133%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210392936%22%7D&uuid=0a84454b7fda42a485fc44a11fe49116&client=apple&clientVersion=9.4.0&st=1620994723000&sv=102&sign=3fa656c8f191de6bb09d815c82b29358",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000094782%22%2C%20%22activityId%22%3A%20%2210355416%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000094782%22%7D&uuid=39ec4f7d21bc4101923e644d1f4d2f12&client=apple&clientVersion=9.4.0&st=1620994722000&sv=102&sign=537022e442247a9c0d5e948ea5bd4cee",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%221000097686%22%2C%20%22activityId%22%3A%20%2210361785%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%221000097686%22%7D&uuid=e91c5df501a943399747453afe590092&client=apple&clientVersion=9.4.0&st=1620994657000&sv=120&sign=02b62424919988cca65b996048ecc828",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210250133%22%2C%20%22activityId%22%3A%20%2210355388%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210391901%22%7D&uuid=782fda9f23324a1f86481565870a4c4d&client=apple&clientVersion=9.4.0&st=1620994623000&sv=120&sign=5689380188e25ffff3dd5603ccf541e9",

"https://api.m.jd.com/client.action?functionId=drawShopGift&body=%7B%22follow%22%3A%200%2C%20%22shopId%22%3A%20%2210250195%22%2C%20%22activityId%22%3A%20%2210326290%22%2C%20%22sourceRpc%22%3A%20%22shop_app_home_window%22%2C%20%22venderId%22%3A%20%2210393826%22%7D&uuid=3950f973a30c4c8885051bd79a31dedb&client=apple&clientVersion=9.4.0&st=1620994618000&sv=120&sign=bfccfbbf6f6af2a8a40458839de4aacd",
]
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
const helpAuthor = true; // 是否帮助作者助力，false打开通知推送，true关闭通知推送
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/';
!(async () => {
  $.newShareCodes = []
//  await getAuthorShareCode();
 // await getAuthorShareCode2();

  for (let i = 0; i < cookiesArr.length; i++) {
//    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
    //  await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
  for (let k = 0; k < skks.length; k++) {
//    if (cookiesArr[k]) {
  //    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])

 //     cookie = cookiesArr[k];
      
      await gzld(skks[k])
//      if ($.newShareCodes.length > 1) {
      //  let code = $.newShareCodes[(i + 1) % $.newShareCodes.length]
       // await help(code[0], code[1])
    //  }
   
    //}
  }
      
      

      
//    }
  }
  

})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


function gzld(url) {
  return new Promise(resolve => {
    $.get({url: url,headers:{
       "cookie":cookie,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }}, async (err, resp, data) => {
      try {
        if (err) {
        } else {
          console.log(data)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
          resolve();
        }
    })
  })
}
function getAuthorShareCode2() {
  return new Promise(resolve => {
    $.get({url: "https://cdn.jsdelivr.net/gh/gitupdate/updateTeam@master/shareCodes/jd_updateBeanHome.json",headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }}, async (err, resp, data) => {
      try {
        if (err) {
        } else {
          if (safeGet(data)) {
            $.authorCode2 = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}



function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}