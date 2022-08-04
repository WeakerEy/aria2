import './App.css';
import { HashRouter, NavLink, Routes, Route, Navigate } from 'react-router-dom'
import Downloading from './Downloading';
import Waiting from './Waiting';
import Completed from './Completed';
import Header from './Header';
import NewTask from './NewTask';
import Aria2Client from './aria2.client';
import { useEffect, useMemo, useRef, useState } from 'react';
import TaskDetail from './TaskDetail';
import { SelectedTasksContext } from './Hooks'
import Settings from './Settings';
import Servers from './Servers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';

// @ts-ignore
globalThis.Aria2Client = Aria2Client

function App() {
  let [aria2State, setAria2State] = useState('连接中')

  var aria2Servers: any = useMemo(() => JSON.parse(localStorage.ARIA2_SERVERS ?? '[]'), [])

  let currentServerIdx = useMemo(() => localStorage.currentServerIdx ?? 0, [localStorage.currentServerIdx])

  let aria2Init = useMemo(() => {
    let server = aria2Servers[currentServerIdx]
    let aria2
    try {
      aria2 = new Aria2Client(server.ip, server.port, server.secret)
    } catch (e) {
      aria2 = new Aria2Client('192.168.0.103', 11000, 'Zwk123')
    }
    return aria2
  }, [])

  let [selectedTasks, setSelectedTasks] = useState([])
  let selectRef = useRef()


  let [aria2, setAria2] = useState(aria2Init)
  let [globalStat, setGlobalStat] = useState<any>({})

  let [statecolor, setStateColor] = useState({ 'background': '#C7D5F1' })

  useEffect(() => {
    aria2.ready().then(() => {
      setAria2State(state => {
        if (state == '连接中') {
          //@ts-ignore
          setStateColor({ 'background': '#9ACD32' })
          return '已连接'
        } else {
          return state
        }
      })
    }, () => {
      if (aria2State == '连接中') {
        setAria2State(state => {
          if (state == '连接中') {
            //@ts-ignore
            setStateColor({ 'background': 'red' })
            return '未连接'
          } else {
            return state
          }
        })
      }
    })


    let id: any = setInterval(() => {
      //@ts-ignore
      aria2.getGlobalStat().then(stat => {
        setGlobalStat(stat)
      })
    }, 1000)

    async function downloadEvent(info: any) {
      //@ts-ignore
      let status = await aria2.tellStatus(info.gid)
      toast(status.files[0].path.split('/').pop() + '下载完成')
    }

    aria2.on('DownloadComplete', downloadEvent)

    return () => {
      clearInterval(id)
      aria2.off('DownloadComplete', downloadEvent)
    }
  }, [aria2])

  function changeServer(e: React.ChangeEvent<HTMLSelectElement>) {
    let index = Number(e.target.value)
    let server = aria2Servers[index]
    localStorage.currentServerIdx = index

    let aria2 = new Aria2Client(server.ip, server.port, server.secret)
    setStateColor({ 'background': '#C7D5F1' })
    setAria2State('连接中')

    setAria2(aria2)
  }

  function changeLeft() {
    let left = document.querySelector('.App-left')
    left?.classList.toggle('close')
  }

  return (
    <SelectedTasksContext.Provider value={{ selectedTasks, setSelectedTasks }}>
      <ToastContainer />
      <HashRouter>
        <div className="App">
          <div className='App-left'>
            <div className='showtitle'>AriaNg</div>
            <div id='selectServers'>
              {
                <select onChange={changeServer} value={currentServerIdx}>
                  {
                    aria2Servers.map((server: any, index: number) => {
                      return (
                        <option key={server.name + index} value={index} >
                          {server.ip + ':' + server.port}
                        </option>
                      )
                    })
                  }
                </select>
              }
            </div>
            <div id='loading-btn'>
              <div>下载</div>
              <div className='hvr-backward'><NavLink style={({ isActive }) => ({ color: isActive ? '#2B6BDC' : '#1A1A1A' })} to="/downloading"><i style={{ color: '#1A1A1A' }} className='fa'>&#xf01a;</i><span>下载中({globalStat.numActive})</span></NavLink></div>
              <div className='hvr-backward'><NavLink style={({ isActive }) => ({ color: isActive ? '#2B6BDC' : '#1A1A1A' })} to="/wating"><i style={{ color: '#1A1A1A' }} className='fa'>&#xf017;</i><span>等待中({globalStat.numWaiting})</span></NavLink></div>
              <div className='hvr-backward'><NavLink style={({ isActive }) => ({ color: isActive ? '#2B6BDC' : '#1A1A1A' })} to="/completed"><i style={{ color: '#1A1A1A' }} className='fa'>&#xf00c;</i><span>已完成({globalStat.numStopped})</span></NavLink></div>
              <div>系统设置</div>
              <div className='hvr-forward'><NavLink style={({ isActive }) => ({ color: isActive ? '#2B6BDC' : '#1A1A1A' })} to="/settings"><i style={{ color: '#1A1A1A' }} className='fa'>&#xf013;</i><span>设置</span></NavLink></div>
              <div className='hvr-forward'><NavLink style={({ isActive }) => ({ color: isActive ? '#2B6BDC' : '#1A1A1A' })} to="/servers"><i style={{ color: '#1A1A1A' }} className='fa'>&#xf0ae;</i><span>服务器</span></NavLink></div>
              <div style={statecolor}>{aria2State}</div>
            </div>
          </div>
          <div className="App-right">
            <div className="App-header">
              <Header select={selectRef} client={aria2}></Header>
            </div>
            <div>
              <Routes>
                <Route path='/' element={<Navigate replace to = 'downloading' />}></Route>
                <Route path='/downloading' element={<Downloading client={aria2} ref={selectRef} />}></Route>
                <Route path='/wating' element={<Waiting client={aria2} ref={selectRef} />}></Route>
                <Route path='/completed' element={<Completed client={aria2} ref={selectRef} />}></Route>
                <Route path='/new' element={<NewTask client={aria2} />}></Route>
                <Route path='/settings' element={<Settings client={aria2} />}></Route>
                <Route path='/servers' element={<Servers client={aria2} />}></Route>
                <Route path='/task/detail/:gid' element={<TaskDetail client={aria2} />}></Route>
              </Routes>
            </div>
            <div className='App-down'>
              <div className='nav-left' onClick={changeLeft}><i className='fa'>&#xf039;</i></div>
              <div className='show-speed'>
                <span>上传速度：{(globalStat.uploadSpeed / 1024).toFixed(1)}KB/s <i className='fa up-icon'>&#xf062;</i></span>
                <span>下载速度：{(globalStat.downloadSpeed / 1024).toFixed(1)}KB/s <i className='fa down-icon'>&#xf063;</i></span>
              </div>
            </div>
          </div>
          <div>
          </div>
        </div>
      </HashRouter>
    </SelectedTasksContext.Provider>
  );
}

export default App;
