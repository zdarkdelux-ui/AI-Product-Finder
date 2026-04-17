
import { motion, AnimatePresence } from "motion/react";
import { X, Check, AlertCircle, ChevronDown } from "lucide-react";
import { Product } from "../products";
import { ComparisonResult } from "../services/geminiService";

interface ComparisonModalProps {
  products: Product[];
  result: ComparisonResult | null;
  onClose: () => void;
  isLoading: boolean;
}

export const ComparisonModal = ({ products, result, onClose, isLoading }: ComparisonModalProps) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-border"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between shrink-0 bg-white">
            <div>
              <h2 className="text-[24px] font-black text-text-main tracking-tight">Сравнение товаров</h2>
              <p className="text-text-muted text-sm font-medium">Сравнение {products.length} моделей по техническим характеристикам и анализу AI</p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6 bg-[#FBFBFC]">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-text-main font-bold animate-pulse">AI анализирует различия...</p>
              </div>
            ) : result ? (
              <div className="space-y-12">
                {/* Product Headers */}
                <div className="grid" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
                  <div />
                  {products.map(p => (
                    <div key={p.id} className="px-4 text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-xl border border-border overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <h3 className="font-bold text-[14px] leading-tight text-text-main line-clamp-2 mb-2">{p.name}</h3>
                      <div className="text-accent font-black">{p.price.toLocaleString('ru-RU')} ₽</div>
                    </div>
                  ))}
                </div>

                {/* AI Summary */}
                <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-accent mb-3">
                    <AlertCircle className="w-5 h-5 font-bold" />
                    <span className="font-black text-sm uppercase tracking-wider">AI Резюме</span>
                  </div>
                  <p className="text-text-main leading-relaxed italic text-[15px]">
                    {result.summary}
                  </p>
                </div>

                {/* Comparison Table */}
                <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                  <div className="grid border-b border-border bg-slate-50/50" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
                    <div className="p-4 text-[11px] font-black text-text-muted uppercase tracking-widest italic font-serif">Характеристика</div>
                    {products.map(p => (
                      <div key={p.id} className="p-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-center italic font-serif">Значение</div>
                    ))}
                  </div>
                  
                  {result.features.map((feature, idx) => (
                    <div key={idx} className="grid border-b border-border last:border-0 hover:bg-slate-50 transition-colors" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
                      <div className="p-4 text-[13px] font-bold text-text-main bg-slate-50/30">{feature.name}</div>
                      {products.map(p => (
                        <div key={p.id} className="p-4 text-[13px] text-text-main text-center border-l border-border/50">
                          {feature.values[p.id] || "—"}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Analysis Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(p => {
                    const analysis = result.analysis[p.id];
                    if (!analysis) return null;
                    return (
                      <div key={p.id} className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg">💡</div>
                           <h4 className="font-black text-text-main text-sm uppercase tracking-tight line-clamp-1">{p.name}</h4>
                        </div>
                        
                        <div className="space-y-4 flex-1">
                          <div>
                            <span className="text-[10px] font-black text-success uppercase tracking-widest mb-2 block">Преимущества</span>
                            <ul className="space-y-2">
                              {analysis.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-2 text-[13px] text-text-main leading-snug">
                                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                  <span>{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 block">Нюансы</span>
                            <ul className="space-y-2">
                              {analysis.cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-2 text-[13px] text-text-main leading-snug">
                                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                  <span>{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border">
                          <span className="text-[11px] font-black text-text-muted uppercase tracking-widest block mb-2">Вердикт AI</span>
                          <p className="text-[13px] font-bold text-accent leading-tight italic">
                            {analysis.verdict}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-text-muted">Произошла ошибка при анализе. Попробуйте еще раз.</div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border flex justify-end gap-3 bg-white shrink-0">
             <button 
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-border font-bold text-sm hover:bg-slate-50 transition-all"
             >
                Закрыть
             </button>
             <button className="px-8 py-3 rounded-xl bg-text-main text-white font-black text-sm hover:bg-black transition-all shadow-lg shadow-black/10">
                Оформить подборку
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
