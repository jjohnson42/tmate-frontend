require("./term.scss")

import React from "react"
import $ from "jquery"
import msgpack from "msgpack-js-browser"

import Window from "./window"

const TMATE_WS_DAEMON_OUT_MSG = 0
const TMATE_WS_SNAPSHOT = 1
const TMATE_WS_PANE_KEYS = 0
const TMATE_WS_EXEC_CMD = 1

const TMATE_OUT_HEADER =          0
const TMATE_OUT_SYNC_LAYOUT =     1
const TMATE_OUT_PTY_DATA =        2
const TMATE_OUT_EXEC_CMD =        3
const TMATE_OUT_FAILED_CMD =      4
const TMATE_OUT_STATUS =          5
const TMATE_OUT_SYNC_COPY_MODE =  6
const TMATE_OUT_WRITE_COPY_MODE = 7

const WS_CONNECTING    = 0
const WS_BOOTSTRAPPING = 1
const WS_OPEN          = 2
const WS_CLOSED        = 3

const WS_ERRORS = {
  1005: "Session closed",
  1006: "Connection failed",
}

class EventBuffer {
  constructor() {
    this.pending_events = []
    this.handlers = null
  }

  send(f, args) {
    if (this.handlers)
      this.handlers[f].apply(null, args)
    else
      this.pending_events.push([f, args])
  }

  set_handler(handlers) {
    this.handlers = handlers
    this.pending_events.forEach(([f, args]) => this.send(f, args))
    this.pending_events = null
  }
}

export default class Session extends React.Component {
  state = { ws_state: WS_CONNECTING }

  componentWillMount() {
    this.char_size = this.compute_char_size()
  }

  componentDidMount() {
    this.connect()

    this.ws_handlers = new Map()
    this.ws_handlers.set(TMATE_WS_DAEMON_OUT_MSG, this.on_ws_daemon_out_msg)
    this.ws_handlers.set(TMATE_WS_SNAPSHOT,       this.on_ws_snapshot)

    this.daemon_handlers = new Map()
    this.daemon_handlers.set(TMATE_OUT_SYNC_LAYOUT, this.on_sync_layout)
    this.daemon_handlers.set(TMATE_OUT_PTY_DATA,    this.on_pty_data)
    this.daemon_handlers.set(TMATE_OUT_STATUS,      this.on_status)

    this.pane_events = new Map()
  }

  componentWillUnmount() {
    this.disconnect()
  }

  compute_char_size() {
    let c = $("<div style='position: absolute, visibility: hidden" +
                          "height: auto, width: auto' class='terminal_font'>X</div>")
    c.appendTo($('body'))
    let size = c[0].getBoundingClientRect()
    c.remove()
    return size
  }

  get_row_width(num_chars) {
    return this.char_size.width * num_chars
  }

  get_col_height(num_chars) {
    return this.char_size.height * num_chars
  }

  get_pane_event_buffer(pane_id) {
    let e = this.pane_events.get(pane_id)
    if (!e) {
      e = new EventBuffer()
      this.pane_events.set(pane_id, e)
    }
    return e
  }

  emit_pane_event(pane_id, f, ...args) {
    this.get_pane_event_buffer(pane_id).send(f, args)
  }

  on_umount_pane(pane_id) {
    this.pane_events.delete(pane_id)
  }

  ws_url() {
    return `ws://${window.location.hostname}:4001/ws/session/${this.props.params.session_token}`
  }

  connect() {
    this.ws = new WebSocket(this.ws_url())
    this.ws.binaryType = "arraybuffer"
    this.ws.onmessage = event => {
      this.on_socket_msg(this.deserialize_msg(event.data))
    }
    this.ws.onopen = event => {
      this.setState({ws_state: WS_BOOTSTRAPPING})
    }
    this.ws.onclose = event => {
      this.setState({ws_state: WS_CLOSED, ws_close_code: event.code})
    }
    this.ws.onerror = event => {
      this.setState({ws_state: WS_CLOSED, ws_close_code: -1})
    }
  }

