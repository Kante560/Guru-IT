import { Nav } from '../Components/Nav'
import { Forms } from '../Components/Forms'
import { Footer } from '../Components/Footer'

const UserAssignment = () => {
  return (
    <div className="min-h-[140vh] w-full bg-user-dashboard">
      <Nav />
      <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-10 items-center justify-center w-full py-8 sm:py-12 md:py-20">
        <div className="flex flex-col mt-20 md:mt-28 w-full max-w-3xl md:max-w-5xl mx-auto bg-white/80 rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-8 md:p-10 transition-all duration-300 hover:shadow-3xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-8 md:mb-10 text-center text-blue-900 tracking-tight drop-shadow">
            Manage Your Assignments
          </h1>
          <div className="flex flex-col md:flex-col gap-6 sm:gap-8 md:gap-10 items-center justify-center w-full">
            <div className="flex justify-center items-center w-full md:w-[70%]">
              <Forms />
            </div>
          </div>
        </div>
       
      </div>
       <Footer  />
    </div>
  )
}

export default UserAssignment
