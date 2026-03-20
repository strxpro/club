import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const API_KEY = 'cef830252713a75968dd501948b06464';
const BASE_URL = 'https://v3.football.api-sports.io';
const LEAGUE_ID = 135; 
const TEAM_ID = 490;
const SEASON = 2024;
const CACHE_TTL = 3 * 60 * 60 * 1000;
const RATE_LIMIT_KEY = 'cagliari_api_limited_until';

const MONTH_NAMES = {
    7: 'Sierpień', 8: 'Wrzesień', 9: 'Październik', 10: 'Listopad', 11: 'Grudzień',
    0: 'Styczeń', 1: 'Luty', 2: 'Marzec', 3: 'Kwiecień', 4: 'Maj', 5: 'Czerwiec'
};

const getPosAbbr = (pos) => {
    switch(pos) {
        case 'Attacker': return 'NAP';
        case 'Midfielder': return 'POM';
        case 'Defender': return 'OBR';
        case 'Goalkeeper': return 'BR';
        default: return 'ZAW';
    }
};

async function fetchWithCache(endpoint) {
    const cacheKey = `cagliari_cache_${endpoint}`;
    const cached = localStorage.getItem(cacheKey);
    const lockedUntil = localStorage.getItem(RATE_LIMIT_KEY);
    
    if (lockedUntil && Date.now() < parseInt(lockedUntil)) {
        if (cached) return JSON.parse(cached).data;
        return null;
    }
    
    if (cached) {
        try {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TTL) return data;
        } catch(e) {}
    }
    
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, { 
            method: 'GET', 
            headers: { "x-apisports-key": API_KEY } 
        });
        
        if (response.status === 429 || response.status === 499 || response.status === 403) {
            localStorage.setItem(RATE_LIMIT_KEY, Date.now() + 24 * 60 * 60 * 1000);
            throw new Error(`Rate limit reached`);
        }

        const data = await response.json();
        
        if (data.errors && Object.keys(data.errors).length > 0) {
            const errStr = JSON.stringify(data.errors).toLowerCase();
            if (errStr.includes("limit") || errStr.includes("requests") || errStr.includes("token")) {
                localStorage.setItem(RATE_LIMIT_KEY, Date.now() + 24 * 60 * 60 * 1000);
            }
            throw new Error("Payload Error: " + errStr);
        }
        
        if (data.response) {
            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: data.response }));
            return data.response;
        }
        throw new Error("Invalid structure.");
    } catch (error) {
        if (cached) return JSON.parse(cached).data;
        return null;
    }
}

// FUT Card Component
const FUTCard = ({ player }) => (
    <div className="relative w-[130px] sm:w-[150px] lg:w-[170px] h-[190px] sm:h-[220px] lg:h-[250px] rounded-[16px] overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:z-20 group cursor-pointer border border-[#d4af37]/60 hover:border-[#d4af37] bg-gradient-to-br from-[#1a233a] to-[#060d1e] shrink-0"
         style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.05)' }}>
         <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 50% 0%, rgba(200, 16, 46, 0.4) 0%, transparent 60%)" }}></div>
         
         {/* Number & Pos */}
         <div className="absolute top-2 left-2 z-20 flex flex-col items-center">
             <div className="text-3xl sm:text-4xl font-heading font-black text-[#d4af37] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-none">{player.number || '-'}</div>
             <div className="text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-widest mt-1 drop-shadow-md bg-black/60 px-1.5 rounded">{getPosAbbr(player.position)}</div>
         </div>
         
         {/* Player Image */}
         <img src={player.photo} alt={player.name} className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 h-[70%] sm:h-[75%] object-contain object-bottom drop-shadow-[0_6px_6px_rgba(0,0,0,0.8)] z-10 transition-transform duration-300 group-hover:scale-110" />
         
         {/* Bottom Panel */}
         <div className="absolute bottom-0 inset-x-0 h-[40%] bg-gradient-to-t from-black via-black/90 to-transparent z-15 flex flex-col items-center justify-end pb-2 sm:pb-3 pointer-events-none">
             <div className="w-[80%] h-[1px] bg-[#d4af37]/40 mb-1 group-hover:bg-[#d4af37] transition-colors"></div>
             <div className="text-[11px] sm:text-[13px] font-heading font-bold text-white uppercase tracking-widest px-1 w-[90%] text-center truncate drop-shadow-[0_2px_2px_rgba(0,0,0,1)] z-20" title={player.name}>{player.name.split(' ').pop()}</div>
         </div>
    </div>
);

