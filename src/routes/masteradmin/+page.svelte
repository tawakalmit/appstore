<script lang="ts">
	let username = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleLogin() {
		loading = true;
		error = '';

		try {
			const res = await fetch('/masteradmin/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});

			if (res.ok) {
				window.location.href = '/dashboard-admin';
			} else {
				const data = await res.json();
				error = data.message || 'Username atau password salah';
			}
		} catch (e) {
			error = 'Terjadi kesalahan, coba lagi.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login - TokoApps</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
	<div class="card w-full max-w-sm bg-base-100 shadow-xl border border-base-200">
		<div class="card-body">
			<div class="text-center mb-4">
				<div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				<h1 class="text-xl font-bold">Admin Panel</h1>
				<p class="text-sm text-base-content/60">Masuk untuk mengelola toko</p>
			</div>

			{#if error}
				<div class="alert alert-error text-sm mb-3">
					<span>{error}</span>
				</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
				<div class="form-control mb-3">
					<label class="label" for="username">
						<span class="label-text">Username</span>
					</label>
					<input
						id="username"
						type="text"
						placeholder="Username"
						class="input input-bordered w-full"
						bind:value={username}
						required
					/>
				</div>

				<div class="form-control mb-5">
					<label class="label" for="password">
						<span class="label-text">Password</span>
					</label>
					<input
						id="password"
						type="password"
						placeholder="••••••••"
						class="input input-bordered w-full"
						bind:value={password}
						required
					/>
				</div>

				<button type="submit" class="btn btn-primary btn-block" disabled={loading}>
					{#if loading}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					Masuk
				</button>
			</form>
		</div>
	</div>
</div>
