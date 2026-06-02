<script lang="ts">
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleRegister() {
		if (password !== confirmPassword) {
			error = 'Password tidak cocok';
			return;
		}

		loading = true;
		error = '';

		try {
			// In production: supabase.auth.signUp({ email, password, options: { data: { name } } })
			await new Promise(resolve => setTimeout(resolve, 1000));
			alert('Registrasi berhasil! Cek email untuk verifikasi. (demo)');
		} catch (e) {
			error = 'Gagal mendaftar. Coba lagi.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Daftar - TokoApps</title>
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center px-4 py-8">
	<div class="card w-full max-w-md bg-base-100 shadow-lg border border-base-200">
		<div class="card-body">
			<h1 class="text-2xl font-bold text-center mb-2">Buat Akun Baru</h1>
			<p class="text-center text-base-content/60 mb-6">Bergabung dan temukan aplikasi terbaik</p>

			{#if error}
				<div class="alert alert-error mb-4">
					<span>{error}</span>
				</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleRegister(); }}>
				<div class="form-control mb-4">
					<label class="label" for="name">
						<span class="label-text">Nama Lengkap</span>
					</label>
					<input
						id="name"
						type="text"
						placeholder="Nama lengkap Anda"
						class="input input-bordered w-full"
						bind:value={name}
						required
					/>
				</div>

				<div class="form-control mb-4">
					<label class="label" for="reg-email">
						<span class="label-text">Email</span>
					</label>
					<input
						id="reg-email"
						type="email"
						placeholder="nama@email.com"
						class="input input-bordered w-full"
						bind:value={email}
						required
					/>
				</div>

				<div class="form-control mb-4">
					<label class="label" for="reg-password">
						<span class="label-text">Password</span>
					</label>
					<input
						id="reg-password"
						type="password"
						placeholder="Minimal 8 karakter"
						class="input input-bordered w-full"
						bind:value={password}
						minlength="8"
						required
					/>
				</div>

				<div class="form-control mb-6">
					<label class="label" for="reg-confirm-password">
						<span class="label-text">Konfirmasi Password</span>
					</label>
					<input
						id="reg-confirm-password"
						type="password"
						placeholder="Ulangi password"
						class="input input-bordered w-full"
						bind:value={confirmPassword}
						minlength="8"
						required
					/>
				</div>

				<button type="submit" class="btn btn-primary btn-block" disabled={loading}>
					{#if loading}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					Daftar
				</button>
			</form>

			<p class="text-center text-sm mt-4">
				Sudah punya akun? <a href="/login" class="link link-primary font-medium">Masuk di sini</a>
			</p>
		</div>
	</div>
</div>
