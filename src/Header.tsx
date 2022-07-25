import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import Aria2Client from "./aria2.client"
import { SelectedTasksContext } from "./Hooks"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as React from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';

interface IProps {
  client: Aria2Client,
  select: any
}

export default function Header({ client, select }: IProps) {
  var navigate = useNavigate()
  var tasksContext = useContext(SelectedTasksContext)



  function selectAll() {
    select.current.selectAll()
  }

  function goNew() {
    navigate('/new')
  }

  let url: any = window.location.href.split('/').pop()
  let urls = [
    'downloading',
    'wating',
    'completed'
  ]



  function changeDownLoad() {
    tasksContext.selectedTasks.map(task => {
      //@ts-ignore
      client.unpause(task.gid)
    })
    toast('恢复下载')
  }

  function changePause() {
    tasksContext.selectedTasks.map(task => {
      //@ts-ignore
      client.pause(task.gid)
    })
    toast('暂停下载')
  }

  function removeTask() {
    tasksContext.selectedTasks.map(task => {
      //@ts-ignore
      client.remove(task.gid)
    })
    toast('删除下载')
  }

  function removeCom() {
    tasksContext.selectedTasks.map(task => {
      //@ts-ignore
      client.removeDownloadResult(task.gid)
    })
    toast('删除成功')
  }


  let isStart = tasksContext.selectedTasks.length > 0 && window.location.href.split('/').pop() == urls[1]
  let isPause = tasksContext.selectedTasks.length > 0 && window.location.href.split('/').pop() == urls[0]
  let isRemove = tasksContext.selectedTasks.length > 0 && window.location.href.split('/').pop() != urls[2]
  let isCom = tasksContext.selectedTasks.length > 0 && window.location.href.split('/').pop() == urls[2]

  return (
    <div id="border-btn">
      <ToastContainer />
      <span className="hvr-underline-reveal" onClick={goNew}><i className="fa">&#xf067;</i> 新建任务</span>
      <span className={isStart ? 'hvr-underline-reveal' : 'hide'} onClick={changeDownLoad}> <i className="fa">&#xf04b;</i> 恢复下载</span>
      <span className={isPause ? 'hvr-underline-reveal' : 'hide'} onClick={changePause}> <i className="fa">&#xf04c;</i> 暂停任务</span>
      <span className={isRemove ? 'hvr-underline-reveal' : 'hide'} onClick={removeTask} ><i className="fa">&#xf014;</i>删除任务</span>
      <span className={isCom ? 'hvr-underline-reveal' : 'hide'} onClick={removeCom}><i className="fa">&#xf014;</i> 删除完成项</span>
      {
        urls?.includes(url) && tasksContext.selectedTasks.length > 0 ?
          <span className="hvr-underline-reveal" onClick={selectAll}><i className="fa">&#xf00a;</i>全选任务</span>
          : <span className="hide" onClick={selectAll}><i className="fa">&#xf00a;</i>全选任务</span>
      }
    </div>
  )
}