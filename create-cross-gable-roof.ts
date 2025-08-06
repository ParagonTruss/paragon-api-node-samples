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

  const mainSouthWestPoint = { x: 0, y: 0 };
  const mainSouthEastPoint = { x: BUILDING_LENGTH, y: 0 };
  const mainNorthEastPoint = { x: BUILDING_LENGTH, y: TRUSS_SPAN };
  const mainNorthWestPoint = { x: 0, y: TRUSS_SPAN };

  const mainSouthBearingEnvelope = await createBearingEnvelope(project.guid, {
    name: "Main South",
    leftPoint: mainSouthWestPoint,
    rightPoint: mainSouthEastPoint,
    thickness: 3.5,
    top: WALL_HEIGHT,
    bottom: 0,
    justification: "Front",
  });

  const mainEastBearingEnvelope = await createBearingEnvelope(project.guid, {
    name: "Main East",
    leftPoint: mainSouthEastPoint,
    rightPoint: mainNorthEastPoint,
    thickness: 3.5,
    top: WALL_HEIGHT,
    bottom: 0,
    justification: "Front",
  });

  const mainNorthBearingEnvelope = await createBearingEnvelope(project.guid, {
    name: "Main North",
    leftPoint: mainNorthEastPoint,
    rightPoint: mainNorthWestPoint,
    thickness: 3.5,
    top: WALL_HEIGHT,
    bottom: 0,
    justification: "Front",
  });

  const mainWestBearingEnvelope = await createBearingEnvelope(project.guid, {
    name: "Main West",
    leftPoint: mainNorthWestPoint,
    rightPoint: mainSouthWestPoint,
    thickness: 3.5,
    top: WALL_HEIGHT,
    bottom: 0,
    justification: "Front",
  });

  const upperSouthWestPoint = {
    x: BUILDING_LENGTH / 2 - TRUSS_SPAN / 2,
    y: TRUSS_SPAN,
  };
  const upperSouthEastPoint = {
    x: BUILDING_LENGTH / 2 + TRUSS_SPAN / 2,
    y: TRUSS_SPAN,
  };
  const upperNorthEastPoint = {
    x: BUILDING_LENGTH / 2 + TRUSS_SPAN / 2,
    y: BUILDING_LENGTH,
  };
  const upperNorthWestPoint = {
    x: BUILDING_LENGTH / 2 - TRUSS_SPAN / 2,
    y: BUILDING_LENGTH,
  };

  const upperEastBearingEnvelope = await createBearingEnvelope(project.guid, {
    name: "Upper East",
    leftPoint: upperSouthEastPoint,
    rightPoint: upperNorthEastPoint,
    thickness: 3.5,
    top: WALL_HEIGHT,
    bottom: 0,
    justification: "Front",
  });

  const upperNorthBearingEnvelope = await createBearingEnvelope(project.guid, {
    name: "Upper North",
    leftPoint: upperNorthEastPoint,
    rightPoint: upperNorthWestPoint,
    thickness: 3.5,
    top: WALL_HEIGHT,
    bottom: 0,
    justification: "Front",
  });

  const upperWestBearingEnvelope = await createBearingEnvelope(project.guid, {
    name: "Upper West",
    leftPoint: upperNorthWestPoint,
    rightPoint: upperSouthWestPoint,
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

  const upperSouthWestHeel = {
    x: BUILDING_LENGTH / 2 - TRUSS_SPAN / 2,
    y: TRUSS_SPAN,
    z: WALL_HEIGHT + HEEL_HEIGHT,
  };
  const upperSouthEastHeel = {
    x: BUILDING_LENGTH / 2 + TRUSS_SPAN / 2,
    y: TRUSS_SPAN,
    z: WALL_HEIGHT + HEEL_HEIGHT,
  };
  const upperNorthEastHeel = {
    x: BUILDING_LENGTH / 2 + TRUSS_SPAN / 2,
    y: BUILDING_LENGTH,
    z: WALL_HEIGHT + HEEL_HEIGHT,
  };
  const upperNorthWestHeel = {
    x: BUILDING_LENGTH / 2 - TRUSS_SPAN / 2,
    y: BUILDING_LENGTH,
    z: WALL_HEIGHT + HEEL_HEIGHT,
  };
  const upperSouthTrussPeak = {
    x: BUILDING_LENGTH / 2,
    y: TRUSS_SPAN / 2,
    z: TRUSS_MAX_ELEVATION,
  };
  const upperNorthTrussPeak = {
    x: BUILDING_LENGTH / 2,
    y: BUILDING_LENGTH,
    z: TRUSS_MAX_ELEVATION,
  };

  const southFace = {
    vertexLoop: [southWestHeel, southEastHeel, eastTrussPeak, westTrussPeak],
  };
  const northFace = {
    vertexLoop: [
      northEastHeel,
      upperSouthEastHeel,
      upperSouthTrussPeak,
      upperSouthWestHeel,
      northWestHeel,
      westTrussPeak,
      eastTrussPeak,
    ],
  };

  const upperWestFace = {
    vertexLoop: [
      upperNorthWestHeel,
      upperSouthWestHeel,
      upperSouthTrussPeak,
      upperNorthTrussPeak,
    ],
  };
  const upperEastFace = {
    vertexLoop: [
      upperSouthEastHeel,
      upperNorthEastHeel,
      upperNorthTrussPeak,
      upperSouthTrussPeak,
    ],
  };

  const roofFaces = [southFace, northFace, upperWestFace, upperEastFace];
  const roofPlanes = await createRoofPlanesFromFaces(project.guid, roofFaces);
  const northRoofPlane = roofPlanes[1];

  console.log("Creating truss envelopes...");

  const mainTrussEnvelope = await createTrussEnvelope(project.guid, {
    name: "Common 1",
    leftPoint: { x: 7 * FEET, y: 0 },
    rightPoint: { x: 7 * FEET, y: TRUSS_SPAN },
    justification: "Back",
    thickness: 1.5,
  });

  const upperTrussEnvelope = await createTrussEnvelope(project.guid, {
    name: "Common 2",
    leftPoint: {
      x: BUILDING_LENGTH / 2 - TRUSS_SPAN / 2,
      y: BUILDING_LENGTH - 7 * FEET,
    },
    rightPoint: {
      x: BUILDING_LENGTH / 2 + TRUSS_SPAN / 2,
      y: BUILDING_LENGTH - 7 * FEET,
    },
    justification: "Back",
    thickness: 1.5,
  });

  const valleyOffset = 1.5;

  const valleyTrussEnvelopes: TrussEnvelope[] = [];
  let nameIndex = 1;
  for (let offset = 0; offset < TRUSS_SPAN / 2 - 1; offset += 2 * FEET) {
    const valleyTrussEnvelope = await createTrussEnvelope(project.guid, {
      name: `Valley ${nameIndex++}`,
      leftPoint: {
        x: BUILDING_LENGTH / 2 - TRUSS_SPAN / 2 + offset + valleyOffset,
        y: TRUSS_SPAN - offset,
      },
      rightPoint: {
        x: BUILDING_LENGTH / 2 + TRUSS_SPAN / 2 - offset - valleyOffset,
        y: TRUSS_SPAN - offset,
      },
      justification: "Back",
      thickness: 1.5,
      bottomCuts: [{ type: "RoofPlane", roofPlaneGuid: northRoofPlane.guid }],
    });

    valleyTrussEnvelopes.push(valleyTrussEnvelope);
  }

  const underValleyTrussEnvelope = await createTrussEnvelope(project.guid, {
    name: "Common 3",
    leftPoint: { x: BUILDING_LENGTH / 2, y: 0 },
    rightPoint: { x: BUILDING_LENGTH / 2, y: TRUSS_SPAN },
    justification: "Back",
    thickness: 1.5,
    topCuts: [{ type: "RoofPlane", roofPlaneGuid: northRoofPlane.guid }],
  });

  console.log("Designing truss...");
  const designedTrussEnvelopes = await createTrusses(project.guid, [
    mainTrussEnvelope.guid,
    upperTrussEnvelope.guid,
    ...valleyTrussEnvelopes.map((trussEnvelope) => trussEnvelope.guid),
    underValleyTrussEnvelope.guid,
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

//// POST /roofPlanes/fromFaces route

async function createRoofPlanesFromFaces(
  projectGuid: string,
  faces: LayoutFace[],
): Promise<RoofPlane[]> {
  const response = await fetch(
    `${paragonApiBaseUrl}/projects/${projectGuid}/roofPlanes/fromFaces`,
    {
      method: "POST",
      headers: paragonApiHeaders,
      body: JSON.stringify(faces),
    },
  );
  return await response.json();
}

//// RoofPlane type

interface RoofPlane {
  guid: string;
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

//// LayoutFace type

interface LayoutFace {
  vertexLoop: Point3D[];
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
  topCuts?: TopOrBottomCut[];
  bottomCuts?: TopOrBottomCut[];
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

interface TopOrBottomCut {
  type: TopOrBottomCutType;
  plane?: Plane3D | null;
  roofPlaneGuid?: string;
  ceilingPlaneGuid?: string;
}

type TopOrBottomCutType = "Absolute" | "RoofPlane" | "CeilingPlane";

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

interface Plane3D {
  a: number;
  b: number;
  c: number;
  d: number;
}
