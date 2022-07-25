import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Aria2Client from "./aria2.client"
import { useInput } from "./Hooks"


interface Iprops {
  client: Aria2Client
}


export default function NewTask({ client }: Iprops) {

  let downloadUrls = useInput('')
  let downloadSpeed = useInput('0')
  let dir = useInput('')
  let maxPiece = useInput('5')
  let navigate = useNavigate()

  // useEffect(() => {
  //   //@ts-ignore
  //   client.getGlobalOption().then(options => {
  //     options.
  //   })
  // }, [])


  function start() {
    let links = downloadUrls.value.split("\n").map(it => it.trim()).filter(it => it)

    if (dir.value) {
      for (let link of links) {
        //@ts-ignore
        client.addUri([link], {
          'dir': dir.value,
          'max-download-limit': downloadSpeed.value,
          'max-concurrent-downloads': maxPiece.value
        })
      }
    } else {
      for (let link of links) {
        //@ts-ignore
        client.addUri([link], {
          'max-download-limit': downloadSpeed.value,
          'max-concurrent-downloads': maxPiece.value
        })
      }
    }
    navigate('/downloading')
  }

  let [show, setShow] = useState(true)

  function mouseHover(e: any) {
    let elm = e.target
    let x = elm.offsetLeft
    let y = elm.offsetTop
    let nav = document.getElementById('nav')
    nav!.style.left = x + 20 + 'px'
    nav!.style.top = y + 'px'
    nav!.innerText = elm.dataset.content
    nav!.removeAttribute('hidden')
    console.log()
  }

  function mouseLeave() {
    let nav = document.getElementById('nav')
    nav!.setAttribute('hidden', 'true')
  }

  function changeColor(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    let emlt = document.querySelector('.defult-active')
    emlt?.classList.remove('defult-active')
    e.currentTarget.classList.add('defult-active')
  }

  return (
    <div>
      <ul className="new-wrapper">
        <li className="change-link hvr-underline-reveal">
          <Link className="defult-active" to={'/new'} onClick={(e) => { changeColor(e); setShow(true) }}> <span>链接</span> </Link>
        </li>
        <li className="change-link hvr-underline-reveal">
          <Link to={'/new'} onClick={(e) => { changeColor(e); setShow(false) }}> <span>选项</span> </Link>
        </li>
      </ul>
      {
        show ?
          <div className="newTask">
            <div style={{ 'fontSize': '20px' }}>下载链接</div>
            <div>
              <textarea cols={100} rows={15} value={downloadUrls.value} onChange={downloadUrls.onChange} placeholder='支持多个下载链接，每个链接占据一行：'></textarea>
            </div>
            <button className="hvr-grow-shadow button-sty downbtn" onClick={start}>立即下载</button>
          </div>
          :
          <div id="aria2-wrapper">
            <div><span className="aria2-frist"> 下载存储路径 <i onMouseEnter={(e) => mouseHover(e)} onMouseLeave={mouseLeave} className="fa" style={{ 'color': '#3C8DBC' }} data-content='以软件安装路径为默认下载路径，可自定义路径' >&#xf059;</i> </span><input type="text" value={dir.value} onChange={dir.onChange} /></div>
            <div><span className="aria2-frist"> 最大下载速度 <i onMouseEnter={(e) => mouseHover(e)} onMouseLeave={mouseLeave} className="fa" style={{ 'color': '#3C8DBC' }} data-content='设置每个任务的最大下载速度 (字节/秒). 0 表示不限制. 您可以增加数值的单位 K 或 M (1K = 1024, 1M = 1024K)' >&#xf059;</i> </span> <input type="text" value={downloadSpeed.value} onChange={downloadSpeed.onChange}></input></div>
            <div><span className="aria2-frist"> 同时下载件数 </span> <input type="text" value={maxPiece.value} onChange={maxPiece.onChange}></input></div>
            <button className="hvr-grow-shadow button-sty downbtn2" onClick={start}>立即下载</button>
          </div>
      }
      <div hidden id="nav"></div>
    </div>
  )
}