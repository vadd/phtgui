import Bar from './bar'
import React from 'react'
import {stringTailUntil} from 'utils'

function labelFormatter(event, strings) {
  let result = ''

  if (event.class_name_id) {
    result += stringTailUntil(strings[event.class_name_id], '\\') + '::'
  }

  if (event.function_name_id) {
    result += strings[event.function_name_id]
  }

  if (!result) {
    result = stringTailUntil(strings[event.filename_id], '/') + ':' + event.line_start
  }

  return result
}

export class EventCallBar extends React.Component {
  render() {
    return <Bar {...this.props} labelFormatter={labelFormatter} />
  }
}
