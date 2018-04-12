export function asyncFetch(option) {
  if (typeof option === 'string') {
    option = {
      type: 'get',
      url: option
    }
  } else {
    option.type = option.type || 'get'
  }

  let allOptions = {
    get: {},
    post: {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(option.data)
    },
    form: {
      method: 'post',
      body: option.data
    },
    put: {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(option.data)
    },
    putForm: {
      method: 'put',
      body: option.data
    },
    delete: {
      method: 'delete'
    }
  }

  let requestOption = allOptions[option.type]

  requestOption.credentials = 'same-origin'
  requestOption.headers = requestOption.headers || {}
  requestOption.headers['Accept'] = 'application/json'
  if (option.type !== 'get') {
    requestOption.headers['X-CSRFToken'] = sessionStorage.csrf
  }
  if (option.type === 'delete' && option.data) {
    requestOption.headers['Content-Type'] = 'application/json'
    requestOption.body = JSON.stringify(option.data)
  }

  let url
  if (option.url.startsWith('/')) {
    url = option.url
  } else {
    url = `/api/v1/${option.url}`
  }
  let request = new Request(url, requestOption)

  let status = 200
  return new Promise((resolve, reject) => {
    fetch(request).then(res => {
      if (res.ok) return res.json()
      status = res.status
      // throw config.errorStatusMsg[res.status] || res
      return res.text()
    }).then(body => {
      if (status === 200) {
        if (body.code === 0) {
          resolve(body.data)
        } else {
          throw body
        }
      } else {
        throw body
      }
    }).catch(err => {
      reject(err)
    })
  })
}
