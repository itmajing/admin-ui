import Vue from 'vue'
import ContextMenu from './index.vue'

export interface Position {
  x: number
  y: number
}

export interface Menu {
  key: string
  title: string
  icon: string
  children?: Array<Menu>
}

export interface Options {
  position: Position
  menuList: Array<Menu>
  onAction?: (payload: any) => void
}


export interface Props {
  position: Position
  menuList: Array<Menu>
  visible: boolean
}

export interface GlobalContextMenu {
  update: (options: Options) => void
}

function newInstance() {
  const props: Props = {
    visible: true,
    menuList: [],
    position: {
      x: 0,
      y: 0,
    },
  }
  let actionHandler = (payload: any) => {
    // ignore
  }

  const Instance = new Vue({
    render(h) {
      return h(ContextMenu, {
        props: props,
        on: {
          action: (payload: any) => {
            actionHandler(payload)
          }
        }
      })
    },
  })

  const component = Instance.$mount()
  document.body.appendChild(component.$el)
  const contextmenu: any = Instance.$children[0]

  return {
    update(options: Options) {
      contextmenu.setVisible(true)
      contextmenu.setPosition(options.position)
      contextmenu.setMenuList(options.menuList)
      if (options.onAction) {
        actionHandler = options.onAction
      }
    },
  }
}

let contextMenuInstance: GlobalContextMenu

export function contextmenu(options: Options) {
  contextMenuInstance = contextMenuInstance || newInstance()
  contextMenuInstance.update(options)
}

export default ContextMenu
