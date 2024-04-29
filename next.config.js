const {
	withNextVideo
} = require('next-video/process')

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

module.exports = withNextVideo(nextConfig, {
	folder: 'public/videos',
	async rewrites() {
		return [{
			source: '/close-friends',
			destination: 'https://private.pratyushsudhakar.com/',
		}]
	},
});