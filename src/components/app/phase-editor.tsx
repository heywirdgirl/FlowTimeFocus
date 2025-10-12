"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react"; // Thêm icon
import { getAuth, User } from "firebase/auth";
import { supabaseClient } from "@/lib/supabase";

interface Phase {
  id?: string;
  title: string;
  duration: number;
  guidedAudio?: { url: string; type: "ambient" | "guided" };
}

function PhaseEditor({
  phase,
  onSave,
  onCancel,
  isNew,
  audioLibrary,
}: {
  phase: Partial<Phase>;
  onSave: (p: Partial<Phase>) => void;
  onCancel: () => void;
  isNew?: boolean;
  audioLibrary: { id: string; url: string; name: string }[];
}) {
  const [title, setTitle] = useState(phase?.title || "");
  const [duration, setDuration] = useState(String(phase?.duration || ""));
  const [guidedAudioUrl, setGuidedAudioUrl] = useState(phase?.guidedAudio?.url || "");
  const [guidedAudioType, setGuidedAudioType] = useState<"ambient" | "guided">(
    phase?.guidedAudio?.type || "ambient"
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedFile(file);
    console.log('File selected:', file?.name); // Debug
    if (file) setGuidedAudioUrl(""); // Clear dropdown khi chọn file
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const newDuration = parseFloat(duration);
    if (!title.trim() || isNaN(newDuration) || newDuration < 0.1) {
      setError("Invalid title or duration");
      setLoading(false);
      return;
    }

    let updates: Partial<Phase> = { ...phase, title, duration: newDuration };

    if (uploadedFile && user) {
      const fileName = `user_${user.uid}/${Date.now()}_${uploadedFile.name}`;
      console.log('Uploading file:', fileName, 'with UID:', user.uid); // Debug
      const { data, error: uploadError } = await supabaseClient.storage
        .from('sounds')
        .upload(fileName, uploadedFile, {
          contentType: uploadedFile.type || 'audio/mpeg',
          metadata: { firebase_uid: user.uid }
        });

      if (uploadError) {
        console.error('Upload error:', uploadError); // Debug
        setError(`Upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      console.log('Upload success:', data); // Debug
      const { data: { publicUrl } } = supabaseClient.storage.from('sounds').getPublicUrl(fileName);
      updates.guidedAudio = { url: publicUrl, type: guidedAudioType };
      console.log('New URL:', publicUrl); // Debug
    } else if (guidedAudioUrl) {
      updates.guidedAudio = { url: guidedAudioUrl, type: guidedAudioType };
    } else {
      updates.guidedAudio = undefined;
    }

    console.log('Final updates:', updates); // Debug
    setError(null);
    onSave(updates);
    setLoading(false);
  };

  return (
    <div className="p-3 my-2 border rounded-lg bg-background space-y-3">
      {/* Phase Title */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">Phase Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter phase title"
          className="w-full"
        />
      </div>

      {/* Duration */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">Duration (minutes)</Label>
        <Input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Enter duration"
          step="0.1"
          className="w-full"
        />
        {parseFloat(duration) < 0.1 && (
          <p className="text-xs text-destructive">Duration must be at least 0.1 minutes.</p>
        )}
      </div>

      {/* Audio Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Background Audio</Label>
        <Input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="w-full"
          disabled={loading}
        />
        <Select
          onValueChange={setGuidedAudioUrl}
          value={guidedAudioUrl || ""}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select audio or none..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {audioLibrary.map((audio) => (
              <SelectItem key={audio.id} value={audio.url}>
                {audio.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Audio Type */}
      {(guidedAudioUrl || uploadedFile) && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Audio Type</Label>
          <Select
            onValueChange={(value) =>
              setGuidedAudioType(value as "ambient" | "guided")
            }
            value={guidedAudioType}
            disabled={loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ambient">Ambient (Loop)</SelectItem>
              <SelectItem value="guided">Guided (Play Once)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          onClick={handleSave}
          size="sm"
          className="w-full bg-blue-500 text-white hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            isNew ? "Add" : "Save"
          )}
        </Button>
        <Button
          onClick={onCancel}
          size="sm"
          variant="outline"
          className="w-full border-gray-300 hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default PhaseEditor;