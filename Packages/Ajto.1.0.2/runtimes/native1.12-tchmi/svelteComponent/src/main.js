import DoorComponent from "./Door.svelte"

window.DoorComponent = function (options) {
    return new DoorComponent(options)
}
