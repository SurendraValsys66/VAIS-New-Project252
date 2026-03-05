import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";

interface UnlockIntentSignalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlock: (selectedOptions: string[]) => void;
  currentlyClickedBadgeId?: string;
}

export default function UnlockIntentSignalModal({
  open,
  onOpenChange,
  onUnlock,
  currentlyClickedBadgeId,
}: UnlockIntentSignalModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const unlockOptions = [
    { id: "current", label: "Unlock Current signal" },
    { id: "super_strong", label: "Unlock Super strong signals only" },
    { id: "very_strong", label: "Unlock Very strong Signals only" },
    { id: "strong", label: "Unlock Strong Signals only" },
    { id: "all", label: "Unlock All Signals" },
  ];

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, optionId]);
    } else {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    }
  };

  const handleUnlock = () => {
    if (selectedOptions.length > 0) {
      onUnlock(selectedOptions);
      onOpenChange(false);
      setSelectedOptions([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 border-0 rounded-2xl overflow-hidden bg-white">
        <DialogTitle className="sr-only">
          Unlock Intent Signal
        </DialogTitle>
        {/* Close Button */}
        <button
          onClick={() => {
            onOpenChange(false);
            setSelectedOptions([]);
          }}
          className="absolute top-6 right-6 z-50 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-8 p-8 md:p-10">
          {/* Left Column - Text and Image */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Main Heading */}
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                Unlock the{" "}
                <span className="bg-gradient-to-r from-valasys-orange via-orange-400 to-valasys-green bg-clip-text text-transparent">
                  full power
                </span>
                <br />
                of Intent Signal
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Unlock advanced AI automation. Boost your productivity,
                streamline your tasks, and stay ahead of the competition.
                Experience the future of efficiency today.
              </p>
            </div>

            {/* VAIS Product Image */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F8dbb6e7a8a734c63b310cb1c08a8ce8b%2F5c3388ec3fcc408bbc81fa5f11c15baf?format=webp&width=800&height=1200"
                alt="VAIS Advanced Sales Intelligence & Automation"
                className="w-full h-[250px] object-cover rounded-2xl"
              />
            </div>
          </div>

          {/* Right Column - Checkboxes and CTA */}
          <div className="flex flex-col justify-between bg-gray-50 rounded-xl p-6">
            {/* Checkboxes Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Unlock premium features
              </h3>

              {/* Checkboxes List */}
              <div className="space-y-4">
                {unlockOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-3 group"
                  >
                    <Checkbox
                      id={option.id}
                      checked={selectedOptions.includes(option.id)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(option.id, checked as boolean)
                      }
                      className="w-5 h-5"
                    />
                    <label
                      htmlFor={option.id}
                      className="text-gray-700 font-medium cursor-pointer group-hover:text-gray-900 transition-colors text-sm"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button and Credits Info */}
            <div className="mt-8 space-y-4">
              <Button
                onClick={handleUnlock}
                disabled={selectedOptions.length === 0}
                className="w-full h-12 bg-gradient-to-r from-valasys-orange to-orange-500 hover:from-orange-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold rounded-lg transition-all duration-200"
              >
                Unlock Signal
              </Button>

              {/* Credits Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold text-blue-900">
                    Each unlock deducts 5 credits
                  </div>
                  <div className="text-blue-700">
                    You have 48,256 credits remaining
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
