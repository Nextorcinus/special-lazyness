"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useHistory } from "../../dashboard/troops/HistoryContext";
import heliosData from "../../data/heliosduabelas.json";
import heliosSkillData from "../../data/heliosduabelasskill.json";
import FormattedNumberInput from "../../utils/FormattedNumbernInput";
import {
	applyRatioToLegion,
	autoBearTrapFormation,
} from "../../utils/TroopAssistantUtils";
import TroopAssistantPreset from "./TroopAssistantPreset";
import TroopLegionCard from "./TroopLegionCard";

export default function TroopAssistantCalculator() {
	const {
		troops,
		setTroops,
		joinerCount,
		setJoinerCount,
		rallySize,
		setRallySize,
		joinerSize,
		setJoinerSize,
		legions,
		setLegions,
	} = useHistory();

	const [tumblingLevel, setTumblingLevel] = useState(0);
	const [cityBuff, setCityBuff] = useState(0);
	const [entrapmentLevel, setEntrapmentLevel] = useState(0);
	const [exaltedInfantryLevel, setExaltedInfantryLevel] = useState(0);

	const [exaltedLancerLevel, setExaltedLancerLevel] = useState(0);

	const [exaltedMarksmanLevel, setExaltedMarksmanLevel] = useState(0);

	const [solarSupremacyLevel, setSolarSupremacyLevel] = useState(0);

	const tumblingValues = [
		0, 1500, 3000, 4500, 6000, 7500, 9000, 10500, 12000, 13500, 15000,
	];

	const entrapmentValues = [
		0, 0, 3600, 7200, 10800, 14400, 18000, 21600, 25200, 28800, 32400,
	];

	const baseTotal =
		Number(troops?.infantry || 0) +
		Number(troops?.lancer || 0) +
		Number(troops?.marksman || 0);

	const tumblingBuff = tumblingValues[tumblingLevel] || 0;
	const entrapmentBuff = entrapmentValues[entrapmentLevel] || 0;

	// =========================
	// HELIOS XII DEPLOYMENT
	// from JSON
	// =========================

	const getHeliosDeployment = (type, level) => {
		if (level === 0) return 0;

		const data = Object.values(heliosData[type] || {}).flat();

		const item = data.find((x) => Number(x.level) === level);

		return Number(
			item?.attributes?.find((attr) => attr.name === "deployment")?.value || 0,
		);
	};

	const exaltedDeployment =
		getHeliosDeployment("Exalted Infantry", exaltedInfantryLevel) +
		getHeliosDeployment("Exalted Lancer", exaltedLancerLevel) +
		getHeliosDeployment("Exalted Marksman", exaltedMarksmanLevel);

	// =========================
	// SOLAR SUPREMACY
	// from JSON
	// =========================

	const getSolarCapacity = (level) => {
		if (level === 0) return 0;

		const solarMeta = heliosSkillData?.skills?.["Solar Supremacy"];

		const template = solarMeta?.template;

		const solarTable = heliosSkillData?.tables?.[template] || [];

		const solarSkill = solarTable.find((x) => Number(x.level) === level);

		const capacity = Number(
			solarSkill?.deployment || solarSkill?.capacity || solarSkill?.value || 0,
		);

		console.log({
			level,
			template,
			capacity,
		});

		return capacity;
	};

	const solarCapacity = getSolarCapacity(solarSupremacyLevel);

	const cityBuffValue = Math.floor((rallySize || 0) * cityBuff);

	const finalRallySize =
		(Number(rallySize) || 0) +
		tumblingBuff +
		entrapmentBuff +
		cityBuffValue +
		exaltedDeployment +
		solarCapacity;

	const maxJoinerCapacity =
		joinerCount > 0 ? Math.floor(baseTotal / joinerCount) : 0;

	const onTroopChange = (key, value) => {
		setTroops((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const totalRequired = legions.reduce(
		(acc, legion) => ({
			infantry: acc.infantry + (legion.infantry || 0),

			lancer: acc.lancer + (legion.lancer || 0),

			marksman: acc.marksman + (legion.marksman || 0),
		}),
		{
			infantry: 0,
			lancer: 0,
			marksman: 0,
		},
	);

	// =========================
	// LOCKED / UNLOCKED
	// =========================

	const lockedLegions = legions.filter((l) => l.isLocked);

	const unlockedLegions = legions.filter((l) => !l.isLocked);

	// =========================
	// TOTAL CAPACITY UNLOCKED
	// =========================
	const unlockedCapacity = unlockedLegions.reduce(
		(sum, legion) => sum + legion.maxSize,
		0,
	);

	// =========================
	// USED BY LOCKED
	// =========================

	const lockedUsed = lockedLegions.reduce(
		(acc, legion) => ({
			infantry: acc.infantry + (legion.infantry || 0),

			lancer: acc.lancer + (legion.lancer || 0),

			marksman: acc.marksman + (legion.marksman || 0),
		}),
		{
			infantry: 0,
			lancer: 0,
			marksman: 0,
		},
	);

	// =========================
	// REMAINING TROOPS
	// =========================

	const remainingTroops = {
		infantry: Math.max(0, (troops?.infantry || 0) - lockedUsed.infantry),

		lancer: Math.max(0, (troops?.lancer || 0) - lockedUsed.lancer),

		marksman: Math.max(0, (troops?.marksman || 0) - lockedUsed.marksman),
	};

	// =========================
	// RAW RATIO
	// =========================

	const totalRemainingTroops =
		remainingTroops.infantry +
		remainingTroops.lancer +
		remainingTroops.marksman;

	const rawRatio = {
		infantry:
			totalRemainingTroops > 0
				? Math.floor((remainingTroops.infantry / totalRemainingTroops) * 100)
				: 0,

		lancer:
			totalRemainingTroops > 0
				? Math.floor((remainingTroops.lancer / totalRemainingTroops) * 100)
				: 0,

		marksman:
			totalRemainingTroops > 0
				? Math.floor((remainingTroops.marksman / totalRemainingTroops) * 100)
				: 0,
	};

	// =========================
	// PREFERRED RATIO
	// base = 1:1:98
	// =========================

	// default ratio
	let infantry = 1;
	let lancer = 1;
	let marksman = 98;

	// marksman needed for 1:1:98
	const idealMarksman = Math.floor(unlockedCapacity * 0.98);

	// enough marksman?
	const hasEnoughMarksman = remainingTroops.marksman >= idealMarksman;

	// only adjust when shortage
	if (!hasEnoughMarksman && unlockedCapacity > 0) {
		const actualMarksman = Math.floor(
			(remainingTroops.marksman / unlockedCapacity) * 100,
		);

		// marksman follows reality
		marksman = Math.max(actualMarksman, 50);

		// remaining goes lancer first
		const remaining = 100 - marksman;

		lancer = Math.max(infantry + 1, remaining - 1);

		infantry = Math.min(5, 100 - lancer - marksman);
	}

	// ensure rules
	infantry = Math.min(infantry, 5);

	if (lancer <= infantry) {
		lancer = infantry + 1;
	}

	if (marksman <= lancer) {
		marksman = lancer + 1;
	}

	// normalize
	const total = infantry + lancer + marksman;

	infantry = Math.round((infantry / total) * 100);

	lancer = Math.round((lancer / total) * 100);

	marksman = 100 - infantry - lancer;

	const preferredRatio = {
		infantry,
		lancer,
		marksman,
	};

	// =========================
	// REAL SUGGESTED SIMULATION
	// based on real shortage
	// =========================

	let simInf = remainingTroops.infantry;

	let simLan = remainingTroops.lancer;

	let simMar = remainingTroops.marksman;

	let usedInf = 0;
	let usedLan = 0;
	let usedMar = 0;

	unlockedLegions.forEach((legion) => {
		const capacity = legion.maxSize;

		// infantry minimum
		const minInfantry = Math.min(Math.floor(capacity * 0.01), simInf);

		// marksman first
		const mar = Math.min(simMar, capacity - minInfantry);

		// lancer fills rest
		const lan = Math.min(simLan, capacity - minInfantry - mar);

		// infantry final
		let inf = Math.min(simInf, capacity - mar - lan);

		// ensure at least 1%
		inf = Math.max(minInfantry, inf);

		simInf -= inf;
		simLan -= lan;
		simMar -= mar;

		usedInf += inf;
		usedLan += lan;
		usedMar += mar;
	});

	const totalUsed = usedInf + usedLan + usedMar;

	const simulateSuggested = () => {
		const updated = legions.map((l) => ({
			...l,
		}));

		const unlocked = updated.filter((l) => !l.isLocked);

		const remaining = {
			infantry: remainingTroops.infantry,

			lancer: remainingTroops.lancer,

			marksman: remainingTroops.marksman,
		};

		unlocked.forEach((legion) => {
			const capacity = legion.maxSize;

			// infantry minimum 1%
			const inf = Math.min(Math.floor(capacity * 0.01), remaining.infantry);

			// capacity after infantry
			const remainingCapacity = capacity - inf;

			// expected marksman
			const expectedMarksman = Math.floor(remainingCapacity * 0.98);

			// real marksman
			const mar = Math.min(remaining.marksman, expectedMarksman);

			// leftover slot → lancer
			const lan = Math.min(remaining.lancer, remainingCapacity - mar);

			remaining.infantry -= inf;

			remaining.lancer -= lan;

			remaining.marksman -= mar;

			legion.infantry = inf;

			legion.lancer = lan;

			legion.marksman = mar;
		});

		return unlocked;
	};

	const simulated = simulateSuggested();

	const simulatedTotals = simulated.reduce(
		(acc, legion) => ({
			infantry: acc.infantry + legion.infantry,

			lancer: acc.lancer + legion.lancer,

			marksman: acc.marksman + legion.marksman,
		}),
		{
			infantry: 0,
			lancer: 0,
			marksman: 0,
		},
	);

	const simulatedTotal =
		simulatedTotals.infantry +
		simulatedTotals.lancer +
		simulatedTotals.marksman;

	const suggestedRatio =
		simulatedTotal > 0
			? {
					infantry: Math.round(
						(simulatedTotals.infantry / simulatedTotal) * 100,
					),

					lancer: Math.round((simulatedTotals.lancer / simulatedTotal) * 100),

					marksman:
						100 -
						Math.round((simulatedTotals.infantry / simulatedTotal) * 100) -
						Math.round((simulatedTotals.lancer / simulatedTotal) * 100),
				}
			: {
					infantry: 0,
					lancer: 0,
					marksman: 0,
				};

	const suggestedTotal =
		suggestedRatio.infantry + suggestedRatio.lancer + suggestedRatio.marksman;

	const applySuggestedRatio = () => {
		const updated = legions.map((l) => ({
			...l,
			ratio: l.ratio
				? {
						...l.ratio,
					}
				: {
						infantry: 1,
						lancer: 1,
						marksman: 98,
					},
		}));

		const unlocked = updated.filter((l) => !l.isLocked);

		if (unlocked.length === 0) {
			toast.error("All legions are locked");
			return;
		}

		// sisa troop setelah locked
		const remaining = {
			infantry: remainingTroops.infantry,

			lancer: remainingTroops.lancer,

			marksman: remainingTroops.marksman,
		};

		unlocked.forEach((legion, index) => {
			const capacity = legion.maxSize;

			// pakai suggested ratio
			let inf = Math.floor((suggestedRatio.infantry / 100) * capacity);

			let lan = Math.floor((suggestedRatio.lancer / 100) * capacity);

			let mar = capacity - inf - lan;

			// clamp by remaining troops
			inf = Math.min(inf, remaining.infantry);

			lan = Math.min(lan, remaining.lancer);

			mar = Math.min(mar, remaining.marksman);

			// fill leftover
			const used = inf + lan + mar;

			const leftover = capacity - used;

			if (leftover > 0) {
				const extraMarksman = Math.min(leftover, remaining.marksman - mar);

				mar += extraMarksman;
			}

			remaining.infantry -= inf;

			remaining.lancer -= lan;

			remaining.marksman -= mar;

			const total = inf + lan + mar;

			legion.infantry = inf;

			legion.lancer = lan;

			legion.marksman = mar;

			// ratio final real
			legion.ratio = {
				infantry: total > 0 ? Math.round((inf / total) * 100) : 0,

				lancer: total > 0 ? Math.round((lan / total) * 100) : 0,

				marksman:
					total > 0
						? 100 -
							Math.round((inf / total) * 100) -
							Math.round((lan / total) * 100)
						: 0,
			};
		});

		setLegions(updated);

		toast.success("Suggested troops applied");
	};
	const handleDistribute = () => {
		const safeTroops = {
			infantry: Number(troops?.infantry) || 0,
			lancer: Number(troops?.lancer) || 0,
			marksman: Number(troops?.marksman) || 0,
		};

		if (
			safeTroops.infantry === 0 &&
			safeTroops.lancer === 0 &&
			safeTroops.marksman === 0
		) {
			toast.error("Please enter troop numbers first");
			return;
		}

		// city buff applies to all march
		const buffedJoinerSize =
			Math.floor((joinerSize || 0) * (1 + cityBuff)) +
			exaltedDeployment +
			solarCapacity;

		const safeJoinerSize = Math.min(buffedJoinerSize, maxJoinerCapacity);

		const result = autoBearTrapFormation({
			totalTroops: safeTroops,
			rallySize: finalRallySize,
			joinerSize: safeJoinerSize,
			joinerCount,
		});

		// preserve lock state
		const mergedResult = result.map((newLegion, index) => {
			const oldLegion = legions[index];

			return {
				...newLegion,

				// keep previous lock
				isLocked: oldLegion?.isLocked ?? false,

				// keep ratio too
				ratio: oldLegion?.ratio
					? {
							infantry: oldLegion.ratio.infantry,

							lancer: oldLegion.ratio.lancer,

							marksman: oldLegion.ratio.marksman,
						}
					: {
							infantry: 1,
							lancer: 1,
							marksman: 98,
						},
			};
		});

		setLegions(mergedResult);

		toast.success(
			`Rally calculated successfully. ${result.length} formations created`,
		);
	};

	return (
		<div className="space-y-6 max-w-[700px] mx-auto">
			<div className="bg-special-inside p-4 rounded-2xl">
				<h2 className="text-2xl text-white mb-1">Troops Setup</h2>
				<p className="text-sm text-white mb-4">
					Enter the total number of troops for each type.
				</p>

				<div className="grid grid-cols-3 gap-4">
					{Object.keys(troops).map((key) => (
						<div key={key}>
							<label className="block text-sm mb-1 capitalize">{key}</label>
							<FormattedNumberInput
								value={troops[key]}
								onChange={(value) => onTroopChange(key, value)}
								className="w-full bg-special-input p-2 rounded-md text-right"
							/>
						</div>
					))}
				</div>
			</div>

			<div className="bg-special-inside p-4 rounded-2xl space-y-4">
				<h3 className="text-xl text-white">Bear Trap Formation Auto Setup</h3>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="text-sm text-white">Rally Starter size</label>
						<FormattedNumberInput
							value={rallySize}
							onChange={(value) => setRallySize(value || 0)}
							className="w-full bg-special-input p-2 rounded-md text-right"
						/>
					</div>

					<div>
						<label className="text-sm text-white">Total March</label>
						<FormattedNumberInput
							value={joinerCount}
							onChange={(value) => setJoinerCount(value || 1)}
							className="w-full bg-special-input p-2 rounded-md text-right"
						/>
					</div>
				</div>

				<div className="flex justify-between items-center mt-2">
					<span className="text-sm text-white p-2">
						Joiner March max capacity
					</span>

					<div className="flex gap-2 items-center">
						<FormattedNumberInput
							value={joinerSize}
							onChange={(value) =>
								setJoinerSize(Math.min(value || 0, maxJoinerCapacity))
							}
							className="w-28 bg-special-input p-1.5 rounded-md text-right text-sm"
						/>
						<span className="text-xs text-white">
							Max ≈ {maxJoinerCapacity.toLocaleString()}
						</span>
					</div>
				</div>

				<div className="space-y-3 mt-4">
					<h4 className="text-white font-semibold">Additional Buff</h4>

					<div>
						<label className="text-sm text-white flex items-center gap-2">
							<Image
								src="/icon/tumbling.png"
								alt="tumbling"
								width={40}
								height={40}
							/>
							Snow Ape Pet Buff
						</label>

						<select
							value={tumblingLevel}
							onChange={(e) => setTumblingLevel(Number(e.target.value))}
							className="w-full bg-special-input p-2 rounded-md"
						>
							{tumblingValues.map((_, i) => (
								<option key={i} value={i}>
									Level {i} (+{tumblingValues[i].toLocaleString()})
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="text-sm text-white flex items-center gap-2">
							<Image
								src="/icon/capacity.png"
								alt="capacity"
								width={40}
								height={40}
							/>
							Buff Capacity Deployment
						</label>

						<select
							value={cityBuff}
							onChange={(e) => setCityBuff(Number(e.target.value))}
							className="w-full bg-special-input p-2 rounded-md"
						>
							<option value={0}>None (0%)</option>
							<option value={0.1}>10%</option>
							<option value={0.2}>20%</option>
						</select>
					</div>

					<div>
						<label className="text-sm text-white flex items-center gap-2">
							<Image
								src="/icon/entrapment.png"
								alt="entrapment"
								width={40}
								height={40}
							/>
							Entrapment Level Cryille
						</label>

						<select
							value={entrapmentLevel}
							onChange={(e) => setEntrapmentLevel(Number(e.target.value))}
							className="w-full bg-special-input p-2 rounded-md"
						>
							{entrapmentValues.map((_, i) => (
								<option key={i} value={i}>
									Level {i} (+{entrapmentValues[i].toLocaleString()})
								</option>
							))}
						</select>
					</div>

					{/* HELIOS XII */}
					<div className="border-t border-white/10 pt-4">
						<h4 className="text-white font-semibold mb-3">
							Helios XII Exalted
						</h4>

						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
							{/* Infantry */}
							<div>
								<label className="text-sm text-white block mb-1">
									Exalted Helm
								</label>

								<select
									value={exaltedInfantryLevel}
									onChange={(e) =>
										setExaltedInfantryLevel(Number(e.target.value))
									}
									className="w-full bg-special-input p-2 rounded-md"
								>
									<option value={0}>Level 0 (+0)</option>

									{(heliosData["Exalted Infantry"]?.["Exalted Helm"] || []).map(
										(item) => {
											const deployment =
												item.attributes?.find(
													(attr) => attr.name === "deployment",
												)?.value || 0;

											return (
												<option
													key={`helm-${item.level}`}
													value={Number(item.level)}
												>
													Level {item.level} (+
													{deployment.toLocaleString()})
												</option>
											);
										},
									)}
								</select>
							</div>

							{/* Lancer */}
							<div>
								<label className="text-sm text-white block mb-1">
									Exalted Warcrown
								</label>

								<select
									value={exaltedLancerLevel}
									onChange={(e) =>
										setExaltedLancerLevel(Number(e.target.value))
									}
									className="w-full bg-special-input p-2 rounded-md"
								>
									<option value={0}>Level 0 (+0)</option>

									{(
										heliosData["Exalted Lancer"]?.["Exalted Warcrown"] || []
									).map((item) => {
										const deployment =
											item.attributes?.find(
												(attr) => attr.name === "deployment",
											)?.value || 0;

										return (
											<option
												key={`warcrown-${item.level}`}
												value={Number(item.level)}
											>
												Level {item.level} (+
												{deployment.toLocaleString()})
											</option>
										);
									})}
								</select>
							</div>

							{/* Marksman */}
							<div>
								<label className="text-sm text-white block mb-1">
									Exalted Veil
								</label>

								<select
									value={exaltedMarksmanLevel}
									onChange={(e) =>
										setExaltedMarksmanLevel(Number(e.target.value))
									}
									className="w-full bg-special-input p-2 rounded-md"
								>
									<option value={0}>Level 0 (+0)</option>

									{(heliosData["Exalted Marksman"]?.["Exalted Veil"] || []).map(
										(item) => {
											const deployment =
												item.attributes?.find(
													(attr) => attr.name === "deployment",
												)?.value || 0;

											return (
												<option
													key={`veil-${item.level}`}
													value={Number(item.level)}
												>
													Level {item.level} (+
													{deployment.toLocaleString()})
												</option>
											);
										},
									)}
								</select>
							</div>

							{/* Solar */}
							<div>
								<label className="text-sm text-white block mb-1">
									Solar Supremacy
								</label>

								<select
									value={solarSupremacyLevel}
									onChange={(e) =>
										setSolarSupremacyLevel(Number(e.target.value))
									}
									className="w-full bg-special-input p-2 rounded-md"
								>
									{Array.from({ length: 16 }, (_, i) => (
										<option key={`solar-${i}`} value={i}>
											Level {i}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>

					<p className="text-xs text-white opacity-70">
						Rally size after buff: {finalRallySize.toLocaleString()}
					</p>
				</div>

				<button
					onClick={handleDistribute}
					className="px-5 py-2 rounded-xl button-Form text-white"
				>
					Calculate Formation
				</button>
			</div>

			<div className="space-y-4">
				{legions.map((legion, index) => (
					<TroopLegionCard
						key={legion.id}
						legion={legion}
						index={index}
						isRallyStarter={index === 0}
						totalTroops={troops}
						legions={legions}
						onUpdate={(updated) => {
							setLegions((prev) =>
								prev.map((l) => (l.id === updated.id ? updated : l)),
							);
						}}
						onRemove={() => {
							setLegions((prev) => prev.filter((l) => l.id !== legion.id));
						}}
					/>
				))}
			</div>

			{legions.length > 0 && (
				<div className="bg-special-inside p-5 rounded-2xl border border-white/10 space-y-4">
					<h3 className="text-xl font-semibold text-white">
						Total Required for {legions.length} Squads
					</h3>

					{["infantry", "lancer", "marksman"].map((type) => {
						const required = totalRequired[type];

						const available = troops?.[type] || 0;

						const isEnough = required <= available;

						const remain = available - required;

						return (
							<div
								key={type}
								className={`rounded-xl border p-4 ${
									isEnough
										? "border-cyan-400/30 bg-cyan-500/5"
										: "border-red-400/30 bg-red-500/5"
								}`}
							>
								<div className="flex justify-between items-start">
									<div>
										<p className="capitalize text-white/70 text-sm">{type}</p>

										<p className="text-lg font-semibold text-white">
											Required: {required.toLocaleString()}
										</p>
									</div>

									<div className="text-right">
										<p className="text-xs text-white/50">Available</p>

										<p className="font-semibold text-cyan-300">
											{available.toLocaleString()}
										</p>

										<div
											className={`mt-2 px-3 py-1 rounded-lg text-sm font-semibold ${
												isEnough
													? "bg-green-500 text-white"
													: "bg-red-500 text-white"
											}`}
										>
											{isEnough ? "✓ OK" : `✕ ${remain.toLocaleString()}`}
										</div>
									</div>
								</div>
							</div>
						);
					})}

					<div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-semibold text-amber-300">
									💡 Suggested Ratio
								</p>

								<p className="text-xs text-white/50">
									Based on available troops
								</p>
							</div>

							<button
								onClick={applySuggestedRatio}
								className="px-4 py-2 rounded-lg text-sm bg-amber-400 text-black font-semibold hover:scale-105 transition"
							>
								Apply to March
							</button>
						</div>

						<div className="mt-4 space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-white/60">Preferred</span>

								<span className="text-cyan-300 font-medium">
									Infantry: {preferredRatio.infantry}% • Lancer:{" "}
									{preferredRatio.lancer}% • Marksman: {preferredRatio.marksman}
									%
								</span>
							</div>

							<div className="flex justify-between">
								<span className="text-white/60">Suggested</span>

								<span className="text-green-300 font-medium">
									Infantry: {suggestedRatio.infantry}% • Lancer:{" "}
									{suggestedRatio.lancer}% • Marksman: {suggestedRatio.marksman}
									%
								</span>
							</div>

							<div className="flex justify-between border-t border-white/10 pt-2">
								<span className="text-white/60">Total Ratio</span>

								<span className="font-semibold text-green-400">
									{suggestedTotal}%
								</span>
							</div>

							<p className="text-xs text-amber-200/80 italic">
								🔒 Locked ratios are kept at your preferred values
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
