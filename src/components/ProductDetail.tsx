
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingCart, Tag, Info, Package, Sparkles, RefreshCw } from "lucide-react";
import { Product, PRODUCTS } from "../products";
import { explainPerformance, SearchParameters } from "../services/geminiService";
import { useState, useEffect } from "react";

interface ProductDetailProps {
  product: Product;
  relatedIds: string[];
  parameters: SearchParameters | null;
  onClose: () => void;
  onNavigate?: (product: Product) => void;
}

export const ProductDetail = ({ product, relatedIds, parameters, onClose, onNavigate }: ProductDetailProps) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const relatedProducts = PRODUCTS.filter(p => relatedIds.includes(p.id));

  useEffect(() => {
    const fetchAiAnalysis = async () => {
      if (!parameters) return;
      setIsLoadingAi(true);
      try {
        const analysis = await explainPerformance(product, parameters);
        setAiAnalysis(analysis);
      } catch (err) {
        console.error("Failed to fetch AI analysis:", err);
      } finally {
        setIsLoadingAi(false);
      }
    };

    fetchAiAnalysis();
  }, [product.id, parameters]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-[2px]">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-[500px] h-full bg-white shadow-2xl flex flex-col border-l border-border"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
            <h2 className="text-[18px] font-black text-text-main uppercase tracking-tight">Карточка товара</h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Image & Main Info */}
            <div className="space-y-6">
              <div className="aspect-square bg-slate-50 rounded-2xl border border-border overflow-hidden relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                {product.sourceUrl && (
                   <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[11px] font-bold border border-white/10 flex justify-between items-center">
                    <span>Товар с внешнего сайта</span>
                    <a href={product.sourceUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">Перейти →</a>
                   </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-slate-100 text-text-muted px-2 py-0.5 rounded text-[10px] font-bold uppercase">{product.brand}</span>
                  <span className="bg-slate-100 text-text-muted px-2 py-0.5 rounded text-[10px] font-bold uppercase">{product.category}</span>
                </div>
                <h1 className="text-[24px] font-bold text-text-main leading-tight mb-4">{product.name}</h1>
                <div className="text-[28px] font-black text-text-main mb-6">{product.price.toLocaleString('ru-RU')} ₽</div>
                
                <button className="w-full bg-accent text-white py-4 rounded-xl font-black text-[15px] flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-[0.98] shadow-lg shadow-accent/20">
                  <ShoppingCart className="w-5 h-5" />
                  Купить сейчас
                </button>
              </div>
            </div>

            {/* AI Analysis (Lazy Loaded) */}
            {(isLoadingAi || aiAnalysis) && (
              <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                  <Sparkles className="w-5 h-5 text-accent opacity-20" />
                </div>
                <div className="flex items-center gap-2 text-accent">
                  <span className="text-xs font-black uppercase tracking-widest">Анализ AI</span>
                  {isLoadingAi && <RefreshCw className="w-3 h-3 animate-spin" />}
                </div>
                {isLoadingAi ? (
                  <div className="space-y-2">
                    <div className="h-3 bg-accent/10 rounded w-full animate-pulse" />
                    <div className="h-3 bg-accent/10 rounded w-5/6 animate-pulse" />
                  </div>
                ) : (
                  <p className="text-[13px] text-text-main leading-relaxed italic">
                    {aiAnalysis}
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-text-muted">
                <Info className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Описание</span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Characteristics Grid */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-text-muted">
                <Tag className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Характеристики</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(product.characteristics).map(([key, value]) => (
                  <div key={key} className="bg-slate-50 border border-border p-3 rounded-xl">
                    <div className="text-[10px] text-text-muted uppercase font-bold mb-1 opacity-60">{key}</div>
                    <div className="text-[13px] font-bold text-text-main">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-text-muted">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">С этим товаром покупают</span>
                </div>
                <div className="space-y-4">
                  {relatedProducts.map(rp => (
                    <div 
                      key={rp.id} 
                      onClick={() => onNavigate?.(rp)}
                      className="flex gap-4 group cursor-pointer p-2 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-border"
                    >
                      <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-border/50">
                        <img src={rp.image} alt={rp.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-text-main leading-tight line-clamp-2 mb-1 group-hover:text-accent transition-colors">{rp.name}</h4>
                        <div className="text-[14px] font-black text-text-main">{rp.price.toLocaleString('ru-RU')} ₽</div>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-text-main hover:bg-accent hover:text-white transition-colors self-center">
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
