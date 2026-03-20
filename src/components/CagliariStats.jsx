import React, { useState, useEffect } from 'react';
import { useTranslation } from '../LanguageContext';

const API_KEY = 'cef830252713a75968dd501948b06464';
const BASE_URL = 'https://v3.football.api-sports.io';
const LEAGUE_ID = 135; 
const TEAM_ID = 490;   
const CACHE_TTL = 3 * 60 * 60 * 1000; 

async function fetchWithCache(endpoint, forceRefresh = false) {
    const cacheKey = `api_cache_${endpoint}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached && !forceRefresh) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
            return data;
        }
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        headers: { "x-apisports-key": API_KEY }
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    if (data.errors && Object.keys(data.errors).length > 0) {
        console.error("API Error: ", data.errors);
        return data;
    }

    localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: data
    }));

    return data;
}

const FIFA_CARD_STYLES = "relative w-24 h-36 md:w-28 md:h-40 bg-gradient-to-br from-[#800020] via-[#5a0016] to-[#3a000e] rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-yellow-600/30 overflow-hidden transform transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(220,20,60,0.4)] flex flex-col items-center group cursor-pointer text-white mx-auto";

export default function CagliariStats() {
    const { t, language } = useTranslation();
    const [currentSeason, setCurrentSeason] = useState(2025);
    
    // State
    const [loading, setLoading] = useState(true);
    const [standings, setStandings] = useState([]);
    const [lastMatch, setLastMatch] = useState(null);
    const [liveMatch, setLiveMatch] = useState(null);
    const [nextMatch, setNextMatch] = useState(null);
    const [startingXI, setStartingXI] = useState([]);
    const [substitutes, setSubstitutes] = useState([]);
    const [squadFallback, setSquadFallback] = useState([]);
    const [apiError, setApiError] = useState(null);

    const handleSeasonChange = (e) => {
        setCurrentSeason(parseInt(e.target.value));
    };

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            setLoading(true);
            try {
                const forceRefresh = true; // Always bypass local cache when explicitly loading a season for exact updates as user requested
                
                // 1. Fetch Squad config to get photos
                const squadData = await fetchWithCache(`/players/squads?team=${TEAM_ID}`, false);
                const squadMap = new Map();
                let rawSquad = [];
                if (squadData.response && squadData.response.length > 0) {
                    rawSquad = squadData.response[0].players;
                    rawSquad.forEach(p => squadMap.set(p.id, p));
                }

                // 2. Fetch Fixtures
                const fixturesData = await fetchWithCache(`/fixtures?team=${TEAM_ID}&season=${currentSeason}`, forceRefresh);
                if (fixturesData.errors && Object.keys(fixturesData.errors).length > 0) {
                    if (isMounted) setApiError(Object.values(fixturesData.errors).join(' | '));
                    if (isMounted) setLoading(false);
                    return;
                }
                if (isMounted) setApiError(null);
                
                let liver = null;
                let lastr = null;
                if (fixturesData.response) {
                    const allFixtures = fixturesData.response;
                    const finished = allFixtures.filter(f => ['Match Finished', 'FT', 'PEN', 'AET'].includes(f.fixture.status.long) || ['FT','PEN','AET'].includes(f.fixture.status.short));
                    finished.sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date));
                    
                    const upcoming = allFixtures.filter(f => !['Match Finished', 'FT', 'PEN', 'AET', 'CANC', 'PST', 'ABD'].includes(f.fixture.status.long) && !['FT','PEN','AET','CANC','PST','ABD'].includes(f.fixture.status.short));
                    upcoming.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

                    const live = allFixtures.find(f => ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'].includes(f.fixture.status.short));

                    if(isMounted) {
                        lastr = finished.length > 0 ? finished[0] : null;
                        setLastMatch(lastr);
                        setNextMatch(upcoming.length > 0 ? upcoming[0] : null);
                        liver = live || null;
                        setLiveMatch(liver);
                    }
                }

                // 3. Lineups
                const matchForLineups = liver || lastr;
                let usedLineup = false;
                if (matchForLineups) {
                    const lineupsData = await fetchWithCache(`/fixtures/lineups?fixture=${matchForLineups.fixture.id}`, forceRefresh);
                    if (lineupsData.response && lineupsData.response.length > 0) {
                        const cagliariLineup = lineupsData.response.find(team => team.team.id === TEAM_ID);
                        if (cagliariLineup && isMounted) {
                            usedLineup = true;
                            const mapWithPhoto = (pArr) => pArr.map(item => {
                                const p = item.player;
                                const profile = squadMap.get(p.id);
                                return { ...p, photo: profile?.photo || 'https://media.api-sports.io/football/players/1.png' }; 
                            });
                            setStartingXI(mapWithPhoto(cagliariLineup.startXI || []));
                            setSubstitutes(mapWithPhoto(cagliariLineup.substitutes || []));
                        }
                    }
                }

                if (!usedLineup && isMounted) {
                    setStartingXI([]);
                    setSubstitutes([]);
                    setSquadFallback(rawSquad);
                }

                // 4. Standings
                const standingsData = await fetchWithCache(`/standings?league=${LEAGUE_ID}&season=${currentSeason}`, forceRefresh);
                if (standingsData.response && standingsData.response.length > 0 && isMounted) {
                    setStandings(standingsData.response[0].league.standings[0] || []);
                }
            } catch (err) {
                console.error("API fetch error", err);
            }
            if (isMounted) setLoading(false);
        };
        loadData();
        return () => { isMounted = false; };
    }, [currentSeason]);

    const renderPitch = (players, isLineup) => {
        if (players.length === 0) return null;
        
        let goalkeepers, defenders, midfielders, attackers;

        if (isLineup) {
            goalkeepers = players.filter(p => p.pos === 'G');
            defenders = players.filter(p => p.pos === 'D');
            midfielders = players.filter(p => p.pos === 'M');
            attackers = players.filter(p => p.pos === 'F');
        } else {
            goalkeepers = players.filter(p => p.position === 'Goalkeeper');
            defenders = players.filter(p => p.position === 'Defender');
            midfielders = players.filter(p => p.position === 'Midfielder');
            attackers = players.filter(p => p.position === 'Attacker');
        }

        const renderRow = (rowPlayers) => (
            <div className="flex flex-row justify-center gap-2 md:gap-6 w-full z-10 mb-4 md:mb-8">
                {rowPlayers.map(p => (
                    <div key={p.id} className={FIFA_CARD_STYLES}>
                        <div className="absolute top-1 left-2 text-yellow-500 font-bold text-lg">{p.number}</div>
                        <div className="w-12 h-12 md:w-16 md:h-16 mt-4 rounded-full overflow-hidden border-2 border-yellow-600/50 shadow-inner bg-black/50">
                            <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="mt-2 text-[10px] md:text-xs font-bold text-center leading-tight px-1 w-full truncate">
                            {p.name.split(' ').pop()}
                        </div>
                    </div>
                ))}
            </div>
        );

        return (
            <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-white/20 shadow-2xl mt-6">
                <div className="absolute inset-0 bg-[#2d5a27] z-0">
                    <div className="absolute top-0 left-0 w-full h-full border-[3px] border-white/50 pointer-events-none p-4"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 border-[3px] border-t-0 border-white/50 pointer-events-none"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-12 border-[3px] border-t-0 border-white/50 pointer-events-none"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 border-[3px] border-white/50 rounded-b-full pointer-events-none" style={{ clipPath: 'inset(100% 0 0 0)'}}></div>
                    
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-[3px] border-b-0 border-white/50 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-12 border-[3px] border-b-0 border-white/50 pointer-events-none"></div>
                    
                    <div className="absolute top-1/2 left-0 w-full h-[3px] bg-white/50 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-[3px] border-white/50 rounded-full pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full pointer-events-none"></div>
                </div>

                <div className="relative z-10 w-full h-full flex flex-col justify-end pt-8 pb-4 items-center gap-2 md:gap-4 px-2">
                    {renderRow(attackers)}
                    {renderRow(midfielders)}
                    {renderRow(defenders)}
                    {renderRow(goalkeepers)}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header & Season Selector */}
            <div className="flex flex-col items-center text-center mb-12 gap-8 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div>
                    <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-bold tracking-[0.2em] text-white/50 mb-4">SEZON {currentSeason} / {currentSeason+1}</span>
                    <h2 className="text-5xl md:text-7xl font-heading text-white tracking-widest uppercase">
                        {t('cagliari_stats_title').split(' ')[0]} <span className="text-crimson">{t('cagliari_stats_title').split(' ').slice(1).join(' ')}</span>
                    </h2>
                </div>
                <div className="flex flex-col mx-auto sm:flex-row items-center gap-4 bg-black/50 px-8 py-4 rounded-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <span className="text-xs text-white/50 font-bold tracking-widest uppercase">{t('cagliari_change_season')}</span>
                    <select 
                        className="bg-transparent text-white font-bold outline-none cursor-pointer text-xl"
                        value={currentSeason}
                        onChange={handleSeasonChange}
                    >
                        <option value="2023" className="text-black">2023 / 2024</option>
                        <option value="2024" className="text-black">2024 / 2025</option>
                        <option value="2025" className="text-black">2025 / 2026</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-crimson"></div>
                </div>
            ) : apiError ? (
                <div className="bg-red-900/40 border border-red-500 text-white p-12 rounded-3xl text-center max-w-3xl mx-auto shadow-[0_0_50px_rgba(220,20,60,0.3)]">
                    <h3 className="text-xl md:text-3xl font-bold mb-4 font-heading tracking-widest text-red-400">🚨 API LIMIT OR PLAN RESTRICTION</h3>
                    <p className="text-lg opacity-90">{apiError}</p>
                    <p className="mt-6 text-sm opacity-50 font-bold">Please select an older season (e.g., 2024) from the dropdown above to continue viewing stats if your plan blocked 2025 access.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Standings */}
                    <div className="lg:col-span-1 border-r-0 lg:border-r border-white/10 pr-0 lg:pr-8">
                        <div className="flex items-center justify-between border-b border-crimson/30 pb-4 mb-6">
                            <h3 className="text-xl md:text-2xl font-heading text-white tracking-wider flex items-center gap-3">
                                <span className="w-8 h-1 bg-crimson rounded-full"></span>
                                {t('cagliari_table')}
                            </h3>
                            <span className="text-sm text-white/50 font-bold">{currentSeason}/{currentSeason+1}</span>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl overflow-x-auto relative">
                            {standings.length > 0 ? (
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="text-white/40 border-b border-white/5">
                                        <tr>
                                            <th className="pb-3 pl-2">#</th>
                                            <th className="pb-3">Team</th>
                                            <th className="pb-3 text-center">G</th>
                                            <th className="pb-3 text-center">Pts</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {standings.map((team, index) => (
                                            <tr key={index} className={`hover:bg-white/5 transition-colors ${team.team.id === TEAM_ID ? 'bg-crimson/20 inset-0 outline outline-1 outline-crimson' : ''}`}>
                                                <td className="py-3 pl-2 font-bold text-white/70">{team.rank}</td>
                                                <td className="py-3 font-semibold text-white flex items-center gap-3">
                                                    <img src={team.team.logo} alt={team.team.name} className="w-6 h-6 object-contain" />
                                                    {team.team.name}
                                                </td>
                                                <td className="py-3 text-center text-white/70">{team.all.played}</td>
                                                <td className="py-3 text-center font-bold text-crimson">{team.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center text-white/50 py-8 text-sm italic">Brak danych dla sezonu {currentSeason} / No data</div>
                            )}
                        </div>
                    </div>

                    {/* Middle Column: Matches */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Last Match */}
                            <div className="flex-1 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-crimson/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-sm font-bold tracking-[0.2em] text-white/50 uppercase">{t('cagliari_last_match')} ({currentSeason})</h4>
                                </div>
                                
                                {lastMatch ? (
                                    <div className="flex items-center justify-between px-2 md:px-6">
                                        <div className="flex flex-col items-center gap-2">
                                            <img src={lastMatch.teams.home.logo} alt={lastMatch.teams.home.name} className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-2xl hover:scale-110 transition-transform" />
                                            <span className="text-xs md:text-sm font-bold text-white/80">{lastMatch.teams.home.name}</span>
                                        </div>
                                        <div className="flex flex-col items-center px-4">
                                            <div className="text-4xl md:text-6xl font-heading font-bold text-white tracking-widest bg-black/30 px-6 py-2 rounded-xl border border-white/10 shadow-inner">
                                                {lastMatch.goals.home} - {lastMatch.goals.away}
                                            </div>
                                            <span className="text-xs text-white/40 mt-3 font-medium uppercase tracking-wider">{new Date(lastMatch.fixture.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <img src={lastMatch.teams.away.logo} alt={lastMatch.teams.away.name} className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-2xl hover:scale-110 transition-transform" />
                                            <span className="text-xs md:text-sm font-bold text-white/80">{lastMatch.teams.away.name}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-white/50 py-4 italic">Brak meczów / No matches</div>
                                )}
                            </div>

                            {/* Next Match */}
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-center">
                                <h4 className="text-sm font-bold tracking-[0.2em] text-white/50 uppercase mb-4 text-center">{t('cagliari_next_match')} ({currentSeason})</h4>
                                {nextMatch ? (
                                    <div className="flex items-center justify-center gap-6">
                                        <div className="flex flex-col items-center">
                                            <img src={nextMatch.teams.away.id === TEAM_ID ? nextMatch.teams.home.logo : nextMatch.teams.away.logo} alt="Opponent" className="w-14 h-14 object-contain opacity-80" />
                                            <span className="text-xs text-white/60 font-bold mt-2 text-center truncate max-w-[100px]">
                                                {nextMatch.teams.away.id === TEAM_ID ? nextMatch.teams.home.name : nextMatch.teams.away.name}
                                            </span>
                                        </div>
                                        <div className="text-center flex flex-col gap-1 border-l border-white/10 pl-6 py-2">
                                            <span className="text-lg text-white font-bold">{new Date(nextMatch.fixture.date).toLocaleDateString()}</span>
                                            <span className="text-xl text-crimson font-heading">{new Date(nextMatch.fixture.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            <span className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{nextMatch.league.name}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-white/50 py-4 italic">Brak danych / No data</div>
                                )}
                            </div>
                        </div>

                        {/* Live Match */}
                        <div className="relative border border-crimson/50 rounded-2xl p-1 shadow-[0_0_30px_rgba(220,20,60,0.15)] overflow-hidden bg-[#0a0f1d] min-h-[140px] flex items-center justify-center">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-crimson via-red-500 to-crimson"></div>
                            
                            {liveMatch ? (
                                <div className="w-full flex justify-between items-center p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-4 h-4 bg-crimson rounded-full animate-ping absolute"></div>
                                        <div className="w-4 h-4 bg-crimson rounded-full relative z-10"></div>
                                        <h4 className="text-sm font-bold tracking-[0.3em] text-crimson uppercase">{t('cagliari_live_match')}</h4>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="font-bold text-xl">{liveMatch.teams.home.name}</span>
                                        <div className="bg-crimson text-white px-4 py-2 rounded-lg font-bold text-3xl shadow-lg border border-red-400">
                                            {liveMatch.goals.home} - {liveMatch.goals.away}
                                        </div>
                                        <span className="font-bold text-xl">{liveMatch.teams.away.name}</span>
                                    </div>
                                    <div className="text-crimson font-bold text-lg">{liveMatch.fixture.status.elapsed}' min.</div>
                                </div>
                            ) : (
                                <div className="text-center w-full px-6">
                                    <p className="text-white/60 italic text-lg">{t('cagliari_no_live')}</p>
                                </div>
                            )}
                        </div>

                        {/* Squad / Lineups */}
                        <div className="mt-8 relative mb-12">
                            <h3 className="text-2xl font-heading text-white tracking-widest uppercase mb-6 text-center">
                                {startingXI.length > 0 ? t('cagliari_starting_xi') : t('cagliari_squad')}
                                <span className="text-crimson ml-2">({currentSeason})</span>
                            </h3>

                            {startingXI.length > 0 ? (
                                <>
                                    {renderPitch(startingXI, true)}
                                    
                                    <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <h4 className="text-xl font-heading text-white tracking-widest uppercase mb-6 text-center border-b border-white/10 pb-4">
                                            {t('cagliari_substitutes')}
                                        </h4>
                                        <div className="flex flex-wrap justify-center gap-4">
                                            {substitutes.map(p => (
                                                <div key={p.id} className="flex flex-col items-center gap-2 bg-black/40 p-4 rounded-xl border border-white/5 hover:border-crimson/50 transition-colors cursor-pointer w-24">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                                                        <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="text-yellow-500 font-bold text-sm">{p.number}</span>
                                                    <span className="text-[10px] text-white font-semibold text-center truncate w-full">{p.name.split(' ').pop()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                renderPitch(squadFallback, false)
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
