"use client";

import { Building2, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [fullName, setFullName] = useState("");
  const supabase = createClient();

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!email || !password) return setError("Please enter your email and password.");
    if (!supabase) return router.push("/");
    setLoading(true);
    if (creatingAccount) {
      if (!fullName) {
        setLoading(false);
        return setError("Please enter your name.");
      }
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      setLoading(false);
      if (signUpError) return setError(signUpError.message);
      if (!data.session) {
        setMessage("Account created. Check your email to confirm it, then sign in.");
        setCreatingAccount(false);
        return;
      }
      router.push("/");
      router.refresh();
      return;
    }
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) return setError(authError.message);
    router.push("/");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest"><Building2 size={22} /></span><span className="font-black">Nammude Veedu</span></div>
        <div className="max-w-lg">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">Your home. Your numbers.</p>
          <h1 className="mt-5 text-5xl font-black leading-[1.08]">Build the dream.<br />Track every rupee.</h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/55">A simple shared tracker for Dheeraj and Deepika—because the best homes are built with clarity.</p>
        </div>
        <p className="text-xs text-white/30">Private · Secure · Made for your family</p>
      </section>
      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest text-white"><Building2 size={22} /></span><span className="font-black">Nammude Veedu</span></div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-forest">Welcome home</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">{creatingAccount ? "Create account" : "Sign in"}</h2>
          <p className="mt-3 text-sm text-slate-500">{creatingAccount ? "Set up secure access to your shared house tracker." : "Use your account to open the house tracker."}</p>
          <form onSubmit={login} className="mt-8 space-y-5">
            {creatingAccount && <div><label className="label">Full name</label><input className="field" placeholder="Dheeraj or Deepika" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>}
            <div><label className="label">Email address</label><input type="email" className="field" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><label className="label">Password</label><div className="relative"><input type={show ? "text" : "password"} className="field pr-12" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-3 text-slate-400">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}
            {message && <p className="rounded-2xl bg-mint px-4 py-3 text-sm font-bold text-forest">{message}</p>}
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-forest px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-forest/20" disabled={loading}>{loading && <LoaderCircle size={18} className="animate-spin" />} {creatingAccount ? "Create account" : "Sign in"}</button>
          </form>
          {supabase && <button onClick={() => { setCreatingAccount(!creatingAccount); setError(""); setMessage(""); }} className="mt-5 w-full text-center text-sm font-bold text-forest">{creatingAccount ? "Already have an account? Sign in" : "New here? Create an account"}</button>}
          {!supabase && <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800"><strong>Preview mode:</strong> enter any email and password to explore. Connect Supabase to enable secure accounts.</div>}
        </div>
      </section>
    </main>
  );
}
