"use client";

import React, { useEffect, useState } from "react";

function App() {
  // Character Portrait URLs
  const CHARACTER_PORTRAITS = {
    SERVITE: [
      'https://cdn.abacus.ai/images/4b4b3e8c-d880-4cfa-8e41-19aebba07b7b.png',
      'https://cdn.abacus.ai/images/f66f7764-8611-40e8-8e7d-7c7c8b6a0f48.png',
      'https://cdn.abacus.ai/images/07098bea-4586-403c-ac45-99bcf19e9dd2.png'
    ],
    VECTORON: [
      'https://cdn.abacus.ai/images/a822938f-3634-493c-84e4-a03ad213f705.png',
      'https://cdn.abacus.ai/images/d01b52cb-2ccc-4504-81b9-18b046950f91.png',
      'https://cdn.abacus.ai/images/8bcd49ad-cf7c-4b2a-9ce6-bc4512c55acd.png'
    ],
    TEKK: [
      'https://cdn.abacus.ai/images/83cd1a73-bb59-40f2-9049-7bd14214c78f.png',
      'https://cdn.abacus.ai/images/7a7bd66a-86a8-4ff9-861a-1b1d95366904.png',
      'https://cdn.abacus.ai/images/eabfa150-e755-442d-8a57-e4f93b37e030.png'
    ]
  };

  // State
  const [gameState, setGameState] = useState('menu');
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [battlefield, setBattlefield] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [turnOrder, setTurnOrder] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [draggedGear, setDraggedGear] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [battleAnimation, setBattleAnimation] = useState(null);

  // Data
  const MODEL_TYPES = {
    SERVITE: { name: 'Servite', speed: 9, agility: 8, defense: 5, power: 3, energyCostMod: 1.0, description: 'Fast and agile, but lack strength' },
    VECTORON: { name: 'Vectoron', speed: 3, agility: 4, defense: 9, power: 9, energyCostMod: 1.0, description: 'Strong and tough, but move slow' },
    TEKK: { name: 'Tekk', speed: 6, agility: 6, defense: 10, power: 7, energyCostMod: 1.5, description: 'Incredibly tough and versatile, but abilities cost extra energy' }
  };

  const CLASSES = {
    OMEGA: { name: 'Omega', size: 5, energy: 150, power: 1.5, slots: 5 },
    DELTA: { name: 'Delta', size: 4, energy: 120, power: 1.3, slots: 4 },
    GAMMA: { name: 'Gamma', size: 3, energy: 100, power: 1.1, slots: 3 },
    BETA: { name: 'Beta', size: 2, energy: 80, power: 0.9, slots: 2 },
    ALPHA: { name: 'Alpha', size: 1, energy: 60, power: 0.7, slots: 1 }
  };

  const COMPANIES = ['Apex Industries', 'Nexus Corp', 'Titan Forge', 'Velocity Systems', 'Guardian Tech', 'Iron Works'];

  const GEAR_TYPES = [
    { id: 1, name: 'Plasma Rifle', type: 'weapon', attack: 25, energy: 15, stat: 'power', bonus: 2, icon: '🔫' },
    { id: 2, name: 'Energy Shield', type: 'armor', attack: 0, energy: 20, stat: 'defense', bonus: 3, icon: '🛡️' },
    { id: 3, name: 'Boost Thrusters', type: 'mobility', attack: 0, energy: 10, stat: 'speed', bonus: 2, icon: '🚀' },
    { id: 4, name: 'Missile Launcher', type: 'weapon', attack: 40, energy: 30, stat: 'power', bonus: 1, icon: '🚀' },
    { id: 5, name: 'Repair Kit', type: 'support', attack: -30, energy: 25, stat: 'defense', bonus: 1, icon: '🔧' },
    { id: 6, name: 'Laser Blade', type: 'weapon', attack: 20, energy: 12, stat: 'agility', bonus: 2, icon: '⚔️' },
    { id: 7, name: 'Heavy Armor', type: 'armor', attack: 0, energy: 0, stat: 'defense', bonus: 4, icon: '🛡️' },
    { id: 8, name: 'Targeting System', type: 'tech', attack: 15, energy: 10, stat: 'agility', bonus: 3, icon: '🎯' },
    { id: 9, name: 'Power Core', type: 'tech', attack: 0, energy: -20, stat: 'power', bonus: 2, icon: '⚡' },
    { id: 10, name: 'Railgun', type: 'weapon', attack: 35, energy: 25, stat: 'power', bonus: 3, icon: '💥' }
  ];

  const MISSIONS = [
    { id: 1, name: 'Rust Harbor', difficulty: 'Easy', enemies: 3, rewards: ['Plasma Rifle', 'Energy Shield'], position: { x: 20, y: 30 } },
    { id: 2, name: 'Scrap Valley', difficulty: 'Easy', enemies: 4, rewards: ['Boost Thrusters', 'Repair Kit'], position: { x: 45, y: 25 } },
    { id: 3, name: 'Iron Peaks', difficulty: 'Medium', enemies: 5, rewards: ['Missile Launcher', 'Heavy Armor'], position: { x: 60, y: 50 } },
    { id: 4, name: 'Forge Ruins', difficulty: 'Medium', enemies: 5, rewards: ['Laser Blade', 'Targeting System'], position: { x: 30, y: 60 } },
    { id: 5, name: 'Steel Citadel', difficulty: 'Hard', enemies: 6, rewards: ['Railgun', 'Power Core'], position: { x: 70, y: 70 } }
  ];

  // Helpers
  const generateRoster = () => {
    const roster = [];
    const models = Object.keys(MODEL_TYPES);
    const classes = Object.keys(CLASSES);

    for (let i = 0; i < 30; i++) {
      const modelKey = models[i % 3];
      const model = MODEL_TYPES[modelKey];
      const classKey = classes[i % 5];
      const classData = CLASSES[classKey];

      const portraitIndex = Math.floor(i / 3) % CHARACTER_PORTRAITS[modelKey].length;
      const portrait = CHARACTER_PORTRAITS[modelKey][portraitIndex];

      roster.push({
        id: i + 1,
        name: `${model.name}-${classData.name}-${String(i + 1).padStart(2, '0')}`,
        model: modelKey,
        class: classKey,
        company: COMPANIES[i % COMPANIES.length],
        portrait,
        level: 1,
        hp: 100 + (model.defense * 10) + (classData.size * 20),
        maxHp: 100 + (model.defense * 10) + (classData.size * 20),
        energy: classData.energy,
        maxEnergy: classData.energy,
        stats: {
          speed: model.speed,
          agility: model.agility,
          defense: model.defense,
          power: model.power * classData.power,
          attack: Math.round(15 + (model.power * classData.power * 3))
        },
        baseStats: {
          speed: model.speed,
          agility: model.agility,
          defense: model.defense,
          power: model.power * classData.power,
          attack: Math.round(15 + (model.power * classData.power * 3))
        },
        slots: classData.slots,
        equipment: [],
        energyCostMod: model.energyCostMod
      });
    }
    return roster;
  };

  const generateAbilities = (character) => {
    const abilities = [{ name: 'Basic Attack', damage: 15, cost: 0, type: 'physical', icon: '👊' }];
    character.equipment.forEach((gear) => {
      if (gear.attack !== 0) {
        const cost = Math.round(gear.energy * character.energyCostMod);
        abilities.push({
          name: gear.name,
          damage: gear.attack,
          cost,
          type: gear.type === 'support' ? 'heal' : 'physical',
          icon: gear.icon
        });
      }
    });
    return abilities;
  };

  const [roster, setRoster] = useState(generateRoster());

  useEffect(() => {
    if (inventory.length === 0) {
      setInventory([
        { ...GEAR_TYPES[0], instanceId: 'g1' },
        { ...GEAR_TYPES[1], instanceId: 'g2' },
        { ...GEAR_TYPES[2], instanceId: 'g3' },
        { ...GEAR_TYPES[5], instanceId: 'g4' },
        { ...GEAR_TYPES[6], instanceId: 'g5' }
      ]);
    }
  }, []);

  useEffect(() => {
    if (battleAnimation) {
      const timer = setTimeout(() => setBattleAnimation(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [battleAnimation]);

  const calculateStats = (character, equipment) => {
    const stats = { ...character.baseStats };
    equipment.forEach(gear => {
      stats[gear.stat] = (stats[gear.stat] || 0) + gear.bonus;
      if (gear.stat === 'power') {
        stats.attack = Math.round(character.baseStats.attack + (gear.bonus * 3));
      }
    });
    return stats;
  };

  const equipGear = (characterId, gear) => {
    const updatedRoster = roster.map(char => {
      if (char.id === characterId) {
        if (char.equipment.length < char.slots) {
          const newEquipment = [...char.equipment, gear];
          const updatedStats = calculateStats(char, newEquipment);
          return { ...char, equipment: newEquipment, stats: updatedStats };
        }
      }
      return char;
    });

    setRoster(updatedRoster);
    setInventory(inventory.filter(g => g.instanceId !== gear.instanceId));

    setSelectedTeam(selectedTeam.map(char =>
      char.id === characterId ? updatedRoster.find(c => c.id === characterId) : char
    ));
  };

  const unequipGear = (characterId, gear) => {
    const updatedRoster = roster.map(char => {
      if (char.id === characterId) {
        const newEquipment = char.equipment.filter(g => g.instanceId !== gear.instanceId);
        const updatedStats = calculateStats(char, newEquipment);
        return { ...char, equipment: newEquipment, stats: updatedStats };
      }
      return char;
    });

    setRoster(updatedRoster);
    setInventory([...inventory, gear]);

    setSelectedTeam(selectedTeam.map(char =>
      char.id === characterId ? updatedRoster.find(c => c.id === characterId) : char
    ));
  };

  const handleDragStart = (e, gear) => {
    setDraggedGear(gear);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnSlot = (e, characterId) => {
    e.preventDefault();
    if (draggedGear) {
      equipGear(characterId, draggedGear);
      setDraggedGear(null);
    }
  };

  const handleDropOnInventory = (e) => {
    e.preventDefault();
    setDraggedGear(null);
  };

  const generateTerrain = () => {
    const terrain = [];
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 10; x++) {
        terrain.push({
          x, y,
          type: Math.random() > 0.8 ? 'obstacle' : 'normal'
        });
      }
    }
    return terrain;
  };

  const generateBattlefield = (mission) => {
    const enemies = [];
    const enemyCount = mission.enemies;
    const difficultyMod = mission.difficulty === 'Easy' ? 0.8 : mission.difficulty === 'Medium' ? 1.0 : 1.3;

    for (let i = 0; i < enemyCount; i++) {
      enemies.push({
        id: `enemy-${i}`,
        name: `Hostile Unit ${i + 1}`,
        hp: Math.round((80 + Math.floor(Math.random() * 40)) * difficultyMod),
        maxHp: Math.round((80 + Math.floor(Math.random() * 40)) * difficultyMod),
        energy: 100,
        maxEnergy: 100,
        stats: {
          speed: Math.round((4 + Math.floor(Math.random() * 4)) * difficultyMod),
          power: Math.round((5 + Math.floor(Math.random() * 3)) * difficultyMod),
          attack: Math.round(20 * difficultyMod)
        },
        isEnemy: true,
        position: { x: 8 + (i % 2), y: 1 + i }
      });
    }

    const playerUnits = selectedTeam.map((char, i) => ({
      ...char,
      position: { x: 1, y: 1 + i },
      isEnemy: false,
      abilities: generateAbilities(char)
    }));

    return { allies: playerUnits, enemies, terrain: generateTerrain() };
  };

  const toggleCharacterSelection = (character) => {
    if (selectedTeam.find(c => c.id === character.id)) {
      setSelectedTeam(selectedTeam.filter(c => c.id !== character.id));
    } else if (selectedTeam.length < 4) {
      setSelectedTeam([...selectedTeam, character]);
    }
  };

  const startMission = (mission) => {
    setSelectedMission(mission);
    const field = generateBattlefield(mission);
    setBattlefield(field);

    const allUnits = [...field.allies, ...field.enemies];
    const sorted = allUnits.sort((a, b) => b.stats.speed - a.stats.speed);
    setTurnOrder(sorted);
    setCurrentTurn(0);
    setSelectedTarget(null);

    setGameState('battle');
  };

  const executeAction = (actor, target, ability) => {
    if (!battlefield) return;
    if (actor.energy < ability.cost) return;

    const newBattlefield = { ...battlefield };
    actor.energy -= ability.cost;

    let amount = 0;
    if (ability.type === 'heal') {
      const healAmount = -ability.damage;
      target.hp = Math.min(target.maxHp, target.hp + healAmount);
      amount = healAmount;
    } else {
      const damage = ability.damage + Math.round(actor.stats.power * 2);
      target.hp = Math.max(0, target.hp - damage);
      amount = damage;
    }

    setBattleAnimation({
      targetId: target.id,
      abilityIcon: ability.icon,
      abilityName: ability.name,
      damage: amount,
      isHeal: ability.type === 'heal'
    });

    if (target.isEnemy) {
      newBattlefield.enemies = newBattlefield.enemies.filter(e => e.hp > 0);
    } else {
      newBattlefield.allies = newBattlefield.allies.filter(a => a.hp > 0);
    }

    setBattlefield(newBattlefield);
    setSelectedTarget(null);

    if (newBattlefield.enemies.length === 0) {
      if (selectedMission) {
        const newGear = selectedMission.rewards.map((rewardName, idx) => {
          const gearTemplate = GEAR_TYPES.find(g => g.name === rewardName);
          return { ...gearTemplate, instanceId: `reward-${Date.now()}-${idx}` };
        });
        setInventory([...inventory, ...newGear]);
      }
      setTimeout(() => setGameState('victory'), 1500);
    } else if (newBattlefield.allies.length === 0) {
      setTimeout(() => setGameState('defeat'), 1500);
    } else {
      setTimeout(() => nextTurn(), 800);
    }
  };

  const nextTurn = () => {
    const nextTurnIndex = (currentTurn + 1) % turnOrder.length;
    const nextUnit = turnOrder[nextTurnIndex];
    if (nextUnit) nextUnit.energy = Math.min(nextUnit.maxEnergy, nextUnit.energy + 10);
    setCurrentTurn(nextTurnIndex);
    setSelectedTarget(null);
  };

  const TeamOverview = ({ team, inBattle = false, currentUnitId = null }) => {
    const displayTeam = inBattle ? battlefield?.allies || [] : team;
    const paddedTeam = [...displayTeam];
    while (paddedTeam.length < 4) paddedTeam.push(null);

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
                        ? 'bg-blue-700 border-yellow-400 shadow-lg shadow-yellow-400/50 transform scale-105'
                        : 'bg-gray-700 border-blue-500'
                      : 'bg-gray-900 border-gray-700'
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

                        <div className="mb-1">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-green-400">HP</span>
                            <span className="text-green-400">{char.hp}/{char.maxHp}</span>
                          </div>
                          <div className="w-full bg-gray-900 h-2 rounded">
                            <div className="bg-green-500 h-2 rounded transition-all" style={{ width: `${(char.hp / char.maxHp) * 100}%` }} />
                          </div>
                        </div>

                        <div className="mb-1">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-blue-400">EN</span>
                            <span className="text-blue-400">{char.energy}/{char.maxEnergy}</span>
                          </div>
                          <div className="w-full bg-gray-900 h-2 rounded">
                            <div className="bg-blue-500 h-2 rounded transition-all" style={{ width: `${(char.energy / char.maxEnergy) * 100}%` }} />
                          </div>
                        </div>

                        <div className="mb-1">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-red-400">ATK</span>
                            <span className="text-red-400">{char.stats.attack}</span>
                          </div>
                          <div className="w-full bg-gray-900 h-1.5 rounded">
                            <div className="bg-red-500 h-1.5 rounded" style={{ width: `${Math.min((char.stats.attack / 50) * 100, 100)}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-yellow-400">DEF</span>
                            <span className="text-yellow-400">{char.stats.defense}</span>
                          </div>
                          <div className="w-full bg-gray-900 h-1.5 rounded">
                            <div className="bg-yellow-500 h-1.5 rounded" style={{ width: `${Math.min((char.stats.defense / 15) * 100, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-20 text-gray-600 text-xs">
                      Empty Slot
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-3 mb-4">
        <h3 className="text-sm font-bold mb-2 text-center">SQUAD OVERVIEW</h3>
        <div className="grid grid-cols-2 gap-2">
          {paddedTeam.slice(0, 4).map((char, idx) => (
            <div
              key={idx}
              className={`${char ? 'bg-gray-700' : 'bg-gray-900'} rounded p-2 border ${char ? 'border-blue-500' : 'border-gray-700'}`}
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
                        <div className="bg-green-500 h-1.5 rounded" style={{ width: `${(char.hp / char.maxHp) * 100}%` }} />
                      </div>
                    </div>

                    <div className="mb-1">
                      <div className="text-blue-400 text-xs">EN</div>
                      <div className="w-full bg-gray-900 h-1.5 rounded">
                        <div className="bg-blue-500 h-1.5 rounded" style={{ width: `${(char.energy / char.maxEnergy) * 100}%` }} />
                      </div>
                    </div>

                    <div className="mb-1">
                      <div className="text-red-400 text-xs">ATK</div>
                      <div className="w-full bg-gray-900 h-1 rounded">
                        <div className="bg-red-500 h-1 rounded" style={{ width: `${Math.min((char.stats.attack / 50) * 100, 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="text-yellow-400 text-xs">DEF</div>
                      <div className="w-full bg-gray-900 h-1 rounded">
                        <div className="bg-yellow-500 h-1 rounded" style={{ width: `${Math.min((char.stats.defense / 15) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-16 text-gray-600 text-xs">
                  Empty Slot
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <h1 className="text-4xl font-bold mb-2">IRON ISLAND</h1>
      <h2 className="text-xl mb-8 text-gray-400">Mech Squad RPG</h2>
      <div className="flex flex-col gap-4">
        <button onClick={() => setGameState('roster')} className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-xl font-semibold">
          Select Squad
        </button>
        <button onClick={() => setGameState('equipment')} className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg text-xl font-semibold">
          Equipment
        </button>
        <button
          onClick={() => setGameState('orbitalMap')}
          className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg text-xl font-semibold"
          disabled={selectedTeam.length !== 4}
        >
          Orbital Map {selectedTeam.length !== 4 && '(Select 4 Units)'}
        </button>
      </div>

      {selectedTeam.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <TeamOverview team={selectedTeam} />
        </div>
      )}
    </div>
  );

  const renderRoster = () => (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4">Select Your Squad ({selectedTeam.length}/4)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {roster.map(char => {
              const modelData = MODEL_TYPES[char.model];
              const classData = CLASSES[char.class];

              return (
                <div
                  key={char.id}
                  onClick={() => toggleCharacterSelection(char)}
                  className={`p-3 rounded cursor-pointer border-2 flex gap-3 ${
                    selectedTeam.find(c => c.id === char.id)
                      ? 'bg-green-600 border-green-400'
                      : 'bg-gray-800 border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <img src={char.portrait} alt={char.name} className="w-20 h-20 rounded object-cover" />
                  <div className="flex-1">
                    <div className="font-bold">{char.name}</div>
                    <div className="text-sm text-gray-300">{modelData.name} - {classData.name}</div>
                    <div className="text-xs text-yellow-300">{char.company}</div>
                    <div className="mt-1 text-xs">
                      <div>HP: {char.maxHp} | EN: {char.maxEnergy}</div>
                      <div>ATK: {char.stats.attack} | DEF: {char.stats.defense}</div>
                      <div>Slots: {char.equipment.length}/{char.slots}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={() => setGameState('menu')} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold">
            Back to Menu
          </button>
        </div>

        {selectedTeam.length > 0 && (
          <div className="w-80">
            <TeamOverview team={selectedTeam} />
          </div>
        )}
      </div>
    </div>
  );

  const renderEquipment = () => (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-3xl font-bold mb-4">Equipment Management</h2>

      {selectedTeam.length === 0 ? (
        <div className="text-gray-400 mb-4">Please select a squad first</div>
      ) : (
        <div className="flex gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-3">Squad Members</h3>
            <div className="space-y-3">
              {selectedTeam.map(char => {
                const currentChar = roster.find(c => c.id === char.id);
                const emptySlots = currentChar.slots - currentChar.equipment.length;

                return (
                  <div key={char.id} className="bg-gray-800 p-4 rounded border-2 border-gray-600">
                    <div className="flex gap-3 mb-3">
                      <img src={currentChar.portrait} alt={currentChar.name} className="w-20 h-20 rounded object-cover" />
                      <div className="flex-1">
                        <div className="font-bold text-lg">{currentChar.name}</div>
                        <div className="text-sm text-gray-400">
                          {MODEL_TYPES[currentChar.model].name} - {CLASSES[currentChar.class].name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ATK: {currentChar.stats.attack} | DEF: {currentChar.stats.defense} | 
                          SPD: {currentChar.stats.speed} | AGI: {currentChar.stats.agility}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {currentChar.equipment.map(gear => (
                        <div
                          key={gear.instanceId}
                          draggable
                          onDragStart={(e) => { unequipGear(currentChar.id, gear); handleDragStart(e, gear); }}
                          className="bg-blue-700 border-2 border-blue-500 rounded-lg p-3 cursor-move hover:bg-blue-600 transition-colors w-24 h-24 flex flex-col items-center justify-center"
                        >
                          <div className="text-2xl mb-1">{gear.icon}</div>
                          <div className="text-xs text-center truncate w-full">{gear.name}</div>
                        </div>
                      ))}

                      {Array.from({ length: emptySlots }).map((_, idx) => (
                        <div
                          key={`empty-${idx}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDropOnSlot(e, currentChar.id)}
                          className="bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg w-24 h-24 flex items-center justify-center hover:border-blue-400 hover:bg-gray-600 transition-colors"
                        >
                          <div className="text-gray-500 text-xs">Drop Here</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-80">
            <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-4 sticky top-4">
              <h3 className="text-xl font-bold mb-3">Available Equipment ({inventory.length})</h3>
              <div className="space-y-2 max-h-screen overflow-y-auto" onDragOver={handleDragOver} onDrop={handleDropOnInventory}>
                {inventory.map(gear => (
                  <div
                    key={gear.instanceId}
                    draggable
                    onDragStart={(e) => handleDragStart(e, gear)}
                    className="bg-gray-700 border-2 border-gray-600 rounded-lg p-3 cursor-move hover:bg-gray-600 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">{gear.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{gear.name}</div>
                        <div className="text-xs text-gray-400">{gear.type}</div>
                      </div>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="text-green-400">+{gear.bonus} {gear.stat}</div>
                      {gear.attack !== 0 && (
                        <div className={gear.attack > 0 ? 'text-red-400' : 'text-blue-400'}>
                          {gear.attack > 0 ? `${gear.attack} dmg` : `${-gear.attack} heal`}
                        </div>
                      )}
                      <div className="text-yellow-400">{gear.energy} energy</div>
                    </div>
                  </div>
                ))}
                {inventory.length === 0 && (
                  <div className="text-gray-500 text-center py-8">
                    No equipment available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setGameState('menu')} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold mt-4">
        Back to Menu
      </button>
    </div>
  );

  const renderOrbitalMap = () => (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4">Orbital Map - Iron Island</h2>

        <div className="bg-gray-800 rounded-lg p-4 mb-4 relative" style={{ height: '400px' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900 to-gray-700 opacity-30 rounded-lg" />
          {MISSIONS.map(mission => (
            <div
              key={mission.id}
              className="absolute cursor-pointer transform hover:scale-110 transition-transform"
              style={{ left: `${mission.position.x}%`, top: `${mission.position.y}%` }}
              onClick={() => setSelectedMission(mission)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                mission.difficulty === 'Easy' ? 'bg-green-500' :
                mission.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {mission.id}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {MISSIONS.map(mission => (
            <div
              key={mission.id}
              className={`p-4 rounded cursor-pointer border-2 ${
                selectedMission?.id === mission.id
                  ? 'bg-blue-700 border-blue-400'
                  : 'bg-gray-800 border-gray-600 hover:border-gray-400'
              }`}
              onClick={() => setSelectedMission(mission)}
            >
              <div className="font-bold text-lg">{mission.name}</div>
              <div className={`text-sm ${
                mission.difficulty === 'Easy' ? 'text-green-400' :
                mission.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                Difficulty: {mission.difficulty}
              </div>
              <div className="text-sm text-gray-300">Enemies: {mission.enemies}</div>
              <div className="text-xs text-blue-300 mt-2">
                Rewards: {mission.rewards.join(', ')}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => selectedMission && startMission(selectedMission)}
            disabled={!selectedMission || selectedTeam.length !== 4}
            className={`px-6 py-3 rounded font-semibold ${
              selectedMission && selectedTeam.length === 4 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            Deploy to {selectedMission?.name || 'Mission'}
          </button>
          <button onClick={() => setGameState('menu')} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold">
            Back to Menu
          </button>
        </div>
      </div>

      <div className="w-80">
        <TeamOverview team={selectedTeam} />
      </div>
    </div>
  </div>
  );

  const renderBattle = () => {
    if (!battlefield) return null;
    const currentUnit = turnOrder[currentTurn];

    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 relative">
        {battleAnimation && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="animate-ping absolute">
              <div className="text-8xl">{battleAnimation.abilityIcon}</div>
            </div>
            <div className="relative z-10 bg-black bg-opacity-80 rounded-lg p-6 animate-bounce">
              <div className="text-4xl mb-2 text-center">{battleAnimation.abilityIcon}</div>
              <div className="text-xl font-bold text-center mb-2">{battleAnimation.abilityName}</div>
              <div className={`text-3xl font-bold text-center ${battleAnimation.isHeal ? 'text-green-400' : 'text-red-400'}`}>
                {battleAnimation.isHeal ? '+' : '-'}{Math.abs(battleAnimation.damage)}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <div className="w-72">
            <TeamOverview team={selectedTeam} inBattle={true} currentUnitId={currentUnit?.id} />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{selectedMission?.name}</h2>
            <div className="text-sm text-gray-400 mb-4">Difficulty: {selectedMission?.difficulty}</div>

            <div className="bg-blue-900 p-3 rounded mb-4">
              <div className="font-bold">{currentUnit?.name}</div>
              <div className="text-sm">
                {currentUnit?.isEnemy ? 'Enemy' : `${MODEL_TYPES[currentUnit?.model]?.name} - ${CLASSES[currentUnit?.class]?.name}`}
              </div>
              <div className="text-xs">Energy: {currentUnit?.energy}/{currentUnit?.maxEnergy}</div>
              {!currentUnit?.isEnemy && (
                <div className="text-xs text-yellow-300 mt-1">Select a target to attack</div>
              )}
            </div>

            <div className="mb-4 bg-gray-800 p-4 rounded overflow-x-auto">
              <div className="grid grid-cols-10 gap-1">
                {battlefield.terrain?.map((tile, i) => {
                  const unit = [...battlefield.allies, ...battlefield.enemies].find(
                    u => u.position.x === tile.x && u.position.y === tile.y
                  );
                  return (
                    <div
                      key={i}
                      className={`w-10 h-10 border ${tile.type === 'obstacle' ? 'bg-gray-700' : 'bg-gray-600'} flex items-center justify-center text-xs font-bold`}
                    >
                      {unit && (
                        <div className={unit.isEnemy ? 'text-red-400' : 'text-green-400'}>
                          {unit.isEnemy ? 'E' : 'A'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-bold mb-2">Enemies</h3>
              <div className="grid grid-cols-2 gap-2">
                {battlefield.enemies.map(enemy => {
                  const isSelected = selectedTarget?.id === enemy.id;
                  const isPlayerTurn = currentUnit && !currentUnit.isEnemy;

                  return (
                    <div
                      key={enemy.id}
                      className={`p-3 rounded border-2 transition-all ${
                        isSelected ? 'bg-red-700 border-yellow-400 shadow-lg shadow-yellow-400/50' : 'bg-red-900 border-red-700'
                      } ${isPlayerTurn ? 'cursor-pointer hover:border-yellow-300' : ''}`}
                      onClick={() => {
                        if (isPlayerTurn) setSelectedTarget(enemy);
                      }}
                    >
                      <div className="font-semibold text-sm">{enemy.name}</div>
                      <div className="text-xs mb-2">HP: {enemy.hp}/{enemy.maxHp}</div>
                      <div className="w-full bg-gray-700 h-2 rounded mb-2">
                        <div className="bg-red-500 h-2 rounded transition-all" style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} />
                      </div>

                      {isSelected && isPlayerTurn && currentUnit?.abilities && (
                        <div className="mt-3 pt-3 border-t border-yellow-400">
                          <div className="text-xs text-yellow-300 mb-2 font-semibold">Select Attack:</div>
                          <div className="flex gap-1 flex-wrap">
                            {currentUnit.abilities.map((ability, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); executeAction(currentUnit, enemy, ability); }}
                                disabled={currentUnit.energy < ability.cost}
                                className={`text-xs px-3 py-2 rounded font-semibold transition-all ${
                                  currentUnit.energy >= ability.cost ? 'bg-yellow-600 hover:bg-yellow-500 hover:scale-105' : 'bg-gray-600 cursor-not-allowed opacity-50'
                                }`}
                              >
                                <div>{ability.icon} {ability.name}</div>
                                <div className="text-xs opacity-75">Cost: {ability.cost}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {currentUnit?.isEnemy && (
              <div className="bg-yellow-900 p-3 rounded">
                <button
                  onClick={() => {
                    const target = battlefield.allies[Math.floor(Math.random() * battlefield.allies.length)];
                    executeAction(currentUnit, target, { name: 'Attack', damage: 20, cost: 0, type: 'physical', icon: '👊' });
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
                >
                  Execute Enemy Turn
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderEndScreen = (isVictory) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <h1 className={`text-5xl font-bold mb-4 ${isVictory ? 'text-green-400' : 'text-red-400'}`}>
        {isVictory ? 'VICTORY!' : 'DEFEAT'}
      </h1>
      {isVictory && selectedMission && (
        <div className="mb-8 text-center">
          <div className="text-xl mb-2">Mission Complete: {selectedMission.name}</div>
          <div className="text-lg text-yellow-300">Rewards Obtained:</div>
          <div className="text-md">{selectedMission.rewards.join(', ')}</div>
        </div>
      )}
      <button
        onClick={() => {
          setGameState('menu');
          setBattlefield(null);
          setSelectedMission(null);
        }}
        className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-xl font-semibold"
      >
        Return to Menu
      </button>
    </div>
  );

  return (
    <div className="w-full">
      {gameState === 'menu' && renderMenu()}
      {gameState === 'roster' && renderRoster()}
      {gameState === 'equipment' && renderEquipment()}
      {gameState === 'orbitalMap' && renderOrbitalMap()}
      {gameState === 'battle' && renderBattle()}
      {gameState === 'victory' && renderEndScreen(true)}
      {gameState === 'defeat' && renderEndScreen(false)}
    </div>
  );
}

export default function Page() {
  return <App />;
}