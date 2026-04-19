import { useState, useRef } from 'react';
import { Upload, Music, Image, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { addSongApi } from '../../api/admin.api';

const AdminUpload = () => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');
    const [genres, setGenres] = useState('');
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);

    const audioInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAudioFile(file);
            // Auto-fill title from filename
            if (!title) {
                const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                setTitle(nameWithoutExt);
            }
        }
    };

    const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            const url = URL.createObjectURL(file);
            setCoverPreview(url);
        }
    };

    const removeCover = () => {
        setCoverFile(null);
        if (coverPreview) URL.revokeObjectURL(coverPreview);
        setCoverPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!audioFile || !title || !artist) return;

        setIsUploading(true);
        setUploadResult(null);

        const formData = new FormData();
        formData.append('audio', audioFile);
        formData.append('title', title);
        formData.append('artist', artist);
        if (album) formData.append('album', album);
        if (genres) formData.append('genres', genres);
        if (coverFile) formData.append('coverImage', coverFile);

        try {
            const res = await addSongApi(formData);
            setUploadResult({
                success: true,
                message: `"${res.data.data?.title || title}" uploaded successfully!`,
            });
            // Reset form
            setTitle('');
            setArtist('');
            setAlbum('');
            setGenres('');
            setAudioFile(null);
            removeCover();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setUploadResult({
                success: false,
                message: error.response?.data?.message || 'Upload failed. Please try again.',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Upload size={24} className="text-blue-400" />
                    Upload Song
                </h1>
                <p className="text-zinc-400 text-sm mt-1">Upload audio files to Cloudinary</p>
            </div>

            {/* Result Banner */}
            {uploadResult && (
                <div
                    className={`flex items-center gap-3 p-4 rounded-lg border ${uploadResult.success
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}
                >
                    {uploadResult.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm">{uploadResult.message}</span>
                    <button onClick={() => setUploadResult(null)} className="ml-auto hover:opacity-70">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Audio File */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <label className="block text-sm font-medium mb-3">Audio File *</label>
                    <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioSelect}
                        className="hidden"
                    />
                    {audioFile ? (
                        <div className="flex items-center gap-3 bg-zinc-800 rounded-lg p-3">
                            <Music size={20} className="text-blue-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{audioFile.name}</p>
                                <p className="text-xs text-zinc-500">{formatFileSize(audioFile.size)}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAudioFile(null)}
                                className="text-zinc-500 hover:text-red-400"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => audioInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-lg p-8 text-center transition-colors"
                        >
                            <Music size={32} className="text-zinc-500 mx-auto mb-2" />
                            <p className="text-sm text-zinc-400">Click to select audio file</p>
                            <p className="text-xs text-zinc-600 mt-1">MP3, WAV, FLAC, OGG, AAC (max 100MB)</p>
                        </button>
                    )}
                </div>

                {/* Cover Image */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <label className="block text-sm font-medium mb-3">Cover Image (optional)</label>
                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverSelect}
                        className="hidden"
                    />
                    {coverPreview ? (
                        <div className="flex items-center gap-4">
                            <img src={coverPreview} alt="Cover" className="w-20 h-20 rounded-lg object-cover" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">{coverFile?.name}</p>
                                <p className="text-xs text-zinc-500">{coverFile && formatFileSize(coverFile.size)}</p>
                            </div>
                            <button type="button" onClick={removeCover} className="text-zinc-500 hover:text-red-400">
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => coverInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-lg p-6 text-center transition-colors"
                        >
                            <Image size={28} className="text-zinc-500 mx-auto mb-2" />
                            <p className="text-xs text-zinc-400">JPG, PNG, WebP</p>
                        </button>
                    )}
                </div>

                {/* Song Info */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
                    <label className="block text-sm font-medium">Song Details</label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-zinc-500 mb-1 block">Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Song title"
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500 mb-1 block">Artist *</label>
                            <input
                                type="text"
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                                placeholder="Artist name"
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500 mb-1 block">Album</label>
                            <input
                                type="text"
                                value={album}
                                onChange={(e) => setAlbum(e.target.value)}
                                placeholder="Album name"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500 mb-1 block">Genres</label>
                            <input
                                type="text"
                                value={genres}
                                onChange={(e) => setGenres(e.target.value)}
                                placeholder="Pop, Rock, Jazz..."
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!audioFile || !title || !artist || isUploading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    {isUploading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload size={18} />
                            Upload Song
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AdminUpload;
