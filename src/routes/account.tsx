import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  User, 
  Wallet, 
  Heart, 
  MapPin, 
  MessageSquare, 
  RotateCw, 
  LogOut, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  Check, 
  Package, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import { meta } from "@/components/layout/page";
import { useAdmin } from "@/store/admin";
import { useShop } from "@/store/shop";
import { money } from "@/lib/products";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: meta("Your Account — VIVANT", "Sign in to your VIVANT account to track orders and manage your saved pieces.") }),
  component: Account,
});

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

const field = "w-full rounded-2xl border border-ink/15 bg-paper/60 px-5 py-4 text-sm outline-none transition-all focus:border-ink focus:bg-cream placeholder:text-muted-foreground/60";

function Hero({ title }: { title: ReactNode }) {
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-[1500px] px-5 pb-10 pt-28 md:px-10 md:pt-36">
        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-cream/40" />
          <p className="eyebrow opacity-80">Member Portal</p>
        </div>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">{title}</h1>
      </div>
    </section>
  );
}


function Account() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [err, setErr] = useState("");
  const [googleBusy, setGoogleBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState<"orders" | "profile" | "wallet" | "addresses" | null>(null);
  
  // Profile edit state
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("+91 98765 43210");
  const [savedAddress, setSavedAddress] = useState("Avenida da Liberdade 124, 1250-144 Lisbon, Portugal");

  useEffect(() => { void useAdmin.persist.rehydrate(); }, []);
  const [googleUser, setGoogleUser] = useState<{ email: string; name: string } | null>(null);
  const { customer, accounts, orders, products, messages, admins, signIn, signUp, signOut, login } = useAdmin();
  const wishlist = useShop((s) => s.wishlist);

  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!alive) return;
      const u = data.user;
      if (u?.email) setGoogleUser({ email: u.email, name: u.user_metadata?.["full_name"] || u.user_metadata?.["name"] || "" });
    });
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT") return;
      supabase.auth.getUser().then(({ data: d }) => {
        if (!alive) return;
        const u = d.user;
        setGoogleUser(u?.email ? { email: u.email, name: u.user_metadata?.["full_name"] || u.user_metadata?.["name"] || "" } : null);
      });
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function handleGoogle() {
    setErr("");
    setGoogleBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setErr("Google sign-in didn't work. Please try again.");
      setGoogleBusy(false);
      return;
    }
    if (result.redirected) return;
    const { data } = await supabase.auth.getUser();
    const u = data.user;
    setGoogleUser(u?.email ? { email: u.email, name: u.user_metadata?.["full_name"] || u.user_metadata?.["name"] || "" } : null);
    setGoogleBusy(false);
  }

  const handleRefresh = () => {
    setRefreshing(true);
    void useAdmin.persist.rehydrate();
    setTimeout(() => setRefreshing(false), 600);
  };

  if (customer || googleUser) {
    const email = customer ?? (googleUser ? googleUser.email : "");
    const me = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    const me2 = googleUser && !customer ? { name: googleUser.name } : me;
    const mine = orders.filter((o) => o.email.toLowerCase() === email.toLowerCase());
    const isAdmin = admins.some((a) => a.email.toLowerCase() === email.toLowerCase());
    const currentName = profileName || me2?.name || (isAdmin ? "Administrator" : "Client");

    return (
      <div className="min-h-screen bg-cream">
        <Hero title={<>Welcome, <em className="italic">{currentName}.</em></>} />

        <main className="mx-auto max-w-6xl px-4 py-12 md:px-8">
          {/* Admin Control Panel Bar */}
          {isAdmin && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-ink px-5 py-3 text-cream shadow-sm">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-cream/90" />
                <span className="text-xs font-medium tracking-wide">Admin Control Panel</span>
              </div>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-1.5 text-xs font-semibold tracking-wider text-ink transition-all hover:bg-white active:scale-95"
              >
                <span>Open Panel</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Top User Profile Header Card */}
          <div className="rounded-3xl border border-ink/10 bg-paper/80 p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-md mb-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="grid h-16 w-16 place-items-center rounded-full border border-ink/15 bg-cream text-ink shadow-sm">
                    <User className="h-8 w-8 stroke-[1.5] text-ink/80" />
                  </div>
                  <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-paper bg-emerald-500 shadow-sm" />
                </div>
                <div>
                  <h2 className="font-sans text-2xl font-bold tracking-tight text-ink md:text-3xl">{currentName}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 rounded-2xl border border-ink/15 bg-cream px-5 py-2.5 text-xs font-semibold tracking-wider text-ink transition-all hover:border-ink/40 hover:bg-paper active:scale-95 disabled:opacity-60 shadow-2xs"
                >
                  <RotateCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </button>
                <button
                  onClick={() => { signOut(); setMode("in"); void supabase.auth.signOut(); }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-2.5 text-xs font-semibold tracking-wider text-destructive transition-all hover:bg-destructive hover:text-white active:scale-95 shadow-2xs"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            </div>
          </div>

          {/* 6 Grid Action Cards (matching reference layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: My Orders */}
            <div 
              onClick={() => setActiveModal("orders")}
              className="group cursor-pointer rounded-3xl border border-ink/10 bg-paper/80 p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-lg flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-ink/10 bg-cream text-ink transition-transform group-hover:scale-105">
                  <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                </div>
                <h3 className="mt-5 font-sans font-semibold text-lg text-ink">My Orders</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  View your order history, statuses, tracking details and invoice slips.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-ink/80 group-hover:text-ink group-hover:underline underline-offset-4">
                <span>{mine.length} {mine.length === 1 ? "order" : "orders"} found</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </div>

            {/* Card 2: Account Details */}
            <div 
              onClick={() => setActiveModal("profile")}
              className="group cursor-pointer rounded-3xl border border-ink/10 bg-paper/80 p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-lg flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-ink/10 bg-cream text-ink transition-transform group-hover:scale-105">
                  <User className="h-5 w-5 stroke-[1.5]" />
                </div>
                <h3 className="mt-5 font-sans font-semibold text-lg text-ink">Account Details</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Update your personal contact details, mobile number, and full name.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-ink/80 group-hover:text-ink group-hover:underline underline-offset-4">
                <span>Edit profile</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </div>

            {/* Card 3: Cashback Wallet */}
            <div 
              onClick={() => setActiveModal("wallet")}
              className="group cursor-pointer rounded-3xl border border-ink/10 bg-paper/80 p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-lg flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-ink/10 bg-cream text-ink transition-transform group-hover:scale-105">
                  <Wallet className="h-5 w-5 stroke-[1.5]" />
                </div>
                <h3 className="mt-5 font-sans font-semibold text-lg text-ink">Cashback Wallet</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Inspect your active cashback credits ledger earned on deliveries.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-ink/80 group-hover:text-ink group-hover:underline underline-offset-4">
                <span>Balance: ₹500</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </div>

            {/* Card 4: Wishlist */}
            <Link 
              to="/wishlist"
              className="group cursor-pointer rounded-3xl border border-ink/10 bg-paper/80 p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-lg flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-ink/10 bg-cream text-ink transition-transform group-hover:scale-105">
                  <Heart className="h-5 w-5 stroke-[1.5]" />
                </div>
                <h3 className="mt-5 font-sans font-semibold text-lg text-ink">Wishlist</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Saved premium menswear pieces you are keeping an eye on.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-ink/80 group-hover:text-ink group-hover:underline underline-offset-4">
                <span>{wishlist.length} saved items</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </Link>

            {/* Card 5: Addresses */}
            <div 
              onClick={() => setActiveModal("addresses")}
              className="group cursor-pointer rounded-3xl border border-ink/10 bg-paper/80 p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-lg flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-ink/10 bg-cream text-ink transition-transform group-hover:scale-105">
                  <MapPin className="h-5 w-5 stroke-[1.5]" />
                </div>
                <h3 className="mt-5 font-sans font-semibold text-lg text-ink">Addresses</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Configure saved delivery recipient and shipping addresses.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-ink/80 group-hover:text-ink group-hover:underline underline-offset-4">
                <span>1 addresses configured</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </div>

            {/* Card 6: Contact Support */}
            <Link 
              to="/contact"
              className="group cursor-pointer rounded-3xl border border-ink/10 bg-paper/80 p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-lg flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-ink/10 bg-cream text-ink transition-transform group-hover:scale-105">
                  <MessageSquare className="h-5 w-5 stroke-[1.5]" />
                </div>
                <h3 className="mt-5 font-sans font-semibold text-lg text-ink">Contact Support</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Submit inquiries directly to our tailoring concierge desk.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-ink/80 group-hover:text-ink group-hover:underline underline-offset-4">
                <span>Send message</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </Link>

          </div>
        </main>

        {/* Modal: My Orders */}
        <AnimatePresence>
          {activeModal === "orders" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl rounded-3xl border border-ink/10 bg-cream p-6 md:p-8 shadow-2xl max-h-[85vh] flex flex-col"
              >
                <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-paper border border-ink/10">
                      <ShoppingBag className="h-5 w-5 text-ink" />
                    </div>
                    <div>
                      <h3 className="font-sans text-xl font-bold tracking-tight text-ink">My Order History</h3>
                      <p className="text-xs text-muted-foreground">{mine.length} orders recorded</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="rounded-full p-2 hover:bg-ink/5">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
                  {mine.length === 0 ? (
                    <div className="py-12 text-center">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground/40" />
                      <p className="mt-3 text-sm text-muted-foreground">No orders placed yet.</p>
                      <Link to="/shop" onClick={() => setActiveModal(null)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-xs font-semibold text-cream">
                        Explore Shop <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ) : (
                    mine.map((o) => (
                      <div key={o.id} className="rounded-2xl border border-ink/10 bg-paper/60 p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono text-xs font-bold text-ink">{o.id}</span>
                            <span className="ml-2 rounded-full bg-ink/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-ink">
                              {o.status}
                            </span>
                          </div>
                          <span className="font-sans text-base font-bold text-ink">{money(o.total)}</span>
                        </div>
                        <div className="divide-y divide-ink/5 text-xs text-ink/80 pt-2">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between py-1.5">
                              <span>{item.name} ({item.size}) × {item.qty}</span>
                              <span className="font-mono">{money(item.price * item.qty)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Account Details */}
        <AnimatePresence>
          {activeModal === "profile" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md rounded-3xl border border-ink/10 bg-cream p-6 md:p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                  <h3 className="font-sans text-xl font-bold tracking-tight text-ink">Edit Account Profile</h3>
                  <button onClick={() => setActiveModal(null)} className="rounded-full p-2 hover:bg-ink/5">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setActiveModal(null);
                  }}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Full Name</label>
                    <input
                      value={profileName || currentName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className={field}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Phone Number</label>
                    <input
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className={field}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Email Address</label>
                    <input
                      value={email}
                      disabled
                      className={`${field} opacity-60 cursor-not-allowed`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-ink py-4 text-xs font-bold tracking-[0.16em] text-cream transition-all hover:bg-ink/85 shadow-md"
                  >
                    SAVE CHANGES
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Cashback Wallet */}
        <AnimatePresence>
          {activeModal === "wallet" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md rounded-3xl border border-ink/10 bg-cream p-6 md:p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                  <h3 className="font-sans text-xl font-bold tracking-tight text-ink">Cashback Wallet</h3>
                  <button onClick={() => setActiveModal(null)} className="rounded-full p-2 hover:bg-ink/5">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-6 rounded-2xl bg-ink p-6 text-cream text-center shadow-md">
                  <p className="text-xs uppercase tracking-widest text-cream/70 font-mono">Available Store Credits</p>
                  <p className="mt-2 font-serif text-4xl font-semibold text-lime">₹500.00</p>
                  <p className="mt-2 text-xs text-cream/80">Can be applied during checkout on all collections.</p>
                </div>
                <div className="mt-6 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Ledger</h4>
                  <div className="flex items-center justify-between rounded-xl bg-paper/60 p-3.5 text-xs">
                    <div>
                      <p className="font-semibold text-ink">Welcome Privilege Credit</p>
                      <p className="text-muted-foreground text-[11px]">Active balance</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-600">+₹500</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Addresses */}
        <AnimatePresence>
          {activeModal === "addresses" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md rounded-3xl border border-ink/10 bg-cream p-6 md:p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                  <h3 className="font-sans text-xl font-bold tracking-tight text-ink">Delivery Addresses</h3>
                  <button onClick={() => setActiveModal(null)} className="rounded-full p-2 hover:bg-ink/5">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-ink/15 bg-paper/80 p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-ink">Primary Address</span>
                      <span className="rounded-full bg-emerald-500/10 text-emerald-700 px-2 py-0.5 text-[10px] font-semibold">Default</span>
                    </div>
                    <p className="text-xs text-ink/80 leading-relaxed">{savedAddress}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Edit Address</label>
                    <textarea
                      value={savedAddress}
                      onChange={(e) => setSavedAddress(e.target.value)}
                      rows={3}
                      className={field}
                    />
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full rounded-full bg-ink py-4 text-xs font-bold tracking-[0.16em] text-cream transition-all hover:bg-ink/85 shadow-md"
                  >
                    SAVE ADDRESS
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Hero title={mode === "in" ? <>Welcome <em>back.</em></> : <>Join <em>VIVANT.</em></>} />
      <section className="mx-auto max-w-md px-5 pb-24 pt-12">
        <div className="mb-8 flex gap-1.5 rounded-full border border-ink/15 bg-paper/60 p-1 text-sm font-semibold">
          {(["in", "up"] as const).map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => { setMode(m); setErr(""); }}
              className={`flex-1 rounded-full py-2.5 text-xs tracking-wider transition-all ${mode === m ? "bg-ink text-cream shadow-md font-bold" : "text-ink/70 hover:text-ink"}`}
            >
              {m === "in" ? "SIGN IN" : "CREATE ACCOUNT"}
            </button>
          ))}
        </div>

        <form method="post" className="grid gap-4" onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const email = String(f.get("email")), password = String(f.get("password"));
          if (mode === "up") {
            if (!signUp({ name: String(f.get("name")), email, password })) setErr("An account with this email already exists.");
          } else {
            const customerOk = signIn(email, password);
            const adminOk = login(email, password);
            if (customerOk || adminOk) {
              setErr("");
            } else {
              setErr("Wrong email or password. New here? Create an account.");
            }
          }
        }}>
          {mode === "up" && <input required name="name" placeholder="Full name" aria-label="Full name" className={field} />}
          <input required name="email" type="email" placeholder="Email address" aria-label="Email" className={field} />
          <input required name="password" type="password" minLength={6} placeholder="Password" aria-label="Password" className={field} />
          {err && <p className="text-xs text-destructive bg-destructive/10 p-3 rounded-xl">{err}</p>}
          <button type="submit" className="rounded-full bg-ink py-4 text-xs font-bold tracking-[0.16em] text-cream transition-all hover:bg-ink/85 hover:shadow-lg active:scale-[0.99]">
            {mode === "in" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <span className="h-px flex-1 bg-ink/10" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-ink/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleBusy}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-ink/20 bg-paper/80 py-4 text-xs font-semibold tracking-widest text-ink transition-all hover:border-ink hover:bg-cream disabled:opacity-60 group shadow-sm"
        >
          <span className="flex items-center"><GoogleMark /></span>
          {googleBusy ? "CONNECTING TO GOOGLE…" : "CONTINUE WITH GOOGLE"}
        </button>
        <p className="mt-8 text-center text-xs text-muted-foreground/80 leading-relaxed">
          Demo mode: accounts and orders are saved locally on this browser session.
        </p>
      </section>
    </div>
  );
}
