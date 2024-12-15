const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-6">
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-start text-muted-foreground">
          <img 
            src="/lovable-uploads/03da23fe-9a53-4fbe-b9d9-1ee4f1589282.png" 
            alt="Lennon Labs Logo" 
            className="h-14 w-14 mr-6"
          />
          <div className="flex items-center space-x-2">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>by Rob Lennon |</span>
            <a 
              href="https://lennonlabs.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:text-primary/80 transition-colors"
            >
              lennonlabs.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;