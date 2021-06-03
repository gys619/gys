

/*
京东神仙书院答题

修改自shylocks大神的脚本

活动时间:2021-1-27至2021-2-5
活动入口: 京东app-我的-神仙书院
活动地址：https://h5.m.jd.com//babelDiy//Zeus//4XjemYYyPScjmGyjej78M6nsjZvj//index.html?babelChannel=ttt9
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#京东神仙书院答题
10 8 * * * https://raw.githubusercontent.com/monk-coder/dust/dust/i-chenzhe/jd_dati.js, tag=京东神仙书院答题, img-url=https://raw.githubusercontent.com/Orz-3/task/master/jd.png, enabled=true
================Loon==============
[Script]
cron "10 8 * * *" script-path=https://raw.githubusercontent.com/monk-coder/dust/dust/i-chenzhe/jd_dati.js,tag=京东神仙书院答题
===============Surge=================
京东神仙书院答题 = type=cron,cronexp="20 8 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/monk-coder/dust/dust/i-chenzhe/jd_dati.js
============小火箭=========
京东神仙书院答题 = type=cron,script-path=https://raw.githubusercontent.com/monk-coder/dust/dust/i-chenzhe/jd_dati.js, cronexpr="20 8 * * *", timeout=3600, enable=true
 */
const $ = new Env('京东神仙书院答题');

const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
    let cookiesData = $.getdata('CookiesJD') || "[]";
    cookiesData = jsonParse(cookiesData);
    cookiesArr = cookiesData.map(item => item.cookie);
    cookiesArr.reverse();
    cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
    cookiesArr.reverse();
    cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';

!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            message = '';
            await TotalBean();
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });

                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }
            await jdImmortalAnswer()
        }
    }
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })

async function jdImmortalAnswer() {
    try {
        $.risk = false
        $.earn = 0
        await getHomeData()
        if ($.risk) return
        for (let i = 0; i < 15; i++) {
            if ($.coin > 100) {
                await getQuestions()
                await $.wait(2 * 1000)
            }
        }
        await exchange();
        await showMsg()
    } catch (e) {
        $.logErr(e)
    }
}

function getHomeData(info = false) {
    return new Promise((resolve) => {
        $.post(taskPostUrl('mcxhd_brandcity_homePage'), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data && data['retCode'] === "200") {
                        const { userCoinNum } = data.result
                        if (info) {
                            $.earn = userCoinNum - $.coin
                        } else {

                            console.log(`当前用户金币${userCoinNum}`)
                        }
                        $.coin = userCoinNum
                    } else {
                        $.risk = true
                        console.log(`账号被风控，无法参与活动`)
                        message += `账号被风控，无法参与活动\n`
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        })
    })
}

function exchange() {
    return new Promise(resolve => {
        $.get(taskUrl('mcxhd_brandcity_exchange'), (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.retCode === '200') {
                        console.log(`本次活动共获取积分 ${data.result.consumedUserScore}\n兑换倍数为 ${data.result.userGrade.exchageRate}\n最终获得京豆 ${data.result.receivedJbeanNum}个`)
                    } else {
                        console.log(data.retMessage);
                    }
                }
            } catch (e) {
                console.log(e)
            } finally {
                resolve();
            }
        })
    })
}

function showMsg() {
    return new Promise(resolve => {
        message += `本次运行获得${$.earn}积分`
        if (!jdNotify) {
            $.msg($.name, '', `${message}`);
        } else {
            $.log(`京东账号${$.index}${$.nickName}\n${message}`);
        }
        resolve()
    })
}

function getQuestions() {
    return new Promise((resolve) => {
        $.get(taskUrl('mcxhd_brandcity_getQuestions'), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data) {
                        switch (data['retCode']) {
                            case "200":
                                console.log(`答题开启成功`)
                                $.coin = $.coin - 100;
                                let i = 0, questionList = []
                                for (let vo of data.result.questionList) {
                                    $.question = vo
                                    console.log(`去查询第${++i}题：【${vo.questionStem}】`)
                                    $.zhe_optionId = null;
                                    await getAnswer(vo.questionId);
                                    if ($.zhe_optionId === null) {
                                        $.zhe_optionId = vo.options[1].optionId;
                                        $.zhe_optionDesc = vo.options[1].optionDesc;
                                    }
                                    await $.wait(2 * 1000)
                                    let b = {
                                        "questionToken": vo.questionToken,
                                        "optionId": $.zhe_optionId,
                                        "optionDesc": $.zhe_optionDesc,
                                        "questionId": vo.questionId,
                                        "questionStem": vo.questionStem,
                                    }
                                    await answer(b)
                                }
                                break;
                            case "325":
                                console.log(data['retMessage']);
                                $.coin = 0;
                                break;
                            case "326":
                                console.log(data['retMessage']);
                                $.coin = 0;
                                break;
                            default:
                                console.log(data);
                                break;
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        })
    })
}


