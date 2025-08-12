import React, { useState } from "react";
import { LogIn, User, Building, Shield } from "lucide-react";
import { User } from "../../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import axiosInstance from "../../utils/axios";

interface LoginPageProps {
  onLogin: (user: User, token: string) => void;
  onShowSignup?: () => void;
}

export function LoginPage({ onLogin, onShowSignup }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError("Please select your role");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {

      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
        role: selectedRole.toUpperCase(),
      });

      const data = response.data;

      if (response.status === 200 && data.success) {
        // Ensure role is lowercase to match UserRole enum
        if (data.data.user && data.data.user.role) {
          data.data.user.role = data.data.user.role.toLowerCase();
        }
        onLogin(data.data.user, data.data.token);
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: "admin", label: "Admin", icon: Shield, color: "red" },
    { value: "vendor", label: "Vendor", icon: User, color: "blue" },
    { value: "center", label: "Distribution Center", icon: Building, color: "green" }
  ];
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log("Logo failed to load, using fallback");
    const target = e.currentTarget;
    target.style.display = "none";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <img
              src="/vrslogo.png"
              alt="Vendor Request System Logo"
              className="w-20 h-20 object-contain"
              onError={handleImageError}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
            Welcome to Vendor Request System
          </h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        <Card className="p-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role *
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`flex items-center p-3 border-2 rounded-lg transition-all ${
                        selectedRole === role.value
                          ? `border-${role.color}-500 bg-${role.color}-50`
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <Icon className={`h-5 w-5 mr-3 ${
                        selectedRole === role.value 
                          ? `text-${role.color}-600` 
                          : "text-gray-400"
                      }`} />
                      <span className={`font-medium ${
                        selectedRole === role.value 
                          ? `text-${role.color}-800` 
                          : "text-gray-700"
                      }`}>
                        {role.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 py-3 text-base font-medium"
              isLoading={isLoading}
              icon={LogIn}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => onShowSignup && onShowSignup()}
                className="font-medium text-orange-600 hover:text-orange-500 cursor-pointer transition-colors"
              >
                Sign up here
              </button>
            </p>
          </div>
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
