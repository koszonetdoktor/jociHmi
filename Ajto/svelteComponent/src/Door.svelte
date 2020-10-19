<script>
    import { onDestroy, onMount } from "svelte"
    export let valueChangeEvent
    export let endAngle = 80
    $: correctEndAngle = 90 - endAngle

    let hasReachedStart = false
    let hasReachedEnd = false

    let angle = 30
    $: correctAngle = 90 - angle

    onMount(() => {
        console.log("Subscribe on event:", valueChangeEvent)
        document.addEventListener(valueChangeEvent, eventHandler)
    })

    onDestroy(() => {
        document.removeEventListener(eventName, eventHandler)
    })

    function eventHandler(event) {
        const {key, value} = event.detail
        console.log("event", key, value)
    }

</script>

<div
    class="cirlce"
    style={`background: conic-gradient(from 0turn at 0% 100%, transparent ${correctAngle}deg, #109D0D 0deg)`}
>
    <div class="base" class:endPosition={hasReachedEnd} style={`transform: rotate(${correctEndAngle}deg)`}></div>
    <div class="base" class:endPosition={hasReachedStart} ></div>
</div>   

<div>
    Door component / Somehting Changes 
</div>

<style>
    .cirlce {
        width: 80px;
        height: 80px;
        border-radius: 0 100% 0 0;
        border: 1px solid transparent;
        position: relative;
        background: conic-gradient(from 0turn at 0% 100%, transparent 12deg, #109D0D 0deg);
    }

    .base {
        position: absolute;
        margin: auto;
        left: 0;
        bottom: 0;
        background: #9F9F9F;
        width: 5%;
        border-radius: 10px;
        height: 105%;
        transform-origin: bottom left;
        transform: rotate(90deg)
    }

    .endPosition {
        background-color: #CBCF06;
        width: 10%;
    }
</style>