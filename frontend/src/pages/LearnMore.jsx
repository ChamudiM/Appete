import React from "react";
import { FaUtensils, FaMapMarkerAlt, FaTags, FaEdit } from "react-icons/fa";

const LearnMore = () => {
    return (
        <div>
            <div className="bg-yellow-50 py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                      <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base text-xl font-semibold leading-7 text-yellow-600">
                          Welcome to Appete
                        </h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                          Your Ultimate Restaurant Companion
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                          Discover your next favorite restaurant with ease. From exploring
                          menus and special offers to getting detailed directions, Appete
                          provides everything you need to make the best dining choices.
                        </p>
                      </div>
                      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                          <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                              <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-600">
                                <FaUtensils className="h-6 w-6 text-white" />
                              </div>
                              Explore Menus
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">
                              Browse through detailed menus of nearby restaurants. Discover
                              new dining options and special offers all in one place.
                            </dd>
                          </div>
                          <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                              <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-600">
                                <FaMapMarkerAlt className="h-6 w-6 text-white" />
                              </div>
                              Get Directions
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">
                              Get accurate directions to your chosen restaurant, making your
                              dining experience smooth and stress-free.
                            </dd>
                          </div>
                          <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                              <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-600">
                                <FaTags className="h-6 w-6 text-white" />
                              </div>
                              Special Offers
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">
                              Find special offers and discounts at restaurants near you,
                              ensuring you get the best value for your dining experience.
                            </dd>
                          </div>
                          <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                              <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-600">
                                <FaEdit className="h-6 w-6 text-white" />
                              </div>
                              Easy Updates
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">
                              Restaurants can easily update their menus and special offers
                              to keep their listings fresh and accurate.
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    </div>
        </div>    
    );  
};

export default LearnMore