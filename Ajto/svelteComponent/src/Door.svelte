<script>
    import { onDestroy, onMount } from "svelte"
    export let valueChangeEvent
    
    let hasReachedStart = false
    let hasReachedEnd = false

    let endAngle = 90
    $: correctEndAngle = 90 - endAngle

    let openAngle = 30
    $: correctAngle = 90 - openAngle

    onMount(() => {
        console.log("Subscribe on event:", valueChangeEvent)
        document.addEventListener(valueChangeEvent, eventHandler)
    })

    onDestroy(() => {
        document.removeEventListener(eventName, eventHandler)
    })

    function eventHandler(event) {
        const {key, value} = event.detail
        console.log("EVENT", key, value)
        switch(key) {
            case "open_angle": 
                openAngle = limitAngle(value)
                break 
            case "end_angle": 
                endAngle = limitAngle(value)
                break
            case "end_position": 
                hasReachedEnd = value
                break
            case "start_position": 
                hasReachedStart = value
                break
            default:
                break
        }
    }

    function limitAngle(angleValue) {
        let limitedValue = angleValue
        if(limitedValue > 90) {
            limitedValue = 90
        } else if(limitedValue < 0) {
            limitedValue = 0
        }
        return limitedValue
    }

</script>

<div
    class="cirlce"
    style={`background: conic-gradient(from 0turn at 0% 100%, transparent ${correctAngle}deg, #109D0D 0deg)`}
>
    <div
        class="base"
        class:inPosition={hasReachedEnd}
        style={`transform: rotate(${correctEndAngle}deg)`}
        data-testid="marker_endPosition"
    ></div>
    <div
        class="base"
        class:inPosition={hasReachedStart}
        data-testid="marker_startPosition"
    ></div>
</div>   

<style>
    .cirlce {
        width: 80px;
        height: 80px;
        border-radius: 0 100% 0 0;
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

    .inPosition {
        background-color: #CBCF06;
        width: 10%;
    }
</style>