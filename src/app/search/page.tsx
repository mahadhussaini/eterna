"use client"

import { useState } from "react"
import { Search, Filter, MapPin, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    ageMin: 18,
    ageMax: 35,
    distance: 50,
    location: "",
    gender: "",
    interests: [] as string[]
  })
  const [showFilters, setShowFilters] = useState(false)

  // Mock search results
  const searchResults = [
    {
      id: "1",
      name: "Sarah",
      age: 28,
      location: "New York, NY",
      distance: "2 miles away",
      photos: ["/placeholder-avatar.jpg"],
      bio: "Adventure seeker who loves photography and travel",
      interests: ["Photography", "Travel", "Art"],
      lastActive: "2 hours ago",
      compatibility: 87
    },
    {
      id: "2",
      name: "Mike",
      age: 32,
      location: "San Francisco, CA",
      distance: "15 miles away",
      photos: ["/placeholder-avatar.jpg"],
      bio: "Tech enthusiast and coffee lover",
      interests: ["Technology", "Coffee", "Music"],
      lastActive: "1 day ago",
      compatibility: 72
    }
  ]

  const interests = [
    "Travel", "Music", "Sports", "Movies", "Books", "Cooking", "Art", "Photography",
    "Dancing", "Hiking", "Gaming", "Fitness", "Technology", "Fashion", "Food"
  ]

  const toggleInterest = (interest: string) => {
    setFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Search</h1>
        <p className="text-gray-600">Find exactly what you&apos;re looking for</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by name, interests, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Active Filters */}
          {(filters.interests.length > 0 || filters.location || filters.gender) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.location && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{filters.location}</span>
                </Badge>
              )}
              {filters.gender && (
                <Badge variant="secondary">
                  {filters.gender === "man" ? "Men" : filters.gender === "woman" ? "Women" : "Non-binary"}
                </Badge>
              )}
              {filters.interests.map(interest => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Age Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Age Range</label>
                <div className="px-3">
                  <Slider
                    value={[filters.ageMin, filters.ageMax]}
                    onValueChange={(value) => setFilters(prev => ({
                      ...prev,
                      ageMin: value[0],
                      ageMax: value[1]
                    }))}
                    min={18}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{filters.ageMin}</span>
                    <span>{filters.ageMax}</span>
                  </div>
                </div>
              </div>

              {/* Distance */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Maximum Distance</label>
                <div className="px-3">
                  <Slider
                    value={[filters.distance]}
                    onValueChange={(value) => setFilters(prev => ({
                      ...prev,
                      distance: value[0]
                    }))}
                    min={1}
                    max={500}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600 mt-1">
                    {filters.distance} km
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <Select value={filters.gender} onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any gender</SelectItem>
                    <SelectItem value="man">Men</SelectItem>
                    <SelectItem value="woman">Women</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Interests</label>
              <div className="flex flex-wrap gap-2">
                {interests.map(interest => (
                  <Button
                    key={interest}
                    variant={filters.interests.includes(interest) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleInterest(interest)}
                    className="text-xs"
                  >
                    {interest}
                  </Button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="City, State or Country"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Search Results ({searchResults.length})
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{searchResults.length} people found</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {searchResults.map((person) => (
            <Card key={person.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
                      <Image
                        src={person.photos[0]}
                        alt={person.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {person.name}, {person.age}
                        </h3>
                        <Badge className="bg-green-100 text-green-800">
                          {person.compatibility}% match
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {person.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {person.lastActive}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm">{person.bio}</p>

                    <div className="flex flex-wrap gap-1">
                      {person.interests.map(interest => (
                        <Badge key={interest} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {searchResults.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or expanding your filters
              </p>
              <Button variant="outline" onClick={() => setShowFilters(true)}>
                <Filter className="h-4 w-4 mr-2" />
                Adjust Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
