<script lang="ts">
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleLogin() {
		loading = true;
		error = '';
		
		// In production, this would use supabase.auth.signInWithPassword
		try {
			// Simulated login
			await new Promise(resolve => setTimeout(resolve, 1000));
			// supabase.auth.signInWithPassword({ email, password })
			alert('Login berhasil! (demo)');
		} catch (e) {
			error = 'Email atau password salah';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Masuk - TokoApps</title>
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center px-4">
	<div class="card w-full max-w-md bg-base-100 shadow-lg border border-base-200">
		<div class="card-body">
			<h1 class="text-2xl font-bold text-center mb-2">Masuk ke TokoApps</h1>
			<p class="text-center text-base-content/60 mb-6">Akses semua aplikasi yang telah Anda beli</p>

			{#if error}
				<div class="alert alert-error mb-4">
					<span>{error}</span>
				</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
				<div class="form-control mb-4">
					<label class="label" for="email">
						<span class="label-text">Email</span>
					</label>
					<input
						id="email"
						type="email"
						placeholder="nama@email.com"
						class="input input-bordered w-full"
						bind:value={email}
						required
					/>
				</div>

				<div class="form-control mb-6">
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
					<label class="label">
						<a href="/forgot-password" class="label-text-alt link link-hover" aria-label="Lupa password">Lupa password?</a>
					</label>
				</div>

				<button type="submit" class="btn btn-primary btn-block" disabled={loading}>
					{#if loading}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					Masuk
				</button>
			</form>

			<div class="divider">atau</div>

			<button class="btn btn-outline btn-block">
				<svg class="h-5 w-5" viewBox="0 0 24 24">
					<path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
					<path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
					<path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
					<path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
				</svg>
				Masuk dengan Google
			</button>

			<p class="text-center text-sm mt-4">
				Belum punya akun? <a href="/register" class="link link-primary font-medium">Daftar sekarang</a>
			</p>
		</div>
	</div>
</div>
