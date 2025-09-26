import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="border-b border-gray-300">
      <nav
        aria-label="Navigasi Utama"
        className="container mx-auto flex h-12 items-center px-4 justify-center"
      >
        <Link to="/" className="font-bold text-lg">
          <div className="max-h-[42px] w-28">
            <img
              src="https://bhisa.id/img/logo-bhisa/logo-bhisa-landscape.png"
              alt="Logo Bhisa"
              className="object-contain w-auto"
            />
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
