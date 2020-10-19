import DoorComponent from "./Door.svelte"

window.OldDoorComponent = function (options) {
    return new DoorComponent(options)
}
