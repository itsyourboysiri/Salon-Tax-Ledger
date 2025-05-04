module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        animation: {
          'gradient-x': 'gradient-x 8s ease infinite',
        },
        keyframes: {
          'gradient-x': {
            '0%, 100%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
          },
        },
        animation: {
          fadeIn: 'fadeIn 0.8s ease-out',
        },
        backgroundImage: {
          'slflag': "url('/slflag.jpg')",
        },
        colors: {
          primary: '#380817',
        },
        
      },
    },
    plugins: [],
  };
  