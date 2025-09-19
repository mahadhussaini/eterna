"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const profileSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  age: z.number().min(18, "Age must be at least 18").max(100, "Age cannot exceed 100"),
  gender: z.string().min(1, "Please select your gender"),
  location: z.string().min(1, "Location is required"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  lookingFor: z.array(z.string()).min(1, "Select what you're looking for"),
  ageMin: z.number().min(18, "Minimum age must be at least 18"),
  ageMax: z.number().max(100, "Maximum age cannot exceed 100"),
  maxDistance: z.number().min(1, "Distance must be at least 1 km").max(500, "Distance cannot exceed 500 km"),
})

type ProfileFormData = z.infer<typeof profileSchema>

const INTERESTS = [
  "Travel", "Music", "Sports", "Movies", "Books", "Cooking", "Art", "Photography",
  "Dancing", "Hiking", "Gaming", "Fitness", "Technology", "Fashion", "Food",
  "Animals", "Nature", "Comedy", "Science", "History"
]

const LOOKING_FOR = [
  "Long-term relationship", "Short-term dating", "Friendship", "Something casual",
  "Marriage", "Life partner", "Adventure buddy", "Travel companion"
]

export function ProfileSetupForm() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      bio: "",
      age: 25,
      gender: "",
      location: "",
      interests: [],
      lookingFor: [],
      ageMin: 18,
      ageMax: 35,
      maxDistance: 50,
    },
  })

  const watchedInterests = watch("interests") || []
  const watchedLookingFor = watch("lookingFor") || []

  const onSubmit = async (data: ProfileFormData) => {
    if (status === "loading") {
      setError("Session is loading. Please wait...")
      return
    }

    if (status === "unauthenticated" || !session?.user?.id) {
      setError("You must be logged in to create a profile")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create profile")
      }

      router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInterestToggle = (interest: string) => {
    const currentInterests = watchedInterests
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest]
    setValue("interests", newInterests)
  }

  const handleLookingForToggle = (item: string) => {
    const currentLookingFor = watchedLookingFor
    const newLookingFor = currentLookingFor.includes(item)
      ? currentLookingFor.filter(i => i !== item)
      : [...currentLookingFor, item]
    setValue("lookingFor", newLookingFor)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        
        <div>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            {...register("displayName")}
            placeholder="How should others see your name?"
            disabled={isLoading}
          />
          {errors.displayName && (
            <p className="text-sm text-red-600 mt-1">{errors.displayName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            {...register("bio")}
            placeholder="Tell us about yourself..."
            rows={3}
            disabled={isLoading}
          />
          {errors.bio && (
            <p className="text-sm text-red-600 mt-1">{errors.bio.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              {...register("age", { valueAsNumber: true })}
              type="number"
              placeholder="25"
              disabled={isLoading}
            />
            {errors.age && (
              <p className="text-sm text-red-600 mt-1">{errors.age.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={(value) => setValue("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="man">Man</SelectItem>
                <SelectItem value="woman">Woman</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-600 mt-1">{errors.gender.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            {...register("location")}
            placeholder="City, Country"
            disabled={isLoading}
          />
          {errors.location && (
            <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
          )}
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Interests</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {INTERESTS.map((interest) => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox
                id={interest}
                checked={watchedInterests.includes(interest)}
                onCheckedChange={() => handleInterestToggle(interest)}
                disabled={isLoading}
              />
              <Label htmlFor={interest} className="text-sm">{interest}</Label>
            </div>
          ))}
        </div>
        {errors.interests && (
          <p className="text-sm text-red-600">{errors.interests.message}</p>
        )}
      </div>

      {/* Looking For */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">What are you looking for?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LOOKING_FOR.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={item}
                checked={watchedLookingFor.includes(item)}
                onCheckedChange={() => handleLookingForToggle(item)}
                disabled={isLoading}
              />
              <Label htmlFor={item} className="text-sm">{item}</Label>
            </div>
          ))}
        </div>
        {errors.lookingFor && (
          <p className="text-sm text-red-600">{errors.lookingFor.message}</p>
        )}
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ageMin">Minimum Age</Label>
            <Input
              {...register("ageMin", { valueAsNumber: true })}
              type="number"
              disabled={isLoading}
            />
            {errors.ageMin && (
              <p className="text-sm text-red-600 mt-1">{errors.ageMin.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="ageMax">Maximum Age</Label>
            <Input
              {...register("ageMax", { valueAsNumber: true })}
              type="number"
              disabled={isLoading}
            />
            {errors.ageMax && (
              <p className="text-sm text-red-600 mt-1">{errors.ageMax.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="maxDistance">Maximum Distance (km)</Label>
          <Input
            {...register("maxDistance", { valueAsNumber: true })}
            type="number"
            disabled={isLoading}
          />
          {errors.maxDistance && (
            <p className="text-sm text-red-600 mt-1">{errors.maxDistance.message}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Profile..." : "Complete Profile"}
      </Button>
    </form>
  )
}
