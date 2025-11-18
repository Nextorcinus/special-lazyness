import { NextResponse } from "next/server";
import basicData from "../../data/BasicBuilding.json";
import fireData from "../../data/buildings.json";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  let result = [];

  if (category === "Basic") {
    result = basicData;
  } else if (category === "Fire Crystal") {
    result = fireData;
  }

  return NextResponse.json(result);
}
