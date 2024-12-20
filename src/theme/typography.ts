export const typography = {
  DEFAULT: {
    css: {
      color: '#333333',
      h1: { 
        color: '#333333',
        fontSize: '2.25rem',
        fontWeight: '800', // Made heavier
        lineHeight: '2.5rem',
        fontFamily: 'Inter, sans-serif',
        marginTop: '2rem',
        marginBottom: '0.5rem' // Reduced spacing
      },
      h2: { 
        color: '#333333',
        fontSize: '1.875rem',
        fontWeight: '700', // Made heavier
        lineHeight: '2.25rem',
        fontFamily: 'Inter, sans-serif',
        marginTop: '1.5rem',
        marginBottom: '0.75rem'
      },
      h3: { 
        color: '#333333',
        fontSize: '1.5rem',
        fontWeight: '400',
        lineHeight: '2rem',
        fontFamily: 'Inter, sans-serif',
        marginTop: '0.75rem',
        marginBottom: '0.75rem'
      },
      h4: { 
        color: '#333333',
        fontSize: '1rem',
        fontWeight: '600',
        lineHeight: '1.75rem',
        fontFamily: 'Inter, sans-serif',
        marginTop: '0.25rem', // Reduced spacing from h1
        marginBottom: '1rem'
      },
      strong: { 
        color: '#333333',
        fontWeight: '600'
      },
      ul: {
        listStyleType: 'disc',
        marginTop: '1.0em',
        marginBottom: '0.5rem',
        paddingLeft: '1.5rem',
        li: {
          marginTop: '0.1em',
          marginBottom: '0.1em',
          color: '#333333'
        }
      },
      '--tw-prose-bullets': '#333333',
      '--tw-prose-counters': '#333333',
      a: {
        color: '#6E59A5',
        textDecoration: 'none',
        fontWeight: '500',
        '&:hover': {
          color: 'hsl(var(--primary))', // Matches the footer link hover state
          transition: 'color 150ms ease'
        }
      }
    },
  },
};