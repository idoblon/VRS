import React, { useState, useEffect } from "react";
import { Building, ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import axiosInstance from "../../utils/axios";

interface CenterSignupPageProps {
  onShowLogin: () => void;
  onShowRoleSelection: () => void;
  onSignupSuccess: () => void;
}

interface CenterFormData {
  centerName: string;
  contactPersonName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  region: string;
  operationalDetails: {
    capacity: number;
    workingHours: {
      start: string;
      end: string;
    };
    workingDays: string[];
  };
  services: string[];
  documents: File[];
}

const nepalProvinces = [
  "Province 1",
  "Madhesh Province", 
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province"
];

const availableServices = [
  "Storage",
  "Packaging", 
  "Distribution",
  "Quality Check",
  "Returns Processing"
];

const workingDaysOptions = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export function CenterSignupPage({ onShowLogin, onShowRoleSelection, onSignupSuccess }: CenterSignupPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CenterFormData>({
    centerName: "",
    contactPersonName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    region: "",
    operationalDetails: {
      capacity: 100,
      workingHours: {
        start: "09:00",
        end: "18:00",
      },
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    services: ["Storage", "Distribution"],
    documents: [],
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof CenterFormData] as any),
        [field]: value,
      },
    }));
  };

  const handleArrayInputChange = (field: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof CenterFormData] as string[]), value]
        : (prev[field as keyof CenterFormData] as string[]).filter((item) => item !== value),
    }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): string | null => {
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (formData.operationalDetails.capacity < 1) {
      return "Capacity must be at least 1";
    }

    if (formData.operationalDetails.workingDays.length === 0) {
      return "Please select at least one working day";
    }

    if (formData.services.length === 0) {
      return "Please select at least one service";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Format phone number with country code
      const formattedPhone = formData.phoneNumber.startsWith("+977")
        ? formData.phoneNumber
        : `+977${formData.phoneNumber}`;

      // Prepare data for API call
      const apiData = {
        name: formData.contactPersonName,
        email: formData.email,
        password: formData.password,
        phone: formattedPhone,
        role: "CENTER",
        centerName: formData.centerName,
        address: formData.address,
        region: formData.region,
        operationalDetails: formData.operationalDetails,
        services: formData.services,
      };

      console.log("Submitting center application:", apiData);

      const response = await axiosInstance.post("/api/auth/register", apiData);

      console.log("Center application response:", response.data);
      setIsLoading(false);

      if (response.data.success) {
        alert("Application submitted successfully! Your application has been sent to the admin for verification.");
        onSignupSuccess();
      } else {
        alert(response.data.message || "Failed to submit application. Please try again.");
      }
    } catch (error: any) {
      console.error("Error submitting center application:", error);
      setIsLoading(false);

      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        const errorMessages = error.response.data.errors
          .map((err: any) => `${err.field}: ${err.message}`)
          .join("\n");
        alert(`Validation errors:\n${errorMessages}`);
      } else {
        alert(
          error.response?.data?.message ||
            "An error occurred while submitting your application. Please try again."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/vrslogo.png"
              alt="Vendor Request System Logo"
              className="w-20 h-20 object-contain"
              onError={(e) => {
                console.log("Logo failed to load");
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Distribution Center Registration
          </h1>
          <p className="text-lg text-gray-600">
            Join our distribution network and manage regional operations
          </p>
        </div>

        <Card className="p-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center mb-6">
            <button
              onClick={onShowRoleSelection}
              className="flex items-center text-orange-600 hover:text-orange-500 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Role Selection
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-6 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Basic Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distribution Center Name *
                  </label>
                  <input
                    type="text"
                    value={formData.centerName}
                    onChange={(e) => handleInputChange("centerName", e.target.value)}
                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all"
                    placeholder="Enter center name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    value={formData.contactPersonName}
                    onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all"
                    placeholder="Enter contact person name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all"
                    placeholder="center@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-3 text-sm text-gray-900 bg-gray-100 border border-r-0 border-green-200 rounded-l-lg">
                      +977
                    </span>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        handleInputChange("phoneNumber", value);
                      }}
                      className="w-full px-4 py-3 border border-green-200 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all"
                      placeholder="9876543210"
                      pattern="[0-9]{10}"
                      inputMode="numeric"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all"
                      placeholder="Enter password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-6 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Address Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleNestedInputChange("address", "street", e.target.value)}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                    placeholder="Enter street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleNestedInputChange("address", "city", e.target.value)}
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province *
                    </label>
                    <select
                      value={formData.address.state}
                      onChange={(e) => handleNestedInputChange("address", "state", e.target.value)}
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                      required
                    >
                      <option value="">Select Province</option>
                      {nepalProvinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      value={formData.address.pincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                        handleNestedInputChange("address", "pincode", value);
                      }}
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                      placeholder="123456"
                      pattern="[0-9]{6}"
                      inputMode="numeric"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region *
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) => handleInputChange("region", e.target.value)}
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                      required
                    >
                      <option value="">Select Region</option>
                      {nepalProvinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Details */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-6 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Operational Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Storage Capacity *
                  </label>
                  <input
                    type="number"
                    value={formData.operationalDetails.capacity}
                    onChange={(e) => handleNestedInputChange("operationalDetails", "capacity", parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all"
                    placeholder="Enter capacity"
                    min="1"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum number of orders that can be handled simultaneously</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Hours Start *
                    </label>
                    <input
                      type="time"
                      value={formData.operationalDetails.workingHours.start}
                      onChange={(e) => handleNestedInputChange("operationalDetails", "workingHours", {
                        ...formData.operationalDetails.workingHours,
                        start: e.target.value
                      })}
                      className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Hours End *
                    </label>
                    <input
                      type="time"
                      value={formData.operationalDetails.workingHours.end}
                      onChange={(e) => handleNestedInputChange("operationalDetails", "workingHours", {
                        ...formData.operationalDetails.workingHours,
                        end: e.target.value
                      })}
                      className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Working Days *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {workingDaysOptions.map((day) => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.operationalDetails.workingDays.includes(day)}
                          onChange={(e) => handleArrayInputChange("operationalDetails.workingDays", day, e.target.checked)}
                          className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Services Offered *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availableServices.map((service) => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={(e) => handleArrayInputChange("services", service, e.target.checked)}
                          className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-6 flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Documents
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Documents (Business License, Registration Certificate, etc.)
                </label>
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-white/50 hover:bg-white/70 transition-all">
                  <Upload className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleDocumentUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-orange-600 hover:text-orange-500 font-medium"
                  >
                    Choose files
                  </label>
                </div>

                {formData.documents.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Uploaded Files:
                    </h4>
                    <div className="space-y-2">
                      {formData.documents.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white p-3 rounded border border-orange-200"
                        >
                          <span className="text-sm text-gray-600">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">
                Application Process
              </h4>
              <p className="text-sm text-yellow-700">
                Your application will be submitted to the admin for review. You
                will receive an email notification once your application is
                approved or if additional information is required.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center space-x-4 pt-6 border-t border-orange-200">
              <Button
                type="button"
                variant="outline"
                onClick={onShowRoleSelection}
                className="px-8 border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                icon={Building}
                className="px-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
              >
                Submit Application
              </Button>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © 2024 Vendor Request System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}