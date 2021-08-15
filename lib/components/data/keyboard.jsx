import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import * as Settings from '../../settings'
import * as Utils from '../../utils'
import useWidgetRefresh from '../../hooks/use-widget-refresh'

export { keyboardStyles as styles } from '../../styles/components/data/keyboard'

const refreshFrequency = 1000

const settings = Settings.get()

export const Widget = () => {
  const { keyboardWidget } = settings.widgets

  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(keyboardWidget)

  const getKeyboard = async () => {
    const keyboard = await Uebersicht.run(
      `defaults read ~/Library/Preferences/com.apple.HIToolbox.plist AppleSelectedInputSources | egrep -w 'KeyboardLayout Name' | sed 's/"//g' | sed 's/KeyboardLayout Name = //g'`
    )
    setState({ keyboard: Utils.cleanupOutput(keyboard) })
    setLoading(false)
  }

  useWidgetRefresh(keyboardWidget, getKeyboard, refreshFrequency)

  if (loading) return <DataWidgetLoader.Widget className="keyboard" />
  if (!state) return null
  const { keyboard } = state

  if (!keyboard?.length) return null

  const lang = keyboard.replace("'KeyboardLayout Name' =", '').replace(';', '')
  const formatedOutput = lang == "ABC" ? "En" : lang.substr(0,2)

  return (
    <DataWidget.Widget classes="keyboard" Icon={Icons.Keyboard}>
      {formatedOutput}
    </DataWidget.Widget>
  )
}
