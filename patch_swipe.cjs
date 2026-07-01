const fs = require('fs');
let code = fs.readFileSync('src/components/SwipeButton.tsx', 'utf8');

code = code.replace(/await controls\.start\(\{\s*x: maxDrag,\s*transition: \{ type: "spring", bounce: 0\.2, duration: 0\.4 \},\s*\}\);\s*setTimeout\(\(\) => \{\s*if \(isMounted\.current\) onSuccess\(\);\s*setTimeout\(\(\) => \{\s*if \(isMounted\.current\) \{\s*setIsSuccess\(false\);\s*controls\.start\(\{ x: 0, transition: \{ type: "tween", ease: "easeOut", duration: 0\.4 \} \}\);\s*\}\s*\}, 500\);\s*\}, 1000\);/g, 
`await controls.start({
        x: maxDrag,
        transition: { type: "spring", bounce: 0.2, duration: 0.4 },
      });
      if (isMounted.current) {
        onSuccess();
      }`);

fs.writeFileSync('src/components/SwipeButton.tsx', code);
