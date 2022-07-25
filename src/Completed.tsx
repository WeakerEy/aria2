import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IProps } from "./Downloading";
import { useSelect, useTasks } from "./Hooks";




function Completed({ client }: IProps, ref: any) {

  let tasks = useTasks(async () => {
    //@ts-ignore
    return client.tellStopped(0, 100)
  }, 1000, client)


  let { selectedGids, selectTask,tasksContext } = useSelect(tasks, ref)

  useEffect(()=>{
    tasksContext.setSelectedTasks([])
  },[])

  // let tasksContext = useContext(SelectedTasksContext)
  // let [selectedGids, setSelectedGids] = useState<string[]>([])

  // useImperativeHandle(ref, () => {
  //   return {
  //     selectAll: function () {
  //       tasksContext.setSelectedTasks(tasks)
  //       setSelectedGids(tasks.map(task => task.gid))
  //     }
  //   }
  // },[tasks])

  // function selectTask(e: React.ChangeEvent<HTMLInputElement>, gid: any) {
  //   let gids   //为了确保数据是最新的
  //   if (e.target.checked) {
  //     gids = [...selectedGids, gid]
  //   } else {
  //     gids = selectedGids.filter(it => it !== gid)
  //   }
  //   setSelectedGids(gids)

  //   tasksContext.setSelectedTasks(gids.map(gid => {
  //     return tasks.find(it => it.gid === gid)
  //   }))
  // }

  return (
    <div>
      <div className="com-wrapper">
        <span>文件名</span>
        <span>大小</span>
        <span>下载详情</span>
      </div>
      <ul className="info-wrapper">
        {
          tasks.map(task => {
            return (
              <li key={task.gid} className="taskCom-info">
                <input type="checkbox" checked={selectedGids.includes(task.gid)} onChange={(e) => selectTask(e, task.gid)} />
                <span>{task.files[0].path.split('/').pop()}</span>
                <span>{(task.completedLength/1024/1024).toFixed(2)} Mb</span>
                <Link to={'/task/detail/' + task.gid}>详情</Link>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}


export default forwardRef(Completed)