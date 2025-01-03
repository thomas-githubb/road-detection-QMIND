"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CogIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [weeklyBudget, setWeeklyBudget] = useState("100");
  const [monthlyBudget, setMonthlyBudget] = useState("400");
  const [weeklySpent, setWeeklySpent] = useState("35");
  const [monthlySpent, setMonthlySpent] = useState("135");

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNext = () => {
    setCurrentScreen((prev) => (prev === 3 ? 1 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentScreen((prev) => (prev === 1 ? 3 : prev - 1));
  };

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  // Event handlers to update state
  const handleWeeklyBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWeeklyBudget(value === "" ? "" : parseInt(value, 10).toString());
  };

  const handleMonthlyBudgetChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setMonthlyBudget(value === "" ? "" : parseInt(value, 10).toString());
  };

  const handleWeeklySpentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWeeklySpent(value === "" ? "" : parseInt(value, 10).toString());
  };

  const handleMonthlySpentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMonthlySpent(value === "" ? "" : parseInt(value, 10).toString());
  };

  // Convert values to numbers when saving
  const handleSaveChanges = () => {
    const finalWeeklyBudget =
      weeklyBudget === "" ? 0 : parseInt(weeklyBudget, 10);
    const finalMonthlyBudget =
      monthlyBudget === "" ? 0 : parseInt(monthlyBudget, 10);
    const finalWeeklySpent = weeklySpent === "" ? 0 : parseInt(weeklySpent, 10);
    const finalMonthlySpent =
      monthlySpent === "" ? 0 : parseInt(monthlySpent, 10);

    setWeeklyBudget(finalWeeklyBudget.toString());
    setMonthlyBudget(finalMonthlyBudget.toString());
    setWeeklySpent(finalWeeklySpent.toString());
    setMonthlySpent(finalMonthlySpent.toString());

    closeDialog();
  };

  // Calculate percentages
  const weeklyPercentage = weeklyBudget
    ? (parseInt(weeklySpent, 10) / parseInt(weeklyBudget, 10)) * 100
    : 0;
  const monthlyPercentage = monthlyBudget
    ? (parseInt(monthlySpent, 10) / parseInt(monthlyBudget, 10)) * 100
    : 0;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative">
      {/* Main Page Content */}
      <section
        className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 px-4 relative"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        {/* Hero Section */}
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/quava-logo.png"
            alt="Quava Logo"
            width={100}
            height={100}
            className="mx-auto"
            style={{
              transform: `scale(${1 + scrollY * 0.0006})`,
              opacity: `${1 - scrollY * 0.001}`,
            }}
          />
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ opacity: `${1 - scrollY * 0.0015}` }}
          >
            Quava
          </h1>
          <p
            className="max-w-lg text-lg text-center"
            style={{ opacity: `${1 - scrollY * 0.0015}` }}
          >
            Your smart grocery shopping partner. Get help with food, grocery,
            and cooking.
          </p>
        </div>

        {/* Call to Action */}
        <div
          className="space-x-4"
          style={{ opacity: `${1 - scrollY * 0.0015}` }}
        >
          <Link href="/signup" passHref>
            <Button className="px-6 py-3 rounded-lg bg-[#2bc276] text-white font-bold hover:bg-[#44e796]">
              Sign Up
            </Button>
          </Link>
          <Link href="/about" passHref>
            <Button className="px-6 py-3 rounded-lg bg-gray-200 text-[var(--foreground)] font-bold hover:bg-gray-300">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Animated Cart */}
        <div className="absolute left-0 right-0 bottom-[90px] flex justify-center">
          <div
            style={{
              transform: `translateX(${scrollY * 0.5 - 150}px)`,
              opacity: `${1 - scrollY * 0.002}`,
              transition: "transform 0.2s ease-out, opacity 0.2s ease-out",
            }}
          >
            <Image
              src="/shopping-cart.png"
              alt="Moving Cart"
              width={100}
              height={100}
              className="opacity-80"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#2bc276] py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">Why Choose Quava?</h2>
          <p className="text-lg max-w-xl mx-auto">
            With Quava, manage your food inventory, track your budget, and find
            recipes that use what you have.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="font-bold">Fridge Management</h3>
              <p className="text-sm mt-2">
                Keep track of items in your fridge to reduce waste and save on
                groceries.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="font-bold">Budget Tracking</h3>
              <p className="text-sm mt-2">
                Set budgets, monitor spending, and stay on track with your
                monthly grocery goals.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="font-bold">Personalized Recipes</h3>
              <p className="text-sm mt-2">
                Get recipes based on the ingredients you already have.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Planner Carousel */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">Explore Quava Features</h2>
          <p className="text-lg max-w-xl mx-auto">
            Get a quick look at our main features: financial planner, Ava the
            smart chat bot, and virtual fridge.
          </p>
          <div className="relative flex items-center justify-center mt-8">
            <div className="relative overflow-hidden w-full h-[500px] bg-white max-w-2xl mx-auto rounded-lg shadow-lg">
              {/* Carousel Screens */}
              <div
                className="flex transition-transform duration-500"
                style={{
                  transform: `translateX(${(currentScreen - 1) * -100}%)`,
                }}
              >
                {/* Financial Planner Screen */}
                <div className="w-full flex-shrink-0 h-full flex flex-col items-center justify-center text-center p-8 relative">
                  <div className="max-w-[400px] mx-auto flex flex-col justify-between h-full pb-12">
                    {" "}
                    {/* Add padding at the bottom */}
                    <h3 className="text-2xl font-bold mb-20">
                      Financial Planner
                    </h3>
                    {/* Weekly Budget */}
                    <div className="w-full text-left">
                      <p className="text-lg font-semibold">
                        Weekly Budget: ${weeklySpent} - ${weeklyBudget}
                      </p>
                      <Progress value={weeklyPercentage} />
                    </div>
                    {/* Monthly Budget */}
                    <div className="w-full text-left mt-4">
                      <p className="text-lg font-semibold">
                        Monthly Budget: ${monthlySpent} - ${monthlyBudget}
                      </p>
                      <Progress value={monthlyPercentage} />
                    </div>
                    {/* Coupons and Price Matching */}
                    <div className="w-full mt-6">
                      <h4 className="text-lg font-semibold mb-2">
                        Coupons & Price Matching
                      </h4>
                      <div className="flex space-x-4 overflow-x-auto">
                        <div className="flex-shrink-0 p-4 bg-gray-200 rounded-lg">
                          Coupon 1
                        </div>
                        <div className="flex-shrink-0 p-4 bg-gray-200 rounded-lg">
                          Coupon 2
                        </div>
                        <div className="flex-shrink-0 p-4 bg-gray-200 rounded-lg">
                          Coupon 3
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings Icon in Bottom Right, Positioned Absolutely */}
                  <button
                    className="absolute top-4 left-4 rounded-full text-black shadow-md hover:bg-gray-100 transform transition-transform duration-100"
                    onClick={openDialog}
                    aria-label="Open settings"
                  >
                    <CogIcon className="w-8 h-8 hover:rotate-45" />
                  </button>
                </div>

                {/* Ava - Smart Chat Bot Screen */}
                <div className="w-full flex-shrink-0 h-full flex flex-col items-center justify-center text-center p-8">
                  <h3 className="text-2xl font-bold mb-4">
                    Ava - Smart Chat Bot
                  </h3>
                  <p className="text-lg">
                    Ask Ava for help with your shopping, recipes, and grocery
                    planning!
                  </p>
                </div>

                {/* Virtual Smart Fridge Screen */}
                <div className="w-full flex-shrink-0 h-full flex flex-col items-center justify-center text-center p-8">
                  <h3 className="text-2xl font-bold mb-4">
                    Virtual Smart Fridge
                  </h3>
                  <p className="text-lg">
                    Track your fridge items and get alerts on expiration dates
                    and recipes!
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={handlePrev}
                className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute z-10 right-4 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Dialog for updating budget */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-96">
                <DialogHeader>
                  <DialogTitle>Update Budget</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="weeklyBudget">Weekly Budget</Label>
                    <Input
                      id="weeklyBudget"
                      type="number"
                      value={weeklyBudget}
                      onChange={handleWeeklyBudgetChange}
                      placeholder="Enter weekly budget"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weeklySpent">Weekly Spent</Label>
                    <Input
                      id="weeklySpent"
                      type="number"
                      value={weeklySpent}
                      onChange={handleWeeklySpentChange}
                      placeholder="Enter amount spent this week"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyBudget">Monthly Budget</Label>
                    <Input
                      id="monthlyBudget"
                      type="number"
                      value={monthlyBudget}
                      onChange={handleMonthlyBudgetChange}
                      placeholder="Enter monthly budget"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlySpent">Monthly Spent</Label>
                    <Input
                      id="monthlySpent"
                      type="number"
                      value={monthlySpent}
                      onChange={handleMonthlySpentChange}
                      placeholder="Enter amount spent this month"
                    />
                  </div>
                  <Button
                    className="mt-4 w-full bg-[#2bc276] hover:bg-[#249e60] text-white"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
    </div>
  );
}
