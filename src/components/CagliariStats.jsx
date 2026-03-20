import React, { useState, useEffect } from 'react';
import { useTranslation } from '../LanguageContext';

const API_KEY = 'cef830252713a75968dd501948b06464';
const BASE_URL = 'https://v3.football.api-sports.io';
const LEAGUE_ID = 135;
const TEAM_ID = 490;
const CACHE_TTL = 3 * 60 * 60 * 1000; 

export default function CagliariStats() {
    const { t } = useTranslation();
    const [season, setSeason] = useState(2025);
    const [standings, setStandings] = useState(null);
    const [fixtures, setFixtures] = useState([]);
    const [squad, setSquad] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchWithCache = async (endpoint, forceRefresh = false) => {
        const cacheKey = `cagliari_react_cache_${endpoint}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached && !forceRefresh) {
            try {
                const { timestamp, data } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_TTL) return data;
            } catch (e) { console.error(e); }
        }

        try {
            const res = await fetch(`${BASE_URL}${endpoint}`, {
                headers: { "x-apisports-key": API_KEY }
            });
            const data = await res.json();
            
            if (data.errors && Object.keys(data.errors).length > 0) {
                console.error("API Error:", data.errors);
                // Return cache if available despite api error (e.g., plan limit)
                if (cached) return JSON.parse(cached).data;
                throw new Error("API Limit or Plan Error.");
            }
            if (data.response) {
                localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: data.response }));
                return data.response;
            }
            throw new Error("Invalid response");
        } catch (err) {
            if (cached) return JSON.parse(cached).data;
            return null;
        }
    };

    const loadData = async (selectedSeason) => {
        setLoading(true);
        setError('');
        
        try {
            const [standingsData, fixturesData, squadData] = await Promise.all([
                fetchWithCache(`/standings?season=${selectedSeason}&league=${LEAGUE_ID}`, true),
                fetchWithCache(`/fixtures?team=${TEAM_ID}&season=${selectedSeason}`, true),
                fetchWithCache(`/players/squads?team=${TEAM_ID}`, true)
            ]);

            setStandings(standingsData && standingsData[0] ? standingsData[0].league.standings[0] : null);
            setFixtures(fixturesData || []);
            setSquad(squadData && squadData[0] ? squadData[0].players : []);

            if (!standingsData || !fixturesData || !squadData) {
                setError(`Brak danych dla sezonu ${selectedSeason}. Możliwy limit API lub zablokowany sezon na darmowym koncie.`);
            }
        } catch (err) {
            setError(`Wystąpił błąd pobierania danych z API dla sezonu ${selectedSeason}.`);
        } finally {
            setLoading(false);
        }
    };

    // On Mount & Season Change
    useEffect(() => {
        loadData(season);
    }, [season]);

    // Helpers
    const getLiveMatch = () => fixtures.filter(f => ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'].includes(f.fixture.status.short))[0];
    const getNextMatch = () => fixtures.filter(f => ['TBD', 'NS', 'Not Started'].includes(f.fixture.status.short) || f.fixture.status.long === 'Not Started').sort((a,b) => a.fixture.timestamp - b.fixture.timestamp)[0];
    const getLastMatch = () => fixtures.filter(f => ['FT', 'AET', 'PEN', 'Match Finished'].includes(f.fixture.status.short)).sort((a,b) => b.fixture.timestamp - a.fixture.timestamp)[0];

    const liveMatch = getLiveMatch();
    const nextMatch = getNextMatch();
    const lastMatch = getLastMatch();

    const renderSquadGroups = () => {
        const groups = [
            { id: "Bramkarze", type: "Goalkeeper" },
            { id: "Obrońcy", type: "Defender" },
            { id: "Pomocnicy", type: "Midfielder" },
            { id: "Napastnicy", type: "Attacker" }
        ];

        return groups.map(g => {
            const players = squad.filter(p => p.position === g.type).sort((a,b) => (a.number || 99) - (b.number || 99));
            if (players.length === 0) return null;

            return (
                <div key={g.id} className="mb-10 w-full">
                    <h4 className="font-heading text-2xl text-white/50 tracking-widest uppercase mb-4 border-b border-white/10 pb-2 pl-2">
                        {g.id}
                    </h4>
                    <div className="flex flex-col gap-3">
                        {players.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors w-full">
                                <div className="flex items-center gap-4">
                                    <img src={p.photo} alt={p.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow-lg" loading="lazy" />
                                    <div className="flex flex-col justify-center">
                                        <p className="text-white font-bold text-sm sm:text-base tracking-wide leading-tight">{p.name}</p>
                                        <p className="text-white/40 text-[10px] sm:text-xs tracking-wider uppercase mt-1">
                                            {p.position === 'Goalkeeper' ? 'Bramkarz' : 
                                             p.position === 'Defender' ? 'Obrońca' : 
                                             p.position === 'Midfielder' ? 'Pomocnik' : 'Napastnik'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right pr-4">
                                    <span className="font-heading text-4xl sm:text-5xl font-black text-white/10 mix-blend-overlay">
                                        {p.number || '-'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        });
    };

    return (
        <main className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 min-h-screen">
            
            {/* Header i Dropdown */}
            <header className="flex flex-col items-center justify-center space-y-6 text-center pt-8 border-b border-white/10 pb-8 relative z-10 w-full">
                <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-bold tracking-[0.2em] text-white/50">
                    SEZON {season} / {season + 1}
                </span>
                
                <h1 className="text-5xl md:text-7xl font-heading text-white tracking-widest uppercase mix-blend-screen drop-shadow-xl">
                    Cagliari <span className="text-crimson">Statystyki</span>
                </h1>

                <div className="flex items-center gap-3 bg-black/40 px-5 py-2.5 rounded-full border border-white/10 mt-6 shadow-2xl">
                    <span className="text-xs text-white/50 font-bold tracking-wider uppercase">ZMIEŃ ROK:</span>
                    <select 
                        value={season}
                        onChange={(e) => setSeason(parseInt(e.target.value))}
                        className="bg-transparent text-white font-bold outline-none cursor-pointer text-sm"
                    >
                        <option value="2023" className="bg-navy-dark">2023</option>
                        <option value="2024" className="bg-navy-dark">2024</option>
                        <option value="2025" className="bg-navy-dark">2025</option>
                    </select>
                </div>
                {error && <p className="text-crimson text-sm font-bold bg-crimson/10 px-4 py-2 rounded-lg border border-crimson/20 mt-4 max-w-lg mx-auto">{error}</p>}
            </header>

            {loading ? (
                <div className="flex justify-center py-20 relative z-10">
                    <div className="w-12 h-12 border-4 border-white/10 border-t-crimson rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="relative z-10 space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        
                        {/* OSTATNI MECZ */}
                        <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 md:p-10 text-center w-full shadow-2xl">
                            <h3 className="text-2xl font-heading text-white tracking-wide uppercase border-b border-white/10 pb-3 mb-8 w-full text-left opacity-90">Ostatni Mecz</h3>
                            {lastMatch ? (
                                <div className="flex flex-col items-center w-full">
                                    <div className="text-xs uppercase tracking-widest text-white/40 mb-6 font-semibold">
                                        {new Date(lastMatch.fixture.date).toLocaleDateString('pl-PL')} &bull; {lastMatch.league.name}
                                    </div>
                                    <div className="flex items-center justify-between w-full px-2 sm:px-8">
                                        <div className="flex flex-col items-center w-[30%]">
                                            <img src={lastMatch.teams.home.logo} className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-2xl mb-4" alt="Home" />
                                            <span className="text-sm font-bold text-white uppercase truncate w-full text-center tracking-wider">{lastMatch.teams.home.name.substring(0,3)}</span>
                                        </div>
                                        <div className="w-[40%] text-center">
                                            <h2 className="font-heading text-6xl sm:text-7xl font-black text-white px-2 tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                                {lastMatch.goals.home} - {lastMatch.goals.away}
                                            </h2>
                                        </div>
                                        <div className="flex flex-col items-center w-[30%]">
                                            <img src={lastMatch.teams.away.logo} className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-2xl mb-4" alt="Away" />
                                            <span className="text-sm font-bold text-white uppercase truncate w-full text-center tracking-wider">{lastMatch.teams.away.name.substring(0,3)}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-white/40 py-10">Brak rozegranych meczów w tym sezonie.</p>
                            )}
                        </section>

                         {/* NAJBLIŻSZY LUB LIVE MECZ */}
                         <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 md:p-10 text-center w-full flex flex-col h-full shadow-2xl relative overflow-hidden">
                            {liveMatch ? (
                                <>
                                    <div className="absolute inset-0 bg-crimson/5 blur-[80px] -z-10 animate-pulse pointer-events-none"></div>
                                    <h3 className="text-2xl font-heading text-white tracking-wide uppercase border-b border-white/10 pb-3 mb-8 w-full text-left flex items-center gap-3">
                                        <span className="w-3 h-3 bg-crimson rounded-full shadow-[0_0_15px_rgba(200,16,46,1)]"></span>
                                        Mecz Na Żywo
                                    </h3>
                                    <div className="flex flex-col items-center w-full py-4 mt-auto mb-auto">
                                        <span className="bg-crimson/20 border border-crimson/50 text-white text-[10px] font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest">MIN: {liveMatch.fixture.status.elapsed}'</span>
                                        <div className="flex items-center gap-8 justify-center w-full px-6">
                                            <img src={liveMatch.teams.home.logo} className="w-20 h-20 object-contain drop-shadow-2xl" />
                                            <div className="font-heading text-6xl text-crimson drop-shadow-[0_0_20px_rgba(200,16,46,0.6)]">
                                                {liveMatch.goals.home} : {liveMatch.goals.away}
                                            </div>
                                            <img src={liveMatch.teams.away.logo} className="w-20 h-20 object-contain drop-shadow-2xl" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-heading text-white tracking-wide uppercase border-b border-white/10 pb-3 mb-6 w-full text-left flex items-center gap-3 opacity-40">
                                        <span className="w-3 h-3 bg-white/20 rounded-full"></span>
                                        Mecz Na Żywo
                                    </h3>
                                    <div className="py-4">
                                        <p className="text-white/30 text-lg font-light">Aktualnie Cagliari nie rozgrywa żadnego spotkania.</p>
                                    </div>
                                    
                                    {nextMatch && (
                                        <div className="mt-auto border border-white/5 bg-black/60 p-6 rounded-2xl shadow-xl w-full">
                                            <h4 className="text-white font-heading text-xl tracking-widest uppercase mb-5 text-left border-b border-white/5 pb-2">Najbliższy Mecz:</h4>
                                            <div className="flex items-center justify-between w-full text-left">
                                                <div>
                                                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">{nextMatch.league.name}</p>
                                                    <p className="text-white font-heading text-3xl tracking-wide leading-none">
                                                        {new Date(nextMatch.fixture.date).toLocaleDateString('pl-PL', { day:'2-digit', month: '2-digit', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-crimson font-bold tracking-widest mt-2 text-lg">
                                                        {new Date(nextMatch.fixture.date).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                <div className="text-white/10 text-3xl font-light italic px-4">vs</div>
                                                <div className="flex flex-col items-center justify-center min-w-[100px]">
                                                    <img src={nextMatch.teams.home.id === TEAM_ID ? nextMatch.teams.away.logo : nextMatch.teams.home.logo} className="w-16 h-16 object-contain drop-shadow-lg mb-2" />
                                                    <span className="text-white/90 font-bold uppercase text-xs truncate max-w-[100px] text-center w-full">
                                                        {nextMatch.teams.home.id === TEAM_ID ? nextMatch.teams.away.name : nextMatch.teams.home.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </section>

                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* TABELA */}
                        <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 md:p-8 w-full overflow-hidden shadow-2xl">
                            <h3 className="text-2xl font-heading text-white tracking-wide uppercase border-b border-white/10 pb-3 mb-6">Tabela Serie A</h3>
                            <div className="overflow-x-auto custom-scroll">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="text-[10px] uppercase tracking-wider text-white/40 border-b border-white/5">
                                        <tr>
                                            <th className="py-3 px-2 font-bold">Poz</th>
                                            <th className="py-3 px-2 font-bold">Klub</th>
                                            <th className="py-3 px-1 text-center font-bold">M</th>
                                            <th className="py-3 px-1 text-center font-bold">+/-</th>
                                            <th className="py-3 px-1 text-center text-crimson font-bold">Pkt</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-white/70">
                                        {standings && standings.length > 0 ? standings.map(row => (
                                            <tr key={row.team.id} className={row.team.id === TEAM_ID ? "bg-crimson/10 border-l-2 border-crimson text-white font-bold" : "hover:bg-white/5 transition-colors"}>
                                                <td className="py-3 px-2">{row.rank}</td>
                                                <td className="py-3 px-2 flex items-center gap-3">
                                                    <img src={row.team.logo} className="w-6 h-6 object-contain" />
                                                    <span className="truncate max-w-[140px] tracking-wide">{row.team.name}</span>
                                                </td>
                                                <td className="py-3 px-1 text-center">{row.all.played}</td>
                                                <td className="py-3 px-1 text-center text-[11px] text-white/50 tracking-wider font-mono">{row.all.goals.for}:{row.all.goals.against}</td>
                                                <td className="py-3 px-1 text-center text-white text-base font-bold">{row.points}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="5" className="text-center py-8 text-white/30">Brak danych dla tego sezonu.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* KADRA - PIONOWA SZYKOWNA LISTA */}
                        <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 md:p-8 w-full shadow-2xl">
                            <h3 className="text-2xl font-heading text-white tracking-wide uppercase border-b border-white/10 pb-3 mb-8">Kadra Zespołu</h3>
                            {squad.length > 0 ? (
                                <div className="flex flex-col items-center">
                                    {renderSquadGroups()}
                                </div>
                            ) : (
                                <p className="text-white/40 py-10 text-center">Brak powołanych graczy na ten sezon.</p>
                            )}
                        </section>
                    </div>
                </div>
            )}
        </main>
    );
}
