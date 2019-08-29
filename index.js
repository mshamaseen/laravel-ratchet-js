export class Shama {

    /**
     *
     * @param url
     */
    constructor(url = 'ws://localhost:9090') {
        this.connection = new WebSocket(url);
        this.debugger = false;
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
        this.log("Connection established!");
        this.send({
            route:'initializeWebsocket'
        });
    };

    onError(e) {
        if(e.hasOwnProperty('message'))
        {
            this.error(e.message);
            return true;
        }
        this.error(e);
    };

    onClose(e) {
        this.error('WebSocket closed !');
    };

    onMessage(e) {
        let data = JSON.parse(e.data);
        if(!data.hasOwnProperty('event'))
        {
            this.error('response don\'t have a event property !');
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
        this.addListeners('error',this.onError);
        this.addListeners('initialize',this.initialize);
        // this.addListeners('sendToUser',this.initialize);
        // this.addListeners('sendToRoom',this.initialize);
        this.addListeners('default',this.default);
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