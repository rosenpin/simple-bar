import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import * as Settings from '../../settings'
import * as Utils from '../../utils'
import useWidgetRefresh from '../../hooks/use-widget-refresh'

const settings = Settings.get()
const { userWidgetsList } = settings.userWidgets

const UserWidget = ({ widget }) => {
  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(true)
  const { icon, backgroundColor, output, onClickAction, onRightClickAction, refreshFrequency } = widget

  const getUserWidget = async () => {
    const widgetOutput = await Uebersicht.run(output)
    if (!Utils.cleanupOutput(widgetOutput).length) {
      setLoading(false)
      return
    }
    setState(widgetOutput)
    setLoading(false)
  }

  useWidgetRefresh(true, getUserWidget, refreshFrequency)

  const isCustomColor = !Settings.userWidgetColors.includes(backgroundColor)

  const style = settings.global.noColorInData
    ? undefined
    : { backgroundColor: isCustomColor ? backgroundColor : `var(${backgroundColor})` }

  if (loading) return <DataWidgetLoader.Widget style={style} />

  const Icon = icon == "None" ? null : Icons[icon]

  const hasOnClickAction = onClickAction?.trim().length > 0
  const hasRightClickAction = onRightClickAction?.trim().length > 0

  const onClick = (e) => {
    Utils.clickEffect(e)
    Uebersicht.run(onClickAction)
    getUserWidget()
  }

  const onRightClick = (e) => {
    Utils.clickEffect(e)
    Uebersicht.run(onRightClickAction)
    getUserWidget()
  }

  const onUserWidgetClick = hasOnClickAction ? { onClick } : {}
  const onUserWidgetRightClick = hasRightClickAction ? { onRightClick } : {}

  return (
    <DataWidget.Widget Icon={Icon} style={style} {...onUserWidgetClick} {...onUserWidgetRightClick}>
      {state}
    </DataWidget.Widget>
  )
}

const UserWidgets = () => {
  const keys = Object.keys(userWidgetsList)
  return keys.map((key) => <UserWidget key={key} widget={userWidgetsList[key]} />)
}

export default UserWidgets
