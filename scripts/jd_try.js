/*
update 2021/6/7
�������ã��ű����µ�ַ https://raw.githubusercontent.com/ZCY01/daily_scripts/main/jd/jd_try.js
�ű�����: QuantumultX, Node.js

?? �ǳ���ʱ�Ľű���
ÿ������ע300���̵꣬���û��̵��ע����Ϊ500����
�����ȡ�ؽű����ã�ʹ�� jd_unsubscribe.js ��ǰȡ������250���̵�ȷ���������ýű��������С�
==========================Quantumultx=========================
[task_local]
# ȡ�ؾ���������Ʒ������ boxjs �޸�ȡ����ע��������
5 10 * * * https://raw.githubusercontent.com/lxk0301/jd_scripts/master/jd_unsubscribe.js, tag=ȡ�ؾ���������Ʒ, enabled=true

# ��������
30 10 * * * https://raw.githubusercontent.com/ZCY01/daily_scripts/main/jd/jd_try.js, tag=��������, img-url=https://raw.githubusercontent.com/ZCY01/img/master/jdtryv1.png, enabled=true
 */
const $ = new Env('��������')

const selfDomain = 'https://try.m.jd.com'
let allGoodList = []
let notifyMsg = ''

// default params
const args = {
	// �Ƿ�֪ͨ
	jdNotify: false,
	// ÿ�λ�ȡ��Ʒ����
	pageSize: 12,
	// ������������
	cidsList: ["���õ���", "�ֻ�����", "���԰칫", "�ҾӼ�װ"],
	// ��������
	typeList: ["��ͨ����", "��������"],
	// ��Ʒ���˹ؼ���
	goodFilters: "�̳�@���@Ӣ��@����@��ѵ".split('@'),
	// ��Ʒ��ͼ۸�
	minPrice: 0,
	// ��Ʒ�ṩ��������
	maxSupplyCount: 10,
	// ��Ʒ����֮��ļ��, ��λ�����룬������[applyInterval, applyInterval+2000]
	applyInterval: 5000
}

const cidsMap = {
	"ȫ����Ʒ": "0",
	"���õ���": "737",
	"�ֻ�����": "652,9987",
	"���԰칫": "670",
	"�ҾӼ�װ": "1620,6728,9847,9855,6196,15248,14065",
	"��ױ����": "1316",
	"����Ь��": "1315,1672,1318,11729",
	"ĸӤ���": "1319,6233",
	"������ʳ": "12218",
	"ͼ������": "1713,4051,4052,4053,7191,7192,5272",
	"�ӱ���Ʒ": "5025,6144",
	"���˻���": "16750",
	"��ͥ���": "15901",
	"ʳƷ����": "1320,12259",
	"���ྪϲ": "4938,13314,6994,9192,12473,6196,5272,12379,13678,15083,15126,15980",
}
const typeMap = {
	"ȫ������": "0",
	"��ͨ����": "1",
	"��������": "3",
	"30������": "5",
}

!(async () => {
	await requireConfig()
	if (!$.cookiesArr[0]) {
		$.msg($.name, '����ʾ�����Ȼ�ȡ�����˺�һcookie\nֱ��ʹ��NobyDa�ľ���ǩ����ȡ', 'https://bean.m.jd.com/', {
			"open-url": "https://bean.m.jd.com/"
		})
		return
	}
	for (let i = 0; i < $.cookiesArr.length; i++) {
		if ($.cookiesArr[i]) {
			$.cookie = $.cookiesArr[i];
			$.UserName = decodeURIComponent($.cookie.match(/pt_pin=(.+?);/) && $.cookie.match(/pt_pin=(.+?);/)[1])
			$.index = i + 1;
			$.isLogin = true;
			$.nickName = '';
			await totalBean();
			console.log(`\n��ʼ�������˺�${$.index}��${$.nickName || $.UserName}\n`);
			if (!$.isLogin) {
				$.msg($.name, `����ʾ��cookie��ʧЧ`, `�����˺�${$.index} ${$.nickName || $.UserName}\n�����µ�¼��ȡ\nhttps://bean.m.jd.com/bean/signIndex.action`, {
					"open-url": "https://bean.m.jd.com/bean/signIndex.action"
				});
				await $.notify.sendNotify(`${$.name}cookie��ʧЧ - ${$.UserName}`, `�����˺�${$.index} ${$.UserName}\n�����µ�¼��ȡcookie`);
				continue
			}

			$.goodList = []
			$.successList = []
			if (allGoodList.length == 0) {
				await getGoodList()
				filterGoodList()
			}
			await getApplyStateByActivityIds()

			$.totalTry = 0
			$.totalGoods = $.goodList.length
			await tryGoodList()
			await getSuccessList()

			await showMsg()
		}
	}
	await $.notify.sendNotify(`${$.name}`, notifyMsg);
})()
	.catch((e) => {
		console.log(`?? ${$.name} ���д���\n${e}`)
	}).finally(() => $.done())

