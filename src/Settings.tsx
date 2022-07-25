import { useEffect, useState } from "react";
import { IProps } from "./Downloading";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Settings({ client }: IProps) {

  let [option, setOption] = useState<any>([])

  const showOption = [
    'dht-file-path',
    'check-integrity',
    'conf-path'
  ]

  const showOptionChinese = {
    'dht-file-path': '下载储存路径',
    'check-integrity': '检查完整性',
    'conf-path': '配置路径'
  }

  useEffect(() => {
    //@ts-ignore
    client.getGlobalOption().then(options => {
      let needOptions: any = {}
      for (let key in options) {
        if (showOption.includes(key)) {
          needOptions[key] = options[key]
        }
      }
      setOption(needOptions)
    })
  }, [])

  function setOneOption(e: React.ChangeEvent<HTMLInputElement>, key: string) {
    setOption({
      ...option,
      [key]: e.target.type == 'text' ? e.target.value : e.target.checked ? 'true' : 'false'
    })
    toast('已成功修改系统配置')
  }




  if (option) {
    return (
      <div>
        <ToastContainer/>
        <h2 className="horizontally">设置</h2>
        <div id="aria2-wrapper">
          {
            Object.entries(option).map(([key, val]: [string, any]) => {
              //@ts-ignore
              let chineseOp = showOptionChinese[key]
              return (
                <div className="setting-input" key={key}>
                  <span className="aria2-frist">{chineseOp}</span>
                  {
                    val == 'true' || val == 'false'
                      ? <input type="checkbox" checked={val == 'true'} onChange={(e) => { setOneOption(e, key) }} />
                      : <input type="text" value={val} onChange={(e) => { setOneOption(e, key) }} />
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
  return <div>loading settings...</div>
}