"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // For navigation
import { auth } from "@/lib/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Alert from "@/components/ui/alert"; // Import the custom alert

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async () => {
    setError(null); // Clear previous error
    setSuccess(null); // Clear previous success
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess("Account created successfully! Redirecting...");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess("Logged in successfully! Redirecting...");
      }
      setTimeout(() => router.push("/"), 2000); // Redirect to home after 2 seconds
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please log in instead.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No user found with this email. Please sign up.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isSignUp ? "Sign Up" : "Log In"}
        </h1>
        <div className="space-y-4">
          {/* Display Success Message */}
          {success && <Alert type="success" message={success} />}

          {/* Display Error Message */}
          {error && <Alert type="error" message={error} />}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleAuth}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </Button>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-gray-500 mt-4"
          >
            {isSignUp
              ? "Already have an account? Log In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
