"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { GripVertical, Star, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { PhotoUpload } from "./photo-upload"

interface Photo {
  id: string
  url: string
  order: number
  isMain: boolean
}

interface PhotoManagerProps {
  photos: Photo[]
  onPhotosChange: (photos: Photo[]) => void
  maxPhotos?: number
}


export function PhotoManager({ photos, onPhotosChange, maxPhotos = 6 }: PhotoManagerProps) {
  const [showUpload, setShowUpload] = useState(false)

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(photos)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order and set first photo as main
    const updatedPhotos = items.map((photo, index) => ({
      ...photo,
      order: index,
      isMain: index === 0
    }))

    onPhotosChange(updatedPhotos)
  }

  const handleSetAsMain = (photoId: string) => {
    const updatedPhotos = photos.map((photo, index) => ({
      ...photo,
      order: photo.id === photoId ? 0 : index + (index >= photos.findIndex(p => p.id === photoId) ? 0 : 1),
      isMain: photo.id === photoId
    })).sort((a, b) => a.order - b.order)

    onPhotosChange(updatedPhotos)
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const updatedPhotos = photos
          .filter(photo => photo.id !== photoId)
          .map((photo, index) => ({
            ...photo,
            order: index,
            isMain: index === 0
          }))

        onPhotosChange(updatedPhotos)
      }
    } catch (error) {
      console.error('Delete photo error:', error)
      alert('Failed to delete photo')
    }
  }

  const handlePhotoUploaded = async (photoData: { url: string; file: File }) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      url: photoData.url,
      order: photos.length,
      isMain: photos.length === 0
    }

    const updatedPhotos = [...photos, newPhoto]
    onPhotosChange(updatedPhotos)
    setShowUpload(false)
  }

  if (showUpload) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Upload New Photo</h3>
          <Button variant="outline" onClick={() => setShowUpload(false)}>
            Cancel
          </Button>
        </div>
        <PhotoUpload
          onPhotoUploaded={handlePhotoUploaded}
          maxPhotos={maxPhotos}
          currentPhotos={photos.map(p => p.url)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Manage Photos ({photos.length}/{maxPhotos})</h3>
        {photos.length < maxPhotos && (
          <Button onClick={() => setShowUpload(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Photo
          </Button>
        )}
      </div>

      {photos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto mb-2" />
              <p>No photos uploaded yet</p>
            </div>
            <Button onClick={() => setShowUpload(true)}>
              Upload Your First Photo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="photos">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
              >
                {photos.map((photo, index) => (
                  <Draggable key={photo.id} draggableId={photo.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`relative group ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                      >
                        <CardContent className="p-2">
                          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={photo.url}
                              alt={`Photo ${index + 1}`}
                              fill
                              className="object-cover"
                            />

                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="absolute top-2 right-2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
                            >
                              <GripVertical className="h-4 w-4 text-gray-600" />
                            </div>

                            {/* Photo Controls */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!photo.isMain && (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleSetAsMain(photo.id)}
                                  >
                                    <Star className="h-4 w-4 mr-1" />
                                    Main
                                  </Button>
                                )}

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeletePhoto(photo.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Main Photo Badge */}
                            {photo.isMain && (
                              <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded flex items-center">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Main
                              </div>
                            )}

                            {/* Photo Order */}
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                              {index + 1}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <strong>Tip:</strong> Drag photos to reorder them. The first photo will be your main profile picture.
        Use the star button to set any photo as main, or the trash button to delete photos.
      </div>
    </div>
  )
}
