'use strict';

import { Socket } from 'socket.io-client';

interface State {
    socket: Socket;

    pageId : string,
    setPageId : Function,
}

export default {} as State;
