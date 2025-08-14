import { useRef, useState } from 'react';
// import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/sonner';
import { Copy, Image, Share, Sparkle, Upload } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface Photo {
  id: string;
  url: string;
  file: File;
}

interface ComicTemplate {
  id: string;
  name: string;
  panels: { id: string; x: number; y: number; width: number; height: number }[];
  className: string;
}

interface Comic {
  id: string;
  templateId: string;
  panels: { [panelId: string]: string };
  title: string;
  createdAt: number;
}

const templates: ComicTemplate[] = [
  {
    id: 'two-panel',
    name: '2 Panel Story',
    panels: [
      { id: 'panel-1', x: 0, y: 0, width: 50, height: 100 },
      { id: 'panel-2', x: 50, y: 0, width: 50, height: 100 },
    ],
    className: 'grid-cols-2',
  },
  {
    id: 'four-panel',
    name: '4 Panel Comic',
    panels: [
      { id: 'panel-1', x: 0, y: 0, width: 50, height: 50 },
      { id: 'panel-2', x: 50, y: 0, width: 50, height: 50 },
      { id: 'panel-3', x: 0, y: 50, width: 50, height: 50 },
      { id: 'panel-4', x: 50, y: 50, width: 50, height: 50 },
    ],
    className: 'grid-cols-2 grid-rows-2',
  },
  {
    id: 'three-vertical',
    name: '3 Panel Vertical',
    panels: [
      { id: 'panel-1', x: 0, y: 0, width: 100, height: 33 },
      { id: 'panel-2', x: 0, y: 33, width: 100, height: 33 },
      { id: 'panel-3', x: 0, y: 66, width: 100, height: 34 },
    ],
    className: 'grid-cols-1 grid-rows-3',
  },
];

