// Styled Components theme setup for cold/dark palette
export const darkTheme = {
  colors: {
    background: '#0B0D10',
    surface: '#1F2833',
    accent: '#2E4A46',
    secondary: '#282A36',
    text: '#C5C6C7',
    heading: '#F8F8F2',
    neon: '#00FFF7',
    border: '#22262A',
    card: '#181A1B',
    error: '#FF5555',
  },
  fonts: {
    body: 'Inter, sans-serif',
    code: 'Fira Code, monospace',
  },
};

export const darkerTheme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    background: '#08090B',
    surface: '#181A1B',
    accent: '#22262A',
    secondary: '#181A1B',
  },
};
