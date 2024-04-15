export namespace ajax {
	function createXHR(): XMLHttpRequest {
		if (window.XMLHttpRequest)
			return new XMLHttpRequest();
		else
			return new ActiveXObject("Microsoft.XMLHTTP");
	}

	export function ajax(params: {
		type: string,
		url: string,
		data?: any,
		dataType?: "json" | "queryStr" | "raw",
		responseType?: "json" | "text" | "raw",
		isAsync?: boolean
	}): Promise<any> {

		params.type = params.type.toUpperCase()
		if (!params.dataType) params.dataType = params.type=="GET"? "queryStr" : "json";
		if (!params.responseType) params.responseType = "json";
		if (params.isAsync == undefined) params.isAsync = true;
		let xhr = createXHR();
		return new Promise((resolve, reject) => {
			if (params.dataType == 'queryStr' && params.data) {
				let qureyStr = "";
				Object.keys(params.data).forEach(key => qureyStr += `${key}=${params.data[key]}&`);
				qureyStr = qureyStr.slice(0, -1);
				params.url += `?${qureyStr}`;
			}
			xhr.open(params.type, params.url, params.isAsync);
			if (params.dataType == 'json') {
				xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
				xhr.send(JSON.stringify(params.data));
			}
			else if (params.dataType == 'queryStr') {
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.send()
			} else if (params.dataType == 'raw') {
				xhr.send(params.data)
			}
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status <= 300 || xhr.status == 304) {
						let res = params.responseType == "json" ? JSON.parse(xhr.responseText) : xhr.responseText;
						resolve(res);
					} else {
						reject(xhr.readyState);
					}
				}
			}
		})
	}
}