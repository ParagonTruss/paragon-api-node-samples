//// API Route Configuration

const paragonApiBaseUrl = "https://designserver.paragontruss.com/api/public";

const paragonApiHeaders = {
  Authorization: `JWT ${process.env.PARAGON_API_KEY}`,
  "Content-Type": "application/json",
};

//// Main function

const FEET = 12;

const BUILDING_LENGTH = 60 * FEET;
const TRUSS_SPAN = 24 * FEET;
const WALL_HEIGHT = 8 * FEET;
const HEEL_HEIGHT = 4.163118960624631;
const TRUSS_MAX_ELEVATION = WALL_HEIGHT + 6 * FEET + HEEL_HEIGHT;

async function main() {
  console.log("Creating project...");
  const project = await createProject({ name: "API Test Project" });

  console.log("Creating bearing envelopes...");

  const southWestPoint = { x: 0, y: 0 };
  const southEastPoint = { x: BUILDING_LENGTH, y: 0 };
  const northEastPoint = { x: BUILDING_LENGTH, y: TRUSS_SPAN };
  const northWestPoint = { x: 0, y: TRUSS_SPAN };

  const southBearingEnvelope = await createBearingEnvelope(project.guid, {
    name: "South",
    leftPoint: southWestPoint,
    rightPoint: southEastPoint,
    thickness: 3.5,
    top: WALL_HEIGHT,
    bottom: 0,
    justification: "Front",
  });

  const eastBearingEnvelope = await createBearingEnvelope(project.guid, {
    name: "East",
    leftPoint: southEastPoint,
    rightPoint: northEastPoint,
    thickness: 3.5,
    top: WALL_HEIGHT,
    bottom: 0,
    justification: "Front",
  });

  const northBearingEnvelope = await createBearingEnvelope(project.guid, {
    name: "North",
    leftPoint: northEastPoint,
    rightPoint: northWestPoint,
    thickness: 3.5,
    top: WALL_HEIGHT,
    bottom: 0,
    justification: "Front",
  });

  const westBearingEnvelope = await createBearingEnvelope(project.guid, {
    name: "West",
    leftPoint: northWestPoint,
    rightPoint: southWestPoint,
    thickness: 3.5,
    top: WALL_HEIGHT,
    bottom: 0,
    justification: "Front",
  });

  console.log("Creating roof planes...");

  const southWestHeel = { x: 0, y: 0, z: WALL_HEIGHT + HEEL_HEIGHT };
  const southEastHeel = {
    x: BUILDING_LENGTH,
    y: 0,
    z: WALL_HEIGHT + HEEL_HEIGHT,
  };
  const northEastHeel = {
    x: BUILDING_LENGTH,
    y: TRUSS_SPAN,
    z: WALL_HEIGHT + HEEL_HEIGHT,
  };
  const northWestHeel = { x: 0, y: TRUSS_SPAN, z: WALL_HEIGHT + HEEL_HEIGHT };
  const westTrussPeak = { x: 0, y: TRUSS_SPAN / 2, z: TRUSS_MAX_ELEVATION };
  const eastTrussPeak = {
    x: BUILDING_LENGTH,
    y: TRUSS_SPAN / 2,
    z: TRUSS_MAX_ELEVATION,
  };

  const southFace = {
    vertices: [southWestHeel, southEastHeel, eastTrussPeak, westTrussPeak],
  };
  const northFace = {
    vertices: [northEastHeel, northWestHeel, westTrussPeak, eastTrussPeak],
  };

  const roofFaces = [southFace, northFace];

  const roofPlanes = await createRoofPlanesFromPolygons(
    project.guid,
    roofFaces,
  );

  console.log("Creating truss envelope...");

  const trussEnvelope = await createTrussEnvelope(project.guid, {
    name: "1",
    leftPoint: { x: 7 * FEET, y: 0 },
    rightPoint: { x: 7 * FEET, y: TRUSS_SPAN },
    justification: "Back",
    thickness: 1.5,
  });

  console.log("Designing truss...");
  const designedTrussEnvelopes = await createTrusses(project.guid, [
    trussEnvelope.guid,
  ]);

  console.log(`Successfully created truss!`);
  console.log(`Project URL: https://design.paragontruss.com/${project.guid}`);
}

