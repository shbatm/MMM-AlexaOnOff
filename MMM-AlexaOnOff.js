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
        /* devices accepts a mixed array of strings or objects of the form:
            { 
              name: "Device Name",
              on: { 
                notification: "NOTIFICATION_TITLE",
                payload: "NOTIFICATION PAYLOAD"
              },
              off: { 
                notification: "NOTIFICATION_TITLE",
                payload: "NOTIFICATION PAYLOAD"
              },
            }
        */
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
                        this.sendNotification(d[payload.action].notification, d[payload.action].payload);
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