import React, { useEffect, useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { getAdminSettings, updateAdminSettings, uploadFile } from '../services/api';

type MediaItem = { type: 'image' | 'video'; title: string; url: string };

const MediaGallery = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const settings = await getAdminSettings();
        setMediaItems(settings.mediaGallery || []);
      } catch (err) {
        console.error('Failed to load media gallery:', err);
        setError('Failed to load media gallery.');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const persistMedia = async (items: MediaItem[]) => {
    try {
      setNotice('');
      setError('');
      const saved = await updateAdminSettings({ mediaGallery: items } as any);
      setMediaItems(saved.mediaGallery || items);
      setNotice('Media gallery updated.');
    } catch (err) {
      console.error('Failed to save media gallery:', err);
      setError('Failed to save media gallery.');
    }
  };

  const handleMediaUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    setNotice('');

    try {
      const uploads: MediaItem[] = [];
      for (const file of Array.from(files)) {
        const result = await uploadFile(file);
        const isVideo = file.type.startsWith('video/');
        const type: 'image' | 'video' = isVideo ? 'video' : 'image';
        const title = file.name.replace(/\.[^/.]+$/, '');
        uploads.push({
          type,
          title: title || (isVideo ? 'Uploaded Video' : 'Uploaded Image'),
          url: result.url,
        });
      }

      const next = [...uploads, ...mediaItems];
      await persistMedia(next);
    } catch (err) {
      console.error('Media upload error:', err);
      setError('Failed to upload media.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (index: number) => {
    const next = mediaItems.filter((_, i) => i !== index);
    await persistMedia(next);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Media Gallery</h1>
        <p className="text-gray-500 text-sm mt-1">Manage uploads displayed on the public homepage.</p>
      </div>

      {(error || notice) && (
        <div className={`border px-4 py-3 rounded ${error ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-700'}`}>
          {error || notice}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Uploads</h2>
            <p className="text-sm text-gray-500">Images and videos shown in the “Uploaded Images & Videos” section.</p>
          </div>
          <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            uploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700 cursor-pointer'
          }`}>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              disabled={uploading}
              onChange={(e) => handleMediaUpload(e.target.files)}
              className="hidden"
            />
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Media'}
          </label>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading media...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {mediaItems.map((item, index) => (
              <div key={`${item.url}-${index}`} className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                <div className="aspect-[4/3] bg-gray-100">
                  {item.type === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover" controls preload="metadata" />
                  ) : (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{item.title || 'Untitled'}</div>
                    <div className="text-xs text-gray-500 capitalize">{item.type}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {mediaItems.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-10">
                No media uploaded yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGallery;
