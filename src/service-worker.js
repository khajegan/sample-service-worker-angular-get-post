importScripts('/ngsw-worker.js');
self.addEventListener('sync', (event) => {
  if (event.tag === 'post-data') {
    event.waitUntil(getAllRows());
  }
});
self.onmessage = function (msg) {
  console.log(msg.data);
  self.clients.matchAll().then(all => all.map(client => client.postMessage('message from sw to to component')));
}

// var Token = '';
function getAllRows() {
  const request = indexedDB.open('db_test');
  request.onerror = function (error) {
    console.error('IndexedDB error:', error)
  }
  request.onupgradeneeded = function () {
    this.result.createObjectStore(that.objectStore, {
      autoIncrement: true, keyPath: 'id'
    });
  }
  // This will execute each time the database is opened.
  request.onsuccess = function () {
    let our_db = this.result;
    let store = our_db.transaction('xhrRequests', 'readwrite').objectStore('xhrRequests');
    let allRecords = store.getAll();
    allRecords.onsuccess = function () {
      fetch('ngsw.json').then(response => response.json()).then(jsonData => {
        const validUrlsTemp = jsonData.dataGroups.map(x=>x.patterns);
        const validUrls = validUrlsTemp[0].concat(validUrlsTemp[1]).map(x=>x.replaceAll('\\', ''));
        allRecords.result.forEach(element => {
          if (validUrls.includes(element.url)) {
            fetch(element.url, {
              method: element.method,
              headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ' + Token
              },
              body: JSON.stringify(element.body)
            }).then(() => {
              Promise.resolve().catch(() => Promise.reject());
              store = our_db.transaction('xhrRequests', 'readwrite').objectStore('xhrRequests');
              store.delete(element.id);
            });
          } else {
            store = our_db.transaction('xhrRequests', 'readwrite').objectStore('xhrRequests');
            store.delete(element.id);
          }
        });
      });
    }
  }
}
