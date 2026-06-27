import fs from 'fs';

function fixFile(file: string, fixes: {search: string, replace: string}[]) {
  let content = fs.readFileSync(file, 'utf8');
  for (const f of fixes) {
    content = content.replace(f.search, f.replace);
  }
  fs.writeFileSync(file, content, 'utf8');
}

fixFile('src/components/Sidebar.tsx', [
  { search: '// Listen for changes const', replace: '\n// Listen for changes\nconst' },
  { search: '// Custom event for same-window updates window.', replace: '\n// Custom event for same-window updates\nwindow.' }
]);

fixFile('src/pages/AdminPage.tsx', [
  { search: '// Calculate active investors const', replace: '\n// Calculate active investors\nconst' },
  { search: '// Only import default data if we don\'t have enough state const', replace: '\n// Only import default data if we don\'t have enough state\nconst' },
  { search: '// Apply simple filters const', replace: '\n// Apply simple filters\nconst' },
  { search: '// Filter businesses to active ones for assignment const', replace: '\n// Filter businesses to active ones for assignment\nconst' },
  { search: '// Format currency const', replace: '\n// Format currency\nconst' },
  { search: '// Format numbers without currency const', replace: '\n// Format numbers without currency\nconst' },
]);

fixFile('src/pages/Banking.tsx', [
  { search: '// Update transactions state setTransactions', replace: '\n// Update transactions state\nsetTransactions' },
  { search: '// Only apply filtering if a specific status is selected const', replace: '\n// Only apply filtering if a specific status is selected\nconst' }
]);

fixFile('src/pages/Businesses.tsx', [
  { search: '// Calculate actual completion date based on months const', replace: '\n// Calculate actual completion date based on months\nconst' },
  { search: '// Calculate total withdrawn const', replace: '\n// Calculate total withdrawn\nconst' },
  { search: '// Sort primarily by active status, then alphabetically by name return', replace: '\n// Sort primarily by active status, then alphabetically by name\nreturn' }
]);

fixFile('src/pages/Investors.tsx', [
  { search: '// Apply filters and search const', replace: '\n// Apply filters and search\nconst' },
  { search: '} // Sub-component for the PDF Content to ensure it\'s rendered identically in Preview and Print const', replace: '}\n// Sub-component for the PDF Content to ensure it\'s rendered identically in Preview and Print\nconst' },
  { search: '} // Component for the Profit Slip const', replace: '}\n// Component for the Profit Slip\nconst' },
  { search: '// Reset form fields after successful investment setInvestmentFormData', replace: '\n// Reset form fields after successful investment\nsetInvestmentFormData' }
]);

fixFile('src/components/MobilePortfolioSummary.tsx', [
  { search: '// 16px horizontal and vertical padding flexShrink', replace: '\n// 16px horizontal and vertical padding\nflexShrink' }
]);

console.log('Fixed common comment bugs');
