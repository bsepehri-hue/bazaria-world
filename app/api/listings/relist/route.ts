export async function POST(req: NextRequest) {
  try {
    // 1. Authorization Check
    const secretKey = req.headers.get("x-api-key");
    if (secretKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Parse body ONCE
    const { oldAssetId, durationDays } = await req.json();

    if (!oldAssetId) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // 3. Fetch original data
    const oldDocRef = doc(db, "listings", oldAssetId);
    const oldDocSnap = await getDoc(oldDocRef);

    if (!oldDocSnap.exists()) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    
    const oldData = oldDocSnap.data() as any;

    // 4. Calculate new end time dynamically
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + (durationDays || 7)); 

    // 5. Create cloned payload
    const clonedPayload = {
      ...oldData, // Spread old data first
      currentBid: 0,
      bidCount: 0,
      bidders: [],
      status: "active",
      startTime: serverTimestamp(),
      endTime: futureDate.toISOString(),
      relistedFrom: oldAssetId
    };

    // 6. Execute write operations
    const newDocRef = await addDoc(collection(db, "listings"), clonedPayload);
    
    await updateDoc(oldDocRef, {
      status: "archived",
      relistedTo: newDocRef.id,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ newAssetId: newDocRef.id });

  } catch (error: any) {
    console.error("Relist Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
