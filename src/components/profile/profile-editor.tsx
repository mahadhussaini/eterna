"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PhotoManager } from "@/components/photos/photo-manager"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const profileSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  age: z.coerce.number().min(18, "You must be at least 18").max(100, "Invalid age"),
  gender: z.string().min(1, "Please select your gender"),
  location: z.string().min(1, "Location is required"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  lookingFor: z.array(z.string()).min(1, "Select what you're looking for"),
  ageMin: z.coerce.number().min(18, "Minimum age must be at least 18"),
  ageMax: z.coerce.number().max(100, "Maximum age cannot exceed 100"),
  maxDistance: z.coerce.number().min(1, "Distance must be at least 1 km").max(500, "Distance cannot exceed 500 km"),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface Photo {
  id: string
  url: string
  order: number
  isMain: boolean
}

const INTERESTS = [
  "Travel", "Music", "Sports", "Movies", "Books", "Cooking", "Art", "Photography",
  "Dancing", "Hiking", "Gaming", "Fitness", "Technology", "Fashion", "Food",
  "Animals", "Nature", "Comedy", "Science", "History"
]

const LOOKING_FOR = [
  "Long-term relationship", "Short-term dating", "Friendship", "Something casual",
  "Marriage", "Life partner", "Adventure buddy", "Travel companion"
]

export function ProfileEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileFormData>,
  })

  const watchedInterests = watch("interests") || []
  const watchedLookingFor = watch("lookingFor") || []

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        const profile = data.profile

        // Reset form with existing data
        reset({
          displayName: profile.displayName,
          bio: profile.bio || "",
          age: profile.age,
          gender: profile.gender,
          location: profile.location,
          interests: profile.interests || [],
          lookingFor: profile.lookingFor || [],
          ageMin: profile.ageMin,
          ageMax: profile.ageMax,
          maxDistance: profile.maxDistance,
        })

        // Set photos
        setPhotos(profile.photos || [])
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }, [reset])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

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

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true)

    try {
      // Update profile
      const profileResponse = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!profileResponse.ok) {
        throw new Error("Failed to update profile")
      }

      // Update photos
      const photosResponse = await fetch("/api/profile/photos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photos }),
      })

      if (!photosResponse.ok) {
        throw new Error("Failed to update photos")
      }

      alert("Profile updated successfully!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs defaultValue="photos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="profile">Profile Info</TabsTrigger>
        </TabsList>

        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoManager
                photos={photos}
                onPhotosChange={setPhotos}
                maxPhotos={6}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    {...register("displayName")}
                    placeholder="How should others see your name?"
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
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-600 mt-1">{errors.bio.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      {...register("age")}
                      type="number"
                      placeholder="25"
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
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INTERESTS.map((interest) => (
                    <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={watchedInterests.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{interest}</span>
                    </label>
                  ))}
                </div>
                {errors.interests && (
                  <p className="text-sm text-red-600 mt-2">{errors.interests.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Looking For */}
            <Card>
              <CardHeader>
                <CardTitle>What are you looking for?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {LOOKING_FOR.map((item) => (
                    <label key={item} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={watchedLookingFor.includes(item)}
                        onChange={() => handleLookingForToggle(item)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                </div>
                {errors.lookingFor && (
                  <p className="text-sm text-red-600 mt-2">{errors.lookingFor.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Matching Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ageMin">Minimum Age</Label>
                    <Input
                      {...register("ageMin")}
                      type="number"
                    />
                    {errors.ageMin && (
                      <p className="text-sm text-red-600 mt-1">{errors.ageMin.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="ageMax">Maximum Age</Label>
                    <Input
                      {...register("ageMax")}
                      type="number"
                    />
                    {errors.ageMax && (
                      <p className="text-sm text-red-600 mt-1">{errors.ageMax.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="maxDistance">Maximum Distance (km)</Label>
                  <Input
                    {...register("maxDistance")}
                    type="number"
                  />
                  {errors.maxDistance && (
                    <p className="text-sm text-red-600 mt-1">{errors.maxDistance.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </form>
  )
}
