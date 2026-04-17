
import { motion } from "motion/react";
import { Star, ShoppingCart, Info, CheckCircle2, ExternalLink } from "lucide-react";
import { Product } from "../products";

interface ProductCardProps {
  product: Product;
  explanation?: string;
  matchScore?: number;
  isComparing?: boolean;
  onCompareToggle?: (id: string) => void;
  onSelect?: (product: Product) => void;
  key?: string | number;
}

export const ProductCard = ({ 
  product, 
  explanation, 
  matchScore, 
  isComparing, 
  onCompareToggle, 
  onSelect 
}: ProductCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      layout
      onClick={() => onSelect?.(product)}
      className={`group relative bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
        isComparing ? "border-accent ring-2 ring-accent/20" : "border-border"
      }`}
    >
      {product.sourceUrl && (
        <div className="absolute top-3 left-3 z-10 bg-text-main/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-tight flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          Внешний сайт
        </div>
      )}

      {matchScore !== undefined && (
        <div className="absolute top-3 right-3 z-10 bg-success text-white px-2 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight">
          {Math.round(matchScore * 100)}% Совпадение
        </div>
      )}
      
      <div className="h-40 overflow-hidden bg-[#F1F5F9] flex items-center justify-center relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        {isComparing && (
          <div className="absolute inset-0 bg-accent/10 flex items-center justify-center backdrop-blur-[2px]">
            <div className="bg-accent text-white p-2 rounded-full shadow-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-[14px] text-text-main mb-2 leading-tight min-h-[2.5rem] line-clamp-2">
          {product.name}
        </h3>
        
        <div className="text-[18px] font-extrabold text-text-main mb-3">
          {product.price.toLocaleString('ru-RU')} ₽
        </div>

        {explanation && (
          <div className="why-ai-box mb-4">
            <div className="text-text-main font-bold block mb-1">Почему подходит:</div>
            <p className="text-text-muted leading-tight">
              {explanation}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
          <button className="flex-1 bg-text-main text-white px-3 py-2 rounded-lg text-[12px] font-bold hover:bg-black transition-colors active:scale-95 duration-150">
            В корзину
          </button>
          
          <button 
            onClick={() => onCompareToggle?.(product.id)}
            className={`w-10 h-10 flex items-center justify-center border rounded-lg transition-colors ${
              isComparing ? "bg-accent border-accent text-white" : "border-border text-text-main hover:bg-slate-50"
            }`}
          >
            ⚖️
          </button>
        </div>
      </div>
    </motion.div>
  );
};
