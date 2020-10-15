<script>
    import { onDestroy, onMount } from "svelte"

    export let eventName
    let angle

    onMount(() => {
        console.log("Subscribe on event:", eventName)
        document.addEventListener(eventName, eventHandler)
    })

    onDestroy(() => {
        document.removeEventListener(eventName, eventHandler)
    })

    function eventHandler(event) {
        console.log("ANGLE: ", event.detail.value)
        angle = event.detail.value
    }

</script>

<div
    class="cirlce"
    style={`background: conic-gradient(from 0turn at 0% 100%, #1B74F8 ${angle}deg, #102A42 0deg)`}
>
    <div class="pointer" style={`transform: rotate(${angle}deg)`}></div>
</div>

<style>
    .cirlce {
        width: 50px;
        height: 50px;
        border-radius: 0 100% 0 0;
        border: 1px solid #1B74F8;
        position: relative;
        background: conic-gradient(from 0turn at 0% 100%, #1B74F8 12deg, #102A42 0deg);
    }


    .pointer {
        position: absolute;
        margin: auto;
        left: 0;
        bottom: 0;
        background: #1B74F8;
        width: 2%;
        height: 100%;
        transform: rotate(54deg);
        transform-origin: bottom left;
    }
</style>