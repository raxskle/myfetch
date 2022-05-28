// ajax封装
const url = "http://httpbin.org/post";

const DEFAULTS = {
  method: "GET",
  params: null,
  data: null,
  contentType: "application/json",
  responseType: "",
  withCredentials: false,
  success() {}, //xhr.send()之后的方法，定义在options中，可以调用时自定义
  httpCodeError() {},
  error() {},
  abort() {},
  timeout() {},
};

// 格式化url参数
const serialize = (params) => {
  const results = [];
  for (const [key, value] of Object.entries(params)) {
    results.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }
  return results.join("&");
};

const addURLData = (url, data) => {
  if (!data) {
    return "";
  }
  const mark = url.includes("?") ? "&" : "?";
  return `${mark}${data}`;
};

class Ajax {
  constructor(url, options) {
    this.url = url;
    this.options = Object.assign({}, DEFAULTS, options);
    this.init();
  }

  init() {
    const xhr = new XMLHttpRequest();
    this.xhr = xhr;
    this.bindEvent();
    xhr.open(this.options.method, this.url + this.addParam(), true);

    this.setResponseType();
    this.setCookie();
    this.setTimeout();
    // 发送请求
    this.sendData();
  }

  bindEvent() {
    const xhr = this.xhr;
    const { success, httpCodeError, error, timeout, abort } = this.options;
    xhr.addEventListener("load", () => {
      if (this.ok()) {
        success(xhr);
      } else {
        httpCodeError(xhr);
      }
    });
    xhr.addEventListener("error", () => {
      error(xhr);
    });
    xhr.addEventListener("abort", () => {
      abort(xhr);
    });
    xhr.addEventListener("timeout", () => {
      timeout(this.options.timeoutTime);
    });
  }

  ok() {
    const xhr = this.xhr;
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      return true;
    } else {
      return false;
    }
  }

  addParam() {
    const { params } = this.options;
    if (!params) {
      return "";
    } else {
      return addURLData(this.url, serialize(params));
    }
  }

  setResponseType() {
    this.xhr.responseType = this.options.responseType;
  }

  setCookie() {
    if (this.options.withCredentials) {
      this.xhr.withCredentials = true;
    }
  }

  setTimeout() {
    const { timeoutTime } = this.options;
    if (timeoutTime > 0) {
      this.xhr.timeout = timeoutTime;
    }
  }

  sendData() {
    const xhr = this.xhr;
    if (!this.isSendData()) {
      return xhr.send();
    }
    let resultData = null;
    const { data } = this.options;
    // formdata不用设置请求头
    if (this.isFormData()) {
      resultData = data;
    } else if (this.isFormURLEncodedData()) {
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      resultData = serialize(data);
    } else if (this.isJSONData()) {
      xhr.setRequestHeader("Content-Type", "application/json");
      resultData = JSON.stringify(data);
    }

    return xhr.send(resultData);
  }

  isSendData() {
    const { data, method } = this.options;
    if (!data) {
      return false;
    }
    if (method === "GET") {
      return false;
    }
    return true;
  }

  isFormData() {
    return this.options.data instanceof FormData;
  }

  isFormURLEncodedData() {
    return this.options.contentType.includes(
      "application/x-www-form-urlencoded"
    );
  }

  isJSONData() {
    return this.options.contentType.includes("application/json");
  }

  getXHR() {
    return this.xhr;
  }
}

const ajax = (url, options) => {
  return new Ajax(url, options).getXHR();
};

// ajax(url, {
//   method: "POST",
//   params: {
//     a: 3,
//     b: 4,
//   },
//   data: { a: 1, b: 2 },

//   success(data, xhr) {
//     console.log(data);
//     console.log(xhr);
//   },

//   httpCodeError(status, xhr) {
//     console.log("HTTP error");
//     console.log(status);
//   },

//   error(xhr) {
//     console.log("error");
//     console.log(xhr);
//   },

//   abort(xhr) {
//     console.log("abort");
//     console.log(xhr);
//   },

//   timeout(timeoutTime) {
//     console.log("timeout");
//     console.log(timeoutTime);
//   },
// });
