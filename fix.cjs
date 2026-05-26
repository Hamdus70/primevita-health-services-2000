const fs = require('fs');

function fix(file) {
    let code = fs.readFileSync(file, 'utf-8');

    // We need to import buttonVariants if it's not already imported
    if (code.includes('Button') && !code.includes('buttonVariants')) {
        code = code.replace(/import \{ Button \} from '@\/components\/ui\/button';/, "import { Button, buttonVariants } from '@/components/ui/button';");
    }

    // Replace string matches
    const patterns = [
        [/<DialogTrigger render=\{<Button variant="outline" size="sm" className="border-\[#10837f\] text-\[#10837f\] hover:bg-emerald-50" \/>\}>/g, 
        '<DialogTrigger className={buttonVariants({variant: "outline", size: "sm"}) + " border-[#10837f] text-[#10837f] hover:bg-emerald-50"} >'],
        
        [/<DialogTrigger render=\{<Button variant="ghost" size="sm" \/>\}>/g, 
        '<DialogTrigger className={buttonVariants({variant: "ghost", size: "sm"})} >'],
        
        [/<DialogTrigger render=\{<Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 w-full sm:w-auto" onClick=\{.*\} \/>\}>/g, 
        (match) => {
            const onClick = match.match(/onClick=\{.*\}/)[0];
            return `<DialogTrigger className={buttonVariants({variant: "outline"}) + " text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 w-full sm:w-auto"} ${onClick}>`;
        }],

        [/<DialogTrigger render=\{<Button variant="outline" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200" onClick=\{.*\} \/>\}>/g, 
        (match) => {
            const onClick = match.match(/onClick=\{.*\}/)[0];
            return `<DialogTrigger className={buttonVariants({variant: "outline"}) + " text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"} ${onClick}>`;
        }],

        [/<DialogTrigger render=\{<Button className="bg-\[#10837f\] hover:bg-\[#0c6b68\]" onClick=\{.*\} \/>\}>/g, 
        (match) => {
            const onClick = match.match(/onClick=\{.*\}/)[0];
            return `<DialogTrigger className={buttonVariants({variant: "default"}) + " bg-[#10837f] hover:bg-[#0c6b68]"} ${onClick}>`;
        }],

        [/<DialogTrigger render=\{<Button className="bg-\[#10837f\] hover:bg-\[#0c6b68\]" \/>\}>/g, 
        '<DialogTrigger className={buttonVariants({variant: "default"}) + " bg-[#10837f] hover:bg-[#0c6b68]"} >'],

        [/<DialogTrigger render=\{<Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" \/>\}>/g, 
        '<DialogTrigger className={buttonVariants({variant: "ghost", size: "sm"}) + " text-blue-600 hover:text-blue-700 hover:bg-blue-50"} >'],

        [/<DialogTrigger render=\{<Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50" \/>\}>/g, 
        '<DialogTrigger className={buttonVariants({variant: "ghost", size: "sm"}) + " text-purple-600 hover:text-purple-700 hover:bg-purple-50"} >'],

        [/<DialogTrigger render=\{<Button variant="ghost" size="sm" className="text-\[#10837f\] hover:text-\[#0c6b68\] hover:bg-\[#10837f\]\/10" \/>\}>/g, 
        '<DialogTrigger className={buttonVariants({variant: "ghost", size: "sm"}) + " text-[#10837f] hover:text-[#0c6b68] hover:bg-[#10837f]/10"} >'],

        [/<DialogTrigger render=\{<Button className="w-full sm:w-auto bg-\[#10837f\] hover:bg-\[#0c6b68\]" onClick=\{.*\} \/>\}>/g, 
        (match) => {
            const onClick = match.match(/onClick=\{.*\}/)[0];
            return `<DialogTrigger className={buttonVariants({variant: "default"}) + " w-full sm:w-auto bg-[#10837f] hover:bg-[#0c6b68]"} ${onClick}>`;
        }],

        [/<DialogTrigger render=\{<Button variant="outline" size="sm" className="h-7 text-xs border-gray-200" \/>\}>/g, 
        '<DialogTrigger className={buttonVariants({variant: "outline", size: "sm"}) + " h-7 text-xs border-gray-200"} >']
    ];

    patterns.forEach(([pattern, replacement]) => {
        code = code.replace(pattern, replacement);
    });

    fs.writeFileSync(file, code);
}

fix('src/pages/dashboard/AdminDashboard.tsx');

// Also fix components/ui/dialog.tsx
let dialogCode = fs.readFileSync('src/components/ui/dialog.tsx', 'utf-8');
if (!dialogCode.includes('buttonVariants')) {
    dialogCode = dialogCode.replace(/import \{ Button \} from '@\/components\/ui\/button'/, "import { Button, buttonVariants } from '@/components/ui/button'");
}
dialogCode = dialogCode.replace(/<DialogPrimitive\.Close\n *data-slot="dialog-close"\n *render=\{\n *<Button\n *variant="ghost"\n *className="absolute top-2 right-2"\n *size="icon-sm"\n *\/>\n *\}/g, 
    '<DialogPrimitive.Close\n            data-slot="dialog-close"\n            className={buttonVariants({variant: "ghost", size: "icon-sm"}) + " absolute top-2 right-2"}');
dialogCode = dialogCode.replace(/<DialogPrimitive\.Close render=\{<Button variant="outline" \/>\}>/g, '<DialogPrimitive.Close className={buttonVariants({variant:"outline"})}>');
fs.writeFileSync('src/components/ui/dialog.tsx', dialogCode);
