import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import * as Settings from '../../settings'
import * as Utils from '../../utils'
import useWidgetRefresh from '../../hooks/use-widget-refresh'

export { keyboardStyles as styles } from '../../styles/components/data/keyboard'

const refreshFrequency = 600000

const settings = Settings.get()
var currentLayout = null

export const Widget = () => {
  const { keyboardWidget } = settings.widgets

  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(keyboardWidget)

  const getKeyboard = async () => {
    const keyboard = await Uebersicht.run(
      `defaults read ~/Library/Preferences/com.apple.HIToolbox.plist AppleSelectedInputSources | egrep -w 'KeyboardLayout Name' | sed 's/"//g' | sed 's/KeyboardLayout Name = //g'`
    )
    // skip updating state if language didn't change
    if (currentLayout != keyboard) currentLayout = keyboard
    else return
    setState({ keyboard: Utils.cleanupOutput(keyboard) })
    setLoading(false)
  }

  useWidgetRefresh(keyboardWidget, getKeyboard, refreshFrequency)

  if (loading) return <DataWidgetLoader.Widget className="keyboard" />
  if (!state) return null
  const { keyboard } = state

  if (!keyboard?.length) return null

  const lang = keyboard.replace("'KeyboardLayout Name' =", '').replace(';', '')
  const formatedOutput = lang == "ABC" ? "EN" : lang.substr(0,2).toUpperCase()

  return (
    <DataWidget.Widget classes="keyboard" Icon={Icons.Keyboard}>
      {formatedOutput}
    </DataWidget.Widget>
  )
}
