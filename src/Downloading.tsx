import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react"
import { Link } from "react-router-dom"
import Aria2Client from "./aria2.client"
import { SelectedTasksContext, useSelect, useTasks } from "./Hooks"



export interface IProps {
  client: Aria2Client
}



function Downloading({ client }: IProps, ref: any) {


  var tasks = useTasks(() => {
    return client.ready().then((client: any) =>
      client.tellActive())
  }, 1000)


  let {selectedGids,selectTask,tasksContext} = useSelect(tasks, ref)

  useEffect(()=>{
    tasksContext.setSelectedTasks([])
  },[])

  return (
    <div>
      <div className="down-wrapper">
        <span>文件名</span>
        <span>大小</span>
        <span>下载速度</span>
        <span>下载进度</span>
        <span>下载详情</span>
      </div>
      <ul className="info-wrapper">
        {
          tasks.map(task => {
            return (
              <li key={task.gid} className="taskDown-info">
                <input type="checkbox" checked={selectedGids.includes(task.gid)} onChange={(e) => { selectTask(e, task.gid) }} />
                <span>{task.files[0].path.split('/').pop()}</span>
                <span>{(task.totalLength/1024/1024).toFixed(2)} Mb</span>
                <span>{(task.downloadSpeed/1024).toFixed(2)} kb/s</span>
                <span>{(task.completedLength/task.totalLength*100).toFixed(2) +'%'}</span>
                <Link to={'/task/detail/' + task.gid}>详情</Link>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default forwardRef(Downloading)

