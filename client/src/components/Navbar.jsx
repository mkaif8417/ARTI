import { useState } from "react";
import { Link } from "react-router-dom";
// import logo from "../../assets/images/final_logo.png";
import "../styles/animation.css";

const Navbar = () => {
    const [hovered, setHovered] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [crossHovered, setCrossHovered] = useState(false); // ✅ moved inside

    const links = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Menu", path: "/menu" },
        { name: "Gallery", path: "/gallery" },
        { name: "Reservation", path: "/reservation" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 ">

            <div className="relative w-full">

                {/* Top Left */}
                <div className=" absolute  top-1 left-4 md:left-8 lg:left-12 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 border-t border-l border-[#C9A581]"></div>

                <div className=" absolute top-2 left-5 lg:top-8 md:left-10 lg:left-16 w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 border-t border-l border-[#C9A581]"></div>

                {/* Top Right */}
                <div className=" absolute  top-1 right-4 md:right-8 lg:right-12 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 border-t border-r border-[#C9A581]"></div>

                <div className=" absolute top-2 right-5 lg:top-8 md:right-10 lg:right-16 w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 border-t border-r border-[#C9A581]"></div>




                <div className="absolute top-0 left-[4%] right-[4%] md:left-[8%] md:right-[8%] lg:left-[10%] lg:right-[10%] h-20 md:h-28 lg:h-32 backdrop-blur-md bg-[#102B2A]/60 rounded-b-sm z-[-1]" />

                <div className="relative h-24 md:h-28 lg:h-32 z-10">


                    <div className="absolute left-[8%] md:left-[10%] lg:left-[10%] top-1/2 -translate-y-1/2">
                        <img
                            //   src={logo}
                            alt="ARTi"
                            className="h-16 mt-3 md:h-[90px] lg:h-[110px] w-auto object-contain"
                        />
                    </div>

                    <button
                        aria-label="Menu"
                        onClick={() => setMenuOpen(!menuOpen)}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className="absolute right-[8%] md:right-[10%] lg:right-[10%] top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center cursor-pointer z-[60]"
                    >
                        {menuOpen ? (
                            <div
                                className="w-12 h-12 flex flex-col items-center justify-center gap-1"
                                onMouseEnter={() => setCrossHovered(true)}
                                onMouseLeave={() => setCrossHovered(false)}
                            >
                                <svg
                                    width="36"
                                    height="36"
                                    viewBox="0 0 40 40"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="cross-svg"
                                >
                                    <line x1="8" y1="8" x2="32" y2="32" stroke="#C9A581" strokeWidth="3.5" strokeLinecap="round" className="cross-line-1" />
                                    <line x1="32" y1="8" x2="8" y2="32" stroke="#C9A581" strokeWidth="3.5" strokeLinecap="round" className="cross-line-2" />
                                </svg>
                                <span
                                    className="block h-[1.5px] bg-[#C9A581] transition-all duration-500 ease-in-out"
                                    style={{ width: crossHovered ? "36px" : "0px" }}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-end gap-2">
                                <span className={`h-[1.5px] bg-[#C9A581] transition-all duration-300 ${hovered ? "w-8" : "w-12"}`} />
                                <span className={`h-[1.5px] bg-[#C9A581] transition-all duration-300 ${hovered ? "w-12" : "w-8"}`} />
                            </div>
                        )}
                    </button>
                </div>

                <div className="absolute top-20 md:top-28 lg:top-32 bg-black left-4 right-4 md:left-4 md:right-4 lg:left-20 lg:right-20 h-px bg-[#C9A581]/20"></div>

                {/* Sliding Menu */}
                {/* Sliding Menu */}
                <div
                    className={`fixed
top-[6rem] md:top-[7rem] lg:top-[8rem]
 left-[2.5%] w-[95%]
md:left-[5%] md:w-[90%]
lg:left-[10%] lg:w-[80%]
  h-[55vh]
  z-[45]
  border-2 border-[#C9A581]/20
  bg-[#102B2A]/80 backdrop-blur-md
  origin-top
  transition-all
  duration-700
  ease-[cubic-bezier(0.22,1,0.36,1)]
  ${menuOpen
                            ? "scale-y-100 opacity-100"
                            : "scale-y-0 opacity-0 pointer-events-none"
                        }
`}
                >
                    <div className="flex flex-col items-center justify-center h-full gap-2 md:gap-3 lg:gap-4">

                        {links.map((link, index) => (
                            <Link
                                key={index}
                                to={link.path}
                                onClick={() => setMenuOpen(false)}
                                className="
          relative
          text-[#C9A581]
          text-2xl
          sm:text-1xl
          md:text-1xl
          lg:text-2xl
          font-light
          tracking-wide
          transition-all
          duration-300
          hover:tracking-[8px]
          hover:scale-105
          group
        "
                            >
                                {link.name}

                                <span
                                    className="
            absolute
            left-0
            -bottom-1
            h-[1px]
            w-0
            bg-[#C9A581]
            transition-all
            duration-500
            group-hover:w-full
          "
                                />
                            </Link>
                        ))}

                    </div>
                </div>
            </div>

            <div className="absolute top-1 md:top-4 left-1/2 -translate-x-1/2 w-[65%] sm:w-[65%] md:w-[70%] lg:w-[75%] h-px bg-[#C9A581]/20"></div>
        </header>
    );
};

export default Navbar;