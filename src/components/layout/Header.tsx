import { usePageConfig } from "@/hooks/usePageConfig";

const Header = () => {
  const config = usePageConfig("revenue-analyzer");

  if (!config) return null;

  return (
    <header className="bg-[#1C1B20] border-b border-border/30">
      <div className="container mx-auto px-8 py-12 text-center">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/d7c607b0-01bb-41b3-b067-b4ca4f2e97ab.png"
            alt="Example lead magnet concepts"
            className="mx-auto w-[300px] h-[300px] object-contain"
          />
        </div>
        <h1 className="text-[2.5rem] font-bold text-primary mb-4">{config.title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {config.subtitle}
        </p>
      </div>
    </header>
  );
};

export default Header;