const SplashScreen = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white p-6 shadow-lg animate-zoom-in">
        <img
          src="/intro/logo.png"
          alt="Minds in Action logo"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};

export default SplashScreen;