export default function CagliariStats() {
    const [standings, setStandings] = useState(null);
    const [fixtures, setFixtures] = useState(null);
    const [squad, setSquad] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    useEffect(() => {
        window.scrollTo(0, 0);
        async function loadAll() {
            setLoading(true);
            const [stData, fixData, sqData] = await Promise.all([
                fetchWithCache(`/standings?season=${SEASON}&league=${LEAGUE_ID}`),
                fetchWithCache(`/fixtures?team=${TEAM_ID}&season=${SEASON}`),
                fetchWithCache(`/players/squad?team=${TEAM_ID}`)
            ]);
            setStandings(stData);
            setFixtures(fixData);
            setSquad(sqData);
            setLoading(false);
        }
        loadAll();
    }, []);

    // LIVE MODULE COMPUTATION
    const liveStatuses = ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'];
    const notStartedStatuses = ['TBD', 'NS'];
    const liveMatches = fixtures ? fixtures.filter(f => liveStatuses.includes(f.fixture.status.short)) : [];
    const upcomingMatches = fixtures ? fixtures.filter(f => notStartedStatuses.includes(f.fixture.status.short)).sort((a,b) => a.fixture.timestamp - b.fixture.timestamp) : [];

    // CALENDAR LOGIC
    const computedYear = selectedMonth >= 7 ? 2024 : 2025; 
    const daysInMonth = new Date(computedYear, selectedMonth + 1, 0).getDate();
    const firstDayIndex = new Date(computedYear, selectedMonth, 1).getDay(); 
    const startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Mon = 0, Sun = 6
    
    const monthFixtures = fixtures ? fixtures.filter(f => {
        const d = new Date(f.fixture.date);
        return d.getMonth() === selectedMonth && d.getFullYear() === computedYear;
    }) : [];

    // FUT SQUAD COMPUTATION
    const groupedSquad = sqData => {
        if (!sqData || !sqData[0] || !sqData[0].players) return null;
        const g = { Goalkeepers: [], Defenders: [], Midfielders: [], Attackers: [] };
        sqData[0].players.forEach(p => {
             let pos = p.position;
             if(pos === 'Attacker') pos = 'Attackers';
             if(pos === 'Midfielder') pos = 'Midfielders';
             if(pos === 'Defender') pos = 'Defenders';
             if(pos === 'Goalkeeper') pos = 'Goalkeepers';
             if(!p.photo || p.photo.includes('not-found')) {
                p.photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0d1530&color=ffffff&size=200`;
             }
             if(g[pos]) g[pos].push(p);
        });
        ['Goalkeepers','Defenders','Midfielders','Attackers'].forEach(cat => {
            g[cat].sort((a,b) => (a.number||99) - (b.number||99));
        });
        return g;
    };
    const squadGroups = groupedSquad(squad);

    if (loading) {
        return (
            <div className="min-h-screen bg-navy-dark flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-white/10 border-t-crimson rounded-full animate-spin"></div>
                    <div className="text-white/50 font-heading tracking-widest text-xl">Wczytywanie Danych...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-navy-dark relative overflow-x-hidden font-body text-white">
            <Navbar />
            
            {/* LIVE MODULE BANNER */}
            {liveMatches.length > 0 ? (
                <div className="w-full bg-crimson/20 border-b border-crimson py-4 z-40 sticky top-20 md:top-24 backdrop-blur-md shadow-xl transition-all block" style={{ animation: 'pulse-border 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
                    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center sm:justify-between gap-4 py-2">
                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                            <span className="bg-crimson text-white text-xs font-bold px-3 py-1 rounded shadow-[0_0_10px_rgba(200,16,46,0.8)] border border-crimson animate-pulse">MECZ NA ŻYWO</span>
                            <span className="text-white font-medium text-sm border border-white/20 px-2 py-0.5 rounded">{liveMatches[0].fixture.status.elapsed}' min</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 sm:gap-6 font-heading text-3xl sm:text-4xl text-white w-full md:w-auto">
                            <div className="flex items-center gap-2 flex-1 justify-end truncate">
                                <span className="tracking-wide hidden sm:inline max-w-[150px] font-normal truncate">{liveMatches[0].teams.home.name}</span>
                                <span className="tracking-wide inline sm:hidden uppercase font-normal">{liveMatches[0].teams.home.name.substring(0,3)}</span>
                                <img src={liveMatches[0].teams.home.logo} className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-md" alt="home" />
                            </div>
                            <span className="text-5xl sm:text-6xl text-crimson font-bold drop-shadow-[0_0_15px_rgba(200,16,46,0.5)] px-2">{liveMatches[0].goals.home ?? 0}:{liveMatches[0].goals.away ?? 0}</span>
                            <div className="flex items-center gap-2 flex-1 justify-start truncate">
                                <img src={liveMatches[0].teams.away.logo} className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-md" alt="away" />
                                <span className="tracking-wide hidden sm:inline max-w-[150px] font-normal truncate">{liveMatches[0].teams.away.name}</span>
                                <span className="tracking-wide inline sm:hidden uppercase font-normal">{liveMatches[0].teams.away.name.substring(0,3)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full bg-navy border-b border-white/10 py-5 sm:py-6 z-40 sticky top-20 md:top-24 backdrop-blur-md shadow-lg transition-all overflow-hidden relative block">
                    <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center relative z-10">
                        <span className="text-white/40 text-xs sm:text-sm font-light tracking-[0.15em] uppercase">Obecnie brak meczów na żywo.</span>
                        {upcomingMatches.length > 0 && (() => {
                            const next = upcomingMatches[0];
                            const nextDate = new Date(next.fixture.date);
                            const dStr = nextDate.toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' });
                            const tStr = nextDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
                            const opponent = next.teams.home.id === TEAM_ID ? next.teams.away : next.teams.home;
                            return (
                                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 bg-black/40 border border-white/5 rounded-2xl px-6 py-3 shadow-sm backdrop-blur-sm">
                                    <span className="text-xs uppercase text-white/40 tracking-widest font-semibold flex items-center gap-2">
                                        <span className="block w-2 h-2 rounded-full bg-white/20"></span>Najbliższe spotkanie:
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <span className="font-heading text-2xl text-white tracking-widest leading-none mt-1">
                                            {dStr} <span className="text-white/30 text-lg mx-1">|</span> <span className="text-crimson">{tStr}</span>
                                        </span>
                                        <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
                                        <div className="flex items-center gap-2 px-1">
                                            <img src={opponent.logo} className="w-8 h-8 object-contain" alt="Logo rywala"/>
                                            <span className="font-bold text-white/90 tracking-wider uppercase text-sm">{opponent.name}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16 pb-24">
                
                {/* CALENDAR SECTION */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                        <h3 className="text-3xl sm:text-4xl font-heading text-white tracking-wide uppercase drop-shadow-md">Terminarz - Interaktywny Kalendarz</h3>
                    </div>
                    
                    {/* TABS (Months) */}
                    <div className="flex overflow-x-auto gap-3 scrollbar-hide mb-8 pb-4">
                        {[7,8,9,10,11,0,1,2,3,4,5].map(m => (
                            <button key={m} onClick={() => setSelectedMonth(m)} 
                                    className={`px-5 py-2.5 whitespace-nowrap rounded-lg text-sm font-heading tracking-widest transition-all box-border ${selectedMonth === m ? 'bg-crimson text-white shadow-[0_0_15px_rgba(200,16,46,0.6)] border-2 border-crimson' : 'bg-black/30 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'}`}>
                                {MONTH_NAMES[m]}
                            </button>
                        ))}
                    </div>
                    
                    {/* GRID */}
                    <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center">
                        {['PON', 'WT', 'ŚR', 'CZW', 'PT', 'SOB', 'ND'].map(day => (
                            <div key={day} className="text-[10px] sm:text-xs font-bold text-white/40 mb-2">{day}</div>
                        ))}
                        
                        {Array.from({length: startDay}).map((_, i) => (
                            <div key={`empty-${i}`} className="bg-transparent h-24 rounded-lg hidden sm:block"></div>
                        ))}
                        
                        {Array.from({length: daysInMonth}).map((_, i) => {
                            const d = i + 1;
                            const fixture = monthFixtures.find(f => new Date(f.fixture.date).getDate() === d);
                            
                            if (fixture) {
                                const opponent = fixture.teams.home.id === TEAM_ID ? fixture.teams.away : fixture.teams.home;
                                const matchDate = new Date(fixture.fixture.date);
                                const time = matchDate.toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'});
                                const isFinished = ['FT', 'AET', 'PEN'].includes(fixture.fixture.status.short);
                                
                                return (
                                    <div key={d} className={`relative bg-black/60 border ${isFinished?'border-white/20':'border-[#d4af37]/60 shadow-[0_0_15px_rgba(212,175,55,0.2)]'} rounded-xl p-2 sm:p-3 hover:scale-105 hover:bg-black/80 hover:z-10 transition-all flex flex-col items-center justify-between min-h-[100px] sm:min-h-[130px] group cursor-pointer overflow-hidden`}>
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-crimson/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                        
                                        <span className={`absolute top-1 sm:top-2 left-2 font-bold text-[10px] sm:text-xs ${isFinished?'text-white/50':'text-white'}`}>{d}</span>
                                        
                                        <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex items-center gap-1 opacity-60">
                                            <span className="text-[8px] uppercase tracking-widest text-[#d4af37] hidden xl:block truncate max-w-[60px]">{fixture.league.name}</span>
                                            <img src={fixture.league.logo} className="w-3 h-3 sm:w-4 sm:h-4 grayscale" alt="cup"/>
                                        </div>
                                        
                                        <div className="mt-4 sm:mt-5 flex-1 flex flex-col items-center justify-center gap-2 z-10 w-full">
                                            <img src={opponent.logo} className={`w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-md ${isFinished?'opacity-70':''}`} alt={opponent.name} />
                                            {isFinished ? (
                                                <div className="font-heading text-xl sm:text-2xl text-white/70 font-bold leading-none">{fixture.goals.home}:{fixture.goals.away}</div>
                                            ) : (
                                                <div className="text-crimson font-bold text-[10px] sm:text-xs tracking-wider bg-black/50 px-2 py-0.5 rounded border border-crimson/30">{time}</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                            
                            return (
                                <div key={d} className="bg-white/5 border border-white/5 rounded-xl p-2 min-h-[60px] sm:min-h-[100px] flex items-start opacity-70">
                                    <span className="text-white/30 font-semibold text-[10px] sm:text-xs">{d}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* SQUAD SECTION (FUT PITCH) */}
                <section className="bg-black/40 border border-white/5 rounded-3xl p-4 sm:p-8 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] mt-12 mb-20">
                    <div className="flex items-center justify-between mb-8 relative z-20">
                        <div className="flex items-center gap-4">
                            <h3 className="text-3xl sm:text-5xl font-heading text-white tracking-widest uppercase drop-shadow-md">Oficjalny Skład</h3>
                            <span className="hidden sm:inline-block border border-[#d4af37]/60 bg-[#d4af37]/10 text-[#d4af37] text-[10px] px-2 py-0.5 rounded tracking-widest font-bold">CARDS</span>
                        </div>
                    </div>
                    
                    {/* VIRTUAL PITCH */}
                    <div className="relative w-full max-w-5xl mx-auto border-[4px] border-white/40 rounded-lg shadow-2xl pb-16 pt-16 mt-8 z-10 bg-[#2b6a3b] overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 100px, rgba(0,0,0,0.15) 100px, rgba(0,0,0,0.15) 200px)' }}>
                        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
                        
                        {/* CSS Pitch Lines */}
                        <div className="absolute inset-x-[15%] top-[-5px] h-[150px] border-[3px] border-white/40 rounded-b-xl z-0 pointer-events-none"></div> 
                        <div className="absolute inset-x-[35%] top-[-5px] h-[60px] border-[3px] border-white/40 rounded-b-xl z-0 pointer-events-none"></div> 
                        <div className="absolute left-1/2 -ml-[50px] top-[145px] w-[100px] h-[50px] border-[3px] border-white/40 border-t-0 rounded-b-full z-0 pointer-events-none"></div> 
                        
                        <div className="absolute top-1/2 left-0 w-full h-[3px] bg-white/40 z-0 pointer-events-none"></div> 
                        <div className="absolute top-1/2 left-1/2 -ml-[75px] -mt-[75px] w-[150px] h-[150px] border-[3px] border-white/40 rounded-full z-0 pointer-events-none"></div> 
                        
                        <div className="absolute inset-x-[15%] bottom-[-5px] h-[150px] border-[3px] border-white/40 rounded-t-xl z-0 pointer-events-none"></div> 
                        <div className="absolute inset-x-[35%] bottom-[-5px] h-[60px] border-[3px] border-white/40 rounded-t-xl z-0 pointer-events-none"></div> 
                        <div className="absolute left-1/2 -ml-[50px] bottom-[145px] w-[100px] h-[50px] border-[3px] border-white/40 border-b-0 rounded-t-full z-0 pointer-events-none"></div>
                        
                        {squadGroups ? (
                            <div className="relative z-10 flex flex-col gap-12 sm:gap-24 w-full justify-center mt-4">
                                {['Attackers', 'Midfielders', 'Defenders', 'Goalkeepers'].map(pos => {
                                    const players = squadGroups[pos];
                                    if(!players || players.length === 0) return null;
                                    return (
                                        <div key={pos} className="flex justify-center flex-wrap gap-4 sm:gap-8 px-2 sm:px-12 w-full mx-auto relative group/row">
                                            {/* Label position */}
                                            <div className="absolute -top-6 sm:-top-10 text-white/30 font-heading text-2xl sm:text-4xl uppercase tracking-[0.3em] font-black z-0 mix-blend-overlay w-full text-center pointer-events-none">{pos}</div>
                                            {players.map(p => <FUTCard key={p.id} player={p} />)}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center relative z-20">
                                <span className="text-white bg-black/50 px-6 py-3 rounded-xl border border-white/20">Brak danych składu z API.</span>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            
            <Footer />
        </div>
    );
}
