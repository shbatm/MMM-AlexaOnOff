/* global Module */

/* Magic Mirror
 * Module: MMM-AlexaOnOff
 *
 * By shbatm
 * MIT Licensed.
 */
/* jshint esversion:6 */

Module.register("MMM-AlexaOnOff", {
    defaults: {
        netInterface: "wlan0",
        netProtocol: "IPv4",
        startPort: 21900,
        devices: [
            "Magic Mirror",
        ]
    },

    requiresVersion: "2.5.0", // Required version of MagicMirror

    start: function() {
        this.sendSocketNotification("INITIALIZE", this.config);
    },

    getScripts: function() {
        return [];
    },

    getStyles: function() {
        return [];
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "ACTION_RECEIVED") {
            this.config.devices.forEach(d => {
                if (typeof d === "object" && payload.device === d.name) {
                    if (payload.action in d) {
                        if (Object.prototype.toString.call(d[payload.action]) === '[object Array]') {
                            // Array of notifications present
                            d[payload.action].forEach(n => {
                                this.sendNotification(n.notification, n.payload);    
                            });
                        } else {
                            // Single notification present
                            this.sendNotification(d[payload.action].notification, d[payload.action].payload);
                        }
                    } else {
                        this.sendNotification("MMM-AlexaOnOff_ACTION_RECEIVED", payload);
                    }
                } else if (typeof d === "string" && payload.device === d) {
                    this.sendNotification("MMM-AlexaOnOff_ACTION_RECEIVED", payload);
                }
            });
        }
    },

    notificationReceived: function(notification, payload, sender) {
        // Do nothing.
    },
});