const fs = require('fs');
const svg = fs.readFileSync('dist/logos/pasi_n_logo_simplificado.svg', 'utf8');

// Simple regex replacements for React SVG
let reactSvg = svg
  .replace(/<\?xml.*\?>\n/g, '')
  .replace(/<!DOCTYPE.*\n.*\n/g, '')
  .replace(/xmlns=\".*?\"/g, '')
  .replace(/version=\".*?\"/g, '')
  .replace(/preserveAspectRatio/g, 'preserveAspectRatio')
  .replace(/viewBox/g, 'viewBox')
  .replace(/fill=\"#000000\"/g, 'fill=\"currentColor\"');

// Extract the inner content
const innerMatch = reactSvg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
if (innerMatch) {
  const innerContent = innerMatch[1];
  
  const component = `import React from 'react';

interface PasionLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { width: 95, height: 25 },
  md: { width: 133, height: 35 },
  lg: { width: 228, height: 60 },
};

export const PasionLogo: React.FC<PasionLogoProps> = ({ size = 'md', className = '' }) => {
  const { width, height } = SIZES[size];

  return (
    <svg 
      className={\`pasion-logo \${className}\`} 
      width={width} 
      height={height} 
      viewBox=\"0 0 1024 1024\" 
      preserveAspectRatio=\"xMidYMid meet\"
      fill=\"none\" 
      xmlns=\"http://www.w3.org/2000/svg\"
      style={{ overflow: 'visible' }}
    >
      ${innerContent.trim()}
    </svg>
  );
};
`;

  fs.writeFileSync('src/components/PasionLogo.tsx', component);
  console.log('Successfully updated PasionLogo.tsx');
} else {
  console.log('Could not extract SVG content');
}
