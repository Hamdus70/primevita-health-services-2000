const { mkdirSync, writeFileSync } = require("fs");

const paths = [
  "src/app/(auth)",
  "src/app/(dashboard)",
  "src/app/(patient)",
  "src/app/(staff)",
  "src/app/(admin)",
  "src/components/layout",
  "src/lib/api-client",
  "src/stores"
];

for (const p of paths) {
  mkdirSync(p, { recursive: true });
}

const groups = ["(auth)", "(dashboard)", "(patient)", "(staff)", "(admin)"];

for (const group of groups) {
  writeFileSync(`src/app/${group}/layout.tsx`, `export default function Layout({ children }: { children: React.ReactNode }) {\n  return (\n    <div className="min-h-screen bg-gray-50 flex flex-col">\n      {children}\n    </div>\n  );\n}\n`);
  writeFileSync(`src/app/${group}/loading.tsx`, `export default function Loading() {\n  return (\n    <div className="flex items-center justify-center min-h-screen">\n      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>\n    </div>\n  );\n}\n`);
  writeFileSync(`src/app/${group}/error.tsx`, `"use client";\n\nimport { useEffect } from "react";\n\nexport default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {\n  useEffect(() => {\n    console.error(error);\n  }, [error]);\n  return (\n    <div className="flex flex-col items-center justify-center min-h-screen">\n      <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>\n      <button onClick={() => reset()} className="px-4 py-2 bg-blue-600 text-white rounded">Try again</button>\n    </div>\n  );\n}\n`);
  writeFileSync(`src/app/${group}/not-found.tsx`, `import Link from "next/link";\n\nexport default function NotFound() {\n  return (\n    <div className="flex flex-col items-center justify-center min-h-screen">\n      <h2 className="text-2xl font-bold mb-2">Not Found</h2>\n      <p className="mb-4">Could not find requested resource in this section</p>\n      <Link href="/" className="text-blue-600 hover:underline">Return Home</Link>\n    </div>\n  );\n}\n`);
}
