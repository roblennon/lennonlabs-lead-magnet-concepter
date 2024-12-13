export const typography = {
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
};