function requireConfig() {
	return new Promise(resolve => {
		console.log('��ʼ��ȡ�����ļ�\n')
		$.notify = $.isNode() ? require('./sendNotify') : { sendNotify: async () => { } }

		//��ȡ Cookies
		$.cookiesArr = []
		if ($.isNode()) {
			//Node.js�û�����jdCookie.js����д����ck;
			const jdCookieNode = require('./jdCookie.js');
			Object.keys(jdCookieNode).forEach((item) => {
				if (jdCookieNode[item]) {
					$.cookiesArr.push(jdCookieNode[item])
				}
			})
			if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
		} else {
			//IOS���û�ֱ����NobyDa��jd $.cookie
			$.cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
		}
		console.log(`��${$.cookiesArr.length}�������˺�\n`)

		if ($.isNode()) {
			if (process.env.JD_TRY_CIDS_KEYS) {
				args.cidsList = process.env.JD_TRY_CIDS_KEYS.split('@').filter(key => {
					return Object.keys(cidsMap).includes(key)
				})
			}
			if (process.env.JD_TRY_TYPE_KEYS) {
				args.typeList = process.env.JD_TRY_TYPE_KEYS.split('@').filter(key => {
					return Object.keys(typeMap).includes(key)
				})
			}
			if (process.env.JD_TRY_GOOD_FILTERS) {
				args.goodFilters = process.env.JD_TRY_GOOD_FILTERS.split('@')
			}
			if (process.env.JD_TRY_MIN_PRICE) {
				args.minPrice = process.env.JD_TRY_MIN_PRICE * 1
			}
			if (process.env.JD_TRY_PAGE_SIZE) {
				args.pageSize = process.env.JD_TRY_PAGE_SIZE * 1
			}
			if (process.env.JD_TRY_MAX_SUPPLY_COUNT) {
				args.maxSupplyCount = process.env.JD_TRY_MAX_SUPPLY_COUNT * 1
			}
		} else {
			let qxCidsList = []
			let qxTypeList = []
			const cidsKeys = Object.keys(cidsMap)
			const typeKeys = Object.keys(typeMap)
			for (let key of cidsKeys) {
				const open = $.getdata(key)
				if (open == 'true') qxCidsList.push(key)
			}
			for (let key of typeKeys) {
				const open = $.getdata(key)
				if (open == 'true') qxTypeList.push(key)
			}
			if (qxCidsList.length != 0) args.cidsList = qxCidsList
			if (qxTypeList.length != 0) args.typeList = qxTypeList
			if ($.getdata('filter')) args.goodFilters = $.getdata('filter').split('@')
			if ($.getdata('min_price')) args.minPrice = Number($.getdata('min_price'))
			if ($.getdata('page_size')) args.pageSize = Number($.getdata('page_size'))
			if ($.getdata('max_supply_count')) args.maxSupplyCount = Number($.getdata('max_supply_count'))
			if (args.pageSize == 0) args.pageSize = 12
		}
		resolve()
	})
}

