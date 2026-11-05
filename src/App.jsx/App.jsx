import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, Music, BookOpen, Volume2, VolumeX, Play, Pause, 
  Search, ShieldAlert, FileText, ExternalLink, Sparkles, X, 
  Copy, Check, User, Filter, Eye, ChevronDown, Flame, Lock, Info, ChevronLeft, ChevronRight
} from 'lucide-react';

// Location Themes definition with dynamic styling tokens (Default: Astral Plane)
const THEMES = {
  astralPlane: {
    id: 'astralPlane',
    name: 'The Astral Plane (Default)',
    bg: 'from-slate-950 via-indigo-950 to-slate-900',
    panelBg: 'bg-indigo-950/80',
    border: 'border-cyan-500/40',
    accent: 'text-cyan-300',
    accentBg: 'bg-indigo-900/40',
    highlight: 'border-cyan-400/70',
    glow: 'shadow-cyan-900/50',
    badge: 'bg-cyan-950/80 text-cyan-200 border-cyan-500/40'
  },
  emeraldGrove: {
    id: 'emeraldGrove',
    name: 'Emerald Grove (Sacred Pool)',
    bg: 'from-emerald-950 via-stone-900 to-amber-950',
    panelBg: 'bg-emerald-950/80',
    border: 'border-emerald-700/50',
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-800/40',
    highlight: 'border-amber-500/60',
    glow: 'shadow-emerald-900/50',
    badge: 'bg-emerald-900/60 text-emerald-200 border-emerald-600/40'
  },
  nautiloid: {
    id: 'nautiloid',
    name: 'The Nautiloid',
    bg: 'from-purple-950 via-slate-950 to-cyan-950',
    panelBg: 'bg-purple-950/80',
    border: 'border-cyan-600/40',
    accent: 'text-cyan-400',
    accentBg: 'bg-cyan-900/30',
    highlight: 'border-purple-500/70',
    glow: 'shadow-cyan-900/50',
    badge: 'bg-purple-900/60 text-cyan-200 border-cyan-500/40'
  },
  shatteredSanctum: {
    id: 'shatteredSanctum',
    name: 'Shattered Sanctum',
    bg: 'from-red-950 via-zinc-950 to-stone-900',
    panelBg: 'bg-zinc-900/90',
    border: 'border-red-800/60',
    accent: 'text-red-400',
    accentBg: 'bg-red-950/50',
    highlight: 'border-red-600/70',
    glow: 'shadow-red-950/60',
    badge: 'bg-red-950/70 text-red-200 border-red-700/50'
  },
  crecheYllek: {
    id: 'crecheYllek',
    name: 'Crèche Yllek',
    bg: 'from-amber-950 via-stone-900 to-yellow-950',
    panelBg: 'bg-stone-900/85',
    border: 'border-amber-600/50',
    accent: 'text-amber-400',
    accentBg: 'bg-amber-900/40',
    highlight: 'border-yellow-500/70',
    glow: 'shadow-amber-900/50',
    badge: 'bg-amber-950/70 text-amber-200 border-amber-600/40'
  },
  owlbearCave: {
    id: 'owlbearCave',
    name: 'Owlbear Cave',
    bg: 'from-stone-950 via-amber-950 to-stone-900',
    panelBg: 'bg-stone-900/85',
    border: 'border-stone-700/60',
    accent: 'text-amber-300',
    accentBg: 'bg-stone-800/50',
    highlight: 'border-amber-700/50',
    glow: 'shadow-stone-900/50',
    badge: 'bg-stone-800/80 text-amber-200 border-stone-600/40'
  },
  zhentHideout: {
    id: 'zhentHideout',
    name: 'Zhentarim Hideout',
    bg: 'from-stone-950 via-yellow-950 to-stone-900',
    panelBg: 'bg-stone-900/90',
    border: 'border-yellow-700/50',
    accent: 'text-yellow-500',
    accentBg: 'bg-yellow-950/40',
    highlight: 'border-yellow-600/60',
    glow: 'shadow-yellow-950/50',
    badge: 'bg-yellow-950/80 text-yellow-200 border-yellow-700/40'
  },
  underdark: {
    id: 'underdark',
    name: 'The Underdark',
    bg: 'from-slate-950 via-indigo-950 to-cyan-950',
    panelBg: 'bg-indigo-950/80',
    border: 'border-cyan-500/50',
    accent: 'text-cyan-300',
    accentBg: 'bg-indigo-900/50',
    highlight: 'border-cyan-400/60',
    glow: 'shadow-indigo-950/60',
    badge: 'bg-indigo-900/70 text-cyan-200 border-cyan-500/40'
  }
};

