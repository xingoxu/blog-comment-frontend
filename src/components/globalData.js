let globalData = {};

function setter(el) {
  globalData = {
    thread_key: el.getAttribute('data-thread-key'),
    thread_url: el.getAttribute('data-thread-url'),
    thread_title: el.getAttribute('data-thread-title'),
  };
}
function getter() {
  return globalData;
}

export default {
  set: setter,
  get: getter,
}