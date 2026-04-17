/**
 * Contact Card Color Themes
 * 
 * Defines color schemes for contact cards with healthcare-appropriate colors.
 * Each theme includes styling for card, icon, text, and button elements.
 */

export const contactCardThemes = {
  'primary-blue': {
    // Card styling
    card: {
      background: 'bg-blue-50 hover:bg-blue-100',
      border: 'border-blue-200',
      shadow: 'hover:shadow-blue-200/50'
    },
    // Icon styling
    icon: {
      background: 'bg-blue-100',
      color: 'text-blue-600'
    },
    // Text styling
    text: {
      title: 'text-blue-900',
      description: 'text-blue-700'
    },
    // Button styling
    button: {
      background: 'bg-blue-600 hover:bg-blue-700',
      text: 'text-white',
      ring: 'focus:ring-blue-500'
    }
  },
  
  'secondary-green': {
    card: {
      background: 'bg-green-50 hover:bg-green-100',
      border: 'border-green-200',
      shadow: 'hover:shadow-green-200/50'
    },
    icon: {
      background: 'bg-green-100',
      color: 'text-green-600'
    },
    text: {
      title: 'text-green-900',
      description: 'text-green-700'
    },
    button: {
      background: 'bg-green-600 hover:bg-green-700',
      text: 'text-white',
      ring: 'focus:ring-green-500'
    }
  },
  
  'accent-teal': {
    card: {
      background: 'bg-teal-50 hover:bg-teal-100',
      border: 'border-teal-200',
      shadow: 'hover:shadow-teal-200/50'
    },
    icon: {
      background: 'bg-teal-100',
      color: 'text-teal-600'
    },
    text: {
      title: 'text-teal-900',
      description: 'text-teal-700'
    },
    button: {
      background: 'bg-teal-600 hover:bg-teal-700',
      text: 'text-white',
      ring: 'focus:ring-teal-500'
    }
  },
  
  'neutral-gray': {
    card: {
      background: 'bg-gray-50 hover:bg-gray-100',
      border: 'border-gray-200',
      shadow: 'hover:shadow-gray-200/50'
    },
    icon: {
      background: 'bg-gray-100',
      color: 'text-gray-600'
    },
    text: {
      title: 'text-gray-900',
      description: 'text-gray-700'
    },
    button: {
      background: 'bg-gray-600 hover:bg-gray-700',
      text: 'text-white',
      ring: 'focus:ring-gray-500'
    }
  }
} as const;

export type ContactCardTheme = keyof typeof contactCardThemes;

/**
 * Get a theme by name with fallback to primary-blue if theme doesn't exist
 */
export function getContactCardTheme(themeName: string) {
  const validTheme = themeName as ContactCardTheme;
  return contactCardThemes[validTheme] || contactCardThemes['primary-blue'];
}

/**
 * Get all available theme names
 */
export function getContactCardThemeNames(): ContactCardTheme[] {
  return Object.keys(contactCardThemes) as ContactCardTheme[];
}

/**
 * Check if a theme name is valid
 */
export function isValidContactCardTheme(themeName: string): themeName is ContactCardTheme {
  return themeName in contactCardThemes;
}

/**
 * Get theme display information for UI selectors
 */
export function getContactCardThemeOptions() {
  return [
    { value: 'primary-blue' as const, label: 'Primary Blue', colorClass: 'bg-blue-500' },
    { value: 'secondary-green' as const, label: 'Secondary Green', colorClass: 'bg-green-500' },
    { value: 'accent-teal' as const, label: 'Accent Teal', colorClass: 'bg-teal-500' },
    { value: 'neutral-gray' as const, label: 'Neutral Gray', colorClass: 'bg-gray-500' },
  ];
}