// Companion data roster
const COMPANIONS = [
  { id: 'all', name: 'All Companions', avatar: '✨' },
  { id: 'gale', name: 'Gale of Waterdeep', avatar: '🔮', quote: 'A fine treatise on Netherese theory, though remarkably flawed on page four.' },
  { id: 'shadowheart', name: 'Shadowheart', avatar: '🗡️', quote: 'Lady Shar approves of knowledge kept out of unworthy hands.' },
  { id: 'astarion', name: 'Astarion', avatar: '🩸', quote: 'Does this codex mention anything about vampire lords or exquisite wine?' },
  { id: 'laezel', name: 'Lae\'zel', avatar: '⚔️', quote: 'Tsk\'va. Less reading, more bloodletting.' },
  { id: 'wyll', name: 'Wyll', avatar: '🏹', quote: 'The Blade of Frontiers keeps a mental list of all devil pacts.' },
  { id: 'karlach', name: 'Karlach', avatar: '🔥', quote: 'Hey soldier! Got any books with pictures of big swords?' }
];

// MLIS Standard Audio File Manifest Mapping
const AUDIO_FILE_MAP = {
  // BB-Audio files (.m4a)
  "SCL-BB-04-01": "SCL-BB-04-01_Audio_ABrushWithEvilOnHags.m4a",
  "SCL-BB-04-07": "SCL-BB-04-07_Audio_AIsForAzuthAndOtherGodsII.m4a",
  "SCL-BB-04-08": "SCL-BB-04-08_Audio_APleasurableDeal.m4a",
  "SCL-BB-04-86": "SCL-BB-04-86_Audio_OnGoblinsMyLifeAndTimes.m4a",
  "SCL-BB-04-108": "SCL-BB-04-108_Audio_ThreadbareBook.m4a",
  "SCL-BB-04-140": "SCL-BB-04-140_Audio_TreatiseOnSussurTreeFlowers.m4a",
  "SCL-BB-04-15": "SCL-BB-04-15_Audio_BookOfDeadGods.m4a",
  "SCL-BB-04-92": "SCL-BB-04-92_Audio_SelunitePrayerBook.m4a",

  // BoH-AUDIO files (.mp3)
  "BoH-01-01": "BoH-01-01_Audio_TheUnbrokenCircleOfZerthimon.mp3",
  "BoH-01-12": "BoH-01-12_Audio_PrayerToIlmater.mp3",
  "BoH-02-05": "BoH-02-05_Audio_NotesOnCeremorphosis.mp3",
  "BoH-03-02": "BoH-03-02_Audio_RaidOrdersForEmeraldGrove.mp3",
  "BoH-04-11": "BoH-04-11_Audio_ZhentarimShipmentManifest.mp3"
};

