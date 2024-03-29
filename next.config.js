/** @type {import('next').NextConfig} */
const nextConfig = {
	compiler: {
		styledComponents: true
	},
	experimental: {
		esmExternals: true
	},
	images: {
		domains: ["i.scdn.co", "images.unsplash.com", "upload.wikimedia.org"]
	}
};

module.exports = nextConfig;
