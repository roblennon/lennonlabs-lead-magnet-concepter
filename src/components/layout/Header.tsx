import { usePageConfig } from "@/hooks/usePageConfig";

const Header = () => {
  const config = usePageConfig("revenue-analyzer");

  if (!config) return null;

  return (
    <header className="bg-[#1C1B20] border-b border-border/30">
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <h1 className="text-[2.5rem] font-bold text-primary mb-4">{config.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {config.subtitle}
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img 
              src="/lovable-uploads/d7c607b0-01bb-41b3-b067-b4ca4f2e97ab.png"
              alt="Example lead magnet concepts"
              className="w-[300px] h-[300px] object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;