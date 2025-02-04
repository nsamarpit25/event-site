"use client";

import { useState } from "react";
import { events } from "@/app/api/events/route";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
   event: events | null;
   isOpen: boolean;
   onClose: () => void;
}

export default function BookingModal({ event, isOpen, onClose }: Props) {
   const [email, setEmail] = useState("");
   const [otp, setOtp] = useState("");
   const [step, setStep] = useState<"email" | "otp">("email");
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");

   if (!isOpen || !event) return null;

   const handleEmailSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);
      try {
         const response = await fetch("/api/otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
         });

         const data = await response.json();
         if (!response.ok) throw new Error(data.error);

         setStep("otp");
      } catch {
         setError("Failed to send OTP. Please try again.");
      }
      setIsLoading(false);
   };

   const handleOtpSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);
      try {
         const response = await fetch("/api/otp", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
         });

         const data = await response.json();
         if (!response.ok) throw new Error(data.error);

         window.location.href = event!.eventUrl;
      } catch {
         setError("Invalid OTP. Please try again.");
      }
      setIsLoading(false);
   };

   return (
      <AnimatePresence>
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl"
            >
               <h2 className="text-2xl font-bold mb-6">{event.title}</h2>

               {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                     {error}
                  </div>
               )}

               <AnimatePresence mode="wait">
                  {step === "email" ? (
                     <motion.form
                        key="email-form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handleEmailSubmit}
                        className="space-y-4"
                     >
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
                           </label>
                           <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@example.com"
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                           />
                        </div>
                        <button
                           type="submit"
                           disabled={isLoading}
                           className={`w-full py-3 rounded-lg text-white font-medium ${
                              isLoading
                                 ? "bg-gray-400"
                                 : "bg-blue-600 hover:bg-blue-700"
                           } transition-colors`}
                        >
                           {isLoading ? (
                              <span className="flex items-center justify-center">
                                 <svg
                                    className="animate-spin h-5 w-5 mr-3"
                                    viewBox="0 0 24 24"
                                 >
                                    <circle
                                       className="opacity-25"
                                       cx="12"
                                       cy="12"
                                       r="10"
                                       stroke="currentColor"
                                       strokeWidth="4"
                                       fill="none"
                                    />
                                    <path
                                       className="opacity-75"
                                       fill="currentColor"
                                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                 </svg>
                                 Sending OTP...
                              </span>
                           ) : (
                              "Send OTP"
                           )}
                        </button>
                     </motion.form>
                  ) : (
                     <motion.form
                        key="otp-form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleOtpSubmit}
                        className="space-y-4"
                     >
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                              Enter OTP
                           </label>
                           <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter 6-digit OTP"
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                              maxLength={6}
                              pattern="\d{6}"
                           />
                        </div>
                        <button
                           type="submit"
                           disabled={isLoading}
                           className={`w-full py-3 rounded-lg text-white font-medium ${
                              isLoading
                                 ? "bg-gray-400"
                                 : "bg-blue-600 hover:bg-blue-700"
                           } transition-colors`}
                        >
                           {isLoading ? (
                              <span className="flex items-center justify-center">
                                 <svg
                                    className="animate-spin h-5 w-5 mr-3"
                                    viewBox="0 0 24 24"
                                 >
                                    <circle
                                       className="opacity-25"
                                       cx="12"
                                       cy="12"
                                       r="10"
                                       stroke="currentColor"
                                       strokeWidth="4"
                                       fill="none"
                                    />
                                    <path
                                       className="opacity-75"
                                       fill="currentColor"
                                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                 </svg>
                                 Verifying...
                              </span>
                           ) : (
                              "Verify OTP"
                           )}
                        </button>
                     </motion.form>
                  )}
               </AnimatePresence>

               <button
                  onClick={onClose}
                  className="mt-6 text-gray-600 hover:text-gray-800 font-medium"
               >
                  Cancel
               </button>
            </motion.div>
         </div>
      </AnimatePresence>
   );
}
