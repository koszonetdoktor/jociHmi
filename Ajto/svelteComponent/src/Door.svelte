<script lang="ts">
    import { onDestroy, onMount } from "svelte"
    import { createRootTheme, groupColorMap } from "./theme"
    import type {GroupNumbers, ValueChangeEventDetail} from "./types"
    import { limitAngle } from "./utils";
    export let valueChangeEvent
    let hasReachedStart = false
    let hasReachedEnd = false

    let targetPosition = "0"
    let currentPosition = "0"

    let selectedGroup: GroupNumbers = 0

    let endAngle = 90
    $: correctEndAngle = 90 - endAngle

    let openAngle = 30
    $: correctAngle = 90 - openAngle

    let brakeOpen = false
    $: brakeColor = brakeOpen ? "var(--theme-color-green)" : "var(--theme-color-lightBlue)"

    onMount(() => {
        createRootTheme()
        document.addEventListener(valueChangeEvent, eventHandler)
    })

    onDestroy(() => {
        document.removeEventListener(valueChangeEvent, eventHandler)
    })

    function eventHandler(event: {detail: ValueChangeEventDetail}) {
        const {key, value} = event.detail
        switch(key) {
            case "open_angle": 
                openAngle = limitAngle(Number(value))
                break 
            case "end_angle": 
                endAngle = limitAngle(Number(value))
                break
            case "end_position": 
                hasReachedEnd = Boolean(value)
                break
            case "start_position": 
                hasReachedStart = Boolean(value)
                break
            case "target_position": 
                targetPosition = value.toString()
                break
            case "current_position": 
                currentPosition = value.toString()
                break
            case "group":
                selectedGroup = typeof value === "number" ? value : 0
                break
            case "brake_open": 
                brakeOpen = Boolean(value)
                break
            default:
                break
        }
    }  
    

</script>

<div class="container" style={`border: 3px solid ${groupColorMap[selectedGroup]};`}>
    <div class="position_container">
        <div class="position_target">{targetPosition}</div>
        <div class="position_current" style={`color: ${brakeColor}`} >{currentPosition}</div>
    </div>
    <div
        class="cirlce"
        style={`background: conic-gradient(from 0turn at 0% 100%, transparent ${correctAngle}deg, ${brakeColor} 0deg)`}
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
        right: 1rem;
        text-align: right;
    }
    .position_target {
        color: var(--theme-color-gray);
    }
    .position_current {
        color: var(--theme-color-green);
    }
</style>