function App() {
  // Temporary localStorage implementation until Spark is configured
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const saved = localStorage.getItem('comic-photos');
    return saved ? JSON.parse(saved) : [];
  });

  const [comics, setComics] = useState<Comic[]>(() => {
    const saved = localStorage.getItem('user-comics');
    return saved ? JSON.parse(saved) : [];
  });

  // Helper functions to save to localStorage
  const savePhotos = (newPhotos: Photo[] | ((prev: Photo[]) => Photo[])) => {
    setPhotos(current => {
      const updated =
        typeof newPhotos === 'function' ? newPhotos(current) : newPhotos;
      localStorage.setItem('comic-photos', JSON.stringify(updated));
      return updated;
    });
  };

  const saveComics = (newComics: Comic[] | ((prev: Comic[]) => Comic[])) => {
    setComics(current => {
      const updated =
        typeof newComics === 'function' ? newComics(current) : newComics;
      localStorage.setItem('user-comics', JSON.stringify(updated));
      return updated;
    });
  };
  const [selectedTemplate, setSelectedTemplate] =
    useState<ComicTemplate | null>(null);
  const [currentComic, setCurrentComic] = useState<{
    [panelId: string]: string;
  }>({});
  const [draggedPhoto, setDraggedPhoto] = useState<string | null>(null);
  const [shareDialog, setShareDialog] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        const newPhoto: Photo = {
          id: Date.now().toString() + Math.random(),
          url,
          file,
        };
        savePhotos(current => [...current, newPhoto]);
      }
    });
    toast.success('Photos uploaded successfully');
  };

  const handleDrop = (e: React.DragEvent, panelId: string) => {
    e.preventDefault();
    if (draggedPhoto) {
      setCurrentComic(prev => ({ ...prev, [panelId]: draggedPhoto }));
      setDraggedPhoto(null);
      toast.success('Photo added to panel');
    }
  };

  const saveComic = () => {
    if (!selectedTemplate || Object.keys(currentComic).length === 0) {
      toast.error('Add some photos to your comic first!');
      return;
    }

    const comic: Comic = {
      id: Date.now().toString(),
      templateId: selectedTemplate.id,
      panels: currentComic,
      title: `My Comic ${comics.length + 1}`,
      createdAt: Date.now(),
    };

    saveComics(current => [...current, comic]);
    toast.success('Comic saved successfully');
  };

  const shareComic = (comicId: string) => {
    const shareUrl = `${window.location.origin}?comic=${comicId}`;
    navigator.clipboard.writeText(shareUrl);
    setShareDialog(comicId);
    toast.success('Share link copied to clipboard');
  };

  const getPhotoUrl = (photoId: string) => {
    return photos.find(p => p.id === photoId)?.url || '';
  };

  return (
    <div className="min-h-screen from-background via-muted/30 to-secondary/20 font-ui bg-gradient-to-br">
      <div className="container max-w-6xl p-6 mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="flex items-center justify-center gap-3 mb-2 text-4xl font-bold font-comic text-foreground">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Comic Studio
            <div className="w-2 h-2 delay-300 rounded-full bg-primary animate-pulse" />
          </h1>
          <p className="text-lg text-muted-foreground font-ui">
            Create professional comics with your photos
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Photo Library */}
          <Card className="p-6 border-border/50 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold font-comic text-foreground">
              Photo Library
            </h2>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={e => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full mb-4 font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <Upload className="mr-2" />
              Upload Photos
            </Button>

            <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-80">
              {photos.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-muted-foreground">
                  <Image size={48} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Upload photos to get started</p>
                </div>
              ) : (
                photos.map(photo => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={() => setDraggedPhoto(photo.id)}
                    className="bg-muted border-border/50 hover:border-primary/40 aspect-square cursor-grab overflow-hidden rounded-lg border transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:cursor-grabbing"
                  >
                    <img
                      src={photo.url}
                      alt="Uploaded photo"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Comic Editor */}
          <Card className="p-6 border-border/50 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold font-comic text-foreground">
              Comic Editor
            </h2>

            {!selectedTemplate ? (
              <div className="space-y-4">
                <p className="mb-4 text-sm text-muted-foreground">
                  Select a layout:
                </p>
                {templates.map(template => (
                  <Button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    variant="outline"
                    className="flex items-center w-full h-16 gap-3 transition-all duration-200 hover:bg-primary/5 hover:border-primary/50"
                  >
                    <div
                      className={`grid ${template.className} h-6 w-10 gap-1`}
                    >
                      {template.panels.map(panel => (
                        <div
                          key={panel.id}
                          className="border rounded-sm bg-muted border-border/30"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium font-comic">
                      {template.name}
                    </span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium font-comic">
                    {selectedTemplate.name}
                  </span>
                  <Button
                    onClick={() => {
                      setSelectedTemplate(null);
                      setCurrentComic({});
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Change Layout
                  </Button>
                </div>

                <div
                  className={`grid ${selectedTemplate.className} bg-card border-border aspect-square gap-2 rounded-lg border p-3`}
                >
                  {selectedTemplate.panels.map(panel => (
                    <div
                      key={panel.id}
                      onDrop={e => handleDrop(e, panel.id)}
                      onDragOver={e => e.preventDefault()}
                      onDragEnter={e => e.preventDefault()}
                      className={`bg-muted/50 border-muted-foreground/30 text-muted-foreground relative flex items-center justify-center rounded-md border border-dashed transition-all duration-200 ${draggedPhoto ? 'border-primary/60 bg-primary/5' : ''} ${currentComic[panel.id] ? 'border-border border-solid' : ''} `}
                    >
                      {currentComic[panel.id] ? (
                        <img
                          src={getPhotoUrl(currentComic[panel.id])}
                          alt={`Panel ${panel.id}`}
                          className="object-cover w-full h-full rounded-sm"
                        />
                      ) : (
                        <div className="text-center">
                          <Image
                            size={20}
                            className="mx-auto mb-1 opacity-40"
                          />
                          <p className="text-xs">Drop photo</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={saveComic}
                  disabled={Object.keys(currentComic).length === 0}
                  className="w-full font-medium bg-accent hover:bg-accent/90 text-accent-foreground"
                  size="lg"
                >
                  Save Comic
                </Button>
              </div>
            )}
          </Card>

          {/* Saved Comics */}
          <Card className="p-6 border-border/50 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold font-comic text-foreground">
              My Comics
            </h2>

            <div className="space-y-3 overflow-y-auto max-h-80">
              {comics.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-muted">
                    <Sparkle size={24} className="opacity-40" />
                  </div>
                  <p className="text-sm">Your comics will appear here</p>
                </div>
              ) : (
                comics.map(comic => {
                  const template = templates.find(
                    t => t.id === comic.templateId
                  );
                  return (
                    <Card
                      key={comic.id}
                      className="p-4 transition-colors border border-border/50 hover:border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium font-comic">
                          {comic.title}
                        </h3>
                        <Button
                          onClick={() => shareComic(comic.id)}
                          size="sm"
                          className="px-2 bg-primary hover:bg-primary/90 text-primary-foreground h-7"
                        >
                          <Share size={14} />
                        </Button>
                      </div>

                      {template && (
                        <div
                          className={`grid ${template.className} mb-2 h-14 w-full gap-1`}
                        >
                          {template.panels.map(panel => (
                            <div
                              key={panel.id}
                              className="overflow-hidden border rounded bg-muted/50 border-border/30"
                            >
                              {comic.panels[panel.id] && (
                                <img
                                  src={getPhotoUrl(comic.panels[panel.id])}
                                  alt={`Panel ${panel.id}`}
                                  className="object-cover w-full h-full"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        {new Date(comic.createdAt).toLocaleDateString()}
                      </p>
                    </Card>
                  );
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
            <DialogTitle className="font-comic">Share Your Comic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Copy this link to share your comic with friends.
            </p>
            <div className="flex items-center space-x-2">
              <input
                readOnly
                value={`${window.location.origin}?comic=${shareDialog}`}
                className="flex-1 px-3 py-2 font-mono text-sm border rounded-md bg-muted border-border"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}?comic=${shareDialog}`
                  );
                  toast.success('Link copied!');
                }}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}

export default App;
