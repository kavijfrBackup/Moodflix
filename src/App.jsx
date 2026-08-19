import React, { useState, useMemo, useEffect } from "react";
import {
  Coffee, Brain, HeartCrack, Flame, Ghost, Sparkles,
  Heart, X, Play, Clock, Star, ArrowLeft, Film, ChevronRight
} from "lucide-react";

// ---------------------------------------------------------------------------
// Design tokens — "late-night marquee" system
// ---------------------------------------------------------------------------
const TOKENS = {
  bg: "#12101C",
  bgElevated: "#1C1830",
  bgCard: "#211C36",
  marquee: "#F2B84B",
  rose: "#D8687A",
  text: "#F3EFEA",
  textMuted: "#A9A2BE",
  border: "#332C4E",
};

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
`;

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const MOODS = [
  {
    id: "cozy",
    label: "Cozy",
    line: "Something warm to put on with tea and blankets.",
    icon: Coffee,
    gradient: "linear-gradient(135deg, #6b4a3a, #b98a56)",
  },
  {
    id: "mindbend",
    label: "Mind-Bending",
    line: "Rewires your brain. Prepare to rewatch the ending.",
    icon: Brain,
    gradient: "linear-gradient(135deg, #3a2b6b, #6c5ce7)",
  },
  {
    id: "heartbreak",
    label: "Heartbreak Recovery",
    line: "Cry it out, then feel weirdly okay by the credits.",
    icon: HeartCrack,
    gradient: "linear-gradient(135deg, #6b2b3f, #d8687a)",
  },
  {
    id: "hype",
    label: "Hype Me Up",
    line: "Loud, fast, and exactly what a Friday needs.",
    icon: Flame,
    gradient: "linear-gradient(135deg, #6b3a1f, #e8873d)",
  },
  {
    id: "spooky",
    label: "Spooky (Not Too Spooky)",
    line: "Tense enough to matter, tame enough to sleep after.",
    icon: Ghost,
    gradient: "linear-gradient(135deg, #1f3a3a, #3a6b6b)",
  },
  {
    id: "feelgood",
    label: "Feel-Good",
    line: "No notes. Just a good time from start to finish.",
    icon: Sparkles,
    gradient: "linear-gradient(135deg, #3a5a2b, #7fb356)",
  },
];

const MOOD_GENRES = {
  cozy: [35, 10751, 10749],       // Comedy, Family, Romance
  mindbend: [878, 9648, 53],      // Sci-Fi, Mystery, Thriller
  heartbreak: [10749, 18],        // Romance, Drama
  hype: [28, 12, 878],            // Action, Adventure, Sci-Fi
  spooky: [27, 53, 9648],         // Horror, Thriller, Mystery
  feelgood: [35, 10751, 12],      // Comedy, Family, Adventure
};

const MOVIES = [
  // cozy
  { id: 1, title: "Paddington 2", year: 2017, runtime: 103, vibe: 9.4, mood: "cozy", blurb: "A polite bear untangles a heist with nothing but marmalade sandwiches and good manners.", palette: ["#b98a56", "#6b4a3a"] },
  { id: 2, title: "The Grand Budapest Hotel", year: 2014, runtime: 99, vibe: 9.1, mood: "cozy", blurb: "A concierge and his protégé keep a fading hotel's dignity intact through absurd circumstances.", palette: ["#c98a6b", "#8a5a4a"] },
  { id: 3, title: "Little Women", year: 2019, runtime: 135, vibe: 9.0, mood: "cozy", blurb: "Four sisters figure out who they want to become, one winter at a time.", palette: ["#a97a5a", "#5a3a2b"] },
  { id: 4, title: "Chef", year: 2014, runtime: 114, vibe: 8.6, mood: "cozy", blurb: "A chef rebuilds his career and his family, one food-truck sandwich at a time.", palette: ["#d89a5a", "#7a4a2b"] },
  // mindbend
  { id: 5, title: "Inception", year: 2010, runtime: 148, vibe: 9.3, mood: "mindbend", blurb: "A team plants an idea in someone's subconscious, four dreams deep and sinking.", palette: ["#6c5ce7", "#2b1f5a"] },
  { id: 6, title: "Everything Everywhere All at Once", year: 2022, runtime: 140, vibe: 9.6, mood: "mindbend", blurb: "A laundromat owner discovers she's the only one who can save every universe at once.", palette: ["#8a6ce7", "#3a2b6b"] },
  { id: 7, title: "Arrival", year: 2016, runtime: 116, vibe: 9.2, mood: "mindbend", blurb: "A linguist learns an alien language that changes how she experiences time itself.", palette: ["#5a4ac7", "#241b4a"] },
  { id: 8, title: "Coherence", year: 2013, runtime: 89, vibe: 8.4, mood: "mindbend", blurb: "A dinner party fractures into parallel versions of itself after a comet passes overhead.", palette: ["#7a5ce7", "#2b1f4a"] },
  // heartbreak
  { id: 9, title: "Eternal Sunshine of the Spotless Mind", year: 2004, runtime: 108, vibe: 9.3, mood: "heartbreak", blurb: "A couple erases each other from memory, and slowly realizes what that costs them.", palette: ["#d8687a", "#5a2436"] },
  { id: 10, title: "Past Lives", year: 2023, runtime: 105, vibe: 9.0, mood: "heartbreak", blurb: "Childhood sweethearts reunite decades later to ask what might have been.", palette: ["#c85a72", "#4a1f30"] },
  { id: 11, title: "Marriage Story", year: 2019, runtime: 137, vibe: 8.8, mood: "heartbreak", blurb: "A divorce turns two decent people into opponents, and back into people again.", palette: ["#b8556b", "#3a1826"] },
  { id: 12, title: "Blue Valentine", year: 2010, runtime: 112, vibe: 8.3, mood: "heartbreak", blurb: "A marriage's beginning and end are told side by side, and neither one is easy.", palette: ["#a84f65", "#301420"] },
  // hype
  { id: 13, title: "Mad Max: Fury Road", year: 2015, runtime: 120, vibe: 9.5, mood: "hype", blurb: "One long chase across the wasteland, and somehow it never lets up for a second.", palette: ["#e8873d", "#5a2f0f"] },
  { id: 14, title: "John Wick", year: 2014, runtime: 101, vibe: 8.9, mood: "hype", blurb: "A retired hitman comes back for one dog's worth of revenge, and doesn't stop.", palette: ["#d87a2f", "#4a2609"] },
  { id: 15, title: "Baby Driver", year: 2017, runtime: 113, vibe: 8.7, mood: "hype", blurb: "A getaway driver runs every heist to the beat of his own playlist.", palette: ["#e89a3d", "#5a3609"] },
  { id: 16, title: "Spider-Man: Across the Spider-Verse", year: 2023, runtime: 140, vibe: 9.4, mood: "hype", blurb: "Miles Morales gets pulled across a multiverse that keeps reinventing what a hero looks like.", palette: ["#e8703d", "#5a2909"] },
  // spooky
  { id: 17, title: "A Quiet Place", year: 2018, runtime: 90, vibe: 8.8, mood: "spooky", blurb: "A family survives by never making a sound, until one moment forces them to.", palette: ["#3a6b6b", "#122a2a"] },
  { id: 18, title: "Get Out", year: 2017, runtime: 104, vibe: 9.1, mood: "spooky", blurb: "A weekend meeting the in-laws turns into something much stranger, one smile at a time.", palette: ["#2f6b5a", "#0f2a20"] },
  { id: 19, title: "Crimson Peak", year: 2015, runtime: 119, vibe: 8.0, mood: "spooky", blurb: "A gothic mansion holds a new bride, an old secret, and a very patient ghost.", palette: ["#4a6b7a", "#152a30"] },
  { id: 20, title: "Coraline", year: 2009, runtime: 100, vibe: 8.9, mood: "spooky", blurb: "A girl finds a door to a better version of her life, with a catch sewn into the details.", palette: ["#3a5a6b", "#0f2030"] },
  // feelgood
  { id: 21, title: "Sing Street", year: 2016, runtime: 106, vibe: 9.0, mood: "feelgood", blurb: "A teenager starts a band to impress a girl and accidentally finds his whole life's direction.", palette: ["#7fb356", "#2b4a1a"] },
  { id: 22, title: "The Intouchables", year: 2011, runtime: 112, vibe: 9.2, mood: "feelgood", blurb: "An unlikely friendship forms between a wealthy quadriplegic and his new caretaker.", palette: ["#8fc366", "#345a20"] },
  { id: 23, title: "Paddington", year: 2014, runtime: 95, vibe: 8.8, mood: "feelgood", blurb: "A bear from Peru finds a family in London, and turns their house upside down.", palette: ["#6fa346", "#254a18"] },
  { id: 24, title: "School of Rock", year: 2003, runtime: 109, vibe: 8.6, mood: "feelgood", blurb: "A washed-up musician poses as a substitute teacher and starts the best band in school.", palette: ["#9fd376", "#3a5a20"] },
];

// ---------------------------------------------------------------------------
// Small building blocks
// ----------------------
// -----------------------------------------------------

function FilmStrip({ style }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        padding: "6px 0",
        opacity: 0.5,
        ...style,
      }}
    >
      {Array.from({ length: 28 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 2,
            background: TOKENS.textMuted,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

function Poster({ movie, size = "normal" }) {
  const isSmall = size === "small";
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "2 / 3",
        borderRadius: 10,
        overflow: "hidden",
        background: movie.poster_path
          ? `url(${TMDB_IMAGE_URL}${movie.poster_path}) center / cover`
          : `linear-gradient(160deg, ${movie.palette?.[0] || "#6b4a3a"}, ${movie.palette?.[1] || "#2b1f5a"})`,
        display: "flex",
        alignItems: "flex-end",
        padding: isSmall ? 10 : 16,
        boxShadow: "0 12px 28px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 90% at 50% 110%, rgba(0,0,0,0.65), transparent 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: isSmall ? 8 : 12,
          right: isSmall ? 8 : 12,
          background: "rgba(18,16,28,0.6)",
          backdropFilter: "blur(4px)",
          borderRadius: 999,
          padding: isSmall ? "3px 7px" : "4px 9px",
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: isSmall ? 10 : 11,
          color: TOKENS.marquee,
        }}
      >
        <Star size={isSmall ? 10 : 11} fill={TOKENS.marquee} strokeWidth={0} />
        {(movie.vote_average ?? movie.vibe ?? 0).toFixed(1)}
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 600,
            fontSize: isSmall ? 14 : 18,
            lineHeight: 1.15,
            color: "#fff",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          {movie.title}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: isSmall ? 10 : 11,
            color: "rgba(255,255,255,0.75)",
            marginTop: 4,
          }}
        >
          {movie.year} · {movie.runtime}m
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main app
// ---------------------------------------------------------------------------
const formatTMDBMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  year: movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A",
  runtime: movie.runtime || 0,
  vibe: movie.vote_average || 0,
  mood: null,
  blurb: movie.overview || "No description available.",
  poster_path: movie.poster_path,
  palette: ["#6b4a3a", "#2b1f5a"],
});

export default function MoodFlix() {
  const [screen, setScreen] = useState("home");
  const [tmdbMovies, setTmdbMovies] = useState([]);
  const [activeMood, setActiveMood] = useState(null);
const [watchlist, setWatchlist] = useState(() => {
  const saved = localStorage.getItem("moodflixWatchlist");
  return saved ? JSON.parse(saved) : [];
});
  const [activeMovie, setActiveMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  localStorage.setItem(
    "moodflixWatchlist",
    JSON.stringify(watchlist)
  );
}, [watchlist]);

  useEffect(() => {
    if (!activeMood) return;

    const fetchMovies = async () => {
        setLoading(true);
        setTmdbMovies([]);

    try {
        const genres = MOOD_GENRES[activeMood.id].join(",");

        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&with_genres=${genres}&page=1`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json();

        console.log(`${activeMood.label} movies:`, data.results);


        const detailedMovies = await Promise.all(
          data.results.map(async (movie) => {
            const detailsResponse = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
            );

            const details = await detailsResponse.json();

            return formatTMDBMovie({
              ...movie,
              ...details,
            });
          })
        );

        setTmdbMovies(detailedMovies);

      } catch (error) {
        console.error("TMDB error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [activeMood]);

const fetchTrailer = async (movieId) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
    );

    const data = await response.json();

    const trailer = data.results.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer"
    );

    if (trailer) {
      setTrailerKey(trailer.key);
    } else {
      alert("No trailer found for this movie.");
    }
  } catch (error) {
    console.error("Trailer error:", error);
  }
};




