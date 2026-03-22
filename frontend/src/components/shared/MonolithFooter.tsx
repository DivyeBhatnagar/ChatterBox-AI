export const MonolithFooter: React.FC = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-white/5 py-16 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <span className="text-xl font-black text-white tracking-[-0.04em] font-headline uppercase block mb-4">
            CHATTERBOX AI
          </span>
          <p className="text-xs text-neutral-500 leading-relaxed uppercase tracking-wider">
            Intelligent conversations, powered by advanced machine learning. Available 24/7 for work, learning, and creativity.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
          <div>
            <h6 className="text-[10px] font-bold text-white tracking-[0.3em] uppercase mb-6">Product</h6>
            <ul className="space-y-3">
              <li><a className="text-[12px] text-neutral-500 hover:text-white transition-colors uppercase" href="#">Features</a></li>
              <li><a className="text-[12px] text-neutral-500 hover:text-white transition-colors uppercase" href="#">Pricing</a></li>
              <li><a className="text-[12px] text-neutral-500 hover:text-white transition-colors uppercase" href="#">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h6 className="text-[10px] font-bold text-white tracking-[0.3em] uppercase mb-6">Company</h6>
            <ul className="space-y-3">
              <li><a className="text-[12px] text-neutral-500 hover:text-white transition-colors uppercase" href="#">About</a></li>
              <li><a className="text-[12px] text-neutral-500 hover:text-white transition-colors uppercase" href="#">Blog</a></li>
              <li><a className="text-[12px] text-neutral-500 hover:text-white transition-colors uppercase" href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h6 className="text-[10px] font-bold text-white tracking-[0.3em] uppercase mb-6">Legal</h6>
            <ul className="space-y-3">
              <li><a className="text-[12px] text-neutral-500 hover:text-white transition-colors uppercase" href="#">Privacy</a></li>
              <li><a className="text-[12px] text-neutral-500 hover:text-white transition-colors uppercase" href="#">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] text-neutral-600 uppercase tracking-widest">
        <span>© 2024 CHATTERBOX AI. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-6">
          <a className="hover:text-white transition-colors" href="#">Twitter</a>
          <a className="hover:text-white transition-colors" href="#">GitHub</a>
          <a className="hover:text-white transition-colors" href="#">Discord</a>
        </div>
      </div>
    </footer>
  );
};
