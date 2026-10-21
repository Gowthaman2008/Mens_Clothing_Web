import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Store, 
  Layers, 
  Link2, 
  Unlink, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Receipt, 
  Printer, 
  CreditCard, 
  QrCode, 
  Banknote, 
  CheckCircle2, 
  Package, 
  Sparkles, 
  AlertTriangle, 
  ArrowUpRight, 
  ShoppingBag,
  History,
  X,
  TrendingUp,
  Boxes,
  Percent,
  Check,
  ArrowRight,
  ShieldCheck,
  DollarSign
} from "lucide-react";
import { useAdmin, type AdminProduct, type PosBill } from "@/store/admin";
import { money } from "@/lib/products";

export const Route = createFileRoute("/admin/pos")({
  head: () => ({
    meta: [
      { title: "Retail POS & Inventory Terminal — VIVANT" },
      { name: "description", content: "Professional in-store billing and multi-channel inventory management." },
    ],
  }),
  component: PosPage,
});

interface CartItem {
  product: AdminProduct;
  size: string;
  colour: string;
  qty: number;
}

function PosPage() {
  const products = useAdmin((s) => s.products) || [];
  const posBills = useAdmin((s) => s.posBills) || [];
  const inventoryLinked = useAdmin((s) => s.inventoryLinked);
  const toggleInventoryLink = useAdmin((s) => s.toggleInventoryLink);
  const createPosBill = useAdmin((s) => s.createPosBill);
  const quickAddStock = useAdmin((s) => s.quickAddStock);
  const session = useAdmin((s) => s.session);

  // Tabs: "pos" (Billing), "stock" (Stock Add), "matrix" (Inventory Matrix), "history" (Sales & Invoices)
  const [activeTab, setActiveTab] = useState<"pos" | "stock" | "matrix" | "history">("pos");

  // POS State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card" | "split">("upi");
  const [discountType, setDiscountType] = useState<"flat" | "percent">("percent");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [applyGst, setApplyGst] = useState(true);
  const [activeReceipt, setActiveReceipt] = useState<PosBill | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  // Stock Add State
  const [stockProductSlug, setStockProductSlug] = useState<string>("");
  const [stockQtyToAdd, setStockQtyToAdd] = useState<number>(10);
  const [stockTarget, setStockTarget] = useState<"both" | "online" | "offline">("both");
  const [stockSuccessMsg, setStockSuccessMsg] = useState("");

  // Categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  // Filtered products for POS
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === "all" || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.slug.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch && !p.hidden;
    });
  }, [products, selectedCategory, search]);

  // POS Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (discountType === "flat") return Math.min(subtotal, Math.max(0, discountValue));
    return Math.min(subtotal, Math.round((subtotal * Math.max(0, Math.min(100, discountValue))) / 100));
  }, [subtotal, discountType, discountValue]);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gstAmount = applyGst ? Math.round(taxableAmount * 0.12) : 0; // 12% GST standard apparel
  const totalAmount = taxableAmount + gstAmount;

  // Key metrics
  const todayBills = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return posBills.filter((b) => b.createdAt.startsWith(today));
  }, [posBills]);

  const todayRevenue = useMemo(() => {
    return todayBills.reduce((acc, b) => acc + b.total, 0);
  }, [todayBills]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => {
      const stock = inventoryLinked ? p.stock : (p.offlineStock ?? p.stock);
      return stock <= 5;
    }).length;
  }, [products, inventoryLinked]);

  const totalStoreUnits = useMemo(() => {
    return products.reduce((acc, p) => acc + (inventoryLinked ? p.stock : (p.offlineStock ?? p.stock)), 0);
  }, [products, inventoryLinked]);

  // Cart operations
  const addToCart = (product: AdminProduct, size?: string) => {
    const chosenSize = size || product.sizes[0] || "M";
    const availableStock = inventoryLinked ? product.stock : (product.offlineStock ?? product.stock);

    const existingIdx = cart.findIndex((i) => i.product.slug === product.slug && i.size === chosenSize);
    if (existingIdx >= 0) {
      if (cart[existingIdx].qty >= availableStock) return;
      const updated = [...cart];
      updated[existingIdx].qty += 1;
      setCart(updated);
    } else {
      if (availableStock <= 0) return;
      setCart([...cart, { 
        product, 
        size: chosenSize, 
        colour: product.colours?.[0]?.name || "Original", 
        qty: 1 
      }]);
    }
  };

  const updateCartQty = (idx: number, delta: number) => {
    const item = cart[idx];
    const availableStock = inventoryLinked ? item.product.stock : (item.product.offlineStock ?? item.product.stock);
    const newQty = item.qty + delta;

    if (newQty <= 0) {
      setCart(cart.filter((_, i) => i !== idx));
    } else if (newQty <= availableStock) {
      const updated = [...cart];
      updated[idx].qty = newQty;
      setCart(updated);
    }
  };

  const removeFromCart = (idx: number) => {
    setCart(cart.filter((_, i) => i !== idx));
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) return;

    const newBill = createPosBill({
      customerName: customerName.trim() || "Walk-in Client",
      customerPhone: customerPhone.trim() || "N/A",
      items: cart.map((c) => ({
        slug: c.product.slug,
        name: c.product.name,
        size: c.size,
        colour: c.colour,
        qty: c.qty,
        price: c.product.price,
      })),
      subtotal,
      discount: discountAmount,
      tax: gstAmount,
      total: totalAmount,
      paymentMethod,
      cashier: session || "Admin Desk",
      notes: applyGst ? "12% GST Invoice" : "Standard Retail Bill",
    });

    setActiveReceipt(newBill);
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setDiscountValue(0);
  };

  const handleAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = stockProductSlug || products[0]?.slug;
    if (!slug || stockQtyToAdd <= 0) return;

    quickAddStock(slug, stockQtyToAdd, inventoryLinked ? "both" : stockTarget);
    const p = products.find((x) => x.slug === slug);
    setStockSuccessMsg(`Successfully restocked +${stockQtyToAdd} units to ${p?.name || slug}!`);
    setTimeout(() => setStockSuccessMsg(""), 4000);
  };

  return (
    <div className="space-y-6 font-sans antialiased text-ink">
      {/* Top Header & Omni-channel Sync Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-ink/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Retail Terminal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-ink mt-1">Store POS & Inventory</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Instant in-store billing, walk-in register, and real-time omni-channel stock control.
          </p>
        </div>

        {/* 1-Click Inventory Sync Switch */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper/80 px-4 py-2.5 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2">
              <div className={`grid h-7 w-7 place-items-center rounded-xl ${inventoryLinked ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"}`}>
                {inventoryLinked ? <Link2 className="h-3.5 w-3.5" /> : <Unlink className="h-3.5 w-3.5" />}
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink">
                  {inventoryLinked ? "Stocks Linked" : "Stocks Unlinked"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {inventoryLinked ? "Live Sync with Web" : "Separate Store Pool"}
                </p>
              </div>
            </div>

            <button
              onClick={toggleInventoryLink}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold tracking-wide transition-all shadow-2xs active:scale-95 ${
                inventoryLinked
                  ? "bg-ink text-cream hover:bg-ink/80"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {inventoryLinked ? "Unlink" : "Link & Sync"}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Professional KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-ink/10 bg-paper/70 p-4 shadow-2xs backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Today's POS Sales</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/10 text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{money(todayRevenue)}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{todayBills.length} completed transactions</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-paper/70 p-4 shadow-2xs backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Store Inventory</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-ink/5 text-ink">
              <Boxes className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{totalStoreUnits}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Physical units in showroom</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-paper/70 p-4 shadow-2xs backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Low Stock Alerts</span>
            <div className={`grid h-8 w-8 place-items-center rounded-xl ${lowStockCount > 0 ? "bg-amber-500/10 text-amber-700" : "bg-emerald-500/10 text-emerald-700"}`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{lowStockCount}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Products under 5 units</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-paper/70 p-4 shadow-2xs backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sync Mode</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-lime/20 text-ink">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-base font-bold text-ink">
            {inventoryLinked ? "Unified Omni-Stock" : "Independent Warehouse"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {inventoryLinked ? "Store sales update website" : "Store sales isolated"}
          </p>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-ink/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("pos")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
            activeTab === "pos"
              ? "bg-ink text-cream shadow-sm"
              : "text-muted-foreground hover:bg-ink/5 hover:text-ink"
          }`}
        >
          <Store className="h-3.5 w-3.5" />
          <span>Billing Register</span>
        </button>

        <button
          onClick={() => setActiveTab("stock")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
            activeTab === "stock"
              ? "bg-ink text-cream shadow-sm"
              : "text-muted-foreground hover:bg-ink/5 hover:text-ink"
          }`}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Quick Stock Intake</span>
        </button>

        <button
          onClick={() => setActiveTab("matrix")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
            activeTab === "matrix"
              ? "bg-ink text-cream shadow-sm"
              : "text-muted-foreground hover:bg-ink/5 hover:text-ink"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Stock Comparison Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
            activeTab === "history"
              ? "bg-ink text-cream shadow-sm"
              : "text-muted-foreground hover:bg-ink/5 hover:text-ink"
          }`}
        >
          <Receipt className="h-3.5 w-3.5" />
          <span>Sales & Invoices ({posBills.length})</span>
        </button>
      </div>

      {/* TAB 1: POS BILLING TERMINAL */}
      {activeTab === "pos" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Product Selector (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search and category pills */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search catalogue by name, SKU or fabric..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-ink/15 bg-paper/80 pl-10 pr-4 py-3 text-xs outline-none focus:border-ink focus:bg-background transition-all"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap ${
                      selectedCategory === c
                        ? "bg-ink text-cream font-semibold shadow-2xs"
                        : "bg-paper/80 border border-ink/10 text-muted-foreground hover:text-ink hover:bg-paper"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const stock = inventoryLinked ? p.stock : (p.offlineStock ?? p.stock);
                const isOutOfStock = stock <= 0;

                return (
                  <div
                    key={p.slug}
                    className={`group rounded-2xl border border-ink/10 bg-paper/70 p-3 flex flex-col justify-between transition-all duration-200 hover:border-ink/30 hover:bg-paper hover:shadow-md ${
                      isOutOfStock ? "opacity-50 grayscale" : ""
                    }`}
                  >
                    <div>
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-ink/5">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2.5 text-xs font-bold text-ink line-clamp-1">{p.name}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-ink">{money(p.price)}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          stock <= 3 ? "bg-red-500/10 text-red-700" : "bg-emerald-500/10 text-emerald-700"
                        }`}>
                          {stock} in store
                        </span>
                      </div>
                    </div>

                    {/* Sizes quick add */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.sizes.map((s) => (
                        <button
                          key={s}
                          disabled={isOutOfStock}
                          onClick={() => addToCart(p, s)}
                          className="flex-1 rounded-lg border border-ink/15 bg-background py-1 text-[10px] font-bold uppercase transition-all hover:bg-ink hover:text-cream active:scale-95 disabled:opacity-30 shadow-2xs"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Checkout Terminal & Live Cart (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-ink/15 bg-paper/90 p-5 shadow-lg backdrop-blur space-y-4">
              <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-ink" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-ink">Active POS Cart</h3>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-[11px] font-semibold text-destructive hover:underline"
                  >
                    Clear Bill
                  </button>
                )}
              </div>

              {/* Customer Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="rounded-xl border border-ink/15 bg-background px-3 py-2 text-xs outline-none focus:border-ink"
                />
                <input
                  type="tel"
                  placeholder="Mobile (For SMS Invoice)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="rounded-xl border border-ink/15 bg-background px-3 py-2 text-xs outline-none focus:border-ink"
                />
              </div>

              {/* Cart Items List */}
              <div className="max-h-56 overflow-y-auto space-y-2 divide-y divide-ink/5 pr-1">
                {cart.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-xs">
                    <ShoppingBag className="mx-auto h-7 w-7 opacity-30 mb-2" />
                    Cart is empty. Select a product size on the left.
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={`${item.product.slug}-${item.size}`} className="pt-2 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-ink truncate">{item.product.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          Size: {item.size} · {money(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateCartQty(idx, -1)}
                          className="grid h-6 w-6 place-items-center rounded-lg border border-ink/20 bg-background hover:bg-ink/5"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center font-mono font-bold text-ink">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(idx, 1)}
                          className="grid h-6 w-6 place-items-center rounded-lg border border-ink/20 bg-background hover:bg-ink/5"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="ml-1 p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <span className="w-16 text-right font-mono font-bold text-ink">
                        {money(item.product.price * item.qty)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Discount Presets & Custom Calculation */}
              <div className="border-t border-ink/10 pt-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono font-semibold">{money(subtotal)}</span>
                </div>

                {/* Discount options */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Store Discount</span>
                    <div className="flex items-center gap-1">
                      {[0, 5, 10, 15].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            setDiscountType("percent");
                            setDiscountValue(d);
                          }}
                          className={`rounded-lg px-2 py-0.5 text-[10px] font-mono font-bold transition-all ${
                            discountType === "percent" && discountValue === d
                              ? "bg-ink text-cream"
                              : "border border-ink/15 hover:bg-ink/5 text-ink"
                          }`}
                        >
                          {d === 0 ? "None" : `${d}%`}
                        </button>
                      ))}
                    </div>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount Applied</span>
                      <span>-{money(discountAmount)}</span>
                    </div>
                  )}
                </div>

                {/* GST Toggle */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={applyGst}
                      onChange={(e) => setApplyGst(e.target.checked)}
                      className="rounded accent-ink"
                    />
                    <span>GST (12% Apparel Standard)</span>
                  </label>
                  <span className="font-mono">{applyGst ? money(gstAmount) : "₹0"}</span>
                </div>

                <div className="flex items-center justify-between border-t border-ink/15 pt-2.5 text-sm font-bold text-ink">
                  <span>Grand Total</span>
                  <span className="text-2xl font-bold tracking-tight text-ink font-mono">{money(totalAmount)}</span>
                </div>
              </div>

              {/* Payment Methods Segmented Selector */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Payment Method</span>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-[11px] font-semibold transition-all ${
                      paymentMethod === "upi" ? "border-ink bg-ink text-cream shadow-sm" : "border-ink/15 bg-background hover:bg-ink/5"
                    }`}
                  >
                    <QrCode className="h-4 w-4" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-[11px] font-semibold transition-all ${
                      paymentMethod === "cash" ? "border-ink bg-ink text-cream shadow-sm" : "border-ink/15 bg-background hover:bg-ink/5"
                    }`}
                  >
                    <Banknote className="h-4 w-4" />
                    <span>Cash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-[11px] font-semibold transition-all ${
                      paymentMethod === "card" ? "border-ink bg-ink text-cream shadow-sm" : "border-ink/15 bg-background hover:bg-ink/5"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("split")}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-[11px] font-semibold transition-all ${
                      paymentMethod === "split" ? "border-ink bg-ink text-cream shadow-sm" : "border-ink/15 bg-background hover:bg-ink/5"
                    }`}
                  >
                    <Layers className="h-4 w-4" />
                    <span>Split</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {paymentMethod === "upi" && (
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-ink/20 py-2.5 text-xs font-semibold hover:bg-ink/5 text-ink bg-background"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>Show Store UPI QR Scanner</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={handleCompleteSale}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-ink py-4 text-xs font-bold tracking-[0.16em] text-cream transition-all hover:bg-ink/85 active:scale-95 disabled:opacity-40 shadow-md"
                >
                  <Printer className="h-4 w-4" />
                  <span>COMPLETE SALE & PRINT INVOICE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUICK STOCK INTAKE */}
      {activeTab === "stock" && (
        <div className="max-w-3xl space-y-6">
          <div className="rounded-3xl border border-ink/10 bg-paper/80 p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-ink">Store Stock Intake & Restocking</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quickly add stock units delivered from ateliers, batch production, or customer returns.
              </p>
            </div>

            {stockSuccessMsg && (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs font-semibold text-emerald-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{stockSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddStockSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Select Product to Restock
                </label>
                <select
                  value={stockProductSlug || products[0]?.slug}
                  onChange={(e) => setStockProductSlug(e.target.value)}
                  className="w-full rounded-xl border border-ink/15 bg-background px-4 py-3 text-xs outline-none focus:border-ink font-medium"
                  required
                >
                  {products.map((p) => {
                    const online = p.stock;
                    const offline = p.offlineStock ?? p.stock;
                    return (
                      <option key={p.slug} value={p.slug}>
                        {p.name} — [Online: {online} | Store: {offline}] — ({money(p.price)})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Quantity to Add
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={stockQtyToAdd}
                      onChange={(e) => setStockQtyToAdd(Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-xl border border-ink/15 bg-background px-4 py-2.5 text-xs outline-none focus:border-ink font-mono font-bold"
                      required
                    />
                    <div className="flex gap-1">
                      {[5, 10, 25, 50].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setStockQtyToAdd(q)}
                          className="rounded-lg border border-ink/15 bg-background px-2.5 py-2 text-xs font-mono font-bold hover:bg-ink hover:text-cream transition-all"
                        >
                          +{q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Stock Destination
                  </label>
                  {inventoryLinked ? (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-900 font-semibold">
                      ✓ Synchronized: Adding to both Online & Offline Store automatically (Linked Mode).
                    </div>
                  ) : (
                    <select
                      value={stockTarget}
                      onChange={(e) => setStockTarget(e.target.value as any)}
                      className="w-full rounded-xl border border-ink/15 bg-background px-4 py-2.5 text-xs outline-none focus:border-ink font-medium"
                    >
                      <option value="offline">Offline Store Inventory Only</option>
                      <option value="online">Online Web Storefront Only</option>
                      <option value="both">Both Stores (Equal Restock)</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-xs font-bold tracking-wider text-cream shadow-md transition-all hover:bg-ink/85 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  <span>RESTOCK INVENTORY</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: STOCK COMPARISON MATRIX */}
      {activeTab === "matrix" && (
        <div className="rounded-3xl border border-ink/10 bg-paper/80 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/10 pb-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-ink">Multi-Channel Stock Matrix</h3>
              <p className="text-xs text-muted-foreground">Compare online storefront availability against offline showroom inventory.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                inventoryLinked ? "bg-emerald-500/10 text-emerald-800" : "bg-amber-500/10 text-amber-800"
              }`}>
                {inventoryLinked ? <Link2 className="h-3.5 w-3.5" /> : <Unlink className="h-3.5 w-3.5" />}
                <span>{inventoryLinked ? "Synchronized Pool (1:1)" : "Independent Stocks"}</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-ink/10 font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 px-3 text-center">Online Web Stock</th>
                  <th className="py-3 px-3 text-center">Offline Store Stock</th>
                  <th className="py-3 px-3 text-center">Sync Status</th>
                  <th className="py-3 px-3 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {products.map((p) => {
                  const online = p.stock;
                  const offline = p.offlineStock ?? p.stock;

                  return (
                    <tr key={p.slug} className="hover:bg-paper/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="h-9 w-9 rounded-xl object-cover bg-ink/5" />
                          <div>
                            <p className="font-bold text-ink">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground uppercase font-semibold">{p.category}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-ink">{money(p.price)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`font-mono font-bold ${online <= 3 ? "text-red-600" : "text-ink"}`}>
                          {online}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`font-mono font-bold ${offline <= 3 ? "text-red-600" : "text-emerald-700"}`}>
                          {offline}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          inventoryLinked ? "bg-emerald-500/10 text-emerald-800" : "bg-amber-500/10 text-amber-800"
                        }`}>
                          {inventoryLinked ? "Linked" : "Separate"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => quickAddStock(p.slug, 5, inventoryLinked ? "both" : "offline")}
                            className="rounded-lg border border-ink/15 bg-background px-2.5 py-1 font-mono font-bold hover:bg-ink hover:text-cream text-[11px] shadow-2xs"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => quickAddStock(p.slug, 10, inventoryLinked ? "both" : "offline")}
                            className="rounded-lg border border-ink/15 bg-background px-2.5 py-1 font-mono font-bold hover:bg-ink hover:text-cream text-[11px] shadow-2xs"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SALES & INVOICES */}
      {activeTab === "history" && (
        <div className="rounded-3xl border border-ink/10 bg-paper/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ink/10 pb-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-ink">In-Store Billing Ledger</h3>
              <p className="text-xs text-muted-foreground">Historical records of walk-in sales and printed customer receipts.</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-muted-foreground">Total In-Store Collection:</span>
              <p className="text-xl font-bold font-mono text-ink">
                {money(posBills.reduce((acc, b) => acc + b.total, 0))}
              </p>
            </div>
          </div>

          {posBills.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              <Receipt className="mx-auto h-8 w-8 opacity-40 mb-2" />
              No offline POS bills recorded yet. Complete a sale in Tab 1 to generate your first invoice.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-ink/10 font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3 px-3">Invoice #</th>
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Client</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Items Summary</th>
                    <th className="py-3 px-3 text-right">Total</th>
                    <th className="py-3 px-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {posBills.map((b) => (
                    <tr key={b.id} className="hover:bg-paper/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-ink">{b.id}</td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {new Date(b.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-ink">{b.customerName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{b.customerPhone}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="rounded-full bg-ink/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-ink">
                          {b.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {b.items.map((i) => `${i.name} (${i.size}) × ${i.qty}`).join(", ")}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-ink">
                        {money(b.total)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setActiveReceipt(b)}
                          className="inline-flex items-center gap-1 rounded-lg border border-ink/20 bg-background px-3 py-1.5 text-[11px] font-bold hover:bg-ink hover:text-cream shadow-2xs transition-all"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PRINTABLE THERMAL/A4 RECEIPT MODAL */}
      <AnimatePresence>
        {activeReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-ink/10 bg-cream p-6 shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Official Store Invoice</span>
                <button onClick={() => setActiveReceipt(null)} className="rounded-full p-1.5 hover:bg-ink/5">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Thermal Invoice Format */}
              <div id="thermal-receipt" className="mt-4 flex-1 overflow-y-auto space-y-4 rounded-2xl bg-white p-6 text-ink shadow-inner font-mono text-xs border border-ink/10">
                <div className="text-center space-y-1">
                  <p className="font-sans text-2xl font-bold tracking-widest text-ink uppercase">VIVANT</p>
                  <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-widest">Haute Menswear Atelier</p>
                  <p className="text-[10px] text-muted-foreground">Avenida da Liberdade 124, Lisbon</p>
                  <p className="text-[10px] text-muted-foreground">GSTIN: 33AAACV1234F1Z5</p>
                </div>

                <div className="border-t border-dashed border-ink/30 pt-2 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span>Invoice: {activeReceipt.id}</span>
                    <span>{new Date(activeReceipt.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Client: {activeReceipt.customerName}</span>
                    <span>Tel: {activeReceipt.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cashier: {activeReceipt.cashier}</span>
                    <span className="uppercase">Pay: {activeReceipt.paymentMethod}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-ink/30 pt-2">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-ink/20 text-[10px]">
                        <th className="pb-1">Item</th>
                        <th className="pb-1 text-center">Qty</th>
                        <th className="pb-1 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                      {activeReceipt.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-1">
                            <p className="font-sans font-bold">{it.name}</p>
                            <p className="text-[10px] text-muted-foreground">Size: {it.size}</p>
                          </td>
                          <td className="py-1 text-center">{it.qty}</td>
                          <td className="py-1 text-right">{money(it.price * it.qty)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-dashed border-ink/30 pt-2 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{money(activeReceipt.subtotal)}</span>
                  </div>
                  {activeReceipt.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount</span>
                      <span>-{money(activeReceipt.discount)}</span>
                    </div>
                  )}
                  {activeReceipt.tax > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>GST (12%)</span>
                      <span>{money(activeReceipt.tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-ink/20 pt-1 text-sm font-bold">
                    <span>TOTAL PAID</span>
                    <span>{money(activeReceipt.total)}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-ink/30 pt-3 text-center text-[10px] text-muted-foreground space-y-1">
                  <p>*** Thank You for Shopping at VIVANT ***</p>
                  <p>Exchangeable within 14 days with original bill.</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-xs font-bold tracking-wider text-cream shadow-md hover:bg-ink/85"
                >
                  <Printer className="h-4 w-4" />
                  <span>PRINT RECEIPT</span>
                </button>
                <button
                  onClick={() => setActiveReceipt(null)}
                  className="rounded-full border border-ink/20 px-5 py-3 text-xs font-semibold hover:bg-ink/5"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* UPI QR SCANNER MODAL */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl border border-ink/10 bg-cream p-6 shadow-2xl text-center space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink">Store UPI QR Terminal</h3>
                <button onClick={() => setShowQrModal(false)} className="rounded-full p-1.5 hover:bg-ink/5">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-inner border border-ink/10 flex flex-col items-center">
                <div className="grid h-44 w-44 place-items-center rounded-2xl bg-ink/5 border border-dashed border-ink/30">
                  <QrCode className="h-32 w-32 text-ink" />
                </div>
                <p className="mt-3 font-mono text-sm font-bold text-ink">UPI: vivant.atelier@upi</p>
                <p className="text-xs font-bold text-emerald-700 mt-1 font-mono">Amount: {money(totalAmount)}</p>
              </div>

              <p className="text-xs text-muted-foreground">Customer can scan with Google Pay, PhonePe, Paytm, or BHIM.</p>

              <button
                onClick={() => {
                  setShowQrModal(false);
                  setPaymentMethod("upi");
                }}
                className="w-full rounded-full bg-ink py-3.5 text-xs font-bold text-cream transition-all hover:bg-ink/85 shadow-md"
              >
                CONFIRM PAYMENT RECEIVED
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
