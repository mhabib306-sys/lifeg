import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const STORAGE_KEY = 'lifeGamificationData';

const defaultDayData = {
  prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
  glucose: { avg: '', tir: '', cv: '', hypos: '', insulin: '', nop: '' },
  whoop: { sleepHours: '', sleepScore: '', hrv: '', recovery: '', strain: '', steps: '' },
  family: { mom: false, dad: false, jana: false, tia: false, ahmed: false, eman: false },
  habits: { exercise: 0, reading: 0, meditation: 0, water: '', vitamins: false, brushTeeth: 0 }
};

const WEIGHTS = {
  prayer: 10,
  glucose: { optimal: 20, acceptable: 10, tirHigh: 15, tirMid: 8, cvLow: 10, cvMid: 5, noHypo: 10, insulin: 5, nop: 2 },
  whoop: { sleepOptimal: 20, sleepAcceptable: 10, sleepScoreDivisor: 5, recoveryHigh: 15, recoveryMid: 8 },
  family: 5,
  habits: { exercise: 8, reading: 5, meditation: 10, water: 3, vitamins: 5, brushTeeth: 5 }
};

function calculateScores(data) {
  // Prayer Score
  const prayerScore = Object.values(data.prayers).filter(Boolean).length * WEIGHTS.prayer;

  // Health Score (Glucose + Whoop + NoP)
  let healthScore = 0;
  const avg = parseFloat(data.glucose.avg) || 0;
  const tir = parseFloat(data.glucose.tir) || 0;
  const cv = parseFloat(data.glucose.cv) || 0;
  const hypos = parseInt(data.glucose.hypos) || 0;
  const insulin = parseFloat(data.glucose.insulin) || 0;
  const nop = parseFloat(data.glucose.nop) || 0;

  if (avg >= 70 && avg <= 140) healthScore += WEIGHTS.glucose.optimal;
  else if (avg > 140 && avg <= 180) healthScore += WEIGHTS.glucose.acceptable;

  if (tir >= 70) healthScore += WEIGHTS.glucose.tirHigh;
  else if (tir >= 50) healthScore += WEIGHTS.glucose.tirMid;

  if (cv > 0 && cv <= 30) healthScore += WEIGHTS.glucose.cvLow;
  else if (cv > 30 && cv <= 50) healthScore += WEIGHTS.glucose.cvMid;

  if (hypos === 0 && avg > 0) healthScore += WEIGHTS.glucose.noHypo;
  if (insulin > 0) healthScore += WEIGHTS.glucose.insulin;
  healthScore += nop * WEIGHTS.glucose.nop;

  // Whoop contribution to health
  const sleepHours = parseFloat(data.whoop.sleepHours) || 0;
  const sleepScore = parseFloat(data.whoop.sleepScore) || 0;
  const recovery = parseFloat(data.whoop.recovery) || 0;

  if (sleepHours >= 7 && sleepHours <= 9) healthScore += WEIGHTS.whoop.sleepOptimal;
  else if (sleepHours >= 6) healthScore += WEIGHTS.whoop.sleepAcceptable;

  healthScore += sleepScore / WEIGHTS.whoop.sleepScoreDivisor;

  if (recovery >= 66) healthScore += WEIGHTS.whoop.recoveryHigh;
  else if (recovery >= 33) healthScore += WEIGHTS.whoop.recoveryMid;

  // Family Score
  const familyScore = Object.values(data.family).filter(Boolean).length * WEIGHTS.family;

  // Habit Score
  let habitScore = 0;
  habitScore += (parseInt(data.habits.exercise) || 0) * WEIGHTS.habits.exercise;
  habitScore += (parseInt(data.habits.reading) || 0) * WEIGHTS.habits.reading;
  habitScore += (parseInt(data.habits.meditation) || 0) * WEIGHTS.habits.meditation;
  habitScore += (parseFloat(data.habits.water) || 0) * WEIGHTS.habits.water;
  habitScore += data.habits.vitamins ? WEIGHTS.habits.vitamins : 0;
  habitScore += (parseInt(data.habits.brushTeeth) || 0) * WEIGHTS.habits.brushTeeth;

  return {
    prayer: prayerScore,
    health: Math.round(healthScore * 10) / 10,
    family: familyScore,
    habit: habitScore,
    total: Math.round((prayerScore + healthScore + familyScore + habitScore) * 10) / 10
  };
}

