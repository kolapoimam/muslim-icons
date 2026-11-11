<script lang="ts">
  import { Mosque } from '@muslim-icons/svelte';
  let size = $state(24);
  let clicks = $state(0);
</script>
<Mosque {size} color="#246b55" strokeWidth={1.5} aria-label="Mosque" onclick={() => clicks++} />
<button onclick={() => size = 48}>Resize</button>
<span>{clicks}</span>
