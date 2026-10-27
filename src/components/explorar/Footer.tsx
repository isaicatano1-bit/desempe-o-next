export function Footer() {
  return (
    <footer className="border-t border-[#DEDED5] bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-5 text-sm text-[#727970] md:flex-row md:items-center md:justify-between lg:px-8">
        <div>© 2026 CoSpace · Tu tiempo, tu espacio.</div>
        <nav className="flex items-center gap-5">
          <a href="#" className="transition hover:text-[#245642]">Ayuda</a>
          <a href="#" className="transition hover:text-[#245642]">Privacidad</a>
          <a href="#" className="transition hover:text-[#245642]">Condiciones</a>
        </nav>
      </div>
    </footer>
  );
}
