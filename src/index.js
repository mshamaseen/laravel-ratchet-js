class Shama {

    /**
     *
     * @param url
     * @param port
     */
    constructor(url = null,port = 9090) {

        if(url === null)
        {
            let myHostname = window.location.hostname;
            let scheme = "ws";
            if (document.location.protocol === "https:") {
                scheme += "s";
            }
            url = scheme+"://" + myHostname + ":" + port;
        }

        this.connection = new WebSocket(url);
        this.debugger = false;
        this._ready = [];
        this.isConnected = false;

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

    onOpen() {
        this.log("Connection established!");
        this.send({
            route:'initializeWebsocket'
        });
        this.isConnected = true;

        this._ready.forEach(function (callback) {
            callback();
        })
    };

    onError(e) {
        if(e.hasOwnProperty('message'))
        {
            this.error(e.message);
            return true;
        }
        this.error(e);
    };

    onClose() {
        this.isConnected = false;
        this.error('WebSocket closed !');
    };

    onMessage(e) {
        let data = JSON.parse(e.data);
        if(!data.hasOwnProperty('event'))
        {
            this.error('response don\'t have a event property!');
            return false;
        }

        if(data.event === 'default')
            this.info('No specific info called from the server, default info is called.');

        if (data.event in this.listeners) {
            return this.listeners[data.event](data);
        }

        this.log(data);

        return false;
    };

    //run this callback win websocket connected
    ready(callback)
    {
        if(typeof callback !== 'function')
            this.error('ready callback is not a function!');
        else if(this.isConnected)
            callback();
        else
            this._ready.push(callback);
    }

    /**
     * @param {string} event
     * @param {function} method
     * @returns {boolean}
     */
    addListeners(event, method) {
        if (typeof method !== 'function') {
            this.error("listeners value should be a function.");
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
            this.error('no route specified');
            return false;
        }

        if(typeof this.session === 'string')
        {
            data['session'] = this.session;
        }

        data['_url'] = window.location.href;

        this.connection.send(JSON.stringify(data));
    }

    /**
     *
     * @param {object} data
     */
    initialize(data)
    {
        this.log(data.message);
    }

    /**
     *
     * @param {object} data
     */
    default(data)
    {
        this.log(data);
    }

    defaultListeners(){
        this.addListeners('error',this.onError.bind(this));
        this.addListeners('initialize',this.initialize.bind(this));
        // this.addListeners('sendToUser',this.initialize);
        // this.addListeners('sendToRoom',this.initialize);
        this.addListeners('default',this.default.bind(this));
    }

    /**
     * @desc report a log
     * @param message
     * @return {boolean}
     */
    log(message)
    {
        if(!this.debugger)
            return true;

        console.log(message);
    }

    /**
     * @desc report an error
     * @param message
     * @return {boolean}
     */
    error(message)
    {
        if(!this.debugger)
            return true;
        console.error(message);
    }

    /**
     * @desc report an info
     * @param message
     * @return {boolean}
     */
    info(message)
    {
        if(!this.debugger)
            return true;
        console.info(message);
    }
}
