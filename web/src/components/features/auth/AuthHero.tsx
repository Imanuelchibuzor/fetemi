"use client";

import Image from "next/image";

export function AuthHero() {
  return (
    <div className="hidden lg:block relative w-full h-full bg-muted overflow-hidden border-r border-white/10">
      <div className="absolute inset-0 bg-primary/5 mix-blend-multiply z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
      <Image
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
        alt="Algorithmic Growth"
        fill
        className="object-cover grayscale opacity-40 focus:opacity-100 transition-opacity duration-1000"
        priority
      />
      <div className="absolute bottom-16 left-16 z-30 flex flex-col gap-4 max-w-md">
        <div className="w-12 h-1 px-1 bg-primary rounded-full" />
        <h2 className="text-5xl font-black text-white tracking-tighter leading-none">
          Neural <br />Publishing.
        </h2>
        <p className="text-white/40 font-medium text-lg">
          The next generation of content automation. Secured by identity, powered by Fetemi.
        </p>
      </div>
    </div>
  );
}
