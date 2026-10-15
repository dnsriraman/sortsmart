import React, { useEffect, useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  Edit3, 
  ShieldCheck, 
  ArrowRight, 
  PlusCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { WASTE_CATEGORIES, WasteItem } from './wasteDataset';

interface ScanResult {
  itemName: string;
  category: 'wet_organic' | 'dry_recyclable' | 'hazardous' | 'e_waste' | 'sanitary_residual';
  categoryLabel: string;
  binName?: string;
  confidencePercent: number;
  confidenceLevel: 'High' | 'Moderate' | 'Uncertain';
  whyThisBin: string;
  preparationSteps: string[];
  canBeRecycled: boolean;
  canBeReused?: boolean;
  reuseIdeas?: string[];
  safetyPrecautions?: string[];
  localRulesConfirmation?: string;
  uncertaintyNotice?: string;
  source?: string;
  model?: string;
  isRealAi?: boolean;
}

interface ScannerViewProps {
  onLogActivity: (itemName: string, category: string, actionType: 'scanned' | 'recycled' | 'composted') => void;
  onOpenCorrection: (result: ScanResult) => void;
  onNavigateToSearch: (query: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  onLogActivity,
  onOpenCorrection,
  onNavigateToSearch,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loggedCurrentItem, setLoggedCurrentItem] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Quick preset test samples for hackathon demonstration
  const samplePresets = [
    {
      name: 'Banana Peel',
      category: 'wet_organic',
      hint: 'Banana Peel',
      url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: 'Lithium Battery',
      category: 'hazardous',
      hint: 'Used Alkaline AA Battery',
      url: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: 'Plastic Water Bottle',
      category: 'dry_recyclable',
      hint: 'PET Plastic Water Bottle',
      url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: 'Broken Smartphone',
      category: 'e_waste',
      hint: 'Broken Smartphone',
      url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: 'Greasy Pizza Box',
      category: 'wet_organic',
      hint: 'Greasy Pizza Box',
      url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    },
  ];

  // Start Camera
  const startCamera = async () => {
    try {
      setErrorMsg(null);
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access is not supported by this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      mediaStreamRef.current = stream;
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setErrorMsg('Camera access was blocked or is not supported. Please upload an image file or click one of the quick test presets below.');
      setCameraActive(false);
    }
  };

  useEffect(() => {
    if (!cameraActive || !videoRef.current || !mediaStreamRef.current) return;

    const video = videoRef.current;
    video.srcObject = mediaStreamRef.current;
    video.play().catch((err) => {
      console.warn('Camera preview could not start:', err);
      setErrorMsg('The camera preview could not start. Please try again or upload an image.');
      stopCamera();
    });
  }, [cameraActive]);

  useEffect(() => {
    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Stop Camera
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  // Capture from Camera video element
  const capturePhoto = () => {
    if (!videoRef.current || videoRef.current.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      setErrorMsg('The camera is still starting. Please wait a moment and try again.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      setSelectedImage(dataUrl);
      analyzeImage(dataUrl);
    } else {
      setErrorMsg('Unable to capture the camera frame. Please try again.');
    }
  };

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image file size exceeds 10MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  // Trigger analysis via backend API
  const analyzeImage = async (base64Img: string, hint?: string) => {
    setIsScanning(true);
    setErrorMsg(null);
    setScanResult(null);
    setLoggedCurrentItem(false);

    try {
      const res = await fetch('/api/scan-waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Img,
          mimeType: 'image/jpeg',
          itemNameHint: hint,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const details = typeof errJson.details === 'string' ? errJson.details : '';
        if (/EACCES|fetch failed|ENETUNREACH|ECONNREFUSED/i.test(details)) {
          throw new Error('The server cannot connect to Gemini. Check that internet access is enabled, then retry the image.');
        }
        if (res.status === 503) {
          throw new Error('Gemini is temporarily unavailable. Please retry the image in a moment.');
        }
        throw new Error(errJson.error || details || `Server responded with status ${res.status}`);
      }

      const data: ScanResult = await res.json();
      setScanResult(data);
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMsg(
        err.message || 'Image processing failed. You can look up the item directly in our Waste Directory.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  // Select a preset demo image
  const selectPreset = async (preset: typeof samplePresets[0]) => {
    stopCamera();
    setSelectedImage(preset.url);
    setIsScanning(true);
    setErrorMsg(null);
    setScanResult(null);
    setLoggedCurrentItem(false);

    try {
      // Fetch image and convert to base64 for real vision analysis
      const imgRes = await fetch(preset.url);
      const blob = await imgRes.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        analyzeImage(base64, preset.hint);
      };
      reader.readAsDataURL(blob);
    } catch {
      // If CORS or offline, fallback directly with hint
      // Keep the request valid while allowing the server's hint-based offline
      // classifier to return the preset's known waste type.
      analyzeImage('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH/AP/EABQQAQAAAAAAAAAAAAAAAAAAACD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAACD/2gAIAQEABj8Cf//Z', preset.hint);
    }
  };

  const handleLogDisposal = () => {
    if (!scanResult) return;
    const action = scanResult.category === 'wet_organic' ? 'composted' : 'recycled';
    onLogActivity(scanResult.itemName, scanResult.category, action);
    setLoggedCurrentItem(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Multi-Modal Gemini Vision Engine
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          AI Waste Scanner
        </h1>
        <p className="text-sm text-slate-600">
          Upload or photograph any discarded item. SortSmart detects material composition, suggests the correct bin, and flags contamination hazards.
        </p>
      </div>

      {/* Main Scanner Container */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Camera & Upload Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>Item Capture</span>
              {cameraActive && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  Live Lens
                </span>
              )}
            </h2>

            {/* Viewfinder / Preview Area */}
            <div className="relative aspect-4/3 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-300">
              {cameraActive ? (
                <>
                  <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover" 
                    playsInline 
                    muted 
                  />
                  <div className="absolute inset-0 pointer-events-none border-2 border-emerald-400/50 m-6 rounded-xl flex items-center justify-center">
                    <div className="w-12 h-12 border-t-2 border-l-2 border-emerald-400 absolute top-2 left-2" />
                    <div className="w-12 h-12 border-t-2 border-r-2 border-emerald-400 absolute top-2 right-2" />
                    <div className="w-12 h-12 border-b-2 border-l-2 border-emerald-400 absolute bottom-2 left-2" />
                    <div className="w-12 h-12 border-b-2 border-r-2 border-emerald-400 absolute bottom-2 right-2" />
                    <span className="text-xs text-emerald-300 bg-slate-900/80 px-2.5 py-1 rounded-full font-mono">
                      Align waste item in frame
                    </span>
                  </div>
                </>
              ) : selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Scanned waste" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-6 text-center text-slate-400 space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-300 mx-auto flex items-center justify-center">
                    <Camera className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">
                    No image captured yet
                  </p>
                  <p className="text-xs text-slate-500">
                    Snap a live photo or upload from your device
                  </p>
                </div>
              )}

              {/* Scanning Overlay Animation */}
              {isScanning && (
                <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3 z-20">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                  <div className="text-center">
                    <p className="text-sm font-bold tracking-wide">
                      Auditing Waste Material...
                    </p>
                    <p className="text-xs text-emerald-300">
                      Gemini 3.5 Flash-Lite analyzing composition
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {cameraActive ? (
                <div className="flex gap-2">
                  <button
                    onClick={capturePhoto}
                    disabled={isScanning}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Take Photo</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={startCamera}
                    disabled={isScanning}
                    className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Use Camera</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                    className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-slate-600" />
                    <span>Upload Image</span>
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Error Message & Search Fallback */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Notice:</span> {errorMsg}
                  </div>
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => selectedImage && analyzeImage(selectedImage)}
                    disabled={isScanning || !selectedImage}
                    className="text-xs font-bold text-amber-800 hover:underline disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                  >
                    Retry image analysis <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onNavigateToSearch('')}
                    className="mt-2 text-xs font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Use directory search instead <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Presets for Hackathon Testing */}
          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                ⚡ Quick Demo Presets
              </span>
              <span className="text-[10px] text-emerald-700">
                Instant test without camera
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {samplePresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => selectPreset(preset)}
                  disabled={isScanning}
                  className="px-2.5 py-2 rounded-lg bg-white hover:bg-emerald-100/60 border border-emerald-200 text-left transition text-xs font-medium text-slate-800 hover:text-emerald-900 flex flex-col justify-between cursor-pointer"
                >
                  <span className="font-semibold truncate">{preset.name}</span>
                  <span className="text-[10px] text-slate-500 capitalize">
                    {preset.category.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Categorization Results & Scientific Action Plan */}
        <div className="lg:col-span-7 space-y-5">
          {scanResult ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              {/* Category Header Card */}
              <div 
                className="rounded-2xl p-5 border-2 space-y-4"
                style={{
                  backgroundColor: WASTE_CATEGORIES[scanResult.category]?.bgColor || '#f1f5f9',
                  borderColor: WASTE_CATEGORIES[scanResult.category]?.color || '#475569',
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs"
                      style={{ backgroundColor: WASTE_CATEGORIES[scanResult.category]?.color || '#334155' }}
                    >
                      {scanResult.binName || WASTE_CATEGORIES[scanResult.category]?.binName}
                    </span>
                    <span className="text-xs font-medium text-slate-600">
                      {scanResult.categoryLabel}
                    </span>
                  </div>

                  {/* Confidence Badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-slate-300 text-xs font-semibold text-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{scanResult.confidencePercent}% Confidence</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      scanResult.confidenceLevel === 'High' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {scanResult.confidenceLevel}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-heading">
                    {scanResult.itemName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Identified via {scanResult.isRealAi ? 'Google Gemini 3.5 Flash-Lite Vision' : 'SortSmart Verified Rule Engine'}
                  </p>
                </div>
              </div>

              {/* Uncertainty Disclaimer (Mandatory Anti-Slop Rule) */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="font-semibold text-slate-800">Verification Notice:</strong> AI predictions are assistive recommendations based on visual features. If this item has chemical residue, lithium components, or grease, verify with local sorting rules before dropping.
                </div>
              </div>

              {/* "Why This Bin?" Scientific Explanation */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  Why This Bin? (Scientific Rationale)
                </h4>
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-slate-700 text-sm leading-relaxed">
                  {scanResult.whyThisBin}
                </div>
              </div>

              {/* Preparation Steps Checklist */}
              {scanResult.preparationSteps && scanResult.preparationSteps.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Disposal Preparation Steps
                  </h4>
                  <ul className="space-y-2">
                    {scanResult.preparationSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reuse & Upcycling Ideas */}
              {scanResult.reuseIdeas && scanResult.reuseIdeas.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Upcycling & Reuse Ideas
                  </h4>
                  <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-100 text-teal-950 text-xs sm:text-sm space-y-1.5">
                    {scanResult.reuseIdeas.map((idea, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>{idea}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Precautions if Hazardous */}
              {scanResult.safetyPrecautions && scanResult.safetyPrecautions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Important Safety Precautions
                  </h4>
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm space-y-1">
                    {scanResult.safetyPrecautions.map((warn, idx) => (
                      <p key={idx}>⚠️ {warn}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions: Log Activity & Correct Prediction */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={handleLogDisposal}
                  disabled={loggedCurrentItem}
                  className={`py-3 px-5 rounded-xl font-bold text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                    loggedCurrentItem
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>
                    {loggedCurrentItem ? 'Logged to Dashboard (+10 pts)' : 'Log Disposal Action (+10 Eco-Pts)'}
                  </span>
                </button>

                {/* "Correct This Result" Button */}
                <button
                  onClick={() => onOpenCorrection(scanResult)}
                  className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Report Incorrect AI Result</span>
                </button>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-10 border border-slate-200/90 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Ready to Classify Any Waste Object
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Take a photo or choose one of the quick test presets on the left. The scanner will identify whether it belongs in Organic, Recyclable, Hazardous, or E-Waste streams.
              </p>
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => selectPreset(samplePresets[0])}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Try Sample: Banana Peel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
