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
	},
	async rewrites() {
		return [{
			source: '/close-friends',
			destination: 'https://private.pratyushsudhakar.com/',
		}]
	},
	webpack: (config, options) => {
		config.module.rules.push({
			test: /\.(graphql|gql)/,
			exclude: /node_modules/,
			loader: "graphql-tag/loader"
		})
		return config
	}
};

module.exports = withNextVideo(nextConfig, {
	folder: 'public/videos'
});