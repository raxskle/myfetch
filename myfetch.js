// fetch实现

const myfetch = (url, options) => {
  let xhr;
  const p = new Promise((resolve, reject) => {
    xhr = new Ajax(url, {
      ...options,
      success(xhr) {
        resolve(JSON.parse(xhr.response));
      },
      httpCodeError(xhr) {
        resolve(JSON.parse(xhr.response));
      },
      error(xhr) {
        reject("请求失败");
      },

      abort(xhr) {
        reject("请求终止");
      },
      timeout(timeoutTime) {
        reject(`请求超时：${timeoutTime}ms`);
      },
    }).getXHR();
  });
  p.xhr = xhr;
  return p;
};

//
myfetch(url, {
  method: "POST",
  params: {
    a: 3,
    b: 4,
  },
  data: { a: 1, b: 2 },
  timeoutTime: 1000,
})
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.log(err);
  });

// let f = fetch(url, {
//   method: "POST",
// })
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