// Act 1 Master Database with Local Relative Audio Paths for GitHub Pages / public hosting
const CODICES_DATABASE = [
  {
    Item_ID: "SCL-BB-04-01",
    Item_Name: "A Brush with Evil: On Hags",
    Category: "Book / Codex",
    Voice_Narrator: "Chelsea Jones",
    Banned_Status: true,
    Audio_Url: "./audio/BB-Audio/SCL-BB-04-01.m4a",
    Audio_Source: "BB-Audio",
    Audio_Duration: "3:08",
    Location: "Sunlit Wetlands / Riverside Teahouse",
    Coordinates: "X: 38 Y: 284",
    Companion: "gale",
    Summary: "Operational field guide profiling hag biology, illusions, and bargain-making behavior. Warns adventurers against trusting teahouse illusions.",
    Tags: ["#Hags", "#Rustic Lore", "#Fey Creatures"],
    Wiki_Url: "https://bg3.wiki/wiki/A_Brush_with_Evil:_On_Hags",
    Camp_Trigger: true,
    Full_Text: `Hags are ancient fey creatures that thrive on despair, corruption, and misery. Never accept a gift from a hag, for every boon bears a tragic price.

Should you encounter a hag residing in a picturesque cottage or serene wetlands, be forewarned: the greenery is an illusion born of foul magic. The waters are fouled with death, and the sweet-smelling tea is brewed from dried blood and bitter herbs.

Their bargains are tailored to your deepest desires—a lost eye returned, a loved one cured, or strength beyond mortal limits. Yet the outcome will inevitably be twisted into horror.`
  },
  {
    Item_ID: "SCL-BB-04-07",
    Item_Name: "A is For Azuth and Other Gods II",
    Category: "Book / Primer",
    Voice_Narrator: "Chelsea Jones",
    Banned_Status: false,
    Audio_Url: "./audio/BB-Audio/SCL-BB-04-07.m4a",
    Audio_Source: "BB-Audio",
    Audio_Duration: "0:36",
    Location: "Blighted Village / Schoolhouse",
    Coordinates: "X: 18 Y: 412",
    Companion: "shadowheart",
    Summary: "Introductory theological survey documenting divine domains, clerical duties, and pantheon classifications across the Sword Coast.",
    Tags: ["#Theology", "#Azuth", "#Faerûn Pantheon"],
    Wiki_Url: "https://bg3.wiki/wiki/A_is_For_Azuth_and_Other_Gods_II",
    Camp_Trigger: false,
    Full_Text: `A is for Azuth, God of Mages, whose wisdom governs the Weave and guides wizards in their incantations.

B is for Bhaal, Lord of Murder, whose bloodsoaked rites are whispered only in shadows and fear.

C is for Cyric, Prince of Lies, who rewrote the scrolls of fate to serve his own twisted ambition.`
  },
  {
    Item_ID: "SCL-BB-04-08",
    Item_Name: "A Pleasurable Deal",
    Category: "Book / Codex",
    Voice_Narrator: "Chelsea & Sebastian",
    Banned_Status: true,
    Audio_Url: "./audio/BB-Audio/SCL-BB-04-08.m4a",
    Audio_Source: "BB-Audio",
    Audio_Duration: "1:45",
    Location: "Risen Road / Tollhouse",
    Coordinates: "X: 104 Y: 560",
    Companion: "astarion",
    Summary: "Contractual record and narrative warning concerning devil pacts, bargain terms, and infernal soul transactions along the Sword Coast.",
    Tags: ["#Infernal Pacts", "#Devils", "#Soul Contracts"],
    Wiki_Url: "https://bg3.wiki/wiki/A_Pleasurable_Deal",
    Camp_Trigger: true,
    Full_Text: `Between the mortal petitioner and the Archdevil Raphael, let it be known:

In exchange for immediate liberation from mortal suffering, the petitioner assigns all rights, claims, and tithes of their immortal soul unto the House of Hope upon death. No mortal magic or clerical plea shall void this agreement.`
  },
  {
    Item_ID: "SCL-BB-04-108",
    Item_Name: "Threadbare Book",
    Category: "Diary / Fragmented Journal",
    Voice_Narrator: "Chelsea Jones",
    Banned_Status: false,
    Audio_Url: "./audio/BB-Audio/SCL-BB-04-108.m4a",
    Audio_Source: "BB-Audio",
    Audio_Duration: "0:21",
    Location: "Wilderness / Sunlit Wetlands",
    Coordinates: "X: -78 Y: 210",
    Companion: "wyll",
    Summary: "Short, poignant personal entry detailing the hardships of travel along the Sword Coast, mentioning dwindling supplies and harsh weather.",
    Tags: ["#Personal Journals", "#Travelogues", "#Sword Coast"],
    Wiki_Url: "https://bg3.wiki/wiki/Threadbare_Book",
    Camp_Trigger: false,
    Full_Text: `Day 14 on the road. Rations are down to moldy hardtack and sour wine. The rain has soaked through my cloak, and the mud pulls at my boots with every step. Yesterday we heard howls in the woods—not wolves, but something bigger.`
  },
  {
    Item_ID: "BoH-01-01",
    Item_Name: "The Unbroken Circle of Zerthimon",
    Category: "Codex / Sacred History",
    Voice_Narrator: "Sebastian Jones",
    Banned_Status: true,
    Audio_Url: "./audio/BoH-AUDIO/BoH-01-01.mp3",
    Audio_Source: "BoH-AUDIO",
    Audio_Duration: "2:15",
    Location: "Crèche Yllek / Infirmary",
    Coordinates: "X: 1375 Y: -760",
    Companion: "laezel",
    Summary: "Sacred gith scroll reciting the teachings of Zerthimon and the uprising against illithid enslavement in the Astral Plane.",
    Tags: ["#Githyanki", "#Zerthimon", "#Astral Plane"],
    Wiki_Url: "https://bg3.wiki/wiki/The_Unbroken_Circle_of_Zerthimon",
    Camp_Trigger: true,
    Full_Text: `Know that flesh is weak, but belief is iron. When the gith bound themselves to the ghaik in bondage, they knew not freedom. But Zerthimon saw beyond the sky. He taught that strength comes from knowing oneself before attempting to master others.`
  },
  {
    Item_ID: "BoH-01-12",
    Item_Name: "Prayer to Ilmater",
    Category: "Scroll / Liturgy",
    Voice_Narrator: "Chelsea Jones",
    Banned_Status: false,
    Audio_Url: "./audio/BoH-AUDIO/BoH-01-12.mp3",
    Audio_Source: "BoH-AUDIO",
    Audio_Duration: "0:48",
    Location: "Emerald Grove / Sacred Pool",
    Coordinates: "X: 240 Y: 430",
    Companion: "shadowheart",
    Summary: "Devotional plea asking the Crying God for endurance through torment and physical suffering.",
    Tags: ["#Ilmater", "#Prayers", "#Devotional"],
    Wiki_Url: "https://bg3.wiki/wiki/Prayer_to_Ilmater",
    Camp_Trigger: false,
    Full_Text: `Lord on the Rack, grant me the fortitude to bear what must be borne. Take away the pain of my companions and lay it upon my shoulders. Let my skin bleed so that others may walk unburdened.`
  },
  {
    Item_ID: "SCL-BB-04-140",
    Item_Name: "Treatise on Sussur Tree Flowers",
    Category: "Book / Academic Botany",
    Voice_Narrator: "Chelsea Jones",
    Banned_Status: false,
    Audio_Url: "./audio/BB-Audio/SCL-BB-04-140.m4a",
    Audio_Source: "BB-Audio",
    Audio_Duration: "1:21",
    Location: "Underdark / Dread Hollow",
    Coordinates: "X: -42 Y: -138",
    Companion: "gale",
    Summary: "Analytical exposition detailing how Sussur bark and blooms suppress the Weave, nullifying spellcasting in the Underdark.",
    Tags: ["#Botany", "#Underdark Flora", "#Sussur Tree"],
    Wiki_Url: "https://bg3.wiki/wiki/Treatise_on_the_Antimagic_Properties_of_Sussur_Tree_Flowers",
    Camp_Trigger: false,
    Full_Text: `The Sussur tree is one of the Underdark's most intriguing botanical anomalies. Its deep blue petals absorb the ambient Weave, creating a sphere of absolute antimagic around its bloom.`
  },
  {
    Item_ID: "BoH-02-05",
    Item_Name: "Notes on Ceremorphosis",
    Category: "Note / Dissection Study",
    Voice_Narrator: "Sebastian Jones",
    Banned_Status: true,
    Audio_Url: "./audio/BoH-AUDIO/BoH-02-05.mp3",
    Audio_Source: "BoH-AUDIO",
    Audio_Duration: "2:04",
    Location: "Nautiloid / Transformation Chamber",
    Coordinates: "X: 30 Y: 120",
    Companion: "astarion",
    Summary: "Grim dissection notes detailing the initial implantation of illithid tadpoles behind the optic nerve.",
    Tags: ["#Mind Flayers", "#Nautiloid", "#Ceremorphosis"],
    Wiki_Url: "https://bg3.wiki/wiki/Anatomy_of_a_True_Soul",
    Camp_Trigger: true,
    Full_Text: `Subject demonstrates immediate tadpole bonding behind the right optic nerve. Transformation suspended by stasis magic within the pod.`
  }
];

