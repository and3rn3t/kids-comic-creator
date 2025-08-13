import { useState, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Toaster } from '@/components/ui/sonner'
import { Upload, ImageIcon, Share, Copy, Sparkles } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Photo {
  id: string
  url: string
  file: File
}

interface ComicTemplate {
  id: string
  name: string
  panels: { id: string; x: number; y: number; width: number; height: number }[]
  className: string
}

interface Comic {
  id: string
  templateId: string
  panels: { [panelId: string]: string }
  title: string
  createdAt: number
}

const templates: ComicTemplate[] = [
  {
    id: 'two-panel',
    name: '2 Panel Story',
    panels: [
      { id: 'panel-1', x: 0, y: 0, width: 50, height: 100 },
      { id: 'panel-2', x: 50, y: 0, width: 50, height: 100 }
    ],
    className: 'grid-cols-2'
  },
  {
    id: 'four-panel',
    name: '4 Panel Comic',
    panels: [
      { id: 'panel-1', x: 0, y: 0, width: 50, height: 50 },
      { id: 'panel-2', x: 50, y: 0, width: 50, height: 50 },
      { id: 'panel-3', x: 0, y: 50, width: 50, height: 50 },
      { id: 'panel-4', x: 50, y: 50, width: 50, height: 50 }
    ],
    className: 'grid-cols-2 grid-rows-2'
  },
  {
    id: 'three-vertical',
    name: '3 Panel Vertical',
    panels: [
      { id: 'panel-1', x: 0, y: 0, width: 100, height: 33 },
      { id: 'panel-2', x: 0, y: 33, width: 100, height: 33 },
      { id: 'panel-3', x: 0, y: 66, width: 100, height: 34 }
    ],
    className: 'grid-cols-1 grid-rows-3'
  }
]

