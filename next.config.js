/** @type {import('next').NextConfig} */
const nextConfig = {
	compiler: {
		styledComponents: true
	},
	experimental: {
		esmExternals: true
	},
};

module.exports = nextConfig;