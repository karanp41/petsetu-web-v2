"use client";

import HeroBannerCarousel from "@/components/layout/HeroBannerCarousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Heart,
  MapPin,
  PawPrint,
  Pill,
  Search,
  Shield,
  Smartphone,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const petCategories = [
  "Dog",
  "Cat",
  "Rabbit",
  "Bird",
  "Fish",
  "Hamster",
  "Guinea Pig",
  "Reptile",
];

const adTypes = ["Adoption", "Breeding", "For Sale", "Lost Pet", "Found Pet"];

const features = [
  {
    icon: Heart,
    title: "Compassionate Adoption",
    description:
      "Connect loving families with pets in need of forever homes through our verified adoption network.",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description:
      "Safe and secure payment processing with buyer and seller protection for peace of mind.",
  },
  {
    icon: Users,
    title: "Trusted Community",
    description:
      "Join thousands of verified pet lovers, breeders, and adoption centers in our growing community.",
  },
  {
    icon: Search,
    title: "Smart Matching",
    description:
      "Advanced search and filtering to help you find the perfect pet companion for your lifestyle.",
  },
];

const reminderTypes = [
  {
    icon: Calendar,
    title: "Vaccination Reminders",
    description:
      "Never miss important vaccination dates with personalized scheduling and notifications.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Clock,
    title: "Feeding Schedule",
    description:
      "Set custom feeding times and get reminders to maintain your pet's healthy routine.",
    color: "bg-green-50 text-green-700",
  },
  {
    icon: Pill,
    title: "Medication Alerts",
    description:
      "Track medications and get alerts for refills and dosage times.",
    color: "bg-purple-50 text-purple-700",
  },
];

export default function Home() {
  const [selectedPetCategory, setSelectedPetCategory] = useState("");
  const [selectedAdType, setSelectedAdType] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedAdType) params.set("type", selectedAdType.toLowerCase());
    if (location) params.set("loc", location);
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Hero Banner Section */}
      <section className="relative py-20 lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Find Your Perfect
                  <span className="text-orange-600 block">Pet Companion</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with loving pets looking for homes, trusted breeders,
                  and a caring community. Plus, keep your furry friends healthy
                  with personalized care reminders.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-4"
                  onClick={() =>
                    window.open(
                      "https://play.google.com/store/apps/details?id=com.app.mydoggy",
                      "_blank"
                    )
                  }
                >
                  <Smartphone className="mr-2 h-5 w-5" />
                  Download App
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 border-2"
                  onClick={() => router.push("/search")}
                >
                  Browse Pets
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-600">
                {/* 10 k downloads */}

                <div className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-blue-500" />
                  <span>10K+ Downloads</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>5K+ Happy Families</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>4.8/5 Rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <HeroBannerCarousel className="max-w-xl mx-auto" />
              {/* Floating elements repositioned above carousel */}
              <div className="pointer-events-none">
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-full shadow-lg animate-bounce">
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-full shadow-lg animate-pulse">
                  <PawPrint className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search Widget */}
      <section id="search" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Pet
            </h2>
            <p className="text-xl text-gray-600">
              Search through thousands of pets waiting for their forever homes
            </p>
          </div>

          <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-gradient-to-r from-orange-50 to-green-50">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Type of Ad
                  </label>
                  <Select
                    value={selectedAdType}
                    onValueChange={setSelectedAdType}
                  >
                    <SelectTrigger className="bg-white text-gray-500">
                      <SelectValue placeholder="Any ad type" />
                    </SelectTrigger>
                    <SelectContent>
                      {adTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Pet Category
                  </label>
                  <Select
                    value={selectedPetCategory}
                    onValueChange={setSelectedPetCategory}
                  >
                    <SelectTrigger className="bg-white text-gray-500">
                      <SelectValue placeholder="Any pet category" />
                    </SelectTrigger>
                    <SelectContent>
                      {petCategories.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Enter location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10 bg-white"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                size="lg"
                className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
              >
                <Search className="mr-2 h-5 w-5" />
                Search Pets
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Top Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PetSetu?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re more than just a pet marketplace. We&apos;re a
              community dedicated to connecting pets with loving families and
              helping you care for them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pet Personalization & Reminders */}
      <section id="care" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Keep Your Pet Happy & Healthy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Never miss important pet care tasks with our personalized reminder
              system. Track vaccinations, feeding schedules, and medications all
              in one place.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {reminderTypes.map((reminder, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${reminder.color}`}>
                    <reminder.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {reminder.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {reminder.description}
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-6">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Start Managing Pet Care
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-2xl">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">My Pet Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Image
                          src="https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=100"
                          alt="Pet"
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">Buddy</h4>
                          <p className="text-sm text-gray-600">
                            Golden Retriever
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Healthy
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Vaccination due</span>
                      </div>
                      <span className="text-sm text-blue-600 font-medium">
                        In 3 days
                      </span>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Feeding time</span>
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        In 30 mins
                      </span>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Pill className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Medication refill</span>
                      </div>
                      <span className="text-sm text-purple-600 font-medium">
                        Next week
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Pet?
          </h2>
          <p className="text-xl text-orange-100 mb-8 leading-relaxed">
            Join thousands of happy families who have found their perfect
            companions through PetSetu. Download our app today and start your
            journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4 bg-white text-orange-600 hover:bg-gray-100"
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Download iOS App
            </Button> */}
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-2 border-white text-orange-600 hover:bg-white hover:text-orange-600"
              onClick={() =>
                window.open(
                  "https://play.google.com/store/apps/details?id=com.app.mydoggy",
                  "_blank"
                )
              }
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Download Android App
            </Button>
          </div>
        </div>
      </section>

      {/* Footer removed (now global) */}
    </div>
  );
}
