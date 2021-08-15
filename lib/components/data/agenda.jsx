import * as Uebersicht from 'uebersicht'
import * as DataWidget from './data-widget.jsx'
import * as DataWidgetLoader from './data-widget-loader.jsx'
import * as Icons from '../icons.jsx'
import useWidgetRefresh from '../../hooks/use-widget-refresh'
import * as Utils from '../../utils'
import * as Settings from '../../settings'

export { agendaStyles as styles } from '../../styles/components/data/agenda'

const refreshFrequency = 10000

const settings = Settings.get()

export const Widget = () => {
  const { widgets, batteryWidgetOptions } = settings
  const { agendaWidget } = widgets

  const [state, setState] = Uebersicht.React.useState()
  const [loading, setLoading] = Uebersicht.React.useState(agendaWidget)

  const getEvent = async () => {
    const [event] = await Promise.all([
      Uebersicht.run(`$HOME/bin/agenda`),
    ])
    setState({
      event: event,
    })
    setLoading(false)
  }

  useWidgetRefresh(batteryWidget, getEvent, refreshFrequency)

  if (loading) return <DataWidgetLoader.Widget className="agenda" />
  if (!state) return null

  const { event } = state

  const onClick = async (e) => {
    Utils.clickEffect(e)
    getBattery()
  }

 return (
    <DataWidget.Widget>
      {event}
    </DataWidget.Widget>
  )
}
