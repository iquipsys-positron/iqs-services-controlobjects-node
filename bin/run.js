let ControlObjectsProcess = require('../obj/src/container/ControlObjectsProcess').ControlObjectsProcess;

try {
    new ControlObjectsProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