function App() {
  const [photos, setPhotos] = useKV<Photo[]>('comic-photos', [])
  const [comics, setComics] = useKV<Comic[]>('user-comics', [])
  const [selectedTemplate, setSelectedTemplate] = useState<ComicTemplate | null>(null)
  const [currentComic, setCurrentComic] = useState<{ [panelId: string]: string }>({})
  const [draggedPhoto, setDraggedPhoto] = useState<string | null>(null)
  const [shareDialog, setShareDialog] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        const newPhoto: Photo = {
          id: Date.now().toString() + Math.random(),
          url,
          file
        }
        setPhotos(current => [...current, newPhoto])
      }
    })
    toast.success('Photos added! 📸')
  }

  const handleDrop = (e: React.DragEvent, panelId: string) => {
    e.preventDefault()
    if (draggedPhoto) {
      setCurrentComic(prev => ({ ...prev, [panelId]: draggedPhoto }))
      setDraggedPhoto(null)
      toast.success('Photo added to panel! ✨')
    }
  }

  const saveComic = () => {
    if (!selectedTemplate || Object.keys(currentComic).length === 0) {
      toast.error('Add some photos to your comic first!')
      return
    }

    const comic: Comic = {
      id: Date.now().toString(),
      templateId: selectedTemplate.id,
      panels: currentComic,
      title: `My Comic ${comics.length + 1}`,
      createdAt: Date.now()
    }

    setComics(current => [...current, comic])
    toast.success('Comic saved! 🎉')
  }

  const shareComic = (comicId: string) => {
    const shareUrl = `${window.location.origin}?comic=${comicId}`
    navigator.clipboard.writeText(shareUrl)
    setShareDialog(comicId)
    toast.success('Link copied! 📋')
  }

  const getPhotoUrl = (photoId: string) => {
    return photos.find(p => p.id === photoId)?.url || ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 font-ui">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-comic font-bold text-primary mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-accent" weight="fill" />
            Comic Creator
            <Sparkles className="text-accent" weight="fill" />
          </h1>
          <p className="text-lg text-muted-foreground font-ui">
            Upload photos, pick a template, and create amazing comics!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Photo Library */}
          <Card className="p-6">
            <h2 className="text-xl font-comic font-semibold mb-4 text-foreground">Your Photos</h2>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full mb-4 bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
              size="lg"
            >
              <Upload className="mr-2" />
              Add Photos
            </Button>

            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {photos.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No photos yet! Add some to get started.</p>
                </div>
              ) : (
                photos.map(photo => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={() => setDraggedPhoto(photo.id)}
                    className="aspect-square bg-muted rounded-lg overflow-hidden cursor-grab active:cursor-grabbing hover:scale-105 transition-transform border-2 border-transparent hover:border-primary/50"
                  >
                    <img
                      src={photo.url}
                      alt="Uploaded photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Comic Editor */}
          <Card className="p-6">
            <h2 className="text-xl font-comic font-semibold mb-4 text-foreground">Create Your Comic</h2>
            
            {!selectedTemplate ? (
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">Choose a template to start:</p>
                {templates.map(template => (
                  <Button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-1 hover:bg-primary/10 hover:border-primary"
                  >
                    <span className="font-comic font-medium">{template.name}</span>
                    <div className={`grid ${template.className} gap-1 w-12 h-8`}>
                      {template.panels.map(panel => (
                        <div key={panel.id} className="bg-muted rounded-sm" />
                      ))}
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-comic font-medium text-lg">{selectedTemplate.name}</span>
                  <Button
                    onClick={() => {
                      setSelectedTemplate(null)
                      setCurrentComic({})
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Change Template
                  </Button>
                </div>

                <div className={`grid ${selectedTemplate.className} gap-3 aspect-square bg-white rounded-lg p-4 border-2 border-dashed border-muted-foreground/30`}>
                  {selectedTemplate.panels.map(panel => (
                    <div
                      key={panel.id}
                      onDrop={(e) => handleDrop(e, panel.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnter={(e) => e.preventDefault()}
                      className={`
                        relative bg-muted rounded-lg border-2 border-dashed border-muted-foreground/50
                        flex items-center justify-center text-muted-foreground
                        transition-all duration-200
                        ${draggedPhoto ? 'border-primary bg-primary/10' : ''}
                        ${currentComic[panel.id] ? 'border-solid border-transparent' : ''}
                      `}
                    >
                      {currentComic[panel.id] ? (
                        <img
                          src={getPhotoUrl(currentComic[panel.id])}
                          alt={`Panel ${panel.id}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon size={24} className="mx-auto mb-1 opacity-50" />
                          <p className="text-xs">Drop photo here</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={saveComic}
                  disabled={Object.keys(currentComic).length === 0}
                  className="w-full bg-primary hover:bg-primary/90 font-medium"
                  size="lg"
                >
                  Save Comic! 🎉
                </Button>
              </div>
            )}
          </Card>

          {/* Saved Comics */}
          <Card className="p-6">
            <h2 className="text-xl font-comic font-semibold mb-4 text-foreground">Your Comics</h2>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {comics.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No comics yet! Create your first one.</p>
                </div>
              ) : (
                comics.map(comic => {
                  const template = templates.find(t => t.id === comic.templateId)
                  return (
                    <Card key={comic.id} className="p-4 border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-comic font-medium text-sm">{comic.title}</h3>
                        <Button
                          onClick={() => shareComic(comic.id)}
                          size="sm"
                          className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        >
                          <Share size={16} />
                        </Button>
                      </div>
                      
                      {template && (
                        <div className={`grid ${template.className} gap-1 w-full h-16 mb-2`}>
                          {template.panels.map(panel => (
                            <div key={panel.id} className="bg-muted rounded overflow-hidden">
                              {comic.panels[panel.id] && (
                                <img
                                  src={getPhotoUrl(comic.panels[panel.id])}
                                  alt={`Panel ${panel.id}`}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(comic.createdAt).toLocaleDateString()}
                      </p>
                    </Card>
                  )
                })
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={!!shareDialog} onOpenChange={() => setShareDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-comic">Share Your Comic! 🎉</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your comic link has been copied! Share it with friends and family.
            </p>
            <div className="flex items-center space-x-2">
              <input
                readOnly
                value={`${window.location.origin}?comic=${shareDialog}`}
                className="flex-1 px-3 py-2 text-sm bg-muted rounded-md"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}?comic=${shareDialog}`)
                  toast.success('Copied again! 📋')
                }}
                size="sm"
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}

export default App