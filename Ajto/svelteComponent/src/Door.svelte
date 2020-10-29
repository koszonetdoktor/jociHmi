<script>
    import { onDestroy, onMount } from "svelte"
    import { createRootTheme } from "./theme"
    export let valueChangeEvent

    createRootTheme()

    let hasReachedStart = false
    let hasReachedEnd = false

    let targetPosition = 999999
    let currentPosition = 999999

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
            case "target_position": 
                targetPosition = value
                break
            case "current_position": 
                currentPosition = value
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

<div class="container">
    <div class="position_container">
        <div class="position_target">{targetPosition}</div>
        <div class="position_current">{currentPosition}</div>
    </div>
    <div
        class="cirlce"
        style={`background: conic-gradient(from 0turn at 0% 100%, transparent ${correctAngle}deg, var(--theme-color-green) 0deg)`}
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

</div>


<style>

    .container {
        width: 72px;
        height: 72px;
        padding: 8px;
        position: relative;
        display: flex;
        align-items: flex-end;
        border: 1px solid var(--theme-color-green);
        border-radius: 5px;
        font-family: 'Open Sans', sans-serif;
    }

    .cirlce {
        width: 50px;
        height: 50px;
        border-radius: 0 100% 0 0;
        position: relative;
        background: conic-gradient(from 0turn at 0% 100%, transparent 12deg, var(--theme-color-green) 0deg);
    }

    .base {
        position: absolute;
        margin: auto;
        left: 0;
        bottom: 0;
        background: var(--theme-color-gray);
        width: 5%;
        border-radius: 10px;
        height: 100%;
        transform-origin: bottom left;
        transform: rotate(90deg)
    }

    .inPosition {
        background-color: var(--theme-color-yellow);
        width: 10%;
    }

    .position_container {
        position: absolute;
        top: 2px;
        right: 2px;
    }
    .position_target {
        color: var(--theme-color-gray);
    }
    .position_current {
        color: var(--theme-color-green);
    }
</style>