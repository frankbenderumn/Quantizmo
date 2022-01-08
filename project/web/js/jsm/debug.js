class Debug {
    constructor(scene) {
        this._scene = scene;
    }

    static log(data, type="none") {
        switch(type) {
            case "success":
                console.log("%c SUCCESS: %s", "color: rgba(50, 255, 50, 1)", data);
                break;
            case "failure":
                console.log("%c FAILURE: %s", "color: rgba(255, 0, 0, 1)", data);
                break;
            case "warning":
                console.log("%c WARNING: %s", "color: rgba(255, 255, 0, 1)", data);
                break;
            case "info":
                console.log("%c INFO: %s", "color: rgba(0, 255, 255, 1)", data);
                break;
            default:
                if (typeof data === Object) {
                    let data = JSON.stringify(data);
                }
                console.log(data);
                break;
        }
    }

    static print(obj) {
        console.log("printing object");
        for (let key of obj) {
            console.log(obj[key]);
        }
    }


} export { Debug }