// @ts-nocheck

const indexDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB

type Params = {
    /** 数据库名 */
    dbName: string
    /** 表名 */
    cacheTableName: string
    /** 设置主键 （需要为添加对象内的key，否则新增和获取都会失败） */
    keyPath: string
    /** 设置索引 */
    indexes: any[]
}

export class IndexDBCache {
    constructor(
        params: Params = {
            dbName: 'test',
            cacheTableName: 'imageCache',
            keyPath: 'imageName',
            indexes: [],
        }
    ) {
        this._db = null // 数据库
        this._transaction = null // 事务
        this._request = null // 打开数据库返回的事务
        this._dbName = params.dbName // 数据库名
        this._cacheTableName = params.cacheTableName // 表名
        this._dbversion = 1 // 数据库版本
        this._keyPath = params.keyPath // 设置主键
        this._indexes = params.indexes // 设置索引
    }
    // 初始化数据库
    initDB() {
        return new Promise((resolve, reject) => {
            // 打开数据库
            this._request = indexDB.open(this._dbName, this._dbversion)
            // 数据库初始化成功
            this._request.onsuccess = (event) => {
                this._db = this._request.result
                resolve(event)
            }
            // 数据库初始化失败
            this._request.onerror = (event) => {
                reject(event)
            }
            // 数据库初次创建或更新时（指定的版本号，大于数据库的实际版本号）会触发
            this._request.onupgradeneeded = (event) => {
                // 这时通过事件对象的target.result属性，拿到数据库实例。
                const db = event.target.result
                if (!db.objectStoreNames.contains(this._cacheTableName)) {
                    const objectStore = db.createObjectStore(this._cacheTableName, {
                        keyPath: this._keyPath,
                    })
                    this._indexes.forEach((element) => {
                        // 三个参数分别为索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）
                        objectStore.createIndex(element.name, element.name, { unique: element.unique })
                    })
                }
                resolve(event)
            }
        })
    }
    /**
     * @description : 新增数据
     * @param        {Object} params 添加到数据库中的数据 单条
     * @return       {*}
     */
    addData(params, mode: 'add' | 'put') {
        return new Promise((resolve, reject) => {
            const transaction = this._db.transaction(this._cacheTableName, 'readwrite')
            const store = transaction.objectStore(this._cacheTableName)

            const response = mode === 'add' ? store.add(params) : store.put(params)
            response.onsuccess = (event) => {
                resolve(event)
            }
            response.onerror = (event) => {
                reject(event)
            }
        })
    }
    // 删除指定主键值
    remove(key) {
        var request = this._db
            .transaction([this._cacheTableName], 'readwrite')
            .objectStore(this._cacheTableName)
            .delete(key)
        request.onsuccess = function (event) {
            console.log('数据删除成功')
        }
    }
    // 清空数据库数据
    clearDB() {
        return new Promise((resolve, reject) => {
            const transaction = this._db.transaction(this._cacheTableName, 'readwrite')
            const store = transaction.objectStore(this._cacheTableName)
            const response = store.clear()
            response.onsuccss = (event) => {
                resolve(event)
            }
            response.onerror = (event) => {
                reject(event)
            }
        })
    }
    // 通过主键读取数据
    getDataByKey(key: any) {
        return new Promise((resolve, reject) => {
            const transaction = this._db.transaction(this._cacheTableName)
            const objectStore = transaction.objectStore(this._cacheTableName)
            // 通过主键读取数据
            // const request = objectStore.get(key);
            // getAll(key)同get(key)获取指定key对应数据，如果getAll不传参或者传null即返回所有数据
            const request = objectStore.getAll(key)
            request.onsuccess = () => {
                resolve(request.result)
            }
            request.onerror = (event) => {
                reject(event)
            }
        })
    }
    // 通过主键读取数据
    getDataByIndex(params) {
        const transaction = this._db.transaction([this._cacheTableName], 'readonly')
        const store = transaction.objectStore(this._cacheTableName)
        const index = store.index(params.index)
        const request = index.get(params.value)
        request.onsuccess = function (e) {
            const result = e.target.result
            console.log('getDataByIndex', result)
        }
    }

    // 遍历数据
    readAll() {
        const objectStore = this._db.transaction(this._cacheTableName).objectStore(this._cacheTableName)
        objectStore.openCursor().onsuccess = function (event) {
            const cursor = event.target.result

            if (cursor) {
                console.log('key: ' + cursor.key)
                console.log('Value: ' + JSON.stringify(cursor.value))
                cursor.continue()
            } else {
                console.log('没有更多数据了！')
            }
        }
    }
    // 更新指定主键数据
    update(params) {
        var request = this._db
            .transaction([this._cacheTableName], 'readwrite')
            .objectStore(this._cacheTableName)
            .put(params)
        request.onsuccess = function (event) {
            console.log('数据更新成功')
        }
        request.onerror = function (event) {
            console.log('数据更新失败')
        }
    }
    // 关闭数据库
    closeDB() {
        this._db.close()
    }
    // 删除数据库
    deleteDB() {
        console.log('开始删除数据库')
        let DBDeleteRequest = indexDB.deleteDatabase(this._dbName)
        DBDeleteRequest.onsuccess = function (event) {
            console.log('删除数据库成功')
        }
        DBDeleteRequest.onerror = function (event) {
            console.log('删除数据库失败')
        }
    }
}