main().catch(console.error);

//// POST /projects route

async function createProject(project: NewProject): Promise<Project> {
  const response = await fetch(`${paragonApiBaseUrl}/projects`, {
    method: "POST",
    headers: paragonApiHeaders,
    body: JSON.stringify(project),
  });
  return await response.json();
}

interface NewProject {
  name: string;
}

interface Project extends NewProject {
  guid: string;
}

//// POST /bearingEnvelopes route

async function createBearingEnvelope(
  projectGuid: string,
  bearingEnvelope: NewBearingEnvelope,
): Promise<BearingEnvelope> {
  const response = await fetch(
    `${paragonApiBaseUrl}/projects/${projectGuid}/bearingEnvelopes`,
    {
      method: "POST",
      headers: paragonApiHeaders,
      body: JSON.stringify(bearingEnvelope),
    },
  );
  return await response.json();
}

//// BearingEnvelope type

interface NewBearingEnvelope {
  name: string;
  leftPoint: Point2D;
  rightPoint: Point2D;
  thickness: number;
  top: number;
  bottom: number;
  justification: Justification;
  nonStructural?: boolean;
}

interface BearingEnvelope extends NewBearingEnvelope {
  guid: string;
}

//// POST /roofPlanes/fromPolygons route

async function createRoofPlanesFromPolygons(
  projectGuid: string,
  polygons: Polygon3D[],
): Promise<RoofPlane[]> {
  const response = await fetch(
    `${paragonApiBaseUrl}/projects/${projectGuid}/roofPlanes/fromPolygons`,
    {
      method: "POST",
      headers: paragonApiHeaders,
      body: JSON.stringify(polygons),
    },
  );
  return await response.json();
}

//// RoofPlane type

interface RoofPlane {
  geometryType: RoofPlaneReferenceGeometryType;
  elevation: number;
  segment: Segment2D | null;
  bearingEnvelopeGuid: string;
  flipped: boolean;
  slope: number;
  heelHeight: number;
  overhang: number;
  cantilever: number;
  cuts: PlaneCut[];
}

type RoofPlaneReferenceGeometryType = "Absolute" | "BearingEnvelope";

type PlaneCutType = "AbsoluteVertical" | "AgainstPlane";

interface PlaneCut {
  type: PlaneCutType;
  cuttingPlaneGuid: string;
  segment: Segment2D | null;
}

//// POST /trussEnvelopes route

async function createTrussEnvelope(
  projectGuid: string,
  trussEnvelope: NewTrussEnvelope,
): Promise<TrussEnvelope> {
  const response = await fetch(
    `${paragonApiBaseUrl}/projects/${projectGuid}/trussEnvelopes`,
    {
      method: "POST",
      headers: paragonApiHeaders,
      body: JSON.stringify(trussEnvelope),
    },
  );
  return await response.json();
}

//// TrussEnvelope type

interface NewTrussEnvelope {
  name: string;
  leftPoint: Point2D;
  rightPoint: Point2D;
  justification: Justification;
  thickness: number;
  leftBevelCut?: BevelCut | null;
  rightBevelCut?: BevelCut | null;
}

interface TrussEnvelope extends NewTrussEnvelope {
  guid: string;
  componentDesignGuid: string | null;
}

type Justification = "Back" | "Center" | "Front";

interface BevelCut {
  type: BevelCutType;
  angle: number;
}

type BevelCutType = "Back" | "Double" | "Front";

//// POST /createTrusses route

async function createTrusses(
  projectGuid: string,
  trussEnvelopeGuids: string[],
): Promise<TrussEnvelope[]> {
  const response = await fetch(
    `${paragonApiBaseUrl}/projects/${projectGuid}/createTrusses`,
    {
      method: "POST",
      headers: paragonApiHeaders,
      body: JSON.stringify(trussEnvelopeGuids),
    },
  );
  return await response.json();
}

//// Geometry types

interface Point2D {
  x: number;
  y: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Polygon3D {
  vertices: Point3D[];
}
