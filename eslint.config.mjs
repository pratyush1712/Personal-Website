import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
	...nextVitals,
	...nextTypeScript,
	{
		ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
		rules: {
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"react-hooks/immutability": "off",
			"react-hooks/purity": "off",
			"react-hooks/set-state-in-effect": "off"
		}
	}
];

export default eslintConfig;
