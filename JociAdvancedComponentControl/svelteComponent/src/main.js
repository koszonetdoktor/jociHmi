import AddButtonComponent from "./AddButton.svelte"

window.AddButton = function (options) {
    return new AddButtonComponent(options)
}
