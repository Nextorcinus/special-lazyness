"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useBuildings } from "../lib/useBuildings";
import { calculateUpgrade } from "../utils/calculateUpgrade";

import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { toast } from "sonner";

import HybridSelect from "./HybridSelect"; // ← HYBRID SELECT

const buildingAliasMap = {
  Furnace: "Furnace",
  Marksman: "Marksman",
  Lancers: "Lancers",
  Infantry: "Infantry",
  Research: "Research Center",
  "Research Center": "Research Center",
  "Command Center": "Command Center",
  Embassy: "Embassy",

  "FC Furnace": "FC Furnace",
  "FC Academy": "FC Academy",
  "FC Marksman": "FC Marksman",
  "FC Lancers": "FC Lancers",
  "FC Infantry": "FC Infantry",
  "FC Embassy": "FC Embassy",
  "FC Infirmary": "FC Infirmary",
  "FC Command Center": "FC Command Center",
};

export default function BuildingForm({
  category,
  selectedSub,
  onCalculate,
}) {
  const [fromLevel, setFromLevel] = useState("");
  const [toLevel, setToLevel] = useState("");
  const [petLevel, setPetLevel] = useState("Off");
  const [vpLevel, setVpLevel] = useState("Off");
  const [doubleTime, setDoubleTime] = useState(false);
  const [zinmanSkill, setZinmanSkill] = useState("Off");
  const [constructionSpeed, setConstructionSpeed] = useState(0);

  const { data, loading } = useBuildings(category);

  useEffect(() => {
    setFromLevel("");
    setToLevel("");
    setPetLevel("Off");
    setVpLevel("Off");
    setDoubleTime(false);
    setZinmanSkill("Off");
    setConstructionSpeed(0);
  }, [selectedSub]);

  const normalizedBuilding = buildingAliasMap[selectedSub] || selectedSub;

  const levelOptions = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const entries = data.filter(
      (b) =>
        b.Building?.trim().toLowerCase() ===
        normalizedBuilding.trim().toLowerCase()
    );

    return [...new Set(entries.map((e) => e.Level))];
  }, [data, normalizedBuilding]);

  const filteredToLevels = useMemo(() => {
    if (!fromLevel) return levelOptions;
    const i = levelOptions.indexOf(fromLevel);
    return levelOptions.slice(i + 1);
  }, [fromLevel, levelOptions]);

  const handleSubmit = () => {
    const result = calculateUpgrade({
      category,
      building: selectedSub,
      fromLevel,
      toLevel,
      buffs: {
        petLevel,
        vpLevel,
        doubleTime,
        zinmanSkill,
        constructionSpeed: Number(constructionSpeed),
      },
    });

    if (result) {
      toast.success("The upgrade calculation was successful!");
      onCalculate(result);
    } else {
      toast.error("Invalid level or missing data.");
    }
  };

  return (
    <Card className="bg-glass-background1 text-white mt-6">
      <CardContent className="space-y-6 pt-6">
        <h2 className="text-xl text-white">{selectedSub}</h2>

        {loading && <p className="text-sm">Loading...</p>}

        {!loading && (
          <>
            {levelOptions.length === 0 && (
              <p className="text-red-400 text-sm">
                ⚠ Data level for "{selectedSub}" not found.
              </p>
            )}

            <div className="bg-glass-background2 p-4 grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-8 gap-4">

              {/* FROM */}
              <div>
                <Label>From</Label>
                <HybridSelect
                  value={fromLevel}
                  onChange={(v) => {
                    setFromLevel(v);
                    setToLevel("");
                  }}
                  placeholder="-- Select Level --"
                  options={levelOptions.map((lvl) => ({
                    value: lvl,
                    label: lvl,
                  }))}
                  className="bg-special-input text-white"
                />
              </div>

              {/* TO */}
              <div>
                <Label>To</Label>
                <HybridSelect
                  value={toLevel}
                  onChange={setToLevel}
                  placeholder="-- Select Level --"
                  options={filteredToLevels.map((lvl) => ({
                    value: lvl,
                    label: lvl,
                  }))}
                  className="bg-special-input text-white"
                />
              </div>

              {/* PET */}
              <div>
                <Label>Pet</Label>
                <HybridSelect
                  value={petLevel}
                  onChange={setPetLevel}
                  placeholder="Select"
                  options={["Off", "Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5"].map(
                    (lvl) => ({ value: lvl, label: lvl })
                  )}
                  className="bg-special-input text-white"
                />
              </div>

              {/* VP */}
              <div>
                <Label>Vp</Label>
                <HybridSelect
                  value={vpLevel}
                  onChange={setVpLevel}
                  placeholder="Select"
                  options={["Off", "10%", "20%"].map((lvl) => ({
                    value: lvl,
                    label: lvl,
                  }))}
                  className="bg-special-input text-white"
                />
              </div>

              {/* ZINMAN */}
              <div>
                <Label>Zinman Skill</Label>
                <HybridSelect
                  value={zinmanSkill}
                  onChange={setZinmanSkill}
                  placeholder="Select"
                  options={["Off", "Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5"].map(
                    (lvl) => ({ value: lvl, label: lvl })
                  )}
                  className="bg-special-input text-white"
                />
              </div>

              {/* CONSTRUCTION SPEED */}
              <div>
                <Label>Const Speed (%)</Label>
                <Input
                  type="number"
                  value={constructionSpeed}
                  onChange={(e) => setConstructionSpeed(e.target.value)}
                  className="bg-special-input text-white"
                />
              </div>

              {/* DOUBLE TIME */}
              <div className="col-span-2 md:col-span-1 flex items-center gap-2">
                <Checkbox checked={doubleTime} onCheckedChange={setDoubleTime} />
                <Label>Double Time</Label>
              </div>

              {/* SUBMIT */}
              <Button
                onClick={handleSubmit}
                className="button-Form text-white rounded-lg py-6 md:py-10"
              >
                Calculate
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