  disconnect() {
    this.ws.onclose = undefined
    this.ws.close()
  }

  on_socket_msg(msg) {
    const [cmd, ...rest] = msg
    const h = this.ws_handlers.get(cmd)
    if (h) { h.apply(this, rest) }
  }

  on_ws_daemon_out_msg(msg) {
    const [cmd, ...rest] = msg
    const h = this.daemon_handlers.get(cmd)
    if (h) { h.apply(this, rest) }
  }

  on_ws_snapshot(panes) {
    for (const pane of panes) {
      const [pane_id, ...rest] = pane
      this.emit_pane_event(pane_id, "on_bootstrap_grid", ...rest)
    }

    this.setState({ws_state: WS_OPEN})
  }

  on_sync_layout(session_x, session_y, windows, active_window_id) {
    this.setState({
      windows: windows,
      size: [session_x, session_y],
      active_window_id: active_window_id
    })
  }

  on_pty_data(pane_id, data) {
    this.emit_pane_event(pane_id, "on_pty_data", data)
  }

  render_ws_connecting() {
    return <div className="session">
             <h3>Connecting...</h3>
           </div>
  }

  render_ws_bootstrapping() {
    return <div className="session">
             <h3>Initializing session...</h3>
           </div>
  }

  render_ws_closed() {
    const close_reason = WS_ERRORS[this.state.ws_close_code] ||
                           `Not connected: ${event.code} ${event.reason}`

    return <div className="session">
             <h3>{close_reason}.</h3>
           </div>
  }

  render_ws_open() {
    let win_nav = null;
    if (this.state.windows.length > 1) {
      const nav_elems = this.state.windows.map(win => {
        const [id, title, panes, active_pane_id] = win
        const active = this.state.active_window_id === id
        return <li key={id} role="presentation" className={active ? 'active' : ''}>
                 <a href="#" onClick={this.on_click_win_tab.bind(this, id)}>
                   <span className="win-id">{id}</span>&nbsp;
                   <span className="win-title">{title}</span></a>
               </li>
      })
      win_nav = <ul className="nav nav-tabs">{nav_elems}</ul>
    }

    const wins = this.state.windows.map(win => {
      const [id, title, panes, active_pane_id] = win
      const active = this.state.active_window_id === id
      const wrapper_style = active ? {} : {display: 'none'}
      return <div key={id} style={wrapper_style}>
               <Window key={id} session={this} id={id} title={title}
                       panes={panes} active={active} active_pane_id={active_pane_id}/>
             </div>
    })

    const session_style = {width: this.get_row_width(this.state.size[0])}
    return <div className="session" style={session_style}>
            {win_nav}
            {wins}
           </div>
  }

  render() {
    switch (this.state.ws_state) {
      case WS_CONNECTING:    return this.render_ws_connecting()
      case WS_BOOTSTRAPPING: return this.render_ws_bootstrapping()
      case WS_OPEN:          return this.render_ws_open()
      case WS_CLOSED:        return this.render_ws_closed()
    }
  }

  on_click_win_tab(win_id, event) {
    if (this.state.active_window_id !== win_id)
      this.focus_window(win_id)
  }

  send_pty_keys(pane_id, data) {
    this.send_msg([TMATE_WS_PANE_KEYS, pane_id, data])
  }

  focus_window(win_id) {
    this.send_msg([TMATE_WS_EXEC_CMD, `select-window -t ${win_id}`])
  }

  focus_pane(pane_id) {
    this.send_msg([TMATE_WS_EXEC_CMD, `select-pane -t %${pane_id}`])
  }

  send_msg(msg) {
    this.ws.send(this.serialize_msg(msg));
  }

  on_status(msg) {
    // TODO
    console.log(`Got status: ${msg}`)
  }

  serialize_msg(msg) {
    return msgpack.encode(msg)
  }

  deserialize_msg(msg) {
    return msgpack.decode(msg)
  }
}