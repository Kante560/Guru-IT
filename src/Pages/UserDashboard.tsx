import { useAuth } from "../Components/AuthContext.tsx";
import { Footer } from "../Components/Footer.tsx";
import { Forms } from "../Components/Forms.tsx";
import { CalendarPage } from "../Components/Calender.tsx";
import { Nav } from "../Components/Nav.tsx";
import SplitText from "../ui/SplitText.tsx"; // ✅ import GSAP SplitText

export const Home = () => {
  const { isAuthenticated } = useAuth();

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <>
      <Nav />

      {isAuthenticated ? (
        <div className="min-h-screen w-full bg-user-dashboard">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full py-8 sm:py-12 md:py-16">
            <div className="flex flex-col mt-20 w-full max-w-3xl mx-auto bg-white/80 rounded-2xl shadow-2xl p-4 sm:p-8 transition-all duration-300 hover:shadow-3xl">
              <h1 className="text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-8 text-center text-blue-900 tracking-tight drop-shadow">
                Welcome to <span className="text-red-600">GURU-IT</span>
              </h1>
              <div className="flex flex-col md:flex-col gap-6 sm:gap-8 items-center justify-center w-full">
                <div className="flex justify-center items-center w-full md:w-auto">
                  <CalendarPage />
                </div>
                <div className="flex justify-center items-center w-full md:w-auto">
                  <Forms />
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <div className="min-h-screen w-full bg-unauth-home">
          <div className="font-inter min-h-screen flex items-center justify-center relative overflow-hidden px-2 sm:px-0">
            {/* Animated shooting stars */}
            <div className="absolute top-[20%] left-[10%] w-[2px] h-[80px] bg-gradient-to-b from-white to-transparent rotate-45 animate-shooting delay-[3s]"></div>
            <div className="absolute top-[40%] left-[20%] w-[1px] h-[80px] bg-gradient-to-b from-white to-transparent rotate-45 animate-shooting delay-[6s]"></div>
            <div className="absolute top-[60%] left-[30%] w-[2px] h-[80px] bg-gradient-to-b from-white to-transparent rotate-45 animate-shooting delay-[10s]"></div>
            <div className="absolute top-[80%] left-[40%] w-[2px] h-[80px] bg-gradient-to-b from-white to-transparent rotate-45 animate-shooting delay-[15s]"></div>
            <div className="absolute top-[20%] right-[10%] w-[2px] h-[80px] bg-gradient-to-b from-white to-transparent rotate-45 animate-shooting delay-[3s]"></div>

            <div className="flex items-center flex-col px-2 sm:px-4 max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 sm:p-10 border border-blue-900/10 transition-all duration-300 hover:shadow-3xl">
              {/* ✅ Replaced h1 with SplitText */}
              <div className="mb-4 sm:mb-6 md:mb-8">
               <SplitText
  className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow text-center"
  delay={80}
  duration={0.6}
  ease="power3.out"
  splitType="chars"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  onLetterAnimationComplete={handleAnimationComplete}
>
  Launch Your <span className="text-blue-900 ml-2">Tech</span>{" "}
  <span className="block text-red-600 mt-2">
    Career with Ease 🚀
  </span>
</SplitText>
              </div>

              <div className="text-center w-full flex items-center justify-center rounded-lg p-2 sm:p-4">
                <p className="text-white py-2 sm:py-3 text-base sm:text-lg md:text-xl max-w-[560px] text-center font-medium">
                  Join our innovation hub and help build the startups of
                  tomorrow. Apply for an internship to gain hands-on experience,
                  mentorship, and be part of a dynamic tech community.
                </p>
              </div>

              <div className="flex items-center justify-center mt-4 sm:mt-8">
                <a
                  href="/signup"
                  className="bg-blue-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition duration-300 active:scale-95"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};
