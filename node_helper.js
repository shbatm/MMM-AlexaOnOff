/* Magic Mirror
 * Node Helper: MMM-AlexaOnOff
 *
 * By shbatm
 * MIT Licensed.
 */

/* jshint node:true, esversion:6 */

var NodeHelper = require("node_helper");
const os = require('os');
const FauxMo = require('fauxmojs');

module.exports = NodeHelper.create({
    start: function() {
        this.initialized = false;
        console.log("Module helper started for " + this.name);
    },

    initialize: function() {
        if (!this.config) { console.error("MMM-AlexaOnOff Config Error."); return; }

        // Find the IP Address to use
        let netIfaces = os.networkInterfaces();
        this.ip = "127.0.0.1";

        if (!(this.config.netInterface in netIfaces)) {
            console.warn(`Requested network interface ${this.config.netInterface} not found!`);
        } else {
            let netDetail = netIfaces[this.config.netInterface].find(x => x.family === this.config.netProtocol);
            this.ip = netDetail.address;
        }

        let dev = [];

        this.config.devices.forEach((d, i) => {
            let dName = (typeof d === "string") ? d : d.name;
            console.log( this.config.startPort + i);
            dev.push({
                name: dName,
                port: this.config.startPort + i,
                handler: (action) => {
                    console.log(`Fauxmo Action for ${dName}: ${action}`);
                    this.sendSocketNotification("ACTION_RECEIVED", { device: dName, action: action });
                }
            });
        });

        this.fauxMo = new FauxMo({
            ipAddress: this.ip,
            devices: dev
        });

        console.info(`FauxMo service started. Listening on ${this.ip}:${this.config.startPort}${(this.config.devices.length > 1) ? "-" +
            (this.config.startPort + (this.config.devices.length - 1)) : ""}`);
        this.initialized = true;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "INITIALIZE" && !this.initialized) {
            this.config = payload;
            this.initialize();
        }
    }
});