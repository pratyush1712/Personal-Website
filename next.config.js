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
		domains: ["i.scdn.co", "images.unsplash.com", "upload.wikimedia.org", "source.unsplash.com", "privatewebsitecontent.s3.amazonaws.com"]
	},
	async headers() {
		return [{
			source: "/api/graphql",
			headers: [{
					key: "Access-Control-Allow-Credentials",
					value: "true"
				},
				{
					key: "Access-Control-Allow-Origin",
					value: "*"
				},
				{
					key: "Access-Control-Allow-Methods",
					value: "GET,DELETE,PATCH,POST,PUT"
				},
				{
					key: "Access-Control-Allow-Headers",
					value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
				},
			]
		}]
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