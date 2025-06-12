import { Nav } from "./Nav";
import { Footer } from "../Components/Footer";
import { Forms } from "../Components/Forms";
import { CalendarPage } from "../Pages/Calender";
import { useAuth } from "../Components/AuthContext.tsx";

export const Home = () => {
  const { isAuthenticated,  } = useAuth();
  return (
    <>
      <Nav />

      { isAuthenticated ? (
        <>
          

          {/* Only show assignments/calendar if logged in */}
          <div className="flex flex-col  md:flex-row gap-8 items-center justify-center bg-gradient-to-r from-blue-100 via-white to-red-100 w-full py-12">
            <div className="flex flex-col mt-20 w-full">
              <h1 className="text-4xl font-bold mb-10 text-center text-blue-900">
                Welcome to GURU-IT
              </h1>
              <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
                <div className="flex justify-center items-center w-full md:w-auto">
                  <Forms />
                </div>
                <div className="flex justify-center items-center w-full md:w-auto">
                  <CalendarPage />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-gradient-to-r from-blue-100 font-inter to-red-100 min-h-screen flex items-center justify-center">
            <div className="flex items-center flex-col space-x-2  px-4 max-w-4xl mx-auto">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  <div className="text-center">
                    Launch Your
                    <span className="text-blue-900">Tech</span>
                  </div>
                  <span className="text-red-600 max-w-[100px]">
                    Career with Ease
                  </span>
                </h1>
              </div>
              <div className="text-center w-full flex items-center justify-center rounded-lg p-4 ">
                <p className="text-gray-600 py-3 text-[20px] max-w-[560px] text-center">
                  Join our innovation hub and help build the startups of
                  tomorrow. Apply for an internship to gain hands-on experience,
                  mentorship, and be part of a dynamic tech community.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </>
  );
};
