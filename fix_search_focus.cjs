const fs = require('fs');
let content = fs.readFileSync('src/pages/Businesses.tsx', 'utf8');

// Add useRef and useEffect imports if missing
content = content.replace(
  /import \{ useState \} from 'react';/,
  "import { useState, useRef, useEffect } from 'react';"
);

// Add the ref and effect inside the component
if (!content.includes('searchInputRef')) {
  content = content.replace(
    /const \[isSearchExpanded, setIsSearchExpanded\] = useState\(false\);/,
    `const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);`
  );

  // Add ref to input
  content = content.replace(
    /autoFocus=\{isSearchExpanded\}/,
    'ref={searchInputRef}'
  );
}

fs.writeFileSync('src/pages/Businesses.tsx', content);
console.log('Fixed search focus');
