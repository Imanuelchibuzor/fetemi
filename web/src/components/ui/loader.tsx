interface Prop {
  text: string;
}

const Loader = ({ text }: Prop) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
      <h2 className="text-xl font-black uppercase tracking-widest text-foreground/40">
        {text}
      </h2>
    </div>
  );
};

export default Loader;
