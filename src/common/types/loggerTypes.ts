enum logLevel {
    none, 
    debug,  
    info,  
    warning,
    error  
  }

type logConfig ={
    logLevel: logLevel;
    logFile: string;
    logTransport: Function | null;
  }

  export {
    logConfig,
    logLevel,
  }
  