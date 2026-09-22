import { useState } from "react";
import { ArrowLeft, ArrowUpRight, LockKeyhole } from "lucide-react";
import { Link, useLocation } from "wouter";
import { logoImage } from "@/academy-data";
import { trpc } from "@/lib/trpc";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = trpc.coach.login.useMutation({
    onSuccess: result => {
      if (result.success) {
        sessionStorage.setItem("cobra_admin", "1");
        navigate("/admin/dashboard");
      } else {
        setError("The username or password is not correct.");
      }
    },
    onError: () => setError("Unable to reach the coach portal. Please try again."),
  });
  const signIn = () => {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Enter the coach username and password to continue.");
      return;
    }
    login.mutate({ username: username.trim(), password });
  };

  return <div className="grid min-h-screen bg-[#080809] text-[#f5f2ed] lg:grid-cols-2">
    <div className="relative hidden overflow-hidden border-r border-white/10 lg:block">
      <img src="/manus-storage/cobra-hero-kata-a_56be9fa6.jpg" alt="Karate athlete performing kata" className="absolute inset-0 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#080809]/90 via-[#080809]/25 to-[#cf3b31]/25" />
      <div className="relative flex h-full flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3"><img src={logoImage} alt="The Cobra Karate Academy" className="h-16 w-16 object-contain" /><div><div className="display text-xl font-extrabold tracking-[.08em]">THE COBRA</div><div className="text-[.48rem] font-bold tracking-[.28em] text-[#b8b3b4]">KARATE ACADEMY</div></div></Link>
        <div><div className="section-kicker">Coach portal</div><h1 className="display mt-5 max-w-md text-7xl font-black uppercase leading-[.85]">The work<br /><span className="text-[#cf3b31]">continues</span><br />behind the scenes.</h1></div>
        <div className="text-[.62rem] font-bold uppercase tracking-[.18em] text-white/55">Private admin access / official academy portal</div>
      </div>
    </div>
    <div className="flex items-center justify-center px-5 py-16"><div className="w-full max-w-md">
      <Link href="/" className="mb-16 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#9f9b9d] hover:text-white"><ArrowLeft size={15} /> Back to public site</Link>
      <div className="mb-10"><img src={logoImage} alt="The Cobra Karate Academy" className="mb-7 h-24 w-24 object-contain lg:hidden" /><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#cf3b31]/15 text-[#cf3b31]"><LockKeyhole size={21} /></div><div className="section-kicker">Coach admin / secure entry</div><h2 className="display mt-4 text-5xl font-bold uppercase">Welcome back.</h2><p className="mt-4 text-sm leading-6 text-[#969294]">Sign in to manage students, attendance, achievements, gallery items and academy announcements.</p></div>
      <div className="space-y-5"><div><label className="text-[.64rem] font-bold uppercase tracking-[.18em] text-[#9f9b9d]">Username</label><input value={username} onChange={e => setUsername(e.target.value)} className="mt-2 w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm outline-none focus:border-[#cf3b31]" placeholder="coach username" autoComplete="username" /></div><div><label className="text-[.64rem] font-bold uppercase tracking-[.18em] text-[#9f9b9d]">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && signIn()} className="mt-2 w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm outline-none focus:border-[#cf3b31]" placeholder="••••••••" autoComplete="current-password" /></div>{error && <div className="text-xs text-[#e06b62]">{error}</div>}<button onClick={signIn} disabled={login.isPending} className="btn-press mt-3 flex w-full items-center justify-between bg-[#cf3b31] px-5 py-4 text-xs font-bold uppercase tracking-[.17em] hover:bg-[#e14b40] disabled:cursor-wait disabled:opacity-60">{login.isPending ? "Checking access" : "Enter dashboard"} <ArrowUpRight size={16} /></button></div>
      <div className="mt-8 border-t border-white/10 pt-5 text-[.62rem] leading-5 text-[#6f6b6e]">Coach credentials are verified server-side and never shipped in the browser bundle. Keep them private and rotate them from project secrets when needed.</div>
    </div></div>
  </div>;
}
