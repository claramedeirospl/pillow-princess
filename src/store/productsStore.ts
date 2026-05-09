import { create } from "zustand";
import type { Product } from "@/@types";

const INITIAL_PRODUCTS: Product[] = [
  { id: "p1", name: "Conjunto Cetim Rosê", category: "pijamas", price: 189.9, originalPrice: 229.9, sizes: ["P","M","G","GG"], colors: ["Rosê","Marfim","Lilás"], emoji: "🌸", tag: "Mais vendido", description: "Conjunto de pijama em cetim acetinado com textura sedosa. Calça de perna reta e blusa de alcinha com renda delicada nas bordas. Ideal para noites especiais e uso diário.", images: ["🌸","✨","💫"], stock: 12 },
  { id: "p2", name: "Body Renda Veneziana", category: "lingerie", price: 149.9, originalPrice: null, sizes: ["P","M","G"], colors: ["Preto","Nude","Bordô"], emoji: "🖤", tag: "Novo", description: "Body em renda veneziana com alça regulável e fecho em strass nas costas. Acabamento impecável com elastano para maior conforto e modelagem.", images: ["🖤","✨","💎"], stock: 8 },
  { id: "p3", name: "Camisola Romântica", category: "pijamas", price: 129.9, originalPrice: 159.9, sizes: ["P","M","G","GG","EG"], colors: ["Rosa","Branco","Azul Bebê"], emoji: "🌙", tag: null, description: "Camisola midi em malha fria com bordado floral na barra. Leve e fresca, perfeita para o verão. Fechamento em botões de pérola.", images: ["🌙","🌸","⭐"], stock: 20 },
  { id: "p4", name: "Conjunto Hot Pants", category: "lingerie", price: 99.9, originalPrice: null, sizes: ["P","M","G"], colors: ["Preto","Vermelho","Nude"], emoji: "💋", tag: "Promoção", description: "Conjunto de top e hot pants em renda stretch. Ultra confortável com elástico embutido. Perfeito para o dia a dia com muito estilo.", images: ["💋","🔥","✨"], stock: 15 },
  { id: "p5", name: "Pijama Veludo Inverno", category: "pijamas", price: 219.9, originalPrice: 269.9, sizes: ["P","M","G","GG"], colors: ["Bordô","Verde Musgo","Cinza"], emoji: "🍷", tag: "Inverno", description: "Conjunto de pijama em veludo aveludado com bolso canguru na calça. Extremamente macio e quentinho para os dias frios.", images: ["🍷","🌿","❄️"], stock: 6 },
  { id: "p6", name: "Sutiã Balconet Renda", category: "lingerie", price: 89.9, originalPrice: null, sizes: ["36","38","40","42","44"], colors: ["Preto","Nude","Rosa"], emoji: "💕", tag: null, description: "Sutiã balconet com bojo suave em renda floral. Alça regulável e fecho duplo nas costas. Confortável para uso prolongado.", images: ["💕","🌸","✨"], stock: 18 },
  { id: "p7", name: "Short Doll Manga Longa", category: "pijamas", price: 159.9, originalPrice: 189.9, sizes: ["P","M","G","GG"], colors: ["Rosa Chá","Lilás","Menta"], emoji: "☁️", tag: null, description: "Short doll com manga longa em viscolycra. Design moderno com detalhe em renda na manga e barra do short. Muito elegante.", images: ["☁️","🌸","🌙"], stock: 9 },
  { id: "p8", name: "Cinta-Liga Glamour", category: "lingerie", price: 119.9, originalPrice: null, sizes: ["P","M","G"], colors: ["Preto","Vermelho"], emoji: "⭐", tag: "Exclusivo", description: "Cinta-liga com 6 ligas ajustáveis e fivelas douradas. Em renda e cetim. Peça única para momentos especiais.", images: ["⭐","💎","🖤"], stock: 4 },
];

interface ProductsState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: INITIAL_PRODUCTS,

  setProducts(products) {
    set({ products });
  },

  addProduct(product) {
    set((state) => ({ products: [...state.products, product] }));
  },

  updateProduct(id, updates) {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  },

  deleteProduct(id) {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },
}));
