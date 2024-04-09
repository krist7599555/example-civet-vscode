<script lang="ts">
import { createCounter } from './couter.svelte'
import { DATA } from './data'
import { createTodo } from './todo.svelte'

let { data } = $props();

let counter = createCounter();
let todo = createTodo();
</script>

<pre>{JSON.stringify(data)}</pre>
<h1>Welcome to SvelteKit {counter.count}</h1>
<button on:click={counter.inc}>Increment</button>

