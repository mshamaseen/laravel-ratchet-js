class Shama {

    /**
     *
     * @param url
     */
    constructor(url = 'ws://localhost:9090') {
        this.connection = new WebSocket(url);

        let _this = this;
        this.connection.onopen = function (e) {
            _this.onOpen(e);
        };
        this.connection.onmessage = function (e) {
            _this.onMessage(e);
        };
        this.connection.onclose = function (e) {
            _this.onClose(e);
        };
        this.connection.onerror = function (e) {
            _this.onError(e);
        };

        /**
         * @type {{event: listener}}
         */
        this.listeners = {

        };

        this.defaultListeners();

        this.session = null;
    }

    onOpen(e) {
        console.log("Connection established!");
        this.send({
            route:'initializeWebsocket'
        });
    };

    onError(e) {
        if(e.hasOwnProperty('message'))
        {
            console.error(e.message);
            return true;
        }
        console.error(e);
    };

    onClose(e) {
        console.error('WebSocket closed !');
    };

    onMessage(e) {
        let data = JSON.parse(e.data);
        if(!data.hasOwnProperty('event'))
        {
            console.error('response don\'t have a event property !');
            return false;
        }

        if (data.event in this.listeners) {
            return this.listeners[data.event](data);
        }

        console.log(data);

        return false;
    };

    /**
     * @param {string} event
     * @param {function} method
     * @returns {boolean}
     */
    addListeners(event, method) {
        if (typeof method !== 'function') {
            console.error("listeners value should be a function.");
            return false;
        }

        this.listeners[event] = method;

        return true;
    };

    /**
     * @param {object} data
     * @returns {boolean}
     */
    send(data) {
        if(!data.hasOwnProperty('route'))
        {
            console.error('no route specified');
            return false;
        }
        if(typeof this.session === 'string')
        {
            data['session'] = this.session;
        }

        this.connection.send(JSON.stringify(data));
    }

    /**
     *
     * @param {object} data
     */
    initialize(data)
    {
        console.log(data.message);
    }

    /**
     *
     * @param {object} data
     */
    default(data)
    {
        console.log(data);
    }

    defaultListeners(){
        this.addListeners('error',this.onError);
        this.addListeners('initialize',this.initialize);
        // this.addListeners('sendToUser',this.initialize);
        // this.addListeners('sendToRoom',this.initialize);
        this.addListeners('default',this.default);
    }
}