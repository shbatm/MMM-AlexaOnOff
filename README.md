# MMM-AlexaOnOff

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Send MagicMirror simple On/Off commands from any home automation device supporting Wemos devices through the [`fauxmojs`](https://github.com/dsandor/fauxmojs) Node.js module. No AWS, microphones, buttons, or 3rd-Party hubs required.

## Installation

*Assumptions:* This module assumes that you have a stand-alone home automation device, such as an Amazon Echo, Echo Dot, Google Home Hub, etc. This module receives commands from these devices over your WiFi and, using [dsandor's](https://github.com/dsandor) fauxmojs Fake Wemos module, translates them into commands for the MagicMirror.

This module also does not control anything on it's own by design. There are plenty of Modules out there to turn on/off the monitor, switch profiles, show/hide modules etc.  This module simply rebroadcasts commands when received as notifications to other modules.

#### To Install:

1. Install the module in your Mirror:

    ```shell
    cd ~/MagicMirror/modules
    git clone https://github.com/shbatm/MMM-AlexaOnOff.git
    cd MMM-AlexaOnOff/
    npm install
    ```
2. Setup the configuration using the details below.
3. Discover devices on your home automation system of choice.
    - For Amazon Alexa devices, simply say "Alexa, discover my devices"
4. For each device you have configured, you can say "Alexa, turn [device name] on", or "off".
    - These `on` and `off` commands will send the notifications you have configured to the different modules.

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-AlexaOnOff',
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `devices`        | *Required* devices accepts a mixed array of strings with device names (e.g. `"Magic Mirror"`) or objects of the form:<br>`{`<br>`  name: "Device Name",`<br>`  on: {`<br>`    notification: "NOTIFICATION_TITLE",`<br>`    payload: "NOTIFICATION PAYLOAD"`<br>`  },`<br>`  off: { `<br>`    notification: "NOTIFICATION_TITLE",`<br>`    payload: "NOTIFICATION PAYLOAD"`<br>`  },`<br>`}`<br><br>In addition to a single notification, `on:` or `off:` can also accept an array of notifications to send. See example below.<br>*Note:* If you provide only string names, or don't provide details on the `on` or `off` notification you want to send, a generic "MMM-AlexaOnOff_ACTION_RECEIVED" notification will be sent with the device name and action in the payload. While not useful by itself, you could have a module that watched for this and did something.
| `netInterface` | *Optional* Network interface you are using<br>Default: `wlan0` for WiFi. If your mirror uses wired ethernet, use `eth0`.
| `netProtocol` | *Optional* Network protocol you are using<br>Default: `IPv4`, change only if you use `IPv6` exclusively.
| `startPort` | *Optional* Starting network port to use. Each device you create will be given its own port in a series starting with this one. 

## Example - Turn On/Off Monitor using an Amazon Echo and MMM-OnScreenMenu module

The [MMM-OnScreenMenu](https://github.com/shbatm/MMM-OnScreenMenu) module allows for controlling your mirror from notifications [sent by other modules](https://github.com/shbatm/MMM-OnScreenMenu#controlling-the-menu-from-another-module).

To use:

1. Start MagicMirror with configuration included below.
2. Say "Alexa, discover my devices."
    - Alexa should find a new device called "Magic Mirror"
3. Say "Alexa, turn off magic mirror."
    - This module will receive the command, find an "off" notification to send.
    - The MMM-OnScreenMenu module will recieve a "ONSCREENMENU_PROCESS_ACTION" notification telling it to turn off the monitor.

#### Example Configuration

**Turn on or off the monitor using MMM-OnScreenMenu module:**
```js
{
    module: 'MMM-OnScreenMenu',
    position: 'bottom_right',
},
{
    module: 'MMM-AlexaOnOff',
    config: {
        devices: [{ 
              name: "Magic Mirror",
              on: { 
                notification: "ONSCREENMENU_PROCESS_ACTION",
                payload: { actionName:'monitorOn' }
              },
              off: { 
                notification: "ONSCREENMENU_PROCESS_ACTION",
                payload: { actionName:'monitorOff' }
              },
        }]
    }
}
```

**Show or hide a module using the MMM-RemoteControl module:**
(see [here](https://github.com/Jopyth/MMM-Remote-Control#list-of-actions) for specifics on the module identifier needed)
```js
{
    module: 'MMM-AlexaOnOff',
    config: {
        devices: [{ 
              name: "Clock Module",
              on: { 
                notification: "REMOTE_ACTION",
                payload: { action: "SHOW", module: "module_3_clock" }
              },
              off: { 
                notification: "REMOTE_ACTION",
                payload: { action: "HIDE", module: "module_3_clock" }
              },
        }]
    }
}
```

**Sending multiple notifications with one device:**
Config section to do this with MMM-Remote-Control (see [here](https://github.com/Jopyth/MMM-Remote-Control#list-of-actions) for specifics on the module identifier needed):
```js
{
    module: 'MMM-AlexaOnOff',
    config: {
        devices: [{ 
              name: "Calendar",
              on: [
                  { 
                    notification: "REMOTE_ACTION",
                    payload: { action: "SHOW", module: "module_4_calendar" }
                  },
                  { 
                    notification: "REMOTE_ACTION",
                    payload: { action: "HIDE", module: "module_3_clock" }
                  }
              ],
              off: [
                  { 
                    notification: "REMOTE_ACTION",
                    payload: { action: "HIDE", module: "module_4_calendar" }
                  },
                  { 
                    notification: "REMOTE_ACTION",
                    payload: { action: "SHOW", module: "module_3_clock" }
                  }
              ],
        }]
    }
}
```
