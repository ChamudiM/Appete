import Header from "../components/Header";

const Home = () => {
  return (
    <>
    <nav className="bg-yellow-500 text-gray-900 py-4 shadow-md">
  <div className="container mx-auto flex items-center justify-between px-24">  
    {/* Logo & App Name */}
    <div className="flex items-center space-x-3 ml-10"> 
      <img src="src/assets/appete.png" alt="Appete Logo" className="h-12 w-12 rounded-full object-cover" />
      <span className="text-2xl font-bold tracking-tight text-white whitespace-nowrap">Appete</span>
    </div>

    {/* Learn More Button */}
    <button className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 mr-4">
      <a href="/info" className="text-white">
      Learn More
      </a>
    </button>
  </div>
</nav>

      <div className="relative overflow-hidden bg-white">
        <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
          <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
            <div className="sm:max-w-lg">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl whitespace-nowrap">
                Welcome to Appete !
              </h1>
              <div className="mt-6 relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Join the Appete Community today.{" "}
                <a href="/sign-up" className="font-semibold text-yellow-500">
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  sign-up <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
              <p className="mt-4 text-l text-gray-500">
                Experience the joy of discovering new dining experiences right
                in your neighborhood. Whether you’re searching for a cozy café
                or the next big culinary trend, Appete is your go-to platform
                for all things food.
              </p>
            </div>
            <div>
              <div className="mt-10">
                {/* Decorative image grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
                >
                  <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                          <img
                            src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img
                            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      </div>
                      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img
                            src="https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1547&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img
                            src="https://plus.unsplash.com/premium_photo-1669150849080-241bf2ec9b4a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGZvb2R8ZW58MHx8MHx8fDA%3D"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img
                            src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      </div>
                      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img
                            src="https://plus.unsplash.com/premium_photo-1679090007096-416815b3ac2a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img
                            src="https://images.unsplash.com/photo-1611765083444-a3ce30f1c885?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D"
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <a
                    href="/sign-in"
                    className="inline-block rounded-md border border-transparent bg-yellow-500 px-12 py-3 text-center font-medium text-white hover:bg-yellow-600 mr-4"
                  >
                    User
                  </a>
                  <a
                    href="/restaurant/sign-up"
                    className="inline-block rounded-md border border-transparent bg-yellow-500 px-8 py-3 text-center font-medium text-white hover:bg-yellow-600"
                  >
                    Restaurant
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
