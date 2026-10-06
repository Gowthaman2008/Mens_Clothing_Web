import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { meta } from "@/components/layout/page";
import { useAdmin } from "@/store/admin";
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

const field = "w-full rounded-xl border border-ink/20 bg-transparent px-4 py-3 outline-none focus:border-ink";

function Hero({ title }: { title: ReactNode }) {
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-[1500px] px-5 pb-7 pt-28 md:px-10 md:pt-32">
        <p className="eyebrow mb-3 opacity-80">Account</p>
        <h1 className="font-serif text-4xl leading-[1] md:text-5xl">{title}</h1>
      </div>
    </section>
  );
}

function Account() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [err, setErr] = useState("");
  const [googleBusy, setGoogleBusy] = useState(false);
  useEffect(() => { void useAdmin.persist.rehydrate(); }, []);
  const [googleUser, setGoogleUser] = useState<{ email: string; name: string } | null>(null);
  const navigate = useNavigate();
  const { customer, accounts, orders, signIn, signUp, signOut, login } = useAdmin();

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
    if (result.redirected) return; // browser is heading to Google
    // Tokens came back directly — refresh the signed-in state.
    const { data } = await supabase.auth.getUser();
    const u = data.user;
    setGoogleUser(u?.email ? { email: u.email, name: u.user_metadata?.["full_name"] || u.user_metadata?.["name"] || "" } : null);
    setGoogleBusy(false);
  }

  if (customer || googleUser) {
    const me = accounts.find((a) => a.email === customer);
    const email = customer ?? (googleUser ? googleUser.email : "");
    const me2 = googleUser && !customer ? { name: googleUser.name } : me;
    const mine = orders.filter((o) => o.email.toLowerCase() === email.toLowerCase());
    return (
      <>
        <Hero title={<>Hello, <em>{me2?.name || "there"}.</em></>} />
        <section className="mx-auto max-w-2xl px-5 pb-20 pt-12">
          <p className="text-muted-foreground">Signed in as {email}</p>
          <h2 className="mt-8 font-serif text-3xl">Your orders</h2>
          {mine.length === 0 ? <p className="mt-4 text-muted-foreground">No orders yet. <Link to="/shop" className="underline">Start shopping.</Link></p> : (
            <ul className="mt-4 divide-y divide-ink/10">
              {mine.map((o) => <li key={o.id} className="flex justify-between py-3 text-sm"><span><b>{o.id}</b> · {o.items.length} item(s) · <span className="capitalize">{o.status}</span></span><span>{money(o.total)}</span></li>)}
            </ul>
          )}
          <button onClick={() => { signOut(); setMode("in"); void supabase.auth.signOut(); }} className="mt-10 rounded-full border border-ink/30 px-6 py-3 text-xs font-semibold tracking-widest">SIGN OUT</button>
        </section>
      </>
    );
  }

  return (
    <>
      <Hero title={mode === "in" ? <>Welcome <em>back.</em></> : <>Join <em>VIVANT.</em></>} />
      <section className="mx-auto max-w-md px-5 pb-20 pt-12">
        <div className="mb-8 flex gap-2 rounded-full border border-ink/20 p-1 text-sm font-semibold">
          {(["in", "up"] as const).map((m) => (
            <button type="button" key={m} onClick={() => { setMode(m); setErr(""); }} className={`flex-1 rounded-full py-2 ${mode === m ? "bg-ink text-cream" : ""}`}>{m === "in" ? "Sign in" : "Create account"}</button>
          ))}
        </div>
        <form method="post" className="grid gap-4" onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const email = String(f.get("email")), password = String(f.get("password"));
          if (mode === "up") {
            if (!signUp({ name: String(f.get("name")), email, password })) setErr("An account with this email already exists.");
          } else if (signIn(email, password)) {
            setErr("");
          } else if (login(email, password)) {
            navigate({ to: "/admin" });
          } else setErr("Wrong email or password. New here? Create an account.");
        }}>
          {mode === "up" && <input required name="name" placeholder="Full name" aria-label="Full name" className={field} />}
          <input required name="email" type="email" placeholder="Email" aria-label="Email" className={field} />
          <input required name="password" type="password" minLength={6} placeholder="Password" aria-label="Password" className={field} />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button type="submit" className="rounded-full bg-ink py-4 text-xs font-semibold tracking-widest text-cream">{mode === "in" ? "SIGN IN" : "CREATE ACCOUNT"}</button>
        </form>
        <div className="mt-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-ink/15" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-ink/15" />
        </div>
        <button type="button" onClick={handleGoogle} disabled={googleBusy} className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-ink bg-cream py-4 text-xs font-semibold tracking-widest text-ink transition-colors hover:bg-ink hover:text-cream disabled:opacity-60 group">
          <span className="flex items-center"><GoogleMark /></span>
          {googleBusy ? "OPENING GOOGLE…" : "CONTINUE WITH GOOGLE"}
        </button>
        <p className="mt-8 text-center text-sm text-muted-foreground">Demo mode: accounts are saved on this device only. Google sign-in works online.</p>
      </section>
    </>
  );
}
