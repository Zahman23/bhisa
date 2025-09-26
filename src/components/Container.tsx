import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const Container = ({ children, title, description }: ContainerProps) => {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8">
          <div className="h-14 flex items-center justify-between">
            <a href="/" className="text-lg font-semibold">
              {title}
            </a>
            <div className="text-sm text-gray-600 hidden md:block">
              {description}
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1280px] px-6 md:px-8">
        {children}
      </main>
      <footer className="border-t">
        <div
          className={`mx-auto w-full max-w-[1280px] py-6 text-sm text-gray-600`}
        >
          © {new Date().getFullYear()} Bhisa Shuttle
        </div>
      </footer>
    </div>
  );
};

export default Container;
