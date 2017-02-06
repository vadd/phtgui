import React from 'react'
import {connect} from 'react-redux'

class BarBase extends React.Component {
  render() {
    let {event, level, tscScale, tsc0} = this.props,
      x = (event.tsc_begin - tsc0) * tscScale,
      y = level * 16,
      width = (event.tsc_end - event.tsc_begin) * tscScale,
      clonedEvent = Object.assign({}, event, {children: null})

    delete clonedEvent.children

    let text = width > 5 ? <text x={x + "%"} y={y + 10}>{JSON.stringify(clonedEvent)}</text> : null

    return (<g>
      <rect x={x + "%"} y={y} width={width + "%"} height="15" rx="2" ry="2" />
      {text}
    </g>)
  }
}

const Bar = connect(
  state => ({
    tscScale: 1 * 100 / (state.trace.flame.tscEnd - state.trace.flame.tscBegin),
    tsc0: state.trace.flame.tscBegin
  }),
  dispatch => ({})
)(BarBase)

class FlameBase extends React.Component {
  render() {
    if (!this.props.event) {
      return (<div>Loading...</div>)
    }

    let bars = []
    let maxLevel = 0
    let traverse = (event, level = 0) => {
      if (level > maxLevel) {
        maxLevel = level
      }
      bars.push(<Bar key={event.tsc_begin} level={level} event={event} />)
      for (let child of event.children) {
        traverse(child, level + 1)
      }
    }
    traverse(this.props.event)

    return (<svg xmlns="http://www.w3.org/2000/svg" width="100%" height={maxLevel * 16}>
      {bars}
    </svg>)
  }
}

const Flame = connect(
  state => ({
    event: state.trace.flame.root
  }),
  dispatch => ({

  })
)(FlameBase)

export default Flame
