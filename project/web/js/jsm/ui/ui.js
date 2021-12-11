import * as Shell from './shell.js'

class UI {
    constructor() {
        // _dag = Shell.dag();
        // _console = Shell.console();
        // _command = Shell.command();
        // _menu = Shell.menu();
        // _notifations = Shell.notifications();
    }

    toggle(id) {
        let target = document.getElementById(id);
        if(target.style.display == 'block') {
            target.style.display = 'show';
        } else {
            target.style.display == 'none';
        }
    }
};