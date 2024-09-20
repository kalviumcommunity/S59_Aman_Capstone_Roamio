"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, TextInput, Alert } from "flowbite-react";
import FileUploader from "@/app/components/UploadFile/UploadFile";
import axios from "axios";
import { Search, X, AlertCircle } from 'lucide-react';

const dummyCollaborators = [
  { id: 1, name: "Wade Cooper", avatar: "/api/placeholder/32/32" },
  { id: 2, name: "Arlene Mccoy", avatar: "/api/placeholder/32/32" },
  { id: 3, name: "Devon Webb", avatar: "/api/placeholder/32/32" },
  { id: 4, name: "Tom Cook", avatar: "/api/placeholder/32/32" },
  { id: 5, name: "Tanya Fox", avatar: "/api/placeholder/32/32" },
  { id: 6, name: "Hellen Schmidt", avatar: "/api/placeholder/32/32" },
];

export default function Page() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [location, setLocation] = useState("");
  const [cities, setCities] = useState([]);
  const [caption, setCaption] = useState("");
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [cityQuery, setCityQuery] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cityQuery) {
        fetchCities(cityQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [cityQuery]);

  const fetchCities = async (searchTerm) => {
    try {
      setError(null);
      const config = {
        method: "get",
        url: `https://api.countrystatecity.in/v1/countries/IN/cities`,
        headers: {
          "X-CSCAPI-KEY": "NFJ6ZXpuYk11RWVVcTdyZWVXQzRNeklwVXVOVUNleUtSdUZXdVpjeA==",
        },
      };
      const response = await axios(config);
      const filteredCities = response.data.filter((city) =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCities(filteredCities);
      setIsCityDropdownOpen(true);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setError("Failed to fetch cities. Please try again.");
    }
  };

  const onSubmit = (data) => {
    console.log("Form data:", { ...data, location, selectedCollaborators });
    // Here you would typically send the data to your backend
  };

  const toggleCollaboratorSelection = (collaborator) => {
    setSelectedCollaborators((prev) =>
      prev.some((c) => c.id === collaborator.id)
        ? prev.filter((c) => c.id !== collaborator.id)
        : [...prev, collaborator]
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create New Post</h1>
        {error && (
          <Alert color="failure" icon={AlertCircle}>
            <span className="font-medium">Error!</span> {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                  Upload File
                </label>
                <div className="mt-1 border-gray-300 rounded-md">
                  <FileUploader register={register} setValue={setValue} />
                </div>
                {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file.message}</p>}
              </div>
              <div className="relative space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="relative">
                  <TextInput
                    id="location"
                    type="text"
                    placeholder="Search city..."
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                {isCityDropdownOpen && cities.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {cities.map((city) => (
                      <li
                        key={city.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setLocation(city.name);
                          setCityQuery(city.name);
                          setIsCityDropdownOpen(false);
                        }}
                      >
                        {city.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
                  Caption
                </label>
                <TextInput
                  id="caption"
                  type="text"
                  placeholder="Write your caption here..."
                  {...register("caption", { required: "Caption is required" })}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                {errors.caption && <p className="mt-2 text-sm text-red-600">{errors.caption.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="collaborators" className="block text-sm font-medium text-gray-700">
                  Collaborators
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-2">
                  {dummyCollaborators.map((collaborator) => {
                    const isSelected = selectedCollaborators.some((c) => c.id === collaborator.id);
                    return (
                      <div
                        key={collaborator.id}
                        className={`flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors ${
                          isSelected ? "bg-blue-50 border border-blue-300" : ""
                        }`}
                        onClick={() => toggleCollaboratorSelection(collaborator)}
                      >
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={collaborator.avatar}
                          alt={collaborator.name}
                        />
                        <span className="flex-grow">{collaborator.name}</span>
                        {isSelected && (
                          <span className="text-blue-500">
                            <X size={20} onClick={(e) => {
                              e.stopPropagation();
                              toggleCollaboratorSelection(collaborator);
                            }} />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Upload Post
          </Button>
        </form>
      </div>
    </div>
  );
}