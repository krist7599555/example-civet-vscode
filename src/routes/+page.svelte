<script lang="ts">
import { createCounter } from './couter.svelte.civet'
import * as c3 from "./couter3"
import { DATA } from './data'
import { createTodo } from './todo.svelte'
import Inject from './Inject.svelte'
let { data } = $props();

let counter = createCounter();
let todo = createTodo();
console.log(c3)
</script>

<h1>Civet Svelte</h1>


<h2>Server</h2>
<pre>{JSON.stringify(data)}</pre>

<h2>FizzBuzz {counter.count} {counter.fizz}</h2>
<button on:click={counter.inc}>Increment</button>

<h2>Inject</h2>
<Inject />
