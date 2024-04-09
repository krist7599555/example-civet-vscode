<script lang="civet">
{ funny_sequence } from "../lib/sequence.civet"
{ onMount } from svelte

a .= $state<number>([])

mul := () =>
  a.push(funny_sequence(a.length + 1))

onMount () =>
  for [1..5]
    mul()
</script>


<button on:click={mul}>multiple</button>
{#each a as itm}
   <pre>{itm}</pre>
{/each}
