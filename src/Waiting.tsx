import { useSelect, useTasks } from "./Hooks"
import { IProps } from "./Downloading"
import { forwardRef, useEffect } from "react"
import { Link } from "react-router-dom"


function Waiting({ client }: IProps, ref: any) {

  //@ts-ignore
  var tasks = useTasks(() => {
    return client.ready().then((client: any) => {
      return client.tellWaiting(0, 100)
    })
  }, 1000)

  let { selectedGids, selectTask, tasksContext } = useSelect(tasks, ref)

  useEffect(() => {
    tasksContext.setSelectedTasks([])
  }, [])

  return (
    <div>
      <div className="wait-wrapper">
        <span></span>
        <span>文件名</span>
        <span>大小</span>
        <span>下载进度</span>
        <span>下载详情</span>
      </div>
      <ul className="info-wrapper">
        {
          tasks.map(task => {
            return (
              <li key={task.gid} className="taskCom-info">
                <label htmlFor={task.gid}>
                  <input type="checkbox" id={task.gid} checked={selectedGids.includes(task.gid)} onChange={(e) => selectTask(e, task.gid)} />
                  <span>{task.files[0].path.split('/').pop()}</span>
                  <span>{(task.totalLength / 1024 / 1024).toFixed(2)}Mb</span>
                  <span>{(task.completedLength / task.totalLength * 100).toFixed(2) + '%'}</span>
                  <span><Link to={'/task/detail/' + task.gid}>详情</Link></span>
                </label>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default forwardRef(Waiting)