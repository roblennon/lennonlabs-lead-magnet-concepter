import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			typography: {
				DEFAULT: {
					css: {
						color: 'hsl(var(--foreground))',
						h1: { 
							color: 'hsl(var(--foreground))',
							fontSize: '2.25rem',
							fontWeight: '700',
							lineHeight: '2.5rem',
							fontFamily: 'Inter, sans-serif',
							marginTop: '2rem',
							marginBottom: '1rem'
						},
						h2: { 
							color: 'hsl(var(--foreground))',
							fontSize: '1.875rem',
							fontWeight: '600',
							lineHeight: '2.25rem',
							fontFamily: 'Inter, sans-serif',
							marginTop: '1.5rem',
							marginBottom: '0.75rem'
						},
						h3: { 
							color: 'hsl(var(--foreground))',
							fontSize: '1.5rem',
							fontWeight: '600',
							lineHeight: '2rem',
							fontFamily: 'Inter, sans-serif',
							marginTop: '1.25rem',
							marginBottom: '0.75rem'
						},
						h4: { 
							color: 'hsl(var(--foreground))',
							fontSize: '1.25rem',
							fontWeight: '600',
							lineHeight: '1.75rem',
							fontFamily: 'Inter, sans-serif',
							marginTop: '1rem',
							marginBottom: '0.5rem'
						},
						strong: { 
							color: 'hsl(var(--foreground))',
							fontWeight: '600'
						},
						ul: {
							listStyleType: 'disc',
							marginTop: '0.5rem',
							marginBottom: '0.5rem',
							paddingLeft: '1.5rem',
							li: {
								marginTop: '0.25rem',
								marginBottom: '0.25rem'
							}
						},
						'--tw-prose-bullets': 'hsl(var(--foreground))',
						'--tw-prose-counters': 'hsl(var(--foreground))',
					},
				},
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require('@tailwindcss/typography')
	],
} satisfies Config;