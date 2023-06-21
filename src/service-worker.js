importScripts('/ngsw-worker.js');
self.addEventListener('sync', (event) => {
  if (event.tag === 'post-data') {
    event.waitUntil(getAllRows());
  }
});
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
      allRecords.result.forEach(element => {
        fetch(element.url, {
          method: element.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(element.body)
        }).then(() => {
          Promise.resolve().catch(() => Promise.reject());
          store = our_db.transaction('xhrRequests', 'readwrite').objectStore('xhrRequests');
          store.delete(element.id);
        });
      });
    }
  }
}
