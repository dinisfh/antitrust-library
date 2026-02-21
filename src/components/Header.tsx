export default function Header() {
    return (
        <header className="h-16 bg-white border-b border-light-gray flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-light-gray rounded-md flex items-center justify-center overflow-hidden">
                    {/* Logo placeholder */}
                    <span className="text-dark-slate font-heading font-bold text-xs select-none">AL</span>
                </div>
                <h1 className="font-heading font-bold text-dark-slate text-xl">Antitrust Library</h1>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm text-dark-slate hidden sm:block">User Profile</span>
                <button className="w-8 h-8 rounded-full bg-primary-blue text-white flex items-center justify-center text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
                    U
                </button>
            </div>
        </header>
    );
}
