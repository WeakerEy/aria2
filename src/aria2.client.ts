import { EventEmitter } from "events"



export default class Aria2Client extends EventEmitter{
   //@ts-ignore
  ws: WebSocket
  id: number
  readyPromise: Promise<Aria2Client>

  callbacks: {
    [id: number]: (data: any) => void
  } = {}

  constructor(public ip: string = '192.168.0.100', public port: number | string, public secret: string) {
    super()
    let url = `ws://${ip}:${port}/jsonrpc`
    this.id = 1
    this.readyPromise = new Promise((resolve,rejects) => {
      this.ws = new WebSocket(url)    //创建网络链接的实例，需要构架事件，所以这里的实例，无法被组件立马拿到
      this.ws.addEventListener('open', () => {
        resolve(this)
      })
      this.ws.addEventListener('error',()=>{
        rejects(this)
      })
    })

    //@ts-ignore
    this.ws.addEventListener('message', (e) => {
      let data = JSON.parse(e.data)
      let id = data.id
      if (id) {
        let callback = this.callbacks[id]
        callback(data)
        delete this.callbacks[id]
      } else {
        //说明是事件
        let event = data.method.slice(8)
        this.emit(event,...data.params)
      }
    })

  }

  ready() {
    return this.readyPromise
  }

}

let aria2Methods = [
  "aria2.addUri",
  "aria2.addTorrent",
  "aria2.getPeers",
  "aria2.addMetalink",
  "aria2.remove",
  "aria2.pause",
  "aria2.forcePause",
  "aria2.pauseAll",
  "aria2.forcePauseAll",
  "aria2.unpause",
  "aria2.unpauseAll",
  "aria2.forceRemove",
  "aria2.changePosition",
  "aria2.tellStatus",
  "aria2.getUris",
  "aria2.getFiles",
  "aria2.getServers",
  "aria2.tellActive",
  "aria2.tellWaiting",
  "aria2.tellStopped",
  "aria2.getOption",
  "aria2.changeUri",
  "aria2.changeOption",
  "aria2.getGlobalOption",
  "aria2.changeGlobalOption",
  "aria2.purgeDownloadResult",
  "aria2.removeDownloadResult",
  "aria2.getVersion",
  "aria2.getSessionInfo",
  "aria2.shutdown",
  "aria2.forceShutdown",
  "aria2.getGlobalStat",
  "aria2.saveSession",
  "system.multicall",
  "system.listMethods",
  "system.listNotifications"
]

aria2Methods.forEach(prefixedMethodName => {
  let [, methodName] = prefixedMethodName.split(".")

  // @ts-ignore
  Aria2Client.prototype[methodName] = function (...args: any[]) {
    return this.ready().then(() => {
      return new Promise((resolve, reject) => {
        let id = this.id++

        function callback(data: any) {
          if (data.error) {
            reject(data.error)
          } else {
            resolve(data.result)
          }
        }

        this.callbacks[id] = callback

        this.ws.send(JSON.stringify({
          jsonrpc: '2.0',
          id: id,
          method: prefixedMethodName,
          params: [`token:${this.secret}`, ...args]
        }))
      })
    })
  }
})