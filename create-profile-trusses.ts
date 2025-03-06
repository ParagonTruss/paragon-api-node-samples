//// API Route Configuration

const paragonApiBaseUrl = 'https://designserver.paragontruss.com/api/public';

const paragonApiHeaders = {
    'Authorization': `JWT ${process.env.PARAGON_API_KEY}`,
    'Content-Type': 'application/json',
};

//// Main function

async function main() {
    console.log('Creating project...');
    const project = await createProject({ name: 'API Test Project' });

    console.log('Creating truss...');
    const truss = await createTruss(project.guid, {
        name: 'RT-1',
        topChordPoints: [{ x: 0, y: 4.163118960624631 }, { x: 144, y: 76.1631189606246 }, { x: 288, y: 4.163118960624631 }],
        bottomChordPoints: [{ x: 0, y: 0 }, { x: 288, y: 0 }],
        leftOverhang: { distance: 24 },
        rightOverhang: { distance: 24 },
    });

    console.log(`Successfully created truss!`);
    console.log(`Project URL: https://design.paragontruss.com/${project.guid}`);
}

main().catch(console.error);

//// POST /projects route

async function createProject(project: NewProject): Promise<Project> {
    const response = await fetch(`${paragonApiBaseUrl}/projects`, {
        method: 'POST',
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

//// POST /createProfileTruss route

async function createTruss(projectGuid: string, profile: Profile): Promise<string> {
    const response = await fetch(`${paragonApiBaseUrl}/projects/${projectGuid}/createProfileTruss`, {
        method: 'POST',
        headers: paragonApiHeaders,
        body: JSON.stringify(profile),
    });
    return await response.json();
}

//// Profile type

interface Profile {
    name: string;
    topChordPoints: Point2D[];
    bottomChordPoints: Point2D[];
    leftOverhang: Overhang;
    rightOverhang: Overhang;
}

interface Overhang {
    distance: number;
    cutType?: 'Plumb' | 'Square' | 'Horizontal' | null;
}

//// Truss type

interface Truss {
    guid: string;
    name: string;
    plies: number;
    members: Member[];
    plates: Plate[];
    bearings: Bearing[];
    outsideToOutsideBearingSpan: number;
    height: number;
    width: number;
}

interface Member {
    guid: string;
    name: string;
    assemblyName: string;
    type: string;
    lumber: Lumber;
    geometry: Point2D[];
    thickness: number;
    overallLength: number;
    bevelCuts: Plane3D[];
}

interface Lumber {
    actualThickness: number;
    actualWidth: number;
    nominalWidth: number;
    nominalThickness: number;
    grade: string;
    species: string;
    structure: 'Sawn' | 'StructuralComposite';
    treatmentType: string;
}

interface Plate {
    guid: string;
    name: string;
    type: string;
    center: Point2D;
    length: number;
    width: number;
    plateOrientation: 'FrontBack' | 'TopBottom';
    slotDirection: Direction3D;
    normalDirection: Direction3D;
}

interface Bearing {
    guid: string;
    geometry: Segment2D;
}

//// Geometry types

interface Point2D {
    x: number;
    y: number;
}

interface Plane3D {
    a: number;
    b: number;
    c: number;
    d: number;
}

interface Direction3D {
    x: number;
    y: number;
    z: number;
}

interface Segment2D {
    basePoint: Point2D;
    endPoint: Point2D;
}
