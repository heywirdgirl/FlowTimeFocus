import { 
    doc, 
    onSnapshot, 
    setDoc, 
    deleteDoc, 
    collection, 
    serverTimestamp, 
    query, 
    orderBy,
    addDoc
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type { Cycle } from "../types";
import { cycleTemplates } from "./cycle-templates";
import { CycleStore } from "./cycle-store";

let unsubscribe: (() => void) | null = null;

const COLLECTION_PATH = "privateCycles";

export const startSyncCycles = (
    uid: string, 
    store: Pick<CycleStore, 'setCycles' | 'setLoading' | 'setError' | 'get'>
) => {
    if (unsubscribe) {
        unsubscribe();
    }

    store.setLoading(true);

    const q = query(
        collection(db, "users", uid, COLLECTION_PATH),
        orderBy("createdAt", "desc")
    );

    unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
            try {
                if (snapshot.empty) {
                    console.log("No cycles found, creating default...");
                    
                    const defaultTemplate = cycleTemplates.find(t => t.id === 'template-pomodoro');
                    if (defaultTemplate) {
                        await createDefaultCycle(uid, defaultTemplate);
                    }
                } else {
                    const cycles = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    } as Cycle));
                    
                    store.setCycles(cycles);
                    
                    const currentState = store.get();
                    if (!currentState.currentCycleId && cycles.length > 0) {
                        store.get().setCurrentCycle(cycles[0].id);
                    }
                }
                
                store.setLoading(false);
            } catch (error) {
                console.error("Error processing cycles:", error);
                store.setError(error instanceof Error ? error.message : "Unknown error");
                store.setLoading(false);
            }
        },
        (error) => {
            console.error("Firestore sync error:", error);
            
            if (error.code === 'permission-denied') {
                store.setError("Permission denied. Please check Firestore rules.");
            } else {
                store.setError(error.message);
            }
            
            store.setLoading(false);
        }
    );
};

async function createDefaultCycle(uid: string, template: Cycle) {
    const cycleRef = doc(collection(db, "users", uid, COLLECTION_PATH));
    
    const newCycle = {
        name: template.name,
        phases: template.phases,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
    
    await setDoc(cycleRef, newCycle);
}

export const stopSyncCycles = () => {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
};

export const saveCycle = async (uid: string, cycle: Cycle) => {
    try {
        const { id, createdAt, ...cycleData } = cycle;
        const cycleRef = doc(db, "users", uid, COLLECTION_PATH, id);
        
        await setDoc(
            cycleRef, 
            { 
                ...cycleData, 
                updatedAt: serverTimestamp() 
            }, 
            { merge: true }
        );
        
        console.log("✅ Cycle saved:", id);
    } catch (error) {
        console.error("❌ Error saving cycle:", error);
        throw error;
    }
};

export const createNewCycleInDb = async (uid: string, cycle: Cycle) => {
    try {
        const { id, ...cycleData } = cycle;
        const cycleRef = doc(collection(db, "users", uid, COLLECTION_PATH));
        
        await setDoc(cycleRef, {
            ...cycleData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        
        console.log("✅ Cycle created:", cycleRef.id);
    } catch (error) {
        console.error("❌ Error creating cycle:", error);
        throw error;
    }
};

export const deleteCycleFromDb = async (uid: string, cycleId: string) => {
    try {
        const cycleRef = doc(db, "users", uid, COLLECTION_PATH, cycleId);
        await deleteDoc(cycleRef);
        console.log("✅ Cycle deleted:", cycleId);
    } catch (error) {
        console.error("❌ Error deleting cycle:", error);
        throw error;
    }
};