export default function App() {
  const [currentTheme, setCurrentTheme] = useState('astralPlane');
  const [selectedAct, setSelectedAct] = useState('act1');
  const [selectedCompanion, setSelectedCompanion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [bannedFilter, setBannedFilter] = useState('all');
  const [selectedCodex, setSelectedCodex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Audio Player States
  const [activeAudio, setActiveAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const audioRef = useRef(null);
  const theme = THEMES[currentTheme];

  // Initialize HTML5 Audio Element for Local File Streaming
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

const handlePlayAudio = (codex, e) => {
  if (e) e.stopPropagation();
  const audio = audioRef.current;

  if (activeAudio?.Item_ID === codex.Item_ID) {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((err) => console.log('Audio error:', err));
    }
  } else {
    audio.pause();
    setActiveAudio(codex);
    setCurrentTime(0);

    // Resolve exact MLIS filename from map, or fallback to standard ID naming
    const folder = codex.Audio_Source === 'BoH-AUDIO' ? 'BoH-AUDIO' : 'BB-Audio';
    const filename = AUDIO_FILE_MAP[codex.Item_ID] || `${codex.Item_ID}.${codex.Audio_Source === 'BoH-AUDIO' ? 'mp3' : 'm4a'}`;
    
    // Construct local path relative to public directory
    const fullAudioPath = `./audio/${folder}/${filename}`;

    audio.src = fullAudioPath;
    audio.volume = isMuted ? 0 : volume;

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.log('Unable to stream audio from path:', fullAudioPath, err);
      setIsPlaying(false);
    });
  }
};

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const copyExcelRow = (codex) => {
    const rowData = `${codex.Item_ID}\t${codex.Item_Name}\t${codex.Category}\t${codex.Voice_Narrator}\t${codex.Banned_Status ? 'RESTRICTED' : 'UNRESTRICTED'}\t${codex.Location}\t${codex.Coordinates}\t${codex.Summary}`;
    navigator.clipboard.writeText(rowData);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Filtered dataset logic
  const filteredCodices = CODICES_DATABASE.filter(item => {
    const matchesSearch = item.Item_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.Item_ID.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.Summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.Tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCompanion = selectedCompanion === 'all' || item.Companion === selectedCompanion;
    const matchesCategory = categoryFilter === 'all' || item.Category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesBanned = bannedFilter === 'all' || 
                          (bannedFilter === 'banned' && item.Banned_Status) ||
                          (bannedFilter === 'safe' && !item.Banned_Status);

    return matchesSearch && matchesCompanion && matchesCategory && matchesBanned;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredCodices.length / itemsPerPage) || 1;
  const paginatedCodices = filteredCodices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bg} text-amber-100 font-serif transition-colors duration-500 pb-36`}>
      
      {/* ================= HEADER BAR ================= */}
      <header className={`sticky top-0 z-30 ${theme.panelBg} border-b ${theme.border} backdrop-blur-md px-4 py-3 shadow-2xl transition-all`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Custom SVG Astral Prism Artifact Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className={`p-2.5 rounded-xl border ${theme.border} ${theme.accentBg} shadow-lg relative group flex items-center justify-center`}>
              <svg className="w-8 h-8 text-cyan-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12,2 20,7 20,17 12,22 4,17 4,7" fill="rgba(6, 182, 212, 0.2)" stroke="#22d3ee" />
                <polygon points="12,2 12,22" stroke="#67e8f9" strokeWidth="1" />
                <polygon points="4,7 20,17" stroke="#67e8f9" strokeWidth="1" />
                <polygon points="20,7 4,17" stroke="#67e8f9" strokeWidth="1" />
                <circle cx="12" cy="12" r="2.5" fill="#f59e0b" className="animate-ping" />
              </svg>
              <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-widest text-amber-200 uppercase font-serif flex items-center gap-2">
                THE ASTRAL PRISM ARCHIVE
              </h1>
              <p className="text-xs text-amber-300/80 font-sans tracking-wide">
                A Protected Repository of Recovered Tomes, Whispering Scrolls & Immersive Voice Audio
              </p>
            </div>
          </div>

          {/* Theme Dropdown & Curator Credits */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            <div className="text-[11px] font-sans text-amber-300/90 bg-stone-900/80 border border-amber-800/40 px-3 py-1 rounded-lg">
              <span>Curators: <strong className="text-amber-200">Chelsea Jones & Paige Turner, MLIS</strong></span>
              <span className="mx-1.5 opacity-40">|</span>
              <span>Performers: <strong className="text-cyan-300">Chelsea Jones & Sebastian Jones</strong></span>
            </div>

            {/* Location Theme Switcher */}
            <div className="flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-amber-400" />
              <div className="relative">
                <select
                  value={currentTheme}
                  onChange={(e) => setCurrentTheme(e.target.value)}
                  className={`appearance-none bg-stone-900/90 text-amber-200 text-xs font-sans px-3 py-1.5 pr-8 rounded-lg border ${theme.border} focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer shadow-inner`}
                >
                  {Object.values(THEMES).map((t) => (
                    <option key={t.id} value={t.id} className="bg-stone-900 text-amber-200">
                      {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* ================= ACT NAVIGATION BUTTONS ================= */}
      <section className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Act 1 Button - Active */}
          <button
            onClick={() => setSelectedAct('act1')}
            className={`p-3 rounded-xl border font-sans text-left transition-all ${
              selectedAct === 'act1'
                ? `bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-lg ${theme.glow}`
                : 'bg-stone-900/60 border-stone-800 text-amber-400/60 hover:bg-stone-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs uppercase tracking-wider text-cyan-300">Act I: Sword Coast & Underdark</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-500/40 text-cyan-200">Active</span>
            </div>
            <p className="text-[11px] opacity-80">Cataloging 192 Tomes, Scrolls & Wilderness Records</p>
          </button>

          {/* Act 2 Button - In Progress */}
          <button
            disabled
            className="p-3 rounded-xl border border-amber-900/40 bg-stone-950/70 text-amber-400/50 font-sans text-left cursor-not-allowed relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-400/70 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-500" />
                Act II: Shadow-Cursed Lands
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-700/50 text-amber-400 font-medium">
                In Progress
              </span>
            </div>
            <p className="text-[11px] opacity-60">Cataloging Moonrise Towers, Reithwin & Shar Temple</p>
          </button>

          {/* Act 3 Button - Planned */}
          <button
            disabled
            className="p-3 rounded-xl border border-stone-800 bg-stone-950/50 text-stone-500 font-sans text-left cursor-not-allowed"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                Act III: Lower City & Sewers
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-400">
                Planned
              </span>
            </div>
            <p className="text-[11px] opacity-50">Grand Mausoleum, High Hall & Undercity Codices</p>
          </button>

        </div>
      </section>

      {/* ================= COMPANION ROSTER FILTER BAR ================= */}
      <section className="max-w-7xl mx-auto px-4 py-2">
        <div className={`p-3 rounded-xl border ${theme.border} ${theme.panelBg} shadow-lg backdrop-blur-sm`}>
          <div className="text-xs font-sans text-amber-400/80 uppercase tracking-widest mb-2 flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            Filter by Companion Reading Lists:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {COMPANIONS.map((comp) => {
              const isActive = selectedCompanion === comp.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => {
                    setSelectedCompanion(comp.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-sans transition-all duration-200 ${
                    isActive 
                      ? `${theme.accentBg} ${theme.accent} border ${theme.highlight} shadow-md scale-105` 
                      : 'bg-stone-900/60 text-amber-300/70 hover:bg-stone-800 border border-amber-900/30'
                  }`}
                >
                  <span>{comp.avatar}</span>
                  <span className="font-medium">{comp.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SEARCH & CONTROLS ================= */}
      <main className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-amber-500/70" />
            <input
              type="text"
              placeholder="Search Title, ID, Tag, or Summary..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full bg-stone-950/80 border ${theme.border} rounded-lg pl-9 pr-4 py-2 text-xs text-amber-100 placeholder-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans shadow-inner`}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`bg-stone-950/80 border ${theme.border} text-amber-200 text-xs font-sans px-3 py-2 rounded-lg focus:outline-none cursor-pointer`}
            >
              <option value="all">All Document Categories</option>
              <option value="book">Books & Codices</option>
              <option value="scroll">Scrolls & Liturgies</option>
              <option value="diary">Diaries & Journals</option>
              <option value="note">Notes & Dissections</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={bannedFilter}
              onChange={(e) => {
                setBannedFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`bg-stone-950/80 border ${theme.border} text-amber-200 text-xs font-sans px-3 py-2 rounded-lg focus:outline-none cursor-pointer`}
            >
              <option value="all">All Clearance Seals</option>
              <option value="banned">Restricted / Banned 🔴</option>
              <option value="safe">Unrestricted Material</option>
            </select>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between text-xs font-sans text-amber-400/60 mb-4 px-1">
          <div>Showing {paginatedCodices.length} of {filteredCodices.length} Act I Records (Page {currentPage} of {totalPages})</div>
          <div className="flex gap-4">
            <span>Restricted Seals: {CODICES_DATABASE.filter(c => c.Banned_Status).length}</span>
            <span className="text-cyan-400 font-mono">192 Total Audio Recordings Mapped</span>
          </div>
        </div>

        {/* ================= GRID OF CODICES ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedCodices.map((codex) => {
            const isCurrentPlaying = activeAudio?.Item_ID === codex.Item_ID && isPlaying;
            return (
              <div
                key={codex.Item_ID}
                onClick={() => setSelectedCodex(codex)}
                className={`relative group bg-stone-900/80 border ${theme.border} hover:${theme.highlight} rounded-2xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer backdrop-blur-sm overflow-hidden`}
              >
                <div>
                  {/* Top Item Badge Row */}
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="font-mono text-xs text-amber-400/90 font-bold bg-amber-950/70 border border-amber-800/40 px-2.5 py-0.5 rounded-md">
                      {codex.Item_ID}
                    </span>

                    <div className="flex items-center space-x-2">
                      {/* Red Wax Seal Badge for Restricted items */}
                      {codex.Banned_Status && (
                        <div className="flex items-center space-x-1.5 bg-red-950 border border-red-600/80 text-red-200 text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full shadow-md">
                          <div className="w-3 h-3 rounded-full bg-red-600 border border-yellow-400 flex items-center justify-center text-[8px]">
                            ⚡
                          </div>
                          <span className="tracking-wider">RESTRICTED</span>
                        </div>
                      )}

                      <span className={`text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-md border ${theme.badge}`}>
                        [{codex.Audio_Source}]
                      </span>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors mb-1">
                    {codex.Item_Name}
                  </h3>
                  <div className="text-xs font-sans text-amber-400/70 mb-3 flex items-center justify-between">
                    <span>{codex.Category}</span>
                    <span className="text-[11px] text-stone-400 font-mono">{codex.Location}</span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-amber-200/80 font-sans leading-relaxed mb-4 line-clamp-3">
                    {codex.Summary}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {codex.Tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-sans bg-stone-950/80 text-amber-300/80 border border-stone-800 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-stone-800/80">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCodex(codex);
                      }}
                      className="flex items-center space-x-1.5 text-xs font-sans text-amber-300/80 hover:text-amber-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Examine / Read</span>
                    </button>

                    <button
                      onClick={(e) => handlePlayAudio(codex, e)}
                      className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-sans font-medium transition-all ${
                        isCurrentPlaying
                          ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20'
                          : `${theme.accentBg} ${theme.accent} border ${theme.border} hover:bg-amber-900/50`
                      }`}
                    >
                      {isCurrentPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isCurrentPlaying ? 'Pause' : 'Listen'}</span>
                      <span className="text-[10px] opacity-70 font-mono">({codex.Audio_Duration})</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-3 mt-8 font-sans">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 rounded-lg bg-stone-900 border border-amber-900/40 disabled:opacity-40 text-amber-300 hover:bg-stone-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-amber-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg bg-stone-900 border border-amber-900/40 disabled:opacity-40 text-amber-300 hover:bg-stone-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* ================= DUAL-PANE MODAL READER ================= */}
      {selectedCodex && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-5xl max-h-[90vh] bg-stone-950 border ${theme.border} rounded-3xl shadow-2xl flex flex-col overflow-hidden`}>
            
            {/* Modal Top Bar */}
            <div className={`p-4 border-b ${theme.border} ${theme.panelBg} flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs bg-amber-950/80 text-amber-300 px-2.5 py-1 rounded border border-amber-800/40">
                  {selectedCodex.Item_ID}
                </span>
                <h2 className="text-lg font-bold text-amber-100">{selectedCodex.Item_Name}</h2>
              </div>
              
              <button
                onClick={() => setSelectedCodex(null)}
                className="p-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Dual-Pane Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-stone-800">
              
              {/* Left Pane: Verbatim Text */}
              <div className="md:col-span-7 p-6 space-y-4 bg-stone-900/40">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="text-xs font-sans text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Verbatim Wiki Transcript
                  </span>
                  <a
                    href={selectedCodex.Wiki_Url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-sans text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>bg3.wiki entry</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-amber-100/90 font-serif leading-relaxed text-sm whitespace-pre-line first-letter:text-3xl first-letter:font-bold first-letter:text-amber-400 first-letter:float-left first-letter:mr-2">
                    {selectedCodex.Full_Text}
                  </p>
                </div>
              </div>

              {/* Right Pane: Schema Metadata & Integrated Music Box */}
              <div className="md:col-span-5 p-6 space-y-5 bg-stone-950">
                
                {/* Audio Sync Module inside Modal */}
                <div className={`p-4 rounded-2xl border ${theme.border} bg-stone-900/80 shadow-lg relative overflow-hidden`}>
                  {selectedCodex.Camp_Trigger && (
                    <div className="absolute top-2 right-2 flex items-center space-x-1 text-[10px] text-amber-400 font-sans bg-amber-950/80 border border-amber-700/40 px-2 py-0.5 rounded-full">
                      <Flame className="w-3 h-3 text-amber-500 animate-bounce" />
                      <span>Camp Dialogue Trigger</span>
                    </div>
                  )}

                  <div className="text-xs font-sans text-amber-400/80 mb-2 font-bold uppercase tracking-wider">
                    Ornate Music Box Sync
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-amber-200">{selectedCodex.Voice_Narrator}</div>
                      <div className="text-[11px] font-sans text-amber-400/60">{selectedCodex.Audio_Source} • {selectedCodex.Audio_Duration}</div>
                    </div>

                    <button
                      onClick={(e) => handlePlayAudio(selectedCodex, e)}
                      className={`px-4 py-2 rounded-xl text-xs font-sans font-bold flex items-center space-x-2 ${
                        activeAudio?.Item_ID === selectedCodex.Item_ID && isPlaying
                          ? 'bg-amber-500 text-stone-950'
                          : 'bg-cyan-900/80 text-cyan-200 border border-cyan-500/40 hover:bg-cyan-800'
                      }`}
                    >
                      {activeAudio?.Item_ID === selectedCodex.Item_ID && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{activeAudio?.Item_ID === selectedCodex.Item_ID && isPlaying ? 'Pause Audio' : 'Listen Now'}</span>
                    </button>
                  </div>
                </div>

                {/* Companion Marginalia Quote */}
                {selectedCodex.Companion && (
                  <div className="p-4 rounded-2xl border border-amber-900/40 bg-amber-950/20">
                    <div className="text-xs font-sans text-amber-400 font-bold mb-1 flex items-center gap-2">
                      <span>{COMPANIONS.find(c => c.id === selectedCodex.Companion)?.avatar}</span>
                      <span>{COMPANIONS.find(c => c.id === selectedCodex.Companion)?.name} Notes:</span>
                    </div>
                    <p className="text-xs font-sans italic text-amber-300/80">
                      "{COMPANIONS.find(c => c.id === selectedCodex.Companion)?.quote}"
                    </p>
                  </div>
                )}

                {/* Excel Row Exporter */}
                <button
                  onClick={() => copyExcelRow(selectedCodex)}
                  className="w-full py-2.5 rounded-xl border border-stone-700 bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-sans flex items-center justify-center space-x-2 transition-colors"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedId ? 'Copied Row to Clipboard!' : 'Copy TSV Record (Excel Format)'}</span>
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= FIXED ORNATE MUSIC BOX PLAYER ================= */}
      <footer className={`fixed bottom-0 inset-x-0 z-40 ${theme.panelBg} border-t ${theme.border} backdrop-blur-lg px-4 py-3 shadow-2xl transition-all`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left Track Info & Spinning Winding Key Animation */}
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative group flex items-center justify-center">
              {/* Mechanical Spinning Key SVG */}
              <div className={`p-3 rounded-full border ${theme.border} ${theme.accentBg} shadow-inner transition-transform ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
                <Music className={`w-6 h-6 ${isPlaying ? 'text-amber-400' : 'text-amber-500/60'}`} />
              </div>
              {isPlaying && (
                <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-sm animate-pulse"></div>
              )}
            </div>

            <div className="min-w-[180px]">
              <div className="text-xs font-bold text-amber-200 line-clamp-1">
                {activeAudio ? activeAudio.Item_Name : 'Select a Codex to Listen'}
              </div>
              <div className="text-[11px] font-sans text-amber-400/70 flex items-center gap-2">
                <span>{activeAudio ? activeAudio.Voice_Narrator : 'Ornate Music Box Idle'}</span>
                {activeAudio && <span className="font-mono text-cyan-400">[{activeAudio.Audio_Source}]</span>}
              </div>
            </div>
          </div>

          {/* Center Playback Controls & Scrubber */}
          <div className="flex-1 max-w-2xl w-full flex items-center space-x-3">
            <button
              disabled={!activeAudio}
              onClick={() => activeAudio && handlePlayAudio(activeAudio)}
              className={`p-2.5 rounded-full border ${theme.border} ${theme.accentBg} ${theme.accent} hover:scale-105 disabled:opacity-40 transition-transform`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <span className="text-xs font-mono text-amber-400/80 w-10 text-right">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              disabled={!activeAudio}
              className="flex-1 h-1.5 bg-stone-900 rounded-lg appearance-none cursor-pointer accent-amber-400 disabled:opacity-30"
            />

            <span className="text-xs font-mono text-amber-400/80 w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Right Volume Control */}
          <div className="flex items-center space-x-2">
            <button onClick={toggleMute} className="text-amber-400/80 hover:text-amber-200">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1.5 bg-stone-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

        </div>
      </footer>

    </div>
  );
}