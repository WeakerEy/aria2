import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IProps } from "./Downloading";
import { useInput } from "./Hooks";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Servers({ client }: IProps) {
  let name = useInput('')
  let ip = useInput('')
  let port = useInput('')
  let secret = useInput('')

  let aria2Servers: any = useMemo(() => {
    return JSON.parse(localStorage.ARIA2_SERVERS ?? '[]')
  }, [])

  let [servers, setServers] = useState(aria2Servers)
  let [serverkey, setServerKey] = useState(JSON.parse(localStorage.ARIA2_SERVERS).length - 1)
  let ul = document.querySelector('.link-wrapper')

  useEffect(() => {
    let emlt = document.querySelector('.defult-active')
    emlt?.classList.remove('defult-active')
    ul?.children[serverkey].classList.add('defult-active')
  }, [serverkey])

  console.log(serverkey,servers)

  function addServer() {
    let newServers = [...servers, {
      name: 'initServers',
      ip: '',
      port: '',
      secret: ''
    }]
    setServers(newServers)
    setServerKey(servers.length)

    ip.setvalue('')
    port.setvalue('')
    secret.setvalue('')
  }

  function saveServers() {
    let newServer = {
      name: name.value,
      ip: ip.value,
      port: port.value,
      secret: secret.value
    }

    servers[serverkey] = newServer
    setServers(servers)
    localStorage.ARIA2_SERVERS = JSON.stringify(servers)

    toast('服务器修改成功')
  }

  function changeLink(e: any, server: any, key: number) {
    name.setvalue(servers[key].name)
    ip.setvalue(servers[key].ip)
    port.setvalue(servers[key].port)
    secret.setvalue(servers[key].secret)
    setServerKey(key)
  }

  function removeServer(server: any, key: number) {
    servers.splice(key, 1)
    setServers(servers)

    localStorage.ARIA2_SERVERS = JSON.stringify(servers)
    localStorage.currentServerIdx = 0

    toast('服务器已删除')
  }


  function showPassword() {
    let input = document.getElementById('pass')
    console.log(input)
    if (input?.getAttribute('type') != 'text') {
      input?.setAttribute('type', 'text')
    } else {
      input?.setAttribute('type', 'password')
    }
  }


  const regIp = /(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)/

  if (regIp.test(ip.value) && Number(port.value) <= 65535 && Number(port.value) > 0 && secret.value) {
    let button = document.querySelector('.button-sty')
    button?.removeAttribute('disabled')
  } else {
    let button = document.querySelector('.button-sty')
    button?.setAttribute('disabled', 'true')
  }

  //正则判断
  {
    if (ip.value && !regIp.test(ip.value)) {
      let ip = document.getElementById('isIp')
      console.log(ip)
      ip?.classList.add('error-input')
    }

    if (ip.value && regIp.test(ip.value)) {
      let ip = document.getElementById('isIp')
      ip?.classList.remove('error-input')
    }

    if (port.value && Number(port.value) <= 0 || Number(port.value) >= 65535) {
      let port = document.getElementById('isPort')
      port?.classList.add('error-input')
    }

    if (port.value && Number(port.value) >= 0 && Number(port.value) <= 65535) {
      let port = document.getElementById('isPort')
      port?.classList.remove('error-input')
    }
  }

  return (
    <div>
      <ToastContainer />
      <ul className="link-wrapper">
        {
          servers.map((server: any, key: number) => {
            return <li key={server.name + key} className="hvr-underline-reveal change-link" onClick={(e) => { changeLink(e, server, key) }}> <span>RPC({server.name})</span> <i className="fa" onClick={() => removeServer(server, key)}>&#xf057;</i></li>
          })
        }
        <i className="fa add-link" onClick={addServer}>&#xf067;</i>
      </ul>
      <div id="aria2-wrapper">
        <div>
          <div><span className="aria2-frist">Aria2 RPC 别名：</span><input id="isName" type="text" value={name.value} onChange={name.onChange} placeholder='测试' /></div>
        </div>
        <div>
          <div>
            <span className="aria2-frist">Aria2 RPC 地址：</span>
            <div className="span-wrapper">
              <span className="ban-input">http://</span><span><input type="text" id="isIp" value={ip.value} onChange={ip.onChange} placeholder='192.168.0.0' /></span><span className="ban-input">:</span><span><input id="isPort" type="text" value={port.value} onChange={port.onChange} placeholder='6800' /></span><span className="ban-input">/jsonrpc</span>
            </div>
          </div>
        </div>
        <div>
          <div><span className="aria2-frist">Aria2 RPC 密钥：</span><input id="pass" type='password' value={secret.value} onChange={secret.onChange} placeholder='输入密码' /> <button><i className="fa" onClick={showPassword}>&#xf06e;</i></button></div>
        </div>
        <div className="button-post">
          <button className="hvr-grow-shadow button-sty" onClick={saveServers}>保存设置</button>
        </div>
      </div>
    </div>
  )
}