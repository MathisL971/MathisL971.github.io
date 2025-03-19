export default {
	async fetch(request, env) {
		const allowedOrigins = [
			'https://mathisl971.github.io', // Production
			'http://localhost:3000', // Development
		];

		const origin = request.headers.get('Origin');

		// Configure CORS to allow requests from your GitHub Pages domain
		const corsHeaders = {
			'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'https://mathisl971.github.io',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		};

		// Handle OPTIONS request (preflight)
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		// Make the authenticated request to GitHub
		try {
			const githubResponse = await fetch(`https://api.github.com/users/MathisL971/repos`, {
				headers: {
					Authorization: `token ${env.GITHUB_TOKEN}`,
					'User-Agent': 'Cloudflare-Worker',
					Accept: 'application/vnd.github.v3+json',
				},
			});

			// Get the response body
			const data = await githubResponse.json();

			const publicRepos = data.filter((repo) => !repo.private);

			// Fetch languages for each repo using the languages_url attribute
			// Fetch all languages in parallel
			await Promise.all(
				publicRepos.map(async (repo) => {
					const languagesResponse = await fetch(repo.languages_url, {
						headers: {
							Authorization: `token ${env.GITHUB_TOKEN}`,
							'User-Agent': 'Cloudflare-Worker',
							Accept: 'application/vnd.github.v3+json',
						},
					});
					const languages = await languagesResponse.json();
					repo.languages = Object.keys(languages);
				})
			);

			// Return the response with CORS headers
			return new Response(JSON.stringify(publicRepos), {
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		} catch (error) {
			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json',
				},
			});
		}
	},
};
