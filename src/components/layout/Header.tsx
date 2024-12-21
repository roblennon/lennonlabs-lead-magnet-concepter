import { usePageConfig } from "@/hooks/usePageConfig";

const Header = () => {
  const config = usePageConfig("revenue-analyzer");

  if (!config) return null;

  console.log('Header config:', config); // Debug log

  return (
    <header className="bg-[#1C1B20] border-b border-border/30">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-[70%] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-1 items-center">
            <div className="lg:col-span-3 text-right">
              <h1 className="text-[2.5rem] font-bold text-primary mb-4">{config.title}</h1>
              <p className="text-lg text-muted-foreground max-w-xl ml-auto leading-relaxed">
                {config.subtitle}
              </p>
            </div>
            <div className="lg:col-span-2 flex justify-center">
              {config.header_image_url ? (
                <img 
                  src={config.header_image_url}
                  alt="Header image"
                  className="w-[300px] h-[300px] object-contain"
                  onError={(e) => {
                    console.error('Image load error:', e);
                    e.currentTarget.src = "/lovable-uploads/d7c607b0-01bb-41b3-b067-b4ca4f2e97ab.png";
                  }}
                />
              ) : (
                <img 
                  src="/lovable-uploads/d7c607b0-01bb-41b3-b067-b4ca4f2e97ab.png"
                  alt="Example lead magnet concepts"
                  className="w-[300px] h-[300px] object-contain"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;