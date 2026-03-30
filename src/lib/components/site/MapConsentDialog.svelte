<script lang="ts">
	let {
		open = false,
		location = '',
		onDecision
	} = $props<{
		open?: boolean;
		location?: string;
		onDecision: (accepted: boolean) => void;
	}>();

	const uid = $props.id();
	const titleId = `${uid}-title`;
	const descriptionId = `${uid}-description`;
	const dialogId = `${uid}-dialog`;

	function closeOnBackdrop(event: MouseEvent): void {
		if (event.target === event.currentTarget) onDecision(false);
	}

	function trapFocus(event: KeyboardEvent): void {
		if (!open) return;
		const dialogEl = document.getElementById(dialogId) as HTMLDivElement | null;
		if (!dialogEl) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			onDecision(false);
			return;
		}

		if (event.key !== 'Tab') return;
		const focusable = Array.from(
			dialogEl.querySelectorAll<HTMLElement>(
				'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
			)
		);
		if (focusable.length === 0) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const active = document.activeElement as HTMLElement | null;

		if (event.shiftKey && active === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && active === last) {
			event.preventDefault();
			first.focus();
		}
	}

	function focusOnMount(node: HTMLButtonElement): () => void {
		const timer = window.setTimeout(() => node.focus(), 0);
		return () => window.clearTimeout(timer);
	}

</script>

<svelte:window onkeydown={trapFocus} />

{#if open}
	<div
		class="fixed inset-0 z-[60] bg-on-surface/45 backdrop-blur-sm flex items-center justify-center px-4"
		role="presentation"
		onclick={closeOnBackdrop}
	>
		<div
			id={dialogId}
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			aria-describedby={descriptionId}
			class="w-full max-w-lg bg-surface-container rounded-3xl p-6 md:p-8"
		>
		<h2 id={titleId} class="text-2xl font-bold font-headline text-on-surface mb-3">Ort in Google Maps anzeigen?</h2>
		<p id={descriptionId} class="text-on-surface-variant leading-relaxed">
			<strong class="text-on-surface font-semibold">"{location}"</strong> auf Google Maps öffnen. Dabei werden Daten an Google übermittelt.
		</p>
		<div class="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
			<button
				type="button"
				{@attach focusOnMount}
				class="px-5 py-2.5 rounded-xl bg-surface-container-highest text-on-surface font-bold hover:brightness-95 transition"
				onclick={() => onDecision(false)}
			>
				Abbrechen
			</button>
			<button
				type="button"
				class="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold hover:brightness-110 transition"
				onclick={() => onDecision(true)}
			>
				Google Maps öffnen
			</button>
		</div>
		</div>
	</div>
{/if}
