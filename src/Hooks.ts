import React, { useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import Aria2Client from "./aria2.client"


export function useInput(init = "") {
  var [value, setValue] = useState(init)
  function onChange(e: any) {
    setValue(e.target.value)
  }
  return {
    value,
    onChange: useCallback(onChange, []),
    setvalue: useCallback(setValue,[])
  }
}

export function useTasks2(client: Aria2Client, interval: number, method: 'Active' | 'Waiting' | 'Stopped') {
  let [tasks, SetTasks] = useState<any[]>([])

  useEffect(() => {
    var id = setInterval(() => {
      client.ready().then(client => {
        //@ts-ignore
        client['tell' + method]().then(task => {
          SetTasks(task)
          console.log(task)
        })
      })
    }, interval)

    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    client.ready().then(client => {
      //@ts-ignore
      client['tell' + method]().then(task => {
        SetTasks(task)
        console.log(task)
      })
    })
  }, [])

  return tasks
}

export function useTasks(getTasks: () => Promise<any[]>, interval: number, client?: Aria2Client) {
  let [tasks, SetTasks] = useState<any[]>([])
  let ref = useRef<typeof getTasks>(getTasks)
  ref.current = getTasks

  useEffect(() => {
    SetTasks([])
  }, [client])

  useEffect(() => {
    var id = setInterval(() => {
      getTasks().then(task => {
        SetTasks(task)
      })
    }, interval)

    return () => clearInterval(id)
  }, [client])

  useEffect(() => {
    getTasks().then(task => {
      SetTasks(task)
    })
  }, [client])

  return tasks
}

export const useAsync = (asyncFunction: () => Promise<any>, immediate = true) => {
  const [pending, setPending] = useState<boolean>(false);
  const [value, setValue] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  // useCallback ensures useEffect is not called on every render, but only if asyncFunction changes.
  const execute = useCallback(() => {
    setError(null);
    setPending(true);
    setValue(null);

    return asyncFunction()
      .then((response: any) => setValue(response))
      .catch((err: any) => setError(err))
      .finally(() => setPending(false));
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    error, execute, pending, value,
  };
};

export const SelectedTasksContext = React.createContext({
  selectedTasks: [],
  setSelectedTasks: Function(),
})
SelectedTasksContext.displayName = 'SelectedTasksContext'

export function useSelect(tasks: any[], ref: any) {
  let tasksContext = useContext(SelectedTasksContext)
  let [selectedGids, setSelectedGids] = useState<string[]>([])

  useImperativeHandle(ref, () => {
    return {
      selectAll: function () {
        if (tasksContext.selectedTasks.length == tasks.length) {
          tasksContext.setSelectedTasks([])
          setSelectedGids([])
        } else {
          tasksContext.setSelectedTasks(tasks)
          setSelectedGids(tasks.map(task => task.gid))
        }
      }
    }
  }, [tasks])

  function selectTask(e: React.ChangeEvent<HTMLInputElement>, gid: any) {
    let gids   //为了确保数据是最新的
    if (e.target.checked) {
      gids = [...selectedGids, gid]
    } else {
      gids = selectedGids.filter(it => it !== gid)
    }
    setSelectedGids(gids)

    tasksContext.setSelectedTasks(gids.map(gid => {
      return tasks.find(it => it.gid === gid)
    }))
  }

  return {
    selectedGids,
    selectTask: selectTask,
    tasksContext
  }
}