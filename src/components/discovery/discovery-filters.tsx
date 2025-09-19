"use client"

import { useState } from "react"
import { MapPin, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

interface Filters {
  ageMin: number
  ageMax: number
  distance: number
  interests: string[]
  location: string
  gender: string
  lookingFor: string[]
}

interface DiscoveryFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onClose: () => void
  isVisible: boolean
}

const INTERESTS = [
  "Travel", "Music", "Sports", "Movies", "Books", "Cooking", "Art", "Photography",
  "Dancing", "Hiking", "Gaming", "Fitness", "Technology", "Fashion", "Food",
  "Animals", "Nature", "Comedy", "Science", "History"
]

const RELATIONSHIP_TYPES = [
  "Long-term relationship", "Short-term dating", "Friendship", "Something casual",
  "Marriage", "Life partner", "Adventure buddy", "Travel companion"
]

export function DiscoveryFilters({ filters, onFiltersChange, onClose, isVisible }: DiscoveryFiltersProps) {
  const [tempFilters, setTempFilters] = useState<Filters>(filters)

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleInterestToggle = (interest: string) => {
    const currentInterests = tempFilters.interests
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest]
    updateFilter("interests", newInterests)
  }

  const handleRelationshipToggle = (type: string) => {
    const currentTypes = tempFilters.lookingFor
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    updateFilter("lookingFor", newTypes)
  }

  const applyFilters = () => {
    onFiltersChange(tempFilters)
    onClose()
  }

  const resetFilters = () => {
    const defaultFilters: Filters = {
      ageMin: 18,
      ageMax: 35,
      distance: 50,
      interests: [],
      location: "",
      gender: "",
      lookingFor: []
    }
    setTempFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Discovery Settings</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Location */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Enter location or use current location"
              value={tempFilters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Age Range */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Age Range: {tempFilters.ageMin} - {tempFilters.ageMax} years
          </Label>
          <div className="space-y-4">
            <Slider
              value={[tempFilters.ageMin]}
              onValueChange={(value) => updateFilter("ageMin", value[0])}
              min={18}
              max={100}
              step={1}
              className="w-full"
            />
            <Slider
              value={[tempFilters.ageMax]}
              onValueChange={(value) => updateFilter("ageMax", value[0])}
              min={18}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Distance */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Maximum Distance: {tempFilters.distance} km
          </Label>
          <Slider
            value={[tempFilters.distance]}
            onValueChange={(value) => updateFilter("distance", value[0])}
            min={1}
            max={500}
            step={5}
            className="w-full"
          />
        </div>

        {/* Gender Preference */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">I&apos;m interested in</Label>
          <Select value={tempFilters.gender || "anyone"} onValueChange={(value) => updateFilter("gender", value === "anyone" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Anyone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anyone">Anyone</SelectItem>
              <SelectItem value="man">Men</SelectItem>
              <SelectItem value="woman">Women</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Interests */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Shared Interests</Label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {INTERESTS.map((interest) => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox
                  id={interest}
                  checked={tempFilters.interests.includes(interest)}
                  onCheckedChange={() => handleInterestToggle(interest)}
                />
                <Label htmlFor={interest} className="text-sm">{interest}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Relationship Types */}
        <div className="mb-8">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Relationship Type</Label>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
            {RELATIONSHIP_TYPES.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={tempFilters.lookingFor.includes(type)}
                  onCheckedChange={() => handleRelationshipToggle(type)}
                />
                <Label htmlFor={type} className="text-sm">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button variant="outline" onClick={resetFilters} className="flex-1">
            Reset
          </Button>
          <Button onClick={applyFilters} className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
