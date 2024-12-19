const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-4 sm:py-6">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-4 sm:space-y-0">
          <img 
            src="/lovable-uploads/03da23fe-9a53-4fbe-b9d9-1ee4f1589282.png" 
            alt="Lennon Labs Logo" 
            className="h-12 w-12 sm:h-14 sm:w-14 sm:mr-6"
          />
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-2 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <span>Made with</span>
              <span className="text-red-500">❤️</span>
              <span>by Rob Lennon</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline">|</span>
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
      </div>
    </footer>
  );
};

export default Footer;