import { useState, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { FaMap } from "react-icons/fa";

const navigation = [
  { name: "About Us", href: "/welcome" },
  { name: "Location", href: "/user/current-location" },
  { name: "Restaurants", href: "/user/nearest-restaurants" },
  { name: "My Profile", href: "/profile" },
];

const backendurl = import.meta.env.VITE_BACKEND_URL

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  
  const [currentNav, setCurrentNav] = useState("About Us");

  useEffect(() => {
    const currentPath = location.pathname;
    const activeNav = navigation.find((item) => item.href === currentPath)?.name || "About Us";
    setCurrentNav(activeNav);
  }, [location]);

  const handleSignout = async () => {
    try {
      await fetch(`${backendurl}/auth/signout`);
      dispatch(signOut());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavClick = (name) => {
    setCurrentNav(name);
  };

  return (
    <Disclosure as="nav" className="bg-yellow-500">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-yellow-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          currentNav === item.name
                            ? "bg-yellow-900 text-white"
                            : "text-white hover:bg-yellow-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={
                          currentNav === item.name ? "page" : undefined
                        }
                        onClick={() => handleNavClick(item.name)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* <button
                  type="button"
                  className="relative rounded-full bg-yellow-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-yellow-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={(currentUser) ? currentUser?.profilePicture : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Fvector-art%2F27501843-a-cartoon-pizza-character-with-a-cute-face&psig=AOvVaw0NxwDLKmysfdcPfnnFWdeI&ust=1719384059645000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIjDqfOS9oYDFQAAAAAdAAAAABAE"}
                        alt=""
                        style={{ objectFit: "cover" }}
                      />
                    </MenuButton>
                  </div>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem>
                        {({ active }) => (
                          <a
                            href="/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={handleSignout}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {(currentUser) ? "Sign out" : "Sign in"}
                          </a>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    currentNav === item.name
                      ? "bg-yellow-900 text-white"
                      : "text-white hover:bg-yellow-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={currentNav === item.name ? "page" : undefined}
                  onClick={() => handleNavClick(item.name)}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
