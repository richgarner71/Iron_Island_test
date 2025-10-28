"use client";

import React, { useEffect, useState } from "react";

function App() {
  // State
  const [gameState, setGameState] = useState("menu"); // 'menu','roster','equipment','orbitalMap','battle','victory','defeat'
  const [showLanding, setShowLanding] = useState(false);

  // Listen to TopMenu navigation events
  useEffect(() => {
    const handler = (e) => {
      const to = e.detail?.to;
      if (!to) return;
      // If battle requires prerequisites, guard as needed
      if (to === "roster" || to === "equipment" || to === "orbitalMap" || to === "battle" || to === "menu") {
        setShowLanding(false);
        setGameState(to === "menu" ? "menu" : to);
        // Remove ?view=home if present
        const url = new URL(window.location.href);
        if (url.searchParams.get("view") === "home") {
          url.searchParams.delete("view");
          window.history.replaceState({}, "", url.toString());
        }
      }
    };
    window.addEventListener("nav:go", handler);
    return () => window.removeEventListener("nav:go", handler);
  }, []);

  // Detect landing view from URL (?view=home)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isHome = params.get("view") === "home";
    setShowLanding(isHome);
  }, []);

  // ... [ALL your existing state, data, helpers remain the same below this line]
  // Due to brevity, the rest of your prior code remains unchanged EXCEPT:
  // - TeamOverview now takes prop `showNumbers`
  // - Non-battle screens pass showNumbers={false}
  // - Battle screen passes showNumbers={true}

  // [Keep all your previously provided constants, helpers, roster/inventory logic,
  // equipment drag/drop, battlefield generation, executeAction, etc.]

  // TeamOverview updated to hide numbers conditionally
  const TeamOverview = ({ team, inBattle = false, currentUnitId = null, showNumbers = false }) => {
    const displayTeam = inBattle ? battlefield?.allies || [] : team;
    const paddedTeam = [...displayTeam];
    while (paddedTeam.length < 4) paddedTeam.push(null);

    const StatBar = ({ color, valuePct, label, number }) => (
      <div className="mb-1">
        <div className="flex justify-between text-xs mb-0.5">
          <span className={color}>{label}</span>
          {showNumbers && <span className={color}>{number}</span>}
        </div>
        <div className="w-full bg-gray-900 h-2 rounded">
          <div className={`${color.replace('text-', 'bg-')} h-2 rounded transition-all`} style={{ width: `${valuePct}%` }} />
        </div>
      </div>
    );

    if (inBattle) {
      return (
        <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-3">
          <h3 className="text-sm font-bold mb-3 text-center">SQUAD STATUS</h3>
          <div className="flex flex-col gap-3">
            {paddedTeam.slice(0, 4).map((char, idx) => {
              const isCurrentTurn = char && currentUnitId === char.id;
              return (
                <div
                  key={idx}
                  className={`rounded p-3 border-2 transition-all duration-300 ${
                    char
                      ? isCurrentTurn
                        ? "bg-blue-700 border-yellow-400 shadow-lg shadow-yellow-400/50 transform scale-105"
                        : "bg-gray-700 border-blue-500"
                      : "bg-gray-900 border-gray-700"
                  }`}
                >
                  {char ? (
                    <div className="flex gap-3">
                      <img src={char.portrait} alt={char.name} className="w-20 h-20 rounded object-cover" />
                      <div className="flex-1">
                        <div className="font-bold text-sm truncate">{char.name}</div>
                        <div className="text-gray-300 text-xs mb-2">
                          {MODEL_TYPES[char.model].name}/{CLASSES[char.class].name}
                        </div>
                        <StatBar
                          color="text-green-400"
                          valuePct={(char.hp / char.maxHp) * 100}
                          label="HP"
                          number={`${char.hp}/${char.maxHp}`}
                        />
                        <StatBar
                          color="text-blue-400"
                          valuePct={(char.energy / char.maxEnergy) * 100}
                          label="EN"
                          number={`${char.energy}/${char.maxEnergy}`}
                        />
                        <div className="mb-1">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-red-400">ATK</span>
                            {showNumbers && <span className="text-red-400">{char.stats.attack}</span>}
                          </div>
                          <div className="w-full bg-gray-900 h-1.5 rounded">
                            <div
                              className="bg-red-500 h-1.5 rounded"
                              style={{ width: `${Math.min((char.stats.attack / 50) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-yellow-400">DEF</span>
                            {showNumbers && <span className="text-yellow-400">{char.stats.defense}</span>}
                          </div>
                          <div className="w-full bg-gray-900 h-1.5 rounded">
                            <div
                              className="bg-yellow-500 h-1.5 rounded"
                              style={{ width: `${Math.min((char.stats.defense / 15) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-20 text-gray-600 text-xs">Empty Slot</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Non-battle (numbers hidden by default)
    return (
      <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-3 mb-4">
        <h3 className="text-sm font-bold mb-2 text-center">SQUAD OVERVIEW</h3>
        <div className="grid grid-cols-2 gap-2">
          {paddedTeam.slice(0, 4).map((char, idx) => (
            <div
              key={idx}
              className={`${char ? "bg-gray-700" : "bg-gray-900"} rounded p-2 border ${char ? "border-blue-500" : "border-gray-700"}`}
            >
              {char ? (
                <div className="flex gap-2">
                  <img src={char.portrait} alt={char.name} className="w-16 h-16 rounded object-cover" />
                  <div className="flex-1 text-xs">
                    <div className="font-bold truncate text-xs">{char.name}</div>
                    <div className="text-gray-400 text-xs mb-1">
                      {MODEL_TYPES[char.model].name}/{CLASSES[char.class].name}
                    </div>
                    <div className="mb-1">
                      <div className="text-green-400 text-xs">HP</div>
                      <div className="w-full bg-gray-900 h-1.5 rounded">
                        <div
                          className="bg-green-500 h-1.5 rounded"
                          style={{ width: `${(char.hp / char.maxHp) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="mb-1">
                      <div className="text-blue-400 text-xs">EN</div>
                      <div className="w-full bg-gray-900 h-1.5 rounded">
                        <div
                          className="bg-blue-500 h-1.5 rounded"
                          style={{ width: `${(char.energy / char.maxEnergy) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="mb-1">
                      <div className="text-red-400 text-xs">ATK</div>
                      <div className="w-full bg-gray-900 h-1 rounded">
                        <div
                          className="bg-red-500 h-1 rounded"
                          style={{ width: `${Math.min((char.stats.attack / 50) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-yellow-400 text-xs">DEF</div>
                      <div className="w-full bg-gray-900 h-1 rounded">
                        <div
                          className="bg-yellow-500 h-1 rounded"
                          style={{ width: `${Math.min((char.stats.defense / 15) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-16 text-gray-600 text-xs">Empty Slot</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ... keep your existing renderMenu/renderRoster/renderEquipment/renderOrbitalMap/renderBattle/renderEndScreen,
  // but pass showNumbers={false} on non-battle TeamOverview, and showNumbers={true} on battle TeamOverview:
  // In roster, equipment, orbitalMap, and menu overviews: <TeamOverview team={selectedTeam} showNumbers={false} />
  // In battle sidebar: <TeamOverview team={selectedTeam} inBattle={true} currentUnitId={currentUnit?.id} showNumbers={true} />

  // Home (landing) with banner
  const renderHome = () => (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="relative w-full">
        <img
          src="/banner-iron-island.png"
          alt="Iron Island — Team in Action"
          className="w-full h-[50vh] md:h-[60vh] object-cover banner-shadow"
        />
      </section>
      <section className="max-w-4xl mx-auto p-6 text-gray-300">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">Iron Island</h1>
        <p className="text-sm md:text-base text-gray-400">
          Assemble your squad of Servites, Vectorons, and Tekks. Fight across a hostile metal world, optimize your
          gear, and command tactical victories.
        </p>
        <div className="mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
            onClick={() => {
              setShowLanding(false);
              const url = new URL(window.location.href);
              if (url.searchParams.get("view") === "home") {
                url.searchParams.delete("view");
                window.history.replaceState({}, "", url.toString());
              }
              setGameState("menu");
            }}
          >
            Enter Game
          </button>
        </div>
      </section>
    </main>
  );

  // ... your existing JSX return, with an early return for home
  if (showLanding) {
    return renderHome();
  }

  // [Keep your existing returns for gameState screens, ensuring TeamOverview props updated as noted.]

  return (
    <div className="w-full">
      {gameState === "menu" && renderMenu()}
      {gameState === "roster" && renderRoster()}
      {gameState === "equipment" && renderEquipment()}
      {gameState === "orbitalMap" && renderOrbitalMap()}
      {gameState === "battle" && renderBattle()}
      {gameState === "victory" && renderEndScreen(true)}
      {gameState === "defeat" && renderEndScreen(false)}
    </div>
  );
}

export default function Page() {
  return <App />;
}