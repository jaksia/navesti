<script lang="ts">
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="mx-auto flex flex-wrap items-center justify-center gap-4 overflow-auto">
	<div class="card bg-base-200 w-96 shadow-sm">
		<figure class="!diff aspect-4/3" style="align-items: unset;">
			<div class="diff-item-1" role="img">
				<img src="/images/svetelne/noc.png" alt="svetelne-noc" />
			</div>
			<div class="diff-item-2 after:top-4/5" role="img">
				<img src="/images/svetelne/den.png" alt="svetelne-den" />
			</div>
			<div class="diff-resizer top-4/5"></div>
		</figure>
		<div class="card-body">
			<h2 class="card-title">Svetelné návestidlá</h2>
			<p></p>
			<div class="card-actions justify-end">
				<a class="btn btn-accent btn-soft" href="/signal/">Otvoriť</a>
			</div>
		</div>
	</div>

	<div class="card bg-base-200 w-96 shadow-md">
		<figure class="!diff aspect-4/3" style="align-items: unset;">
			<div class="diff-item-1" role="img">
				<img src="/images/autoblok/noc.png" alt="autoblok-noc" />
			</div>
			<div class="diff-item-2 after:top-4/5" role="img">
				<img src="/images/autoblok/den.png" alt="autoblok-den" />
			</div>
			<div class="diff-resizer top-4/5"></div>
		</figure>
		<div class="card-body">
			<h2 class="card-title">Autoblok</h2>
			<p></p>
			<div class="card-actions justify-end">
				<a class="btn btn-error btn-soft" href="/autoblok/">Otvoriť</a>
			</div>
		</div>
	</div>

	<div class="card bg-base-200 w-96 shadow-sm">
		<figure class="!diff aspect-4/3" style="align-items: unset;">
			<div class="diff-item-1" role="img">
				<img src="/images/mechanicke/noc.png" alt="mechanicke-noc" />
			</div>
			<div class="diff-item-2 after:top-4/5" role="img">
				<img src="/images/mechanicke/den.png" alt="mechanicke-den" />
			</div>
			<div class="diff-resizer top-4/5"></div>
		</figure>
		<div class="card-body">
			<h2 class="card-title">Mechanické návestidlá</h2>
			<p></p>
			<div class="card-actions justify-end">
				<a class="btn btn-warning btn-soft" href="/mechanicke/">Otvoriť</a>
			</div>
		</div>
	</div>

	<div class="card bg-base-200 w-96 shadow-sm">
		<figure class="!diff aspect-4/3" style="align-items: unset;">
			<div class="diff-item-1" role="img">
				<img src="/images/mechanicke/zriadovacie/noc.png" alt="mechanicke-zriadovacie-noc" />
			</div>
			<div class="diff-item-2 after:top-4/5" role="img">
				<img src="/images/mechanicke/zriadovacie/den.png" alt="mechanicke-zriadovacie-den" />
			</div>
			<div class="diff-resizer top-4/5"></div>
		</figure>
		<div class="card-body">
			<h2 class="card-title">Mechanické zriaďovacie návestidlá</h2>
			<p></p>
			<div class="card-actions justify-end">
				<a class="btn btn-info btn-soft" href="/mechanicke/zriadovacie/">Otvoriť</a>
			</div>
		</div>
	</div>

	<div class="card bg-base-200 w-96 shadow-md">
		<figure>
			<img src="/images/spadovisko.png" alt="spadovisko" class="aspect-4/3" />
		</figure>
		<div class="card-body">
			<h2 class="card-title">Spádovisko</h2>
			<p></p>
			<div class="card-actions justify-end">
				<a class="btn btn-secondary btn-soft" href="/spadovisko/">Otvoriť</a>
			</div>
		</div>
	</div>
</div>
