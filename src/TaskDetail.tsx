import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { IProps } from "./Downloading";
import { useAsync, useTasks } from "./Hooks";
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react'


export default function TaskDetail({ client }: IProps) {
  type EChartsOption = echarts.EChartsOption;
  var params = useParams()

  var { pending, value } = useAsync(useCallback(async () => {
    //@ts-ignore
    return await client.tellStatus(params.gid)
  }, []))

  var task = useTasks(() => {
    return client.ready().then((client: any) =>
      client.tellStatus(params.gid))
  }, 1000)

  let [speed, setSpeed] = useState([[new Date().getTime(), 0]])


  useEffect(() => {
    let id = window.setInterval(() => {
      //@ts-ignore
      setSpeed(newspeed => [...newspeed, [new Date().getTime(), task.downloadSpeed]])
    }, 1000)
    return () => clearInterval(id)
  }, [task])




  function isStatus(status: any) {
    var state = null
    switch (status) {
      case ('active'):
        return state = '正在下载中'

      case ('waiting'):
        return state = '正在等待中'

      case ('paused'):
        return state = '下载被暂停'

      case ('error'):
        return state = '因错误停止'

      case ('complete'):
        return state = '已完成'

      case ('removed'):
        return state = '已被删除'

    }
  }



  let getOption = () => {
    let option: EChartsOption = {
      xAxis: {
        type: 'time',
        boundaryGap: false,
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          //@ts-ignore
          data: [...speed],
          type: 'line',
          areaStyle: {}
        }
      ]
    };

    return option
  }




  if (value) {
    return (
      <div>
        <h2 className="horizontally">信息总览</h2>
        <div id="aria2-wrapper">
          <div>
            <span className="aria2-frist">文件名称: </span><span>{value.files[0].path.split('/').pop()}</span>
          </div>
          <div>
            <span className="aria2-frist">当前状态:</span>{isStatus(value.status)}
          </div>
          <div>
            <span className="aria2-frist">任务大小：</span>{value.totalLength + ' B'}
          </div>
          <div>
            <span className="aria2-frist">已下载：</span>{(value.completedLength/value.totalLength*100).toFixed(2) + ' %'}
          </div>
          <div>
            <span className="aria2-frist">下载速度：</span>{(value.downloadSpeed / 1024).toFixed(2)} kb/s
          </div>
          <div>
            <span className="aria2-frist">下载地址：</span>{value.files[0].uris[0].uri}
          </div>
          <div>
            <span className="aria2-frist">下载文件目录：</span>{value.dir}
          </div>
        </div>

        <ReactEcharts option={getOption()} />
      </div>
    )
  }
  if (pending) {
    return <div>loading...</div>
  }
  return null
}