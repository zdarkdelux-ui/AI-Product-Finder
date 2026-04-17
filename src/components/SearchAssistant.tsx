
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, RefreshCw, AlertCircle, ChevronRight, Scale, X, ShoppingCart } from "lucide-react";
import { parseUserQuery, explainPerformance, SearchParameters, compareProducts, getRecommendedProducts, ComparisonResult, scoutWebProducts } from "../services/geminiService";
import { PRODUCTS, Product } from "../products";
import { ProductCard } from "./ProductCard";
import { ComparisonModal } from "./ComparisonModal";
import { ProductDetail } from "./ProductDetail";

export const SearchAssistant = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{ product: Product; explanation: string; score: number }[]>([]);
  const [parsedParams, setParsedParams] = useState<SearchParameters | null>(null);
  const [isWebScouting, setIsWebScouting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clarification, setClarification] = useState<string | null>(null);
  
  // Comparison & Related State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isComparingAI, setIsComparingAI] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [relatedIds, setRelatedIds] = useState<string[]>([]);

  const handleSearch = async (overrideQuery?: string) => {
    const searchQuery = overrideQuery || query;
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setIsWebScouting(false);
    setError(null);
    setClarification(null);

    try {
      const parseResult = await parseUserQuery(searchQuery);
      setParsedParams(parseResult.parameters);
      
      if (parseResult.clarificationQuestion) {
        setClarification(parseResult.clarificationQuestion);
      }

      let finalResults: { product: Product; explanation: string; score: number }[] = [];

      if (parseResult.parameters.sourceDomain) {
        setIsWebScouting(true);
        const webProducts = await scoutWebProducts(parseResult.parameters.sourceDomain, parseResult.parameters);
        
        finalResults = webProducts.map(p => ({
          product: p as Product,
          score: 1.0,
          explanation: `Этот товар найден по вашему запросу на сайте ${parseResult.parameters.sourceDomain}.`
        }));
      } else {
        // Filter products based on extracted parameters
        const scoredResults = PRODUCTS.map(product => {
          let score = 0;
          const p = parseResult.parameters;
          const matchedParams: string[] = [];
          
          if (p.category && product.category.toLowerCase().includes(p.category.toLowerCase())) {
            score += 0.3;
            matchedParams.push(product.category);
          }
          if (p.subcategory && product.subcategory.toLowerCase().includes(p.subcategory.toLowerCase())) {
            score += 0.3;
            matchedParams.push(product.subcategory);
          }
          if (p.color && product.characteristics.color?.toLowerCase().includes(p.color.toLowerCase())) {
            score += 0.2;
            matchedParams.push(product.characteristics.color || "");
          }
          if (p.brand && product.brand.toLowerCase() === p.brand.toLowerCase()) {
            score += 0.2;
            matchedParams.push(product.brand);
          }
          if (p.hasThermostat !== undefined && product.characteristics.hasThermostat === p.hasThermostat) {
            score += 0.2;
            matchedParams.push("термостат");
          }
          if (p.width && product.characteristics.width === p.width) {
            score += 0.2;
            matchedParams.push(`${p.width}см`);
          }
          if (p.maxPrice && product.price <= p.maxPrice) score += 0.1;
          
          // Normalize score
          const totalPossible = 0.3 + 0.3 + 0.2 + 0.2 + 0.2 + 0.2 + 0.1;
          const normalizedScore = score / totalPossible;
          
          const localExplanation = matchedParams.length > 0 
            ? `Найденное соответствие: ${matchedParams.filter(Boolean).join(", ")}.`
            : "Хороший вариант под ваши критерии.";

          return { product, score: normalizedScore, explanation: localExplanation };
        })
        .filter(item => item.score > 0.2)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

        finalResults = scoredResults.map(item => ({
          product: item.product,
          score: item.score,
          explanation: item.explanation
        }));
      }

      setResults(finalResults);
    } catch (err) {
      console.error(err);
      setError("Упс, что-то пошло не так при обработке запроса. Попробуйте еще раз.");
    } finally {
      setIsSearching(false);
      setIsWebScouting(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setParsedParams(null);
    setClarification(null);
    setCompareIds([]);
  };

  const handleCompareToggle = (id: string) => {
    setCompareIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleStartComparison = async () => {
    if (compareIds.length < 2) return;
    setShowCompareModal(true);
    setIsComparingAI(true);
    setComparisonResult(null);
    
    try {
      const productsToCompare = PRODUCTS.filter(p => compareIds.includes(p.id));
      const res = await compareProducts(productsToCompare);
      setComparisonResult(res);
    } catch (err) {
      console.error(err);
      setError("Ошибка при генерации сравнения.");
    } finally {
      setIsComparingAI(false);
    }
  };

  const handleProductSelect = async (product: Product) => {
    setSelectedProduct(product);
    setRelatedIds([]);
    try {
      const recs = await getRecommendedProducts(product, PRODUCTS);
      setRelatedIds(recs);
    } catch (err) {
      console.error(err);
    }
  };

  const quickPicks = [
    "чёрный смеситель с термостатом",
    "мойка шириной 60 см",
    "недорогая плитка под бетон",
    "раковина чаша для ванны"
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-[300px] shrink-0 border-b md:border-b-0 md:border-r border-border sidebar-bg p-6 flex flex-col gap-8 overflow-y-auto">
        {/* Recognized Parameters */}
        <div>
          <div className="text-[12px] uppercase tracking-[1px] text-text-muted font-bold mb-3">
            Распознанные параметры
          </div>
          <div className="space-y-2">
            {!parsedParams && (
              <p className="text-xs text-slate-400 italic">Начните поиск, чтобы увидеть параметры...</p>
            )}
            {parsedParams && Object.entries(parsedParams).map(([key, value]) => (
              value !== undefined && value !== null && value !== '' && typeof value !== 'object' && (
                <div key={key} className="parameter-chip">
                  <span className="text-text-muted capitalize">{key}</span>
                  <span className="font-bold text-text-main">{String(value)}</span>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Smart Assistant / Clarification */}
        <AnimatePresence>
          {clarification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="text-[12px] uppercase tracking-[1px] text-text-muted font-bold mb-3">
                Умный помощник
              </div>
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                <p className="text-[14px] leading-relaxed text-text-main mb-3">
                  {clarification}
                </p>
                <div className="space-y-2">
                  <button className="w-full text-left p-2.5 rounded-lg border border-accent text-accent text-[13px] font-medium hover:bg-accent hover:text-white transition-all">
                    Ответить в поиске
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Placeholder */}
        <div className="mt-auto">
          <div className="text-[12px] uppercase tracking-[1px] text-text-muted font-bold mb-3">
            История подборов
          </div>
          <div className="text-[13px] text-text-muted leading-relaxed">
            Сегодня: Чёрная мойка 60см...<br />
            Вчера: Душевой гарнитур хром...
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto bg-white">
        {/* Search Bar Area */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="bg-white border-2 border-accent rounded-xl p-4 flex items-center gap-4 shadow-[0_4px_12px_rgba(59,130,246,0.1)] mb-4">
            <span className="bg-accent/10 text-accent px-2 py-1 rounded-md text-[12px] font-bold uppercase tracking-tight">
              AI Поиск
            </span>
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Опишите товар своими словами..."
              className="flex-1 border-none outline-none text-[18px] text-text-main placeholder:text-slate-300"
            />
            <button 
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSearching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-6 h-6" />}
            </button>
          </div>

          {!results.length && !isSearching && (
            <div className="flex flex-wrap gap-2 justify-center">
              {quickPicks.map((pick) => (
                <button
                  key={pick}
                  onClick={() => {
                    setQuery(pick);
                    handleSearch(pick);
                  }}
                  className="bg-slate-50 border border-border px-3 py-1.5 rounded-full text-[12px] text-text-muted hover:border-accent hover:text-accent transition-all font-semibold"
                >
                  {pick}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100 text-sm">
            <AlertCircle className="w-5 h-5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Results Sections */}
        <div className="max-w-4xl mx-auto">
          {isWebScouting && (
            <div className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-xl flex items-center gap-3 animate-pulse">
              <RefreshCw className="w-5 h-5 text-accent animate-spin" />
              <p className="text-sm font-bold text-accent">Ищем реальные товары на выбранном сайте через Google Search...</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-[20px] font-bold text-text-main">Рекомендуемые товары</h2>
                <p className="text-sm text-text-muted">Найдено {results.length} подходящих моделей из каталога</p>
              </div>
              <button className="text-[13px] font-bold text-accent">Сравнить все ({results.length})</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {isSearching && (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white border border-border rounded-xl h-[350px]">
                  <div className="h-40 bg-slate-50 rounded-t-xl mb-4" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-50 rounded w-1/4" />
                    <div className="h-6 bg-slate-50 rounded w-3/4" />
                    <div className="h-20 bg-slate-50 rounded w-full" />
                  </div>
                </div>
              ))
            )}
            
            {!isSearching && results.map(({ product, explanation, score }) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                explanation={explanation}
                matchScore={score}
                isComparing={compareIds.includes(product.id)}
                onCompareToggle={handleCompareToggle}
                onSelect={handleProductSelect}
              />
            ))}
          </div>

          {/* Comparison Tray */}
          <AnimatePresence>
            {compareIds.length > 0 && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-text-main text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 border border-white/10 backdrop-blur-md"
              >
                <div className="flex items-center gap-3 border-r border-white/20 pr-6">
                  <Scale className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-[13px] font-black uppercase tracking-tight">Сравнение</div>
                    <div className="text-[11px] text-white/60 font-medium">Выбрано {compareIds.length} товара</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {compareIds.map(id => {
                    const p = PRODUCTS.find(pr => pr.id === id);
                    return (
                      <div key={id} className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden border border-white/5 relative group">
                        <img src={p?.image} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => handleCompareToggle(id)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                   <button 
                    onClick={() => setCompareIds([])}
                    className="text-[11px] font-black uppercase tracking-widest hover:text-red-400 transition-colors"
                   >
                     Очистить
                   </button>
                   <button 
                    onClick={handleStartComparison}
                    disabled={compareIds.length < 2}
                    className="bg-accent text-white px-6 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50 disabled:grayscale"
                   >
                     Сравнить
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSearching && results.length > 0 && (
            <div className="mt-8 bg-[#F8FAFC] border border-dashed border-border rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white border border-border rounded-lg flex items-center justify-center text-xl">
                  📦
                </div>
                <div>
                  <div className="font-bold text-sm text-text-main">Сопутствующие товары</div>
                  <div className="text-[12px] text-text-muted">К этим товарам часто покупают комплектующие в цвет</div>
                </div>
              </div>
              <button className="bg-white border border-border px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                Смотреть аксессуары
              </button>
            </div>
          )}

          {!isSearching && query && results.length === 0 && (
            <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-border">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-border shadow-sm">
                <Search className="w-8 h-8 text-slate-200" />
              </div>
              <h2 className="text-xl font-bold text-text-main mb-1">Ничего не найдено</h2>
              <p className="text-sm text-text-muted max-w-xs mx-auto mb-6">
                Попробуйте изменить параметры или задайте запрос более обще.
              </p>
              <button 
                onClick={clearSearch}
                className="bg-accent text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-accent/90 transition-colors"
              >
                Сбросить поиск
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Overlays */}
      {showCompareModal && (
        <ComparisonModal 
          products={PRODUCTS.filter(p => compareIds.includes(p.id))}
          result={comparisonResult}
          isLoading={isComparingAI}
          onClose={() => setShowCompareModal(false)}
        />
      )}

      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct}
          relatedIds={relatedIds}
          parameters={parsedParams}
          onClose={() => setSelectedProduct(null)}
          onNavigate={handleProductSelect}
        />
      )}
    </div>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);
