<script>
    import { onDestroy, onMount } from "svelte";
    let count = 0;
    export let color 
    export let eventName

    function eventHandler(event) {
        console.log("incoming evetn", event)
        console.log("value", event.detail.value)
    }

    
    onMount(() => {
        document.addEventListener(eventName, eventHandler)
    })

    onDestroy(() => {
        document.removeEventListener(eventName, eventHandler)
    })

	function handleClick() {
		count += 1;
    }
    console.log("color", color)
</script>

<button on:click={handleClick}>
	Clicked {count} {count === 1 ? 'time' : 'times'}
</button>

<style>
    button {
        background-color: yellow;   
    }
</style>