import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import Aria2Client from "./aria2.client"
import { SelectedTasksContext } from "./Hooks"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';

interface IProps {
  client: Aria2Client,
  select: any
}

export default function Header({ client, select }: IProps) {
  let navigate = useNavigate()
  let tasksContext = useContext(SelectedTasksContext)

  function selectAll() {
    select.current.selectAll()
  }

  function clearSelecte() {
    tasksContext.setSelectedTasks([])
    select.current.removeGids()
  }

  function goNew() {
    if (tasksContext.selectedTasks.length) {
      clearSelecte()
    }
    navigate('/new')
  }

  function changeDownLoad() {
    tasksContext.selectedTasks.map(task => {
      //@ts-ignore
      client.unpause(task.gid)
    })
    clearSelecte()
    toast('恢复下载')
  }

  function changePause() {
    tasksContext.selectedTasks.map(task => {
      //@ts-ignore
      client.pause(task.gid)
    })
    clearSelecte()
    toast('暂停下载')
  }

  function removeTask() {
    tasksContext.selectedTasks.map(task => {
      //@ts-ignore
      client.remove(task.gid)
    })
    clearSelecte()
    toast('删除下载')
  }

  function removeCom() {
    tasksContext.selectedTasks.map(task => {
      //@ts-ignore
      client.removeDownloadResult(task.gid)
    })
    clearSelecte()
    toast('删除成功')
  }

  console.log(tasksContext.selectedTasks.length)


  let url: any = window.location.href.split('/').pop()
  let urls = [
    'downloading',
    'wating',
    'completed'
  ]

  let isStart = tasksContext.selectedTasks.length > 0 && window.location.href.split('/').pop() == urls[1]
  let isPause = tasksContext.selectedTasks.length > 0 && window.location.href.split('/').pop() == urls[0]
  let isRemove = tasksContext.selectedTasks.length > 0 && window.location.href.split('/').pop() != urls[2]
  let isCom = tasksContext.selectedTasks.length > 0 && window.location.href.split('/').pop() == urls[2]

  return (
    <div>
      <ToastContainer />
      <div id="border-btn">
        <Button variant="contained" size="large" onClick={goNew}>新建下载</Button>
        <Button variant="contained" size="large" disabled={!isStart} onClick={changeDownLoad}><i className="fa">&#xf04b;</i>恢复下载</Button>
        <Button variant="contained" size="large" disabled={!isPause} onClick={changePause}><i className="fa">&#xf04c;</i>暂停任务</Button>
        <Button variant="contained" size="large" disabled={!isRemove} onClick={removeTask}><i className="fa">&#xf014;</i>删除任务</Button>
        <Button variant="contained" size="large" disabled={!isCom} onClick={removeCom}><i className="fa">&#xf014;</i>删除完成项</Button>
        <Button variant="contained" size="large" disabled={!urls?.includes(url)} onClick={selectAll}><i className="fa">&#xf00a;</i>全选任务</Button>
      </div>
    </div>
  )
}