function Card({ title, icon, color, children }) {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    amber: 'bg-amber-600',
    slate: 'bg-slate-600',
    orange: 'bg-orange-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className={`${colorClasses[color]} px-4 py-3 flex items-center gap-2`}>
        <span className="text-xl">{icon}</span>
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer py-1">
      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-green-500' : 'bg-gray-300'}`}>
        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : ''}`} />
      </div>
      <span className="text-sm">{label}</span>
    </label>
  );
}

function NumberInput({ label, value, onChange, placeholder, unit }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600 w-24">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {unit && <span className="text-sm text-gray-500 w-12">{unit}</span>}
    </div>
  );
}

function Counter({ label, value, onChange, max = 10 }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
        >-</button>
        <span className="w-8 text-center font-semibold">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center font-bold"
        >+</button>
      </div>
    </div>
  );
}

function ScoreCard({ label, score, max, color }) {
  const percentage = max ? Math.min((score / max) * 100, 100) : 0;
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="font-bold text-lg">{score}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {max && <div className="text-xs text-gray-400 mt-1 text-right">/ {max} max</div>}
    </div>
  );
}

export default function LifeGamification() {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [allData, setAllData] = useState({});
  const [activeTab, setActiveTab] = useState('track');

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setAllData(JSON.parse(saved));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  }, [allData]);

  const todayData = allData[currentDate] || JSON.parse(JSON.stringify(defaultDayData));
  const scores = calculateScores(todayData);

  const updateData = (category, field, value) => {
    setAllData(prev => ({
      ...prev,
      [currentDate]: {
        ...todayData,
        [category]: {
          ...todayData[category],
          [field]: value
        }
      }
    }));
  };

  // Calculate weekly data for charts
  const getWeekData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = allData[dateStr] || defaultDayData;
      const dayScores = calculateScores(dayData);
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        total: dayScores.total,
        prayer: dayScores.prayer,
        health: dayScores.health,
        family: dayScores.family,
        habit: dayScores.habit
      });
    }
    return days;
  };

  // Calculate monthly stats
  const getMonthlyStats = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    let totalScore = 0;
    let daysLogged = 0;
    let totalPrayers = 0;
    let totalFamilyCheckins = 0;

    for (let day = 1; day <= now.getDate(); day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (allData[dateStr]) {
        daysLogged++;
        const dayScores = calculateScores(allData[dateStr]);
        totalScore += dayScores.total;
        totalPrayers += Object.values(allData[dateStr].prayers).filter(Boolean).length;
        totalFamilyCheckins += Object.values(allData[dateStr].family).filter(Boolean).length;
      }
    }

    return { totalScore, daysLogged, totalPrayers, totalFamilyCheckins, avgDaily: daysLogged ? Math.round(totalScore / daysLogged) : 0 };
  };

  const weekData = getWeekData();
  const monthlyStats = getMonthlyStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Life Gamification</h1>
          <p className="text-blue-100">Track habits, health & family - Level up your life</p>

          {/* Date selector */}
          <div className="mt-4 flex items-center gap-4">
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              onClick={() => setCurrentDate(new Date().toISOString().split('T')[0])}
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="flex gap-2 bg-slate-800 p-1 rounded-xl">
          {['track', 'dashboard'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                activeTab === tab
                  ? 'bg-white text-slate-800'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab === 'track' ? '📝 Daily Tracking' : '📊 Dashboard'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {activeTab === 'track' ? (
          <>
            {/* Today's Score Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <ScoreCard label="Prayer" score={scores.prayer} max={50} color="blue" />
              <ScoreCard label="Health" score={scores.health} max={80} color="green" />
              <ScoreCard label="Family" score={scores.family} max={30} color="amber" />
              <ScoreCard label="Habits" score={scores.habit} max={50} color="purple" />
              <div className="col-span-2 md:col-span-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 shadow text-white">
                <div className="text-sm opacity-90">Total Score</div>
                <div className="text-3xl font-bold">{scores.total}</div>
              </div>
            </div>

            {/* Tracking Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Prayers */}
              <Card title="Prayers" icon="🕌" color="blue">
                {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map(prayer => (
                  <Toggle
                    key={prayer}
                    label={prayer.charAt(0).toUpperCase() + prayer.slice(1)}
                    checked={todayData.prayers[prayer]}
                    onChange={(e) => updateData('prayers', prayer, !todayData.prayers[prayer])}
                  />
                ))}
              </Card>

              {/* Glucose */}
              <Card title="Glucose (Libre)" icon="💉" color="green">
                <div className="space-y-2">
                  <NumberInput label="Avg Glucose" value={todayData.glucose.avg} onChange={(v) => updateData('glucose', 'avg', v)} placeholder="mg/dL" unit="mg/dL" />
                  <NumberInput label="Time in Range" value={todayData.glucose.tir} onChange={(v) => updateData('glucose', 'tir', v)} placeholder="%" unit="%" />
                  <NumberInput label="CV" value={todayData.glucose.cv} onChange={(v) => updateData('glucose', 'cv', v)} placeholder="%" unit="%" />
                  <NumberInput label="Hypo Events" value={todayData.glucose.hypos} onChange={(v) => updateData('glucose', 'hypos', v)} placeholder="0" />
                  <NumberInput label="Insulin" value={todayData.glucose.insulin} onChange={(v) => updateData('glucose', 'insulin', v)} placeholder="units" unit="u" />
                  <NumberInput label="NoP" value={todayData.glucose.nop} onChange={(v) => updateData('glucose', 'nop', v)} placeholder="0" />
                </div>
              </Card>

              {/* Whoop */}
              <Card title="Whoop Metrics" icon="💪" color="purple">
                <div className="space-y-2">
                  <NumberInput label="Sleep Hours" value={todayData.whoop.sleepHours} onChange={(v) => updateData('whoop', 'sleepHours', v)} placeholder="7.5" unit="hrs" />
                  <NumberInput label="Sleep Score" value={todayData.whoop.sleepScore} onChange={(v) => updateData('whoop', 'sleepScore', v)} placeholder="85" unit="/100" />
                  <NumberInput label="HRV" value={todayData.whoop.hrv} onChange={(v) => updateData('whoop', 'hrv', v)} placeholder="45" unit="ms" />
                  <NumberInput label="Recovery" value={todayData.whoop.recovery} onChange={(v) => updateData('whoop', 'recovery', v)} placeholder="75" unit="%" />
                  <NumberInput label="Strain" value={todayData.whoop.strain} onChange={(v) => updateData('whoop', 'strain', v)} placeholder="12" unit="/21" />
                  <NumberInput label="Steps" value={todayData.whoop.steps} onChange={(v) => updateData('whoop', 'steps', v)} placeholder="8000" />
                </div>
              </Card>

              {/* Family */}
              <Card title="Family Check-ins" icon="👨‍👩‍👧‍👦" color="amber">
                {['mom', 'dad', 'jana', 'tia', 'ahmed', 'eman'].map(person => (
                  <Toggle
                    key={person}
                    label={person.charAt(0).toUpperCase() + person.slice(1)}
                    checked={todayData.family[person]}
                    onChange={() => updateData('family', person, !todayData.family[person])}
                  />
                ))}
              </Card>

              {/* Habits */}
              <Card title="Habits" icon="✨" color="slate">
                <Counter label="Exercise" value={todayData.habits.exercise || 0} onChange={(v) => updateData('habits', 'exercise', v)} max={5} />
                <Counter label="Reading" value={todayData.habits.reading || 0} onChange={(v) => updateData('habits', 'reading', v)} max={5} />
                <Counter label="Meditation" value={todayData.habits.meditation || 0} onChange={(v) => updateData('habits', 'meditation', v)} max={5} />
                <NumberInput label="Water" value={todayData.habits.water} onChange={(v) => updateData('habits', 'water', v)} placeholder="2.5" unit="L" />
                <div className="mt-2">
                  <Toggle label="Vitamins taken" checked={todayData.habits.vitamins} onChange={() => updateData('habits', 'vitamins', !todayData.habits.vitamins)} />
                </div>
                <Counter label="Brush Teeth" value={todayData.habits.brushTeeth || 0} onChange={(v) => updateData('habits', 'brushTeeth', v)} max={3} />
              </Card>

              {/* Quick Stats */}
              <Card title="Today's Summary" icon="📈" color="orange">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>Prayers</span>
                    <span className="font-bold">{Object.values(todayData.prayers).filter(Boolean).length}/5</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
                    <span>Family</span>
                    <span className="font-bold">{Object.values(todayData.family).filter(Boolean).length}/6</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span>Glucose</span>
                    <span className="font-bold">{todayData.glucose.avg || '--'} mg/dL</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <span>Sleep</span>
                    <span className="font-bold">{todayData.whoop.sleepHours || '--'} hrs</span>
                  </div>
                </div>
              </Card>
            </div>
          </>
        ) : (
          /* Dashboard Tab */
          <div className="space-y-6">
            {/* Monthly KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-white">
                <div className="text-sm opacity-80">Monthly Score</div>
                <div className="text-3xl font-bold">{monthlyStats.totalScore}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                <div className="text-sm opacity-80">Days Logged</div>
                <div className="text-3xl font-bold">{monthlyStats.daysLogged}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
                <div className="text-sm opacity-80">Total Prayers</div>
                <div className="text-3xl font-bold">{monthlyStats.totalPrayers}</div>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white">
                <div className="text-sm opacity-80">Family Check-ins</div>
                <div className="text-3xl font-bold">{monthlyStats.totalFamilyCheckins}</div>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Last 7 Days - Total Score</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Score Breakdown Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Score Breakdown by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weekData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="prayer" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                    <Line type="monotone" dataKey="health" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
                    <Line type="monotone" dataKey="family" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                    <Line type="monotone" dataKey="habit" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <span className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Prayer</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Health</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-500 rounded-full"></span> Family</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 bg-purple-500 rounded-full"></span> Habit</span>
              </div>
            </div>

            {/* Goals Progress */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Monthly Goals</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'All Prayers (1550)', current: monthlyStats.totalPrayers * 10, target: 1550, color: 'blue' },
                  { label: 'Family Check-ins (80%)', current: monthlyStats.totalFamilyCheckins, target: Math.round(monthlyStats.daysLogged * 6 * 0.8) || 1, color: 'amber' },
                  { label: 'Days Logged', current: monthlyStats.daysLogged, target: new Date().getDate(), color: 'green' },
                  { label: 'Avg Daily Score (100+)', current: monthlyStats.avgDaily, target: 100, color: 'orange' },
                ].map((goal, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">{goal.label}</span>
                      <span className="font-semibold">{goal.current} / {goal.target}</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${goal.color}-500 transition-all duration-500`}
                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%`, backgroundColor: goal.color === 'blue' ? '#3b82f6' : goal.color === 'amber' ? '#f59e0b' : goal.color === 'green' ? '#22c55e' : '#f97316' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-slate-500 py-6 text-sm">
        Data saved locally in your browser
      </div>
    </div>
  );
}