function answer(body = {}) {
    let b = {
        "questionToken": body.questionToken,
        "optionId": body.optionId
    }
    return new Promise((resolve) => {
        $.get(taskUrl('mcxhd_brandcity_answerQuestion', { "costTime": 1, ...b }), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data && data['retCode'] === "200") {
                        if (data.result.isCorrect) {
                            console.log(`您选对啦！获得积分${data.result.score}，本次答题共计获得${data.result.totalScore}分`)
                            $.earn += parseInt(data.result.score)
                            $.question = {
                                ...$.question,
                                correct: $.option
                            }
                            let q = {
                                "optionId": body.optionId,
                                "optionDesc": body.optionDesc,
                                "questionId": body.questionId,
                                "questionStem": body.questionStem,
                            }
                            await newQuestion(q);
                        } else {
                            let correct = $.question.options.filter(vo => vo.optionId === data.result.correctOptionId)[0]
                            console.log(`您选错啦～正确答案是：${correct.optionDesc}`)
                            $.question = {
                                ...$.question,
                                correct: correct
                            }
                            q = {
                                "optionId": correct.optionId,
                                "optionDesc": correct.optionDesc,
                                "questionId": body.questionId,
                                "questionStem": body.questionStem,
                            }
                            await newQuestion(q);
                        }
                        if (data.result.isLastQuestion) {
                            console.log(`答题完成`)
                        }
                    } else {
                        console.log(`答题失败`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        })
    })
}


function getAnswer(params) {
    return new Promise(resolve => {
        $.get({
            url: `https://api.r2ray.com/jd.question/index?questionId=${params}`
        }, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                } else {
                    data = JSON.parse(data);
                    if (data.resCode === 200) {
                        console.log(`Nice!在题库中找到了正确的答案：${data.data.optionDesc}\n`)
                        $.zhe_optionId = data.data.optionId;
                        $.zhe_optionDesc = data.data.optionDesc;
                    } else {
                        console.log('题库中没有找到对应的答案。');
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve();
            }
        })
    })
}

function newQuestion(params) {
    let opt = {
        'url': 'https://api.r2ray.com/jd.question/addorupdate',
        'headers': {
            'Content-Type': 'application/json',
        },
        'body': JSON.stringify(params),
    }
    return new Promise(resolve => {
        $.post(opt, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                } else {
                    data = JSON.parse(data)
                    console.log(data.msg)
                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve();
            }
        })
    })
}

function taskUrl(function_id, body = {}, function_id2) {
    body = { "token": 'jd17919499fb7031e5', ...body }
    return {
        url: `${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0&appid=publicUseApi&t=${new Date().getTime()}&sid=&uuid=&area=&networkType=wifi`,
        headers: {
            "Cookie": cookie,
            'Accept': "application/json, text/plain, */*",
            'Accept-Language': 'zh-cn',
            "origin": "https://h5.m.jd.com",
            "referer": "https://h5.m.jd.com/babelDiy/Zeus/4XjemYYyPScjmGyjej78M6nsjZvj/index.html",
            'Content-Type': 'application/x-www-form-urlencoded',
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
        }
    }
}

function taskPostUrl(function_id, body = {}, function_id2) {
    let url = `${JD_API_HOST}`;
    if (function_id2) {
        url += `?functionId=${function_id2}`;
    }
    body = { ...body, "token": 'jd17919499fb7031e5' }
    return {
        url,
        body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0&appid=publicUseApi`,
        headers: {
            "Cookie": cookie,
            "origin": "https://h5.m.jd.com",
            "referer": "https://h5.m.jd.com/",
            'Content-Type': 'application/x-www-form-urlencoded',
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
        }
    }
}

function TotalBean() {
    return new Promise(async resolve => {
        const options = {
            "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
            "headers": {
                "Accept": "application/json,text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": cookie,
                "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['retcode'] === 13) {
                            $.isLogin = false; //cookie过期
                            return
                        }
                        $.nickName = data['base'].nickname;
                    } else {
                        console.log(`京东服务器返回空数据`)
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
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