function getGoodListByCond(cids, page, pageSize, type, state) {
	return new Promise((resolve, reject) => {
		let option = taskurl(`${selfDomain}/activity/list?pb=1&cids=${cids}&page=${page}&pageSize=${pageSize}&type=${type}&state=${state}`)
		delete option.headers['Cookie']
		$.get(option, (err, resp, data) => {
			try {
				if (err) {
					console.log(`?? ${arguments.callee.name.toString()} API����ʧ�ܣ�������·\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					if (data.success) {
						$.totalPages = data.data.pages
						allGoodList = allGoodList.concat(data.data.data)
					} else {
						console.log(`?? ��� ${cids} ${page} �б�ʧ��: ${data.message}`)
					}
				}
			} catch (e) {
				reject(`?? ${arguments.callee.name.toString()} API���ؽ����������\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve()
			}
		})
	})
}

async function getGoodList() {
	if (args.cidsList.length === 0) args.cidsList.push("ȫ����Ʒ")
	if (args.typeList.length === 0) args.typeList.push("ȫ������")
	for (let cidsKey of args.cidsList) {
		for (let typeKey of args.typeList) {
			if (!cidsMap.hasOwnProperty(cidsKey) || !typeMap.hasOwnProperty(typeKey)) continue
			console.log(`? ��ȡ ${cidsKey} ${typeKey} ��Ʒ�б�`)
			$.totalPages = 1
			for (let page = 1; page <= $.totalPages; page++) {
				await getGoodListByCond(cidsMap[cidsKey], page, args.pageSize, typeMap[typeKey], '0')
			}
		}
	}
}

function filterGoodList() {
	console.log(`? ������Ʒ�б���ǰ����${allGoodList.length}����Ʒ`)
	const now = Date.now()
	const oneMoreDay = now + 2 * 24 * 60 * 60 * 1000
	allGoodList = allGoodList.filter(good => {
		// 1. good ������
		// 2. good �����������10min
		// 3. good �Ľ���ʱ���������
		// 4. good �ļ۸�С����С������
		// 5. good �������������� maxSupplyCount, ��Ϊ������Ʒ
		if (!good || good.endTime < now + 10 * 60 * 1000 || good.endTime > oneMoreDay || good.jdPrice < args.minPrice) {
			return false
		}
		for (let item of args.goodFilters) {
			if (good.trialName.indexOf(item) != -1) return false
		}
		if (good.supplyCount > args.maxSupplyCount) {
			return false
		}
		return true
	})
	allGoodList = allGoodList.sort((a, b) => {
		let endDayA = Math.trunc(a.endTime / (1000 * 3600 * 24))
		let endDayB = Math.trunc(b.endTime / (1000 * 3600 * 24))
		if (endDayA != endDayB) {
			return endDayB - endDayA
		}
		if (a.activityType != b.activityType) {
			return b.activityType - a.activityType
		}
		return b.jdPrice - a.jdPrice
	})
}

async function getApplyStateByActivityIds() {
	function opt(list) {
		let ids = []
		list.forEach(good => ids.push(good.id))
		return new Promise((resolve, reject) => {
			$.get(taskurl(`${selfDomain}/getApplyStateByActivityIds?activityIds=${ids.join(',')}`), (err, resp, data) => {
				try {
					if (err) {
						console.log(`?? ${arguments.callee.name.toString()} API����ʧ�ܣ�������·\n${JSON.stringify(err)}`)
					} else {
						data = JSON.parse(data)
						ids.length = 0
						for (let apply of data) ids.push(apply.activityId)
					}
				} catch (e) {
					reject(`?? ${arguments.callee.name.toString()} API���ؽ����������\n${e}\n${JSON.stringify(data)}`)
				} finally {
					resolve(ids)
				}
			})
		})
	}

	$.goodList = []
	for (let start = 0, end = args.pageSize; start < allGoodList.length; start = end, end += args.pageSize) {
		let list = allGoodList.slice(start, end)
		let applied = await opt(list)
		$.goodList = $.goodList.concat(list.filter(good => {
			for (let id of applied) {
				if (id == good.id) {
					return false
				}
			}
			return true
		}))
		if ($.goodList.length >= 350) break
	}
}

function canTry(good) {
	return new Promise((resolve, reject) => {
		let ret = false
		$.get(taskurl(`${selfDomain}/activity?id=${good.id}`), (err, resp, data) => {
			try {
				if (err) {
					console.log(`?? ${arguments.callee.name.toString()} API����ʧ�ܣ�������·\n${JSON.stringify(err)}`)
				} else {
					ret = data.indexOf('trySku') != -1
					let result = data.match(/"shopId":(\d+)/)
					if (result) {
						good.shopId = eval(result[1])
					}
				}
			} catch (e) {
				reject(`?? ${arguments.callee.name.toString()} API���ؽ����������\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve(ret)
			}
		})
	})
}

function isFollowed(good) {
	return new Promise((resolve, reject) => {
		$.get(taskurl(`${selfDomain}/isFollowed?id=${good.shopId}`, good.id), (err, resp, data) => {
			try {
				if (err) {
					console.log(`?? ${arguments.callee.name.toString()} API����ʧ�ܣ�������·\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					resolve(data.success && data.data)
				}
			} catch (e) {
				reject(`?? ${arguments.callee.name.toString()} API���ؽ����������\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve(false)
			}
		})
	})
}

function followShop(good) {
	return new Promise((resolve, reject) => {
		$.get(taskurl(`${selfDomain}/followShop?id=${good.shopId}`, good.id), (err, resp, data) => {
			try {
				if (err) {
					console.log(`?? ${arguments.callee.name.toString()} API����ʧ�ܣ�������·\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					if (data.code == 'F0410') {
						$.running = false
						$.stopMsg = data.msg || "��ע������������Ŷ~�������¹�ע�б��"
					}
					resolve(data.success && data.data)
				}
			} catch (e) {
				reject(`?? ${arguments.callee.name.toString()} API���ؽ����������\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve(false)
			}
		})
	})
}

async function tryGoodList() {
	console.log(`? �������� ${$.goodList.length} ����Ʒ`)
	$.running = true
	$.stopMsg = '�������'
	for (let i = 0; i < $.goodList.length && $.running; i++) {
		let good = $.goodList[i]
		if (!await canTry(good)) continue
		// ���û�й�ע�ҹ�עʧ��
		if (good.shopId && !await isFollowed(good) && !await followShop(good)) continue
		// ��������������̫�̣���������������ȷ�� follwShop ���
		await $.wait(Math.floor(Math.random() * 2000 + args.applyInterval))
		// ��ע��ϣ���������
		await doTry(good)
	}
}

async function doTry(good) {
	return new Promise((resolve, reject) => {
		$.get(taskurl(`${selfDomain}/migrate/apply?activityId=${good.id}&source=1&_s=m`, good.id), (err, resp, data) => {
			try {
				if (err) {
					console.log(`?? ${arguments.callee.name.toString()} API����ʧ�ܣ�������·\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					if (data.success) {
						$.totalTry += 1
						console.log(`?? ${good.id} ??${good.trialName.substr(0, 15)}?? ${data.message}`)
					} else if (data.code == '-131') { // ÿ��300����Ʒ
						$.stopMsg = data.message
						$.running = false
					} else {
						console.log(`?? ${good.id} ??${good.trialName.substr(0, 15)}?? ${JSON.stringify(data)}`)
					}
				}
			} catch (e) {
				reject(`?? ${arguments.callee.name.toString()} API���ؽ����������\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve()
			}
		})
	})
}

async function getSuccessList() {
	// һҳ12����Ʒ������ɲ���ɣ���������һ�����н�12����Ʒ�ɣ���??
	return new Promise((resolve, reject) => {
		const option = {
			url: `https://try.jd.com/my/tryList?selected=2&page=1&tryVersion=2&_s=m`,
			headers: {
				'Host': 'try.jd.com',
				'Connection': 'keep-alive',
				'UserAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
				'Accept': '*/*',
				'Referer': 'https://try.m.jd.com/',
				'Accept-Encoding': 'gzip, deflate, br',
				'Accept-Language': 'zh,zh-CN;q=0.9,en;q=0.8',
				'Cookie': $.cookie
			}
		}
		$.get(option, (err, resp, data) => {
			try {
				if (err) {
					console.log(`?? ${arguments.callee.name.toString()} API����ʧ�ܣ�������·\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					if (data.success && data.data) {
						$.successList = data.data.data.filter(item => {
							return item.text.text.indexOf('�뾡����ȡ') != -1
						})
					} else {
						console.log(`?? ��óɹ��б�ʧ��: ${data.message}`)
					}
				}
			} catch (e) {
				reject(`?? ${arguments.callee.name.toString()} API���ؽ����������\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve()
			}
		})
	})
}

async function showMsg() {
	let message = `�����˺�${$.index} ${$.nickName || $.UserName}\n?? �������룺${$.totalTry}/${$.totalGoods}����Ʒ??\n?? ${$.successList.length}����Ʒ����ȡ??\n?? ����ԭ��${$.stopMsg}`
	if (!args.jdNotify || args.jdNotify === 'false') {
		$.msg($.name, ``, message, {
			"open-url": 'https://try.m.jd.com/user'
		})
		if ($.isNode())
			notifyMsg += `${message}\n\n`
	} else {
		console.log(message)
	}
}

function taskurl(url, goodId) {
	return {
		'url': url,
		'headers': {
			'Host': 'try.m.jd.com',
			'Accept-Encoding': 'gzip, deflate, br',
			'Cookie': $.cookie,
			'Connection': 'keep-alive',
			'Accept': '*/*',
			'UserAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
			'Accept-Language': 'zh-cn',
			'Referer': goodId ? `https://try.m.jd.com/activity/?id=${goodId}` : undefined
		},
	}
}

function totalBean() {
	return new Promise(async resolve => {
		const options = {
			"url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
			"headers": {
				"Accept": "application/json,text/plain, */*",
				"Content-Type": "application/x-www-form-urlencoded",
				"Accept-Encoding": "gzip, deflate, br",
				"Accept-Language": "zh-cn",
				"Connection": "keep-alive",
				"Cookie": $.cookie,
				"Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
				"User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
			},
			"timeout": 10000,
		}
		$.post(options, (err, resp, data) => {
			try {
				if (err) {
					console.log(`${JSON.stringify(err)}`)
					console.log(`${$.name} API����ʧ�ܣ�������·����`)
				} else {
					if (data) {
						data = JSON.parse(data);
						if (data['retcode'] === 13) {
							$.isLogin = false; //cookie����
							return
						}
						if (data['retcode'] === 0) {
							$.nickName = (data['base'] && data['base'].nickname) || $.UserName;
						} else {
							$.nickName = $.UserName
						}
					} else {
						console.log(`�������������ؿ�����`)
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

function jsonParse(str) {
	if (typeof str == "string") {
		try {
			return JSON.parse(str);
		} catch (e) {
			console.log(e);
			$.msg($.name, '', '����������BoxJs������޸�����\n����ͨ���ű�ȥ��ȡcookie')
			return [];
		}
	}
}

// ���� @chavyleung ����
// https://raw.githubusercontent.com/chavyleung/scripts/master/Env.js
function Env(name, opts) {
	class Http {
		constructor(env) {
			this.env = env
		}

		send(opts, method = 'GET') {
			opts = typeof opts === 'string' ? {
				url: opts
			} : opts
			let sender = this.get
			if (method === 'POST') {
				sender = this.post
			}
			return new Promise((resolve, reject) => {
				sender.call(this, opts, (err, resp, body) => {
					if (err) reject(err)
					else resolve(resp)
				})
			})
		}

		get(opts) {
			return this.send.call(this.env, opts)
		}

		post(opts) {
			return this.send.call(this.env, opts, 'POST')
		}
	}

	return new (class {
		constructor(name, opts) {
			this.name = name
			this.http = new Http(this)
			this.data = null
			this.dataFile = 'box.dat'
			this.logs = []
			this.isMute = false
			this.isNeedRewrite = false
			this.logSeparator = '\n'
			this.startTime = new Date().getTime()
			Object.assign(this, opts)
			this.log('', `??${this.name}, ��ʼ!`)
		}

		isNode() {
			return 'undefined' !== typeof module && !!module.exports
		}

		isQuanX() {
			return 'undefined' !== typeof $task
		}

		isSurge() {
			return 'undefined' !== typeof $httpClient && 'undefined' === typeof $loon
		}

		isLoon() {
			return 'undefined' !== typeof $loon
		}

		toObj(str, defaultValue = null) {
			try {
				return JSON.parse(str)
			} catch {
				return defaultValue
			}
		}

		toStr(obj, defaultValue = null) {
			try {
				return JSON.stringify(obj)
			} catch {
				return defaultValue
			}
		}

		getjson(key, defaultValue) {
			let json = defaultValue
			const val = this.getdata(key)
			if (val) {
				try {
					json = JSON.parse(this.getdata(key))
				} catch { }
			}
			return json
		}

		setjson(val, key) {
			try {
				return this.setdata(JSON.stringify(val), key)
			} catch {
				return false
			}
		}

		getScript(url) {
			return new Promise((resolve) => {
				this.get({
					url
				}, (err, resp, body) => resolve(body))
			})
		}

		runScript(script, runOpts) {
			return new Promise((resolve) => {
				let httpapi = this.getdata('@chavy_boxjs_userCfgs.httpapi')
				httpapi = httpapi ? httpapi.replace(/\n/g, '').trim() : httpapi
				let httpapi_timeout = this.getdata('@chavy_boxjs_userCfgs.httpapi_timeout')
				httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20
				httpapi_timeout = runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout
				const [key, addr] = httpapi.split('@')
				const opts = {
					url: `http://${addr}/v1/scripting/evaluate`,
					body: {
						script_text: script,
						mock_type: 'cron',
						timeout: httpapi_timeout
					},
					headers: {
						'X-Key': key,
						'Accept': '*/*'
					}
				}
				this.post(opts, (err, resp, body) => resolve(body))
			}).catch((e) => this.logErr(e))
		}

		loaddata() {
			if (this.isNode()) {
				this.fs = this.fs ? this.fs : require('fs')
				this.path = this.path ? this.path : require('path')
				const curDirDataFilePath = this.path.resolve(this.dataFile)
				const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
				const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
				const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
				if (isCurDirDataFile || isRootDirDataFile) {
					const datPath = isCurDirDataFile ? curDirDataFilePath : rootDirDataFilePath
					try {
						return JSON.parse(this.fs.readFileSync(datPath))
					} catch (e) {
						return {}
					}
				} else return {}
			} else return {}
		}

		writedata() {
			if (this.isNode()) {
				this.fs = this.fs ? this.fs : require('fs')
				this.path = this.path ? this.path : require('path')
				const curDirDataFilePath = this.path.resolve(this.dataFile)
				const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
				const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
				const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
				const jsondata = JSON.stringify(this.data)
				if (isCurDirDataFile) {
					this.fs.writeFileSync(curDirDataFilePath, jsondata)
				} else if (isRootDirDataFile) {
					this.fs.writeFileSync(rootDirDataFilePath, jsondata)
				} else {
					this.fs.writeFileSync(curDirDataFilePath, jsondata)
				}
			}
		}

		lodash_get(source, path, defaultValue = undefined) {
			const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
			let result = source
			for (const p of paths) {
				result = Object(result)[p]
				if (result === undefined) {
					return defaultValue
				}
			}
			return result
		}

		lodash_set(obj, path, value) {
			if (Object(obj) !== obj) return obj
			if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []
			path
				.slice(0, -1)
				.reduce((a, c, i) => (Object(a[c]) === a[c] ? a[c] : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {})), obj)[
				path[path.length - 1]
			] = value
			return obj
		}

		getdata(key) {
			let val = this.getval(key)
			// ����� @
			if (/^@/.test(key)) {
				const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
				const objval = objkey ? this.getval(objkey) : ''
				if (objval) {
					try {
						const objedval = JSON.parse(objval)
						val = objedval ? this.lodash_get(objedval, paths, '') : val
					} catch (e) {
						val = ''
					}
				}
			}
			return val
		}

		setdata(val, key) {
			let issuc = false
			if (/^@/.test(key)) {
				const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
				const objdat = this.getval(objkey)
				const objval = objkey ? (objdat === 'null' ? null : objdat || '{}') : '{}'
				try {
					const objedval = JSON.parse(objval)
					this.lodash_set(objedval, paths, val)
					issuc = this.setval(JSON.stringify(objedval), objkey)
				} catch (e) {
					const objedval = {}
					this.lodash_set(objedval, paths, val)
					issuc = this.setval(JSON.stringify(objedval), objkey)
				}
			} else {
				issuc = this.setval(val, key)
			}
			return issuc
		}

		getval(key) {
			if (this.isSurge() || this.isLoon()) {
				return $persistentStore.read(key)
			} else if (this.isQuanX()) {
				return $prefs.valueForKey(key)
			} else if (this.isNode()) {
				this.data = this.loaddata()
				return this.data[key]
			} else {
				return (this.data && this.data[key]) || null
			}
		}

		setval(val, key) {
			if (this.isSurge() || this.isLoon()) {
				return $persistentStore.write(val, key)
			} else if (this.isQuanX()) {
				return $prefs.setValueForKey(val, key)
			} else if (this.isNode()) {
				this.data = this.loaddata()
				this.data[key] = val
				this.writedata()
				return true
			} else {
				return (this.data && this.data[key]) || null
			}
		}

		initGotEnv(opts) {
			this.got = this.got ? this.got : require('got')
			this.cktough = this.cktough ? this.cktough : require('tough-cookie')
			this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()
			if (opts) {
				opts.headers = opts.headers ? opts.headers : {}
				if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
					opts.cookieJar = this.ckjar
				}
			}
		}

		get(opts, callback = () => { }) {
			if (opts.headers) {
				delete opts.headers['Content-Type']
				delete opts.headers['Content-Length']
			}
			if (this.isSurge() || this.isLoon()) {
				if (this.isSurge() && this.isNeedRewrite) {
					opts.headers = opts.headers || {}
					Object.assign(opts.headers, {
						'X-Surge-Skip-Scripting': false
					})
				}
				$httpClient.get(opts, (err, resp, body) => {
					if (!err && resp) {
						resp.body = body
						resp.statusCode = resp.status
					}
					callback(err, resp, body)
				})
			} else if (this.isQuanX()) {
				if (this.isNeedRewrite) {
					opts.opts = opts.opts || {}
					Object.assign(opts.opts, {
						hints: false
					})
				}
				$task.fetch(opts).then(
					(resp) => {
						const {
							statusCode: status,
							statusCode,
							headers,
							body
						} = resp
						callback(null, {
							status,
							statusCode,
							headers,
							body
						}, body)
					},
					(err) => callback(err)
				)
			} else if (this.isNode()) {
				this.initGotEnv(opts)
				this.got(opts)
					.on('redirect', (resp, nextOpts) => {
						try {
							if (resp.headers['set-cookie']) {
								const ck = resp.headers['set-cookie'].map(this.cktough.Cookie.parse).toString()
								if (ck) {
									this.ckjar.setCookieSync(ck, null)
								}
								nextOpts.cookieJar = this.ckjar
							}
						} catch (e) {
							this.logErr(e)
						}
						// this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
					})
					.then(
						(resp) => {
							const {
								statusCode: status,
								statusCode,
								headers,
								body
							} = resp
							callback(null, {
								status,
								statusCode,
								headers,
								body
							}, body)
						},
						(err) => {
							const {
								message: error,
								response: resp
							} = err
							callback(error, resp, resp && resp.body)
						}
					)
			}
		}

		post(opts, callback = () => { }) {
			// ���ָ����������, ��ûָ��`Content-Type`, ���Զ�����
			if (opts.body && opts.headers && !opts.headers['Content-Type']) {
				opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
			}
			if (opts.headers) delete opts.headers['Content-Length']
			if (this.isSurge() || this.isLoon()) {
				if (this.isSurge() && this.isNeedRewrite) {
					opts.headers = opts.headers || {}
					Object.assign(opts.headers, {
						'X-Surge-Skip-Scripting': false
					})
				}
				$httpClient.post(opts, (err, resp, body) => {
					if (!err && resp) {
						resp.body = body
						resp.statusCode = resp.status
					}
					callback(err, resp, body)
				})
			} else if (this.isQuanX()) {
				opts.method = 'POST'
				if (this.isNeedRewrite) {
					opts.opts = opts.opts || {}
					Object.assign(opts.opts, {
						hints: false
					})
				}
				$task.fetch(opts).then(
					(resp) => {
						const {
							statusCode: status,
							statusCode,
							headers,
							body
						} = resp
						callback(null, {
							status,
							statusCode,
							headers,
							body
						}, body)
					},
					(err) => callback(err)
				)
			} else if (this.isNode()) {
				this.initGotEnv(opts)
				const {
					url,
					..._opts
				} = opts
				this.got.post(url, _opts).then(
					(resp) => {
						const {
							statusCode: status,
							statusCode,
							headers,
							body
						} = resp
						callback(null, {
							status,
							statusCode,
							headers,
							body
						}, body)
					},
					(err) => {
						const {
							message: error,
							response: resp
						} = err
						callback(error, resp, resp && resp.body)
					}
				)
			}
		}
		/**
		 *
		 * ʾ��:$.time('yyyy-MM-dd qq HH:mm:ss.S')
		 *    :$.time('yyyyMMddHHmmssS')
		 *    y:�� M:�� d:�� q:�� H:ʱ m:�� s:�� S:����
		 *    ����y��ѡ0-4λռλ����S��ѡ0-1λռλ���������ѡ0-2λռλ��
		 * @param {*} fmt ��ʽ������
		 *
		 */
		time(fmt) {
			let o = {
				'M+': new Date().getMonth() + 1,
				'd+': new Date().getDate(),
				'H+': new Date().getHours(),
				'm+': new Date().getMinutes(),
				's+': new Date().getSeconds(),
				'q+': Math.floor((new Date().getMonth() + 3) / 3),
				'S': new Date().getMilliseconds()
			}
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (new Date().getFullYear() + '').substr(4 - RegExp.$1.length))
			for (let k in o)
				if (new RegExp('(' + k + ')').test(fmt))
					fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
			return fmt
		}

		/**
		 * ϵͳ֪ͨ
		 *
		 * > ֪ͨ����: ͬʱ֧�� QuanX �� Loon ���ָ�ʽ, EnvJs�������л����Զ�ת��, Surge ������֧�ֶ�ý��֪ͨ
		 *
		 * ʾ��:
		 * $.msg(title, subt, desc, 'twitter://')
		 * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
		 * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
		 *
		 * @param {*} title ����
		 * @param {*} subt ������
		 * @param {*} desc ֪ͨ����
		 * @param {*} opts ֪ͨ����
		 *
		 */
		msg(title = name, subt = '', desc = '', opts) {
			const toEnvOpts = (rawopts) => {
				if (!rawopts) return rawopts
				if (typeof rawopts === 'string') {
					if (this.isLoon()) return rawopts
					else if (this.isQuanX()) return {
						'open-url': rawopts
					}
					else if (this.isSurge()) return {
						url: rawopts
					}
					else return undefined
				} else if (typeof rawopts === 'object') {
					if (this.isLoon()) {
						let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
						let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
						return {
							openUrl,
							mediaUrl
						}
					} else if (this.isQuanX()) {
						let openUrl = rawopts['open-url'] || rawopts.url || rawopts.openUrl
						let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
						return {
							'open-url': openUrl,
							'media-url': mediaUrl
						}
					} else if (this.isSurge()) {
						let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
						return {
							url: openUrl
						}
					}
				} else {
					return undefined
				}
			}
			if (!this.isMute) {
				if (this.isSurge() || this.isLoon()) {
					$notification.post(title, subt, desc, toEnvOpts(opts))
				} else if (this.isQuanX()) {
					$notify(title, subt, desc, toEnvOpts(opts))
				}
			}
			if (!this.isMuteLog) {
				let logs = ['', '==============??ϵͳ֪ͨ??==============']
				logs.push(title)
				subt ? logs.push(subt) : ''
				desc ? logs.push(desc) : ''
				console.log(logs.join('\n'))
				this.logs = this.logs.concat(logs)
			}
		}

		log(...logs) {
			if (logs.length > 0) {
				this.logs = [...this.logs, ...logs]
			}
			console.log(logs.join(this.logSeparator))
		}

		logErr(err, msg) {
			const isPrintSack = !this.isSurge() && !this.isQuanX() && !this.isLoon()
			if (!isPrintSack) {
				this.log('', `??${this.name}, ����!`, err)
			} else {
				this.log('', `??${this.name}, ����!`, err.stack)
			}
		}

		wait(time) {
			return new Promise((resolve) => setTimeout(resolve, time))
		}

		done(val = {}) {
			const endTime = new Date().getTime()
			const costTime = (endTime - this.startTime) / 1000
			this.log('', `??${this.name}, ����! ?? ${costTime} ��`)
			this.log()
			if (this.isSurge() || this.isQuanX() || this.isLoon()) {
				$done(val)
			}
		}
	})(name, opts)
}
