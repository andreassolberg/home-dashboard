interface EntityState {
  state: string;
  updated: Date;
}

// interface EntityResponse {
//   entity_id?: string;
//   state: string;
//   last_changed: string;
// }

export default class HAData {
  token: string;
  constructor(token: string) {
    this.token = token;
    console.log("HA data ready", this.token);
    this.getAPI("states?filter=room:kjellerstua");
  }

  getAPI(path: string) {
    return fetch("https://home.solweb.no/api/" + path, {
      mode: "cors",
      headers: {
        Authorization: "Bearer " + this.token,
      },
    }).then((response) => response.json());
  }

  listen(entities: string[], callback: Function) {
    let msgid = 1;
    const data: { [entityId: string]: EntityState } = {};

    entities.forEach((entity) => {
      this.getAPI("states/" + entity).then((response) => {
        if (!response.entity_id) return;
        data[response.entity_id] = {
          state: response.state,
          updated: new Date(response.last_changed),
        };
        callback(data);
      });
    });

    const socket = new WebSocket("wss://home.solweb.no/api/websocket");
    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({ type: "auth", access_token: this.token }));
    });
    setTimeout(() => {
      socket.send(
        JSON.stringify({
          id: ++msgid,
          type: "subscribe_events",
          event_type: "state_changed",
        })
      );
    }, 1000);
    socket.addEventListener(
      "message",
      function (this: WebSocket, message: any): void {
        try {
          const msg = JSON.parse(message.data);
          if (msg.type !== "event") return;
          if (msg.event.event_type !== "state_changed") return;
          if (!entities.includes(msg.event.data.entity_id)) return;

          data[msg.event.data.entity_id] = getStateObj(msg.event.data);

          callback(data);
        } catch (e) {
          console.error("Error parsing message data:", e);
        }
      }
    );

    return () => socket.close();
  }
}

const getStateObj = (msg: any) => {
  let o = {
    state: msg.new_state.state,
    updated: new Date(msg.new_state.last_changed),
  };
  return o;
};