const results = tmdbMovies;

  const isSaved = (id) => watchlist.some((m) => m.id === id);
  const toggleSave = (movie) => {
    setWatchlist((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );
  };

  const selectMood = (mood) => {
    setActiveMood(mood);
    setScreen("results");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: TOKENS.bg,
        color: TOKENS.text,
        fontFamily: "'Inter', sans-serif",
      }}
    >

      <style>
        {`
          ${FONT_IMPORT}

          @keyframes moodflixPulse {
            0%, 100% {
              opacity: 0.4;
              transform: scale(0.9);
            }

            50% {
              opacity: 1;
              transform: scale(1.1);
            }
          }
        `}
      </style>

      {/* Nav */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 28px",
          borderBottom: `1px solid ${TOKENS.border}`,
          position: "sticky",
          top: 0,
          background: "rgba(18,16,28,0.85)",
          backdropFilter: "blur(10px)",
          zIndex: 10,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
          onClick={() => setScreen("home")}
        >
          <Film size={20} color={TOKENS.marquee} />
          <span
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: 0.3,
            }}
          >
            MoodFlix
          </span>
        </div>
        <button
          onClick={() => setScreen("watchlist")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: `1px solid ${TOKENS.border}`,
            color: TOKENS.text,
            padding: "8px 14px",
            borderRadius: 999,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          <Heart
            size={14}
            color={TOKENS.rose}
            fill={watchlist.length ? TOKENS.rose : "none"}
          />
          Watchlist
          {watchlist.length > 0 && (
            <span
              style={{
                background: TOKENS.rose,
                color: "#fff",
                borderRadius: 999,
                fontSize: 11,
                padding: "1px 6px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {watchlist.length}
            </span>
          )}
        </button>
      </header>

      {/* HOME */}
      {screen === "home" && (
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "56px 24px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                letterSpacing: 2,
                color: TOKENS.marquee,
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Tonight's Showing
            </div>
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                fontSize: "clamp(32px, 5vw, 52px)",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              What's the mood?
            </h1>
            <p
              style={{
                color: TOKENS.textMuted,
                fontSize: 16,
                marginTop: 14,
                maxWidth: 480,
                marginInline: "auto",
              }}
            >
              Skip the endless scrolling. Pick a feeling, and we'll pick the film.
            </p>
          </div>

          <FilmStrip style={{ marginBottom: 40, justifyContent: "center" }} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {MOODS.map((mood) => {
              const Icon = mood.icon;
              return (
                <button
                  key={mood.id}
                  onClick={() => selectMood(mood)}
                  style={{
                    textAlign: "left",
                    border: `1px solid ${TOKENS.border}`,
                    borderRadius: 16,
                    padding: 20,
                    background: TOKENS.bgElevated,
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform 0.15s ease, border-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.borderColor = TOKENS.marquee;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = TOKENS.border;
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: mood.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 14,
                    }}
                  >
                    <Icon size={19} color="#fff" strokeWidth={2} />
                  </div>
                  <div
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 6,
                    }}
                  >
                    {mood.label}
                  </div>
                  <div style={{ color: TOKENS.textMuted, fontSize: 13.5, lineHeight: 1.5 }}>
                    {mood.line}
                  </div>
                  <ChevronRight
                    size={16}
                    color={TOKENS.textMuted}
                    style={{ position: "absolute", top: 20, right: 18 }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {screen === "results" && activeMood && (
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px 80px" }}>
          <button
            onClick={() => setScreen("home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              color: TOKENS.textMuted,
              cursor: "pointer",
              fontSize: 13,
              marginBottom: 20,
              padding: 0,
            }}
          >
            <ArrowLeft size={14} /> Change mood
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: activeMood.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <activeMood.icon size={21} color="#fff" />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 600,
                  fontSize: 28,
                  margin: 0,
                }}
              >
                {activeMood.label}
              </h2>
              <div style={{ color: TOKENS.textMuted, fontSize: 13.5 }}>{activeMood.line}</div>
            </div>
          </div>

        {loading ? (
          <div
            style={{
              minHeight: 300,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              color: TOKENS.textMuted,
            }}
          >
            <Film
              size={32}
              color={TOKENS.marquee}
              style={{
                animation: "moodflixPulse 1.2s ease-in-out infinite",
              }}
            />

            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 20,
                color: TOKENS.text,
              }}
            >
              Finding your films...
            </div>

            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              Matching the mood
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 20,
            }}
          >
            {results.map((movie) => (
              <div key={movie.id}>
                <div
                  style={{ position: "relative", cursor: "pointer" }}
                  onClick={() => setActiveMovie(movie)}
                >
                  <Poster movie={movie} />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(movie);
                    }}
                    style={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      background: "rgba(18,16,28,0.7)",
                      backdropFilter: "blur(4px)",
                      border: "none",
                      borderRadius: 999,
                      width: 30,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                  >
                    <Heart
                      size={14}
                      color={TOKENS.rose}
                      fill={isSaved(movie.id) ? TOKENS.rose : "none"}
                    />
                  </button>
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12.5,
                    color: TOKENS.textMuted,
                    lineHeight: 1.4,
                  }}
                >
                  {movie.blurb}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      )}

      {/* WATCHLIST */}
      {screen === "watchlist" && (
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px 80px" }}>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 28,
              marginBottom: 6,
            }}
          >
            Your Watchlist
          </h2>
          <p style={{ color: TOKENS.textMuted, fontSize: 13.5, marginBottom: 28 }}>
            {watchlist.length === 0
              ? "Nothing saved yet — tap the heart on anything that catches your eye."
              : `${watchlist.length} film${watchlist.length > 1 ? "s" : ""} saved for later.`}
          </p>

          {watchlist.length === 0 ? (
            <div
              style={{
                border: `1px dashed ${TOKENS.border}`,
                borderRadius: 16,
                padding: "60px 20px",
                textAlign: "center",
                color: TOKENS.textMuted,
              }}
            >
              <Heart size={28} color={TOKENS.border} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 14 }}>Your watchlist is empty.</div>
              <button
                onClick={() => setScreen("home")}
                style={{
                  marginTop: 16,
                  background: TOKENS.marquee,
                  color: "#12101C",
                  border: "none",
                  borderRadius: 999,
                  padding: "9px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Pick a mood
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 20,
              }}
            >
              {watchlist.map((movie) => (
                <div key={movie.id} style={{ position: "relative", cursor: "pointer" }} onClick={() => setActiveMovie(movie)}>
                  <Poster movie={movie} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(movie);
                    }}
                    style={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      background: "rgba(18,16,28,0.7)",
                      border: "none",
                      borderRadius: 999,
                      width: 30,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <X size={14} color={TOKENS.text} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL */}
      {activeMovie && (
        <div
          onClick={() => setActiveMovie(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,9,15,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: TOKENS.bgCard,
              borderRadius: 20,
              maxWidth: 520,
              width: "100%",
              overflow: "hidden",
              border: `1px solid ${TOKENS.border}`,
              display: "flex",
              maxHeight: "85vh",
            }}
          >
            <div style={{ width: "38%", flexShrink: 0 }}>
              <Poster movie={activeMovie} />
            </div>
            <div style={{ padding: 22, overflowY: "auto" }}>
              <button
                onClick={() => setActiveMovie(null)}
                style={{
                  float: "right",
                  background: "none",
                  border: "none",
                  color: TOKENS.textMuted,
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
              <h3
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 600,
                  fontSize: 22,
                  margin: "0 10px 6px 0",
                }}
              >
                {activeMovie.title}
              </h3>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  color: TOKENS.textMuted,
                  fontSize: 12.5,
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: 14,
                }}
              >
                <span>{activeMovie.year}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={12} /> {activeMovie.runtime}m
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: TOKENS.marquee }}>
                  <Star size={12} fill={TOKENS.marquee} strokeWidth={0} /> {activeMovie.vibe.toFixed(1)}
                </span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: TOKENS.text, marginBottom: 20 }}>
                {activeMovie.blurb}
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => fetchTrailer(activeMovie.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: TOKENS.marquee,
                    color: "#12101C",
                    border: "none",
                    borderRadius: 999,
                    padding: "9px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Play size={13} fill="#12101C" />
                  Watch trailer
                </button>

                <button
                  onClick={() => toggleSave(activeMovie)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "transparent",
                    border: `1px solid ${TOKENS.border}`,
                    color: TOKENS.text,
                    borderRadius: 999,
                    padding: "9px 16px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <Heart
                    size={13}
                    color={TOKENS.rose}
                    fill={isSaved(activeMovie.id) ? TOKENS.rose : "none"}
                  />
                  {isSaved(activeMovie.id) ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRAILER MODAL */}
      {trailerKey && (
        <div
          onClick={() => setTrailerKey(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 900,
              aspectRatio: "16 / 9",
              position: "relative",
            }}
          >
            <button
              onClick={() => setTrailerKey(null)}
              style={{
                position: "absolute",
                top: -40,
                right: 0,
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <X size={26} />
            </button>

            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Movie trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                border: "none",
                borderRadius: 14